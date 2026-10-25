/**
 * Registration handling: validate → spam check (Turnstile) → email (Resend) → save (D1).
 * Kept free of Astro/Cloudflare imports so it can be unit-tested anywhere.
 */
import { GRADES, MAX_CHILDREN, POLICY_VERSION, photoQuestions, policies } from "../data/registration";

/* ---------------- types ---------------- */

export interface D1Like {
  prepare(query: string): { bind(...values: unknown[]): { run(): Promise<unknown> } };
}

export interface RegistrationEnv {
  DB?: D1Like;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  NOTIFY_EMAIL?: string;
  FROM_EMAIL?: string;
  SEND_CONFIRMATION?: string;
}

export interface Registration {
  parents: { first: string; last: string }[];
  city: string;
  email: string;
  phone: string;
  children: { name: string; dob: string; grade: string; allergies: string }[];
  emergencyContacts: { name: string; phone: string }[];
  additionalPickup: string;
  hospital: { name: string; city: string };
  photoPermissions: Record<string, { allowed: boolean; signature: string }>;
  signatures: Record<string, string>;
  policyVersion: string;
}

export type FieldErrors = Record<string, string>;

/* ---------------- helpers ---------------- */

const MAX = 200;
const MAX_LONG = 2000;

function text(form: FormData, name: string, max = MAX): string {
  const v = form.get(name);
  return typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

/** Returns "(000) 000-0000" or null when the number isn't a valid 10-digit US number. */
export function formatPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (digits.length !== 10) return null;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validDob(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  const years = (now.getTime() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
  return years > 2 && years < 20;
}

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/* ---------------- validation ---------------- */

export function parseRegistration(form: FormData): { data?: Registration; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const need = (name: string, label: string, max = MAX) => {
    const v = text(form, name, max);
    if (!v) errors[name] = `Please enter ${label}.`;
    return v;
  };

  const p1 = { first: need("p1_first", "a first name"), last: need("p1_last", "a last name") };
  const p2 = { first: text(form, "p2_first"), last: text(form, "p2_last") };
  const city = need("city", "your city of residence");

  const email = text(form, "email").toLowerCase();
  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email, like example@example.com.";

  const phoneRaw = text(form, "phone");
  const phone = formatPhone(phoneRaw);
  if (!phoneRaw) errors.phone = "Please enter your phone number.";
  else if (!phone) errors.phone = "Please enter a valid phone number, like (000) 000-0000.";

  const count = Number.parseInt(text(form, "child_count"), 10);
  const childCount = Number.isInteger(count) && count >= 1 && count <= MAX_CHILDREN ? count : 0;
  if (!childCount) errors.child_count = "Please choose how many children are enrolling.";

  const children: Registration["children"] = [];
  for (let i = 1; i <= childCount; i++) {
    const name = need(`child${i}_name`, "the child’s name");
    const dob = text(form, `child${i}_dob`);
    if (!dob) errors[`child${i}_dob`] = "Please enter a date of birth.";
    else if (!validDob(dob)) errors[`child${i}_dob`] = "Please check this date of birth.";
    const grade = text(form, `child${i}_grade`);
    if (!GRADES.includes(grade)) errors[`child${i}_grade`] = "Please choose a grade.";
    const allergies = need(`child${i}_allergies`, "allergies, or “None”", MAX_LONG);
    children.push({ name, dob, grade, allergies });
  }

  const emergencyContacts: Registration["emergencyContacts"] = [];
  for (let i = 1; i <= 3; i++) {
    const name = text(form, `ec${i}_name`);
    const raw = text(form, `ec${i}_phone`);
    if (i === 1 || name || raw) {
      if (!name) errors[`ec${i}_name`] = "Please enter this contact’s name.";
      const formatted = formatPhone(raw);
      if (!raw) errors[`ec${i}_phone`] = "Please enter this contact’s phone number.";
      else if (!formatted) errors[`ec${i}_phone`] = "Please enter a valid phone number, like (000) 000-0000.";
      emergencyContacts.push({ name, phone: formatted ?? raw });
    }
  }

  const additionalPickup = text(form, "extra_pickup", MAX_LONG);
  const hospital = { name: need("hospital_name", "a hospital"), city: need("hospital_city", "the hospital’s city") };

  const photoPermissions: Registration["photoPermissions"] = {};
  for (const q of photoQuestions) {
    const answer = text(form, q.id);
    const signature = text(form, `${q.id}_sig`);
    if (answer !== "yes" && answer !== "no") errors[q.id] = "Please choose yes or no.";
    else if (answer === "yes" && !signature) errors[`${q.id}_sig`] = "Please type your name to give permission.";
    photoPermissions[q.id] = { allowed: answer === "yes", signature: answer === "yes" ? signature : "no" };
  }

  const signatures: Record<string, string> = {};
  for (const policy of policies) {
    signatures[policy.id] = need(`sig_${policy.id}`, "your name as your e-signature");
  }

  if (Object.keys(errors).length) return { errors };
  return {
    errors,
    data: {
      parents: p2.first || p2.last ? [p1, p2] : [p1],
      city,
      email,
      phone: phone as string,
      children,
      emergencyContacts,
      additionalPickup,
      hospital,
      photoPermissions,
      signatures,
      policyVersion: POLICY_VERSION,
    },
  };
}

/* ---------------- Turnstile (spam protection) ---------------- */

export async function verifyTurnstile(secret: string, token: string, ip?: string): Promise<boolean> {
  if (!token) return false;
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}

/* ---------------- emails ---------------- */

const fullName = (p: { first: string; last: string }) => `${p.first} ${p.last}`.trim();

function row(label: string, value: string) {
  return `<tr><td style="padding:6px 12px 6px 0;color:#5b5853;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 0;color:#0a0908;font-weight:600">${escapeHtml(value || "—")}</td></tr>`;
}

function section(title: string, rows: string) {
  return `<h2 style="font:800 16px system-ui,sans-serif;color:#1155cc;margin:28px 0 8px">${escapeHtml(title)}</h2><table style="border-collapse:collapse;font:15px/1.45 system-ui,sans-serif">${rows}</table>`;
}

export function registrationSummaryHtml(d: Registration, submittedAt: string): string {
  const parents = d.parents.map((p, i) => row(`Parent/Guardian ${i + 1}`, fullName(p))).join("");
  const contact = row("Email", d.email) + row("Phone", d.phone) + row("City", d.city);
  const kids = d.children
    .map((c, i) => row(`Child ${i + 1}`, `${c.name} · ${c.grade} grade · born ${c.dob}`) + row("Allergies", c.allergies))
    .join("");
  const ecs = d.emergencyContacts.map((c, i) => row(`Emergency contact ${i + 1}`, `${c.name} · ${c.phone}`)).join("");
  const pickup = row("Other authorized adults", d.additionalPickup) + row("Preferred hospital", `${d.hospital.name}, ${d.hospital.city}`);
  const photos = photoQuestions
    .map((q) => {
      const p = d.photoPermissions[q.id];
      return row(q.short, p.allowed ? `Yes, signed “${p.signature}”` : "No");
    })
    .join("");
  const sigs = policies.map((p) => row(p.title, `Signed “${d.signatures[p.id]}”`)).join("");
  return (
    section("Family", parents + contact) +
    section("Children", kids) +
    section("Pickup & safety", ecs + pickup) +
    section("Photo & video permissions", photos) +
    section(`Agreements (version ${d.policyVersion}, ${submittedAt})`, sigs)
  );
}

function wrap(inner: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f4f6;padding:24px"><div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;padding:32px">${inner}</div></body></html>`;
}

async function sendEmail(env: RegistrationEnv, msg: { to: string[]; subject: string; html: string; replyTo?: string }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.FROM_EMAIL || "Sparks Academy <onboarding@resend.dev>",
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
      ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

export async function sendRegistrationEmails(env: RegistrationEnv, d: Registration, submittedAt: string): Promise<string> {
  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL) return "skipped: email not configured";
  const kids = d.children.map((c) => c.name).join(", ");
  const summary = registrationSummaryHtml(d, submittedAt);
  const status: string[] = [];

  try {
    await sendEmail(env, {
      to: env.NOTIFY_EMAIL.split(",").map((s) => s.trim()),
      replyTo: d.email,
      subject: `New Sparks registration: ${fullName(d.parents[0])} (${d.children.length} ${d.children.length === 1 ? "child" : "children"})`,
      html: wrap(
        `<h1 style="font:800 24px system-ui,sans-serif;margin:0 0 8px">New registration 🎉</h1><p style="font:16px system-ui,sans-serif;color:#3d3a36;margin:0">${escapeHtml(fullName(d.parents[0]))} registered ${escapeHtml(kids)}. Reply to this email to reach them directly.</p>${summary}`,
      ),
    });
    status.push("notify:sent");
  } catch (e) {
    console.error("Notification email failed", e);
    status.push("notify:failed");
  }

  if (env.SEND_CONFIRMATION === "true") {
    try {
      await sendEmail(env, {
        to: [d.email],
        replyTo: env.NOTIFY_EMAIL.split(",")[0].trim(),
        subject: "Welcome to the Sparks family!",
        html: wrap(
          `<h1 style="font:800 26px system-ui,sans-serif;margin:0 0 12px;color:#1155cc">Welcome to the Sparks family!</h1><p style="font:16px/1.6 system-ui,sans-serif;color:#3d3a36">Hi ${escapeHtml(d.parents[0].first)}, thank you for registering ${escapeHtml(kids)} at Sparks Academy. One of our coordinators will reach out soon to welcome you and answer any questions. You can also call us at 559.904.0999.</p><p style="font:16px/1.6 system-ui,sans-serif;color:#3d3a36">Here is a copy of what you submitted, for your records:</p>${summary}`,
        ),
      });
      status.push("confirm:sent");
    } catch (e) {
      console.error("Confirmation email failed", e);
      status.push("confirm:failed");
    }
  }
  return status.join(" ");
}

/* ---------------- database ---------------- */

export async function saveRegistration(
  db: D1Like,
  d: Registration,
  meta: { id: string; createdAt: string; ip?: string; userAgent?: string; emailStatus: string },
) {
  await db
    .prepare(
      `INSERT INTO registrations (id, created_at, parent_name, email, phone, city, children_count, children_names, policy_version, data, ip, user_agent, email_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      meta.id,
      meta.createdAt,
      fullName(d.parents[0]),
      d.email,
      d.phone,
      d.city,
      d.children.length,
      d.children.map((c) => c.name).join(", "),
      d.policyVersion,
      JSON.stringify(d),
      meta.ip ?? null,
      meta.userAgent?.slice(0, 300) ?? null,
      meta.emailStatus,
    )
    .run();
}

/* ---------------- request handler ---------------- */

const THANKS = "/join/thanks";

function wantsJson(request: Request) {
  return (request.headers.get("accept") || "").includes("application/json");
}

function respond(request: Request, status: number, body: { ok: boolean; message?: string; errors?: FieldErrors }) {
  if (wantsJson(request)) {
    return new Response(JSON.stringify(body.ok ? { ok: true, redirect: THANKS } : body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (body.ok) return new Response(null, { status: 303, headers: { Location: THANKS } });
  const list = Object.values(body.errors ?? {})
    .map((e) => `<li>${escapeHtml(e)}</li>`)
    .join("");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Please check your registration</title></head>
<body style="font:17px/1.6 system-ui,sans-serif;max-width:40rem;margin:3rem auto;padding:0 1.25rem;color:#0a0908">
<h1 style="color:#1155cc">Almost there!</h1><p>${escapeHtml(body.message ?? "Please fix the following and submit again:")}</p><ul>${list}</ul>
<p><a href="javascript:history.back()" style="color:#1155cc;font-weight:800">← Go back to the form</a> (your answers are kept)</p>
<p>Need help? Call us at <a href="tel:+15599040999">559.904.0999</a>.</p></body></html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function handleRegistration(request: Request, env: RegistrationEnv): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return respond(request, 400, { ok: false, message: "We couldn’t read the form. Please try again." });
  }

  // Honeypot: real people never fill this hidden field. Pretend success for bots.
  if (text(form, "website")) return respond(request, 200, { ok: true });

  const { data, errors } = parseRegistration(form);
  if (!data) return respond(request, 422, { ok: false, message: "Please check the highlighted fields.", errors });

  const ip = request.headers.get("CF-Connecting-IP") ?? undefined;
  if (env.TURNSTILE_SECRET_KEY) {
    const human = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, text(form, "cf-turnstile-response", 4096), ip);
    if (!human) {
      return respond(request, 400, {
        ok: false,
        message: "Please complete the “I am human” check at the bottom of the form, then submit again.",
        errors: { turnstile: "Please complete the “I am human” check." },
      });
    }
  } else {
    console.warn("TURNSTILE_SECRET_KEY is not set: spam protection is off.");
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const emailStatus = await sendRegistrationEmails(env, data, createdAt);

  let saved = false;
  if (env.DB) {
    try {
      await saveRegistration(env.DB, data, { id, createdAt, ip, userAgent: request.headers.get("user-agent") ?? undefined, emailStatus });
      saved = true;
    } catch (e) {
      console.error("Saving registration failed", e);
    }
  }

  if (!saved && !emailStatus.includes("notify:sent")) {
    console.error("Registration could not be saved or emailed", JSON.stringify(data));
    return respond(request, 500, {
      ok: false,
      message: "Something went wrong on our side and your registration was not received. Please try again in a few minutes or call us at 559.904.0999.",
    });
  }
  return respond(request, 200, { ok: true });
}
