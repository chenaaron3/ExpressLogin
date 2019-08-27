// Import Highway
import Highway from '@dogstudio/highway';
import $ from "jquery"
import onPageLoad from "./main.js"

class CustomRenderer extends Highway.Renderer {
    // Hooks/methods
    onEnter() {
        console.log("onEnter");
        offsetTransitionBackground();
    }
    onEnterCompleted() {
        console.log("onEnterCompleted");
        onPageLoad();
    }
    onLeave() {
        console.log("onLeave");
        offsetTransitionBackground();
    }
    onLeaveCompleted() {
        console.log("onLeaveCompleted");
    }
}

function offsetTransitionBackground()
{
    // gets the background components
    var $topLeftSlide = $(".transitionTL");
    var $topRightSlide = $(".transitionTR");
    var $bottomLeftSlide = $(".transitionBL");
    var $bottomRightSlide = $(".transitionBR");

    var height = parseInt($topLeftSlide.css("height"), 10);

    var img = new Image;
    img.src = $topLeftSlide.css('background-image').replace(/^url\(["']?|["']?\)$/ig, "");
    var bgImgWidth = img.width;
    var bgImgHeight = img.height;
    var horizOffset = bgImgWidth * height / bgImgHeight / 2;
    var vertOffset = height / 2;

    $topLeftSlide.css("background-position", "bottom -" + vertOffset + "px right -" + horizOffset + "px");
    $topRightSlide.css("background-position", "bottom -" + vertOffset + "px left -" + horizOffset + "px");
    $bottomLeftSlide.css("background-position", "top -" + vertOffset + "px right -" + horizOffset + "px");
    $bottomRightSlide.css("background-position", "top -" + vertOffset + "px left -" + horizOffset + "px");
}

// Don`t forget to export your renderer
export default CustomRenderer;