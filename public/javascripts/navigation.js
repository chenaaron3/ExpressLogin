// Functions used on client side
// Called by HTML
// Using JQuery

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

function generateTodoHTML(activity)
{
    return`
     <li class="activity">
        <span>${activity}</span>
        <i class="fas fa-trash"></i>
        <i class="fas fa-check"></i>
    </li>`;
}

function generateCompleteHTML(activity)
{
    return `
     <li class="activity">
        <span>${activity}</span>
        <i class="fas fa-trash"></i>
    </li>`;
}


$(document).ready(() => {
    $("#menu-list li").on("click", function() {
        changePath($(this).attr("href"));
    });

    let $todoList = $(".notComplete");
    let $completeList = $(".complete");

    // when click on check in todoList, send to completeList
    $todoList.delegate(".fa-check", "click", function () {
        let $parent = $(this).parent();
        let activity = $parent.children().html();
        $.ajax({
            url: '/checkTodo',
            type: 'POST',
            data: {
                activity: activity
            },
            success: function(result) {
                $parent.remove();
                $completeList.append(generateCompleteHTML(activity));
                console.log(result);
            }
        });
    });

    // when click on trash in todoList, send delete request
    $todoList.delegate(".fa-trash", "click", function () {
        let $parent = $(this).parent();
        let activity = $parent.children().html();
        $.ajax({
            url: '/deleteTodo',
            type: 'DELETE',
            data: {
                activity: activity
            },
            success: function(result) {
                $parent.remove();
                console.log(result);
            }
        });
    });

    // when click on trash in completeList, send delete request
    $completeList.delegate(".fa-trash", "click", function () {
        let $parent = $(this).parent();
        let activity = $parent.children().html();
        $.ajax({
            url: '/deleteComplete',
            type: 'DELETE',
            data: {
                activity: activity
            },
            success: function(result) {
                $parent.remove();
                console.log(result);
            }
        });
    });
});