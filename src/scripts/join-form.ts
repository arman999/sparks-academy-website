// Registration form behavior: dynamic child fields, phone formatting, friendly
// validation, and submitting without leaving the page. The form also works with
// JavaScript turned off (the server validates everything again).

declare global {
  interface Window {
    turnstile?: { reset: (el?: Element | string) => void };
  }
}

const form = document.querySelector<HTMLFormElement>("[data-join-form]");

if (form) {
  const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = form) => root.querySelector<T>(sel);
  const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = form) => [...root.querySelectorAll<T>(sel)];

  /* ---------- 1. Show only as many child blocks as needed ---------- */
  const countSelect = $<HTMLSelectElement>('[name="child_count"]');
  const childBlocks = $$<HTMLFieldSetElement>("[data-child]");

  const syncChildren = () => {
    const count = Number(countSelect?.value || 1);
    childBlocks.forEach((block) => {
      const n = Number(block.dataset.child);
      const show = n <= count;
      block.hidden = !show;
      block.disabled = !show; // disabled fields are not submitted or validated
      $$<HTMLInputElement>("input, select, textarea", block).forEach((el) => {
        if (el.name.endsWith("_name") || el.name.endsWith("_dob") || el.name.endsWith("_grade") || el.name.endsWith("_allergies")) {
          el.required = show;
        }
      });
      // update the "(optional)" / "*" markers to match
      $$(".field", block).forEach((field) => {
        const label = $("label", field);
        if (label && show) label.querySelector("span")?.replaceWith(Object.assign(document.createElement("span"), { className: "text-brand", textContent: " *", ariaHidden: "true" }));
      });
    });
  };
  countSelect?.addEventListener("change", syncChildren);
  if (countSelect && !countSelect.value) countSelect.value = "1";
  syncChildren();

  /* ---------- 2. Photo permission: signature only when "yes" ---------- */
  $$<HTMLFieldSetElement>("[data-photo]").forEach((group) => {
    const name = group.dataset.photo!;
    const sigBox = $("[data-photo-sig]", group);
    const sig = $<HTMLInputElement>(`[name="${name}_sig"]`, group);
    const sync = () => {
      const yes = $<HTMLInputElement>(`[name="${name}"][value="yes"]`, group)?.checked ?? false;
      if (sigBox) sigBox.hidden = !yes;
      if (sig) {
        sig.required = yes;
        sig.disabled = !yes;
      }
      const hint = sigBox?.querySelector(".field p[id$='-hint']");
      if (hint) hint.remove();
    };
    group.addEventListener("change", sync);
    sync();
  });

  /* ---------- 3. Phone formatting: (000) 000-0000 ---------- */
  const formatPhone = (value: string) => {
    let d = value.replace(/\D/g, "");
    if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
    d = d.slice(0, 10);
    if (d.length < 4) return d;
    if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  };
  $$<HTMLInputElement>('input[type="tel"]').forEach((input) => {
    input.addEventListener("input", () => {
      const atEnd = input.selectionStart === input.value.length;
      input.value = formatPhone(input.value);
      if (atEnd) input.setSelectionRange(input.value.length, input.value.length);
    });
  });

  /* ---------- 4. Validation messages ---------- */
  const labelFor = (el: HTMLElement): string => {
    const name = el.getAttribute("name") ?? "";
    const field = el.closest<HTMLElement>("[data-field]");
    const base = field?.querySelector("label")?.childNodes[0]?.textContent?.trim() ?? "This field";
    let m: RegExpMatchArray | null;
    if ((m = name.match(/^child(\d)_/))) return `Child ${m[1]}: ${base}`;
    if ((m = name.match(/^ec(\d)_/))) return `Emergency contact ${m[1]}: ${base}`;
    if ((m = name.match(/^p(\d)_/))) return `Parent/Guardian ${m[1]}: ${base}`;
    if (name === "hospital_name") return "Hospital name";
    if (name === "hospital_city") return "Hospital city";
    if (name.startsWith("photo_")) {
      const short = el.closest<HTMLElement>("[data-short]")?.dataset.short ?? "Photo permission";
      return name.endsWith("_sig") ? `${short}: signature` : short;
    }
    if (name.startsWith("sig_")) return `${el.closest("article")?.querySelector("h3")?.textContent?.trim() ?? "Agreement"}: signature`;
    return base;
  };

  const messageFor = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string => {
    const v = el.validity;
    if (v.valid) {
      if (el instanceof HTMLInputElement && el.type === "tel" && el.value) {
        const digits = el.value.replace(/\D/g, "");
        if (digits.length !== 10 && !(digits.length === 11 && digits.startsWith("1"))) return "Please enter a valid phone number, like (000) 000-0000.";
      }
      return "";
    }
    if (el instanceof HTMLInputElement && el.type === "radio") return "Please choose yes or no.";
    if (v.valueMissing) {
      if (el instanceof HTMLSelectElement) return "Please choose an option.";
      if (el.name.startsWith("sig_") || el.name.endsWith("_sig")) return "Please type your full name to sign.";
      return "Required.";
    }
    if (v.typeMismatch && el.type === "email") return "Please enter a valid email, like example@example.com.";
    if (v.rangeOverflow) return "This date can’t be in the future.";
    return "Please check this field.";
  };

  const setError = (name: string, message: string) => {
    const field = $(`[data-field="${name}"]`);
    if (!field) return;
    const error = $(`#f-${CSS.escape(name)}-error`);
    if (message) {
      field.setAttribute("data-invalid", "");
      if (error) error.textContent = message;
      $$<HTMLElement>(`[name="${name}"]`).forEach((el) => el.setAttribute("aria-invalid", "true"));
    } else {
      field.removeAttribute("data-invalid");
      if (error) error.textContent = "";
      $$<HTMLElement>(`[name="${name}"]`).forEach((el) => el.removeAttribute("aria-invalid"));
    }
  };

  const fields = () =>
    $$<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input[name], select[name], textarea[name]").filter(
      (el) => !el.disabled && el.name !== "website" && !el.name.startsWith("cf-"),
    );

  const checkField = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    const msg = messageFor(el);
    setError(el.name, msg);
    return msg;
  };

  // Validate when leaving a field; re-check while typing once it has an error
  form.addEventListener("focusout", (e) => {
    const el = e.target as HTMLInputElement;
    if (el?.name && el.name !== "website" && el.type !== "radio" && el.value) checkField(el);
  });
  form.addEventListener("input", (e) => {
    const el = e.target as HTMLInputElement;
    if (el?.name && el.closest("[data-invalid]")) checkField(el);
    if (!form.querySelector("[data-invalid]")) document.querySelector("[data-error-summary]")?.classList.add("hidden");
  });
  form.addEventListener("change", (e) => {
    const el = e.target as HTMLInputElement;
    if (el?.type === "radio" || el?.tagName === "SELECT") checkField(el);
  });

  /* ---------- 5. Error summary ---------- */
  const summary = $("[data-error-summary]");
  const summaryList = $("[data-error-list]");
  const summaryTitle = $("[data-error-title]");

  const showSummary = (items: { name: string; label: string; message: string }[], title?: string) => {
    if (!summary || !summaryList) return;
    summaryList.innerHTML = "";
    const MAX_LISTED = 6;
    for (const item of items.slice(0, MAX_LISTED)) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#f-${item.name}`;
      a.className = "underline underline-offset-2 font-semibold";
      a.textContent = `${item.label}: ${item.message}`;
      a.addEventListener("click", (ev) => {
        ev.preventDefault();
        const target = $<HTMLElement>(`[name="${item.name}"]`);
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
        target?.focus({ preventScroll: true });
      });
      li.append(a);
      summaryList.append(li);
    }
    if (items.length > MAX_LISTED) {
      const li = document.createElement("li");
      li.textContent = `…and ${items.length - MAX_LISTED} more, highlighted in red above.`;
      summaryList.append(li);
    }
    if (summaryTitle) summaryTitle.textContent = title ?? (items.length === 1 ? "Please check 1 thing" : `Please check ${items.length} things`);
    summary.classList.toggle("hidden", items.length === 0 && !title);
  };

  /* ---------- 6. Submit ---------- */
  const submitBtn = $<HTMLButtonElement>("[data-submit]");
  const submitLabel = $("[data-submit-label]");
  const spinner = $("[data-submit-spinner]");
  let dirty = false;
  let submitting = false;
  let succeeded = false;
  form.addEventListener("input", () => (dirty = true), { once: true });
  window.addEventListener("beforeunload", (e) => {
    if (dirty && !submitting && !succeeded) e.preventDefault();
  });

  const setBusy = (busy: boolean) => {
    submitting = busy;
    if (submitBtn) submitBtn.disabled = busy;
    if (submitLabel) submitLabel.textContent = busy ? "Sending…" : "Submit registration";
    spinner?.classList.toggle("hidden", !busy);
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const problems: { name: string; label: string; message: string }[] = [];
    const seen = new Set<string>();
    for (const el of fields()) {
      if (seen.has(el.name)) continue;
      const msg = checkField(el);
      if (msg) {
        seen.add(el.name);
        problems.push({ name: el.name, label: labelFor(el), message: msg });
      }
    }
    if (problems.length) {
      showSummary(problems);
      // Take the parent straight to the first thing that needs attention
      const first = $<HTMLElement>(`[name="${problems[0].name}"]`);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      first?.focus({ preventScroll: true });
      return;
    }
    showSummary([]);

    setBusy(true);
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; redirect?: string; message?: string; errors?: Record<string, string> };
      if (json.ok) {
        succeeded = true;
        window.location.assign(json.redirect || "/join/thanks");
        return;
      }
      const errs = Object.entries(json.errors ?? {});
      errs.forEach(([name, msg]) => setError(name, msg));
      showSummary(
        errs.map(([name, message]) => {
          const el = $<HTMLElement>(`[name="${name}"]`);
          return { name, label: el ? labelFor(el) : "Form", message };
        }),
        json.message || "Something went wrong. Please try again.",
      );
      window.turnstile?.reset();
      summary?.focus();
    } catch {
      showSummary([], "We couldn’t reach our server. Please check your connection and try again, or call us at 559.904.0999.");
      summary?.focus();
    } finally {
      if (!succeeded) setBusy(false);
    }
  });

  /* ---------- 7. Highlight the current section in the side navigation ---------- */
  const links = [...document.querySelectorAll<HTMLAnchorElement>("[data-step-link]")];
  if (links.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          links.forEach((l) => {
            if (l.dataset.stepLink === entry.target.id) l.setAttribute("aria-current", "step");
            else l.removeAttribute("aria-current");
          });
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    $$(".form-section").forEach((s) => observer.observe(s));
  }
}

export {};
