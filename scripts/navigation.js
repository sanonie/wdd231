const menuButton = document.querySelector("#menuButton");
const navigation = document.querySelector("#primaryNav");

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");
        menuButton.textContent = isOpen ? "✕" : "☰";
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
}
