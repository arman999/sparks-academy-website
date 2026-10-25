// Close the mobile menu after tapping a link in it.
document.querySelectorAll<HTMLDetailsElement>("[data-mobile-menu]").forEach((menu) => {
  menu.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("a")) menu.open = false;
  });
  document.addEventListener("click", (event) => {
    if (menu.open && !menu.contains(event.target as Node)) menu.open = false;
  });
});
