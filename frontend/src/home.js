const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');
const icons = {
  moon: '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>',
  sun: '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
};

function updateThemeButton() {
  const isDark = root.dataset.theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  toggle.innerHTML = isDark ? icons.sun : icons.moon;
  toggle.setAttribute("aria-label", label);
  toggle.setAttribute("title", label);
  toggle.setAttribute("aria-pressed", String(isDark));
  themeColor?.setAttribute("content", isDark ? "#151e19" : "#fafbf8");
}

updateThemeButton();

toggle.addEventListener("click", () => {
  const isDark = root.dataset.theme !== "dark";
  root.dataset.theme = isDark ? "dark" : "light";
  localStorage.setItem("darkMode", JSON.stringify(isDark));
  updateThemeButton();
});
