// generates html for todo activity
import $ from "jquery";

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

function onPageLoad() {
    console.log("Document ready from main.");
    let $todoList = $(".notComplete");
    let $completeList = $(".complete");

    console.log($todoList);

    // when enter something in the todo input
    $(".todoInput").on("keydown", function search(e) {
        if(e.key === "Enter") {
            let $input = $(this);
            let activity = $input.val();
            // make a request to create activity
            $.ajax({
                url: `/createActivity`,
                type: "Post",
                data: {
                    activity: activity,
                },
                success: function(result){
                    // clears the input text and adds a todo element
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
                // removes the todo element and adds a completed element
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
                // delete the activity element
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
                // delete activity element
                $parent.remove();
                console.log(result);
            }
        });
    });
}

export default onPageLoad;