// Pause / play button for the scrolling cards.
document.querySelectorAll<HTMLButtonElement>("[data-marquee-toggle]").forEach((button) => {
  const section = button.closest("section");
  const marquee = section?.querySelector<HTMLElement>("[data-marquee]");
  if (!marquee) return;

  const label = button.querySelector<HTMLElement>("[data-label]");
  const pauseIcon = button.querySelector<HTMLElement>("[data-icon-pause]");
  const playIcon = button.querySelector<HTMLElement>("[data-icon-play]");

  // Hide the button when the visitor has reduced motion on (nothing moves anyway).
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    button.hidden = true;
    return;
  }

  button.addEventListener("click", () => {
    const paused = marquee.toggleAttribute("data-paused");
    button.setAttribute("aria-pressed", String(paused));
    if (label) label.textContent = paused ? "Play" : "Pause";
    pauseIcon?.classList.toggle("hidden", paused);
    playIcon?.classList.toggle("hidden", !paused);
  });
});
