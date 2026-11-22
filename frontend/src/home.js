const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');

function updateThemeButton() {
  const isDark = root.dataset.theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  toggle.textContent = isDark ? "☀" : "☾";
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
