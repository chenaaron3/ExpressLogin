// changes the page to a given subdirectory
function changePath(path) {
    console.log("Going to " + path);
    // opens in respect to base url
    window.location.href = path;
}

// toggles open and close class tag
function toggleMenu() {
    var menu = document.getElementById("menu");
    if (menu.classList.contains("open")) {
        menu.classList.remove("open");
        menu.classList.add("close");
    } else {
        menu.classList.remove("close");
        menu.classList.add("open");
    }
}