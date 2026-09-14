(function () {
  const storageKey = "recomp-theme";
  const root = document.documentElement;
  const buttons = document.querySelectorAll("[data-theme-choice]");

  function applyTheme(choice) {
    root.setAttribute("data-theme", choice);
    buttons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        button.dataset.themeChoice === choice ? "true" : "false",
      );
    });
  }

  const saved = localStorage.getItem(storageKey);
  if (saved === "light" || saved === "dark" || saved === "system") {
    applyTheme(saved);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.dataset.themeChoice;
      localStorage.setItem(storageKey, choice);
      applyTheme(choice);
    });
  });
})();
