function changePath(path) {
    console.log("Going to " + path);
    // opens in respect to base url
    window.location.href = path;
}

function toggleMenu() {
    var $menu = $("#menu");
    if ($menu.hasClass("open")) {
        $menu.removeClass("open");
        $menu.addClass("close");
    } else {
        $menu.removeClass("close");
        $menu.addClass("open");
    }
}

$(document).ready(() => {
    $("#menu-list li").on("click", function() {
        changePath($(this).attr("href"));
    });
});