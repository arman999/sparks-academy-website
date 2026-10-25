// Show the sticky Join button after the hero, hide it while the final call-to-action is on screen.
const bar = document.querySelector<HTMLElement>("[data-sticky-join]");
const hero = document.querySelector("[data-hero]");
const finalCta = document.querySelector("[data-final-cta]");

if (bar) {
  const visible = new Map<Element, boolean>();
  const update = () => {
    const hide = [...visible.values()].some(Boolean);
    bar.toggleAttribute("data-hidden", hide);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) visible.set(entry.target, entry.isIntersecting);
      update();
    },
    { rootMargin: "0px 0px -15% 0px" },
  );

  [hero, finalCta].forEach((el) => {
    if (el) {
      visible.set(el, true);
      observer.observe(el);
    }
  });
  if (!hero && !finalCta) bar.removeAttribute("data-hidden");
}
