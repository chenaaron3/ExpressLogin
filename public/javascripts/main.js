// generates html for todo activity
import $ from "jquery";
import Highway from '@dogstudio/highway';
import {TimelineMax} from "gsap"

function generateTodoHTML(activity)
{
    return`
     <li class="activity">
        <span>${activity}</span>
        <i class="fas fa-trash"></i>
        <i class="fas fa-check"></i>
    </li>`;
}

// generates html for complete activity
function generateCompleteHTML(activity)
{
    return `
     <li class="activity">
        <span>${activity}</span>
        <i class="fas fa-trash"></i>
    </li>`;
}

$(document).ready(() => {
    let $todoList = $(".notComplete");
    let $completeList = $(".complete");

    $("#menu-list li").on("click", function() {
        changePath($(this).attr("href"));
    });

    // when enter something in the todo input
    $(".todoInput").on("keydown", function search(e) {
        if(e.key === "Enter") {
            let $input = $(this);
            let activity = $input.val();
            $.ajax({
                url: `/createActivity`,
                type: "Post",
                data: {
                    activity: activity,
                },
                success: function(result){
                    console.log(result);
                    $input.val("");
                    $todoList.append(generateTodoHTML(activity));
                }
            });
        }
    });

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