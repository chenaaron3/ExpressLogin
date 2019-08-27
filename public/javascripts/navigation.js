// toggles open and close class tag
function toggleMenu() {
    var menu = document.getElementById("menu");
    // if menu is open, close it
    if (menu.classList.contains("open")) {
        menu.classList.remove("open");
        menu.classList.add("close");
    }
    // otherwise open it
    else {
        menu.classList.remove("close");
        menu.classList.add("open");
    }
}