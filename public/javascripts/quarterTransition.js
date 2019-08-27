// Import Highway
import Highway from '@dogstudio/highway';
import $ from "jquery"
import {TimelineMax} from "gsap";

class CustomTransition extends Highway.Transition {
    // Built-in methods
    in({from, to, trigger, done}) {
        from.remove();
        console.log(`Inside in: From: ${from} To: ${to} Trigger: ${trigger}`);
        let tl = new TimelineMax({
            onComplete: () => {
                done();
            }
        });

        var $topLeftSlide = $(".transitionTL");
        var $topRightSlide = $(".transitionTR");
        var $bottomLeftSlide = $(".transitionBL");
        var $bottomRightSlide = $(".transitionBR");
        tl.fromTo($topLeftSlide, .5, {top: "-50%", left: "-50%"}, {top: "-100%", left: "-100%"}, 0);
        tl.fromTo($topRightSlide, .5, {top: "-50%", right: "-50%"}, {top: "-100%", right: "-100%"}, 0);
        tl.fromTo($bottomLeftSlide, .5, {top: "50%", left: "-50%"}, {top: "100%", left: "-100%"}, 0);
        tl.fromTo($bottomRightSlide, .5, {top: "50%", right: "-50%"}, {top: "100%", right: "-100%"}, 0);
    }

    out({from, trigger, done}) {
        console.log(`Inside out: From: ${from} Trigger: ${trigger}`);
        let tl = new TimelineMax({
            onComplete: () => {
                setTimeout(function () {
                    done();
                }, 100);
            }
        });

        var $topLeftSlide = $(".transitionTL");
        var $topRightSlide = $(".transitionTR");
        var $bottomLeftSlide = $(".transitionBL");
        var $bottomRightSlide = $(".transitionBR");
        tl.fromTo($topLeftSlide, .5, {top: "-100%", left: "-100%"}, {top: "-50%", left: "-50%"}, 0);
        tl.fromTo($topRightSlide, .5, {top: "-100%", right: "-100%"}, {top: "-50%", right: "-50%"}, 0);
        tl.fromTo($bottomLeftSlide, .5, {top: "100%", left: "-100%"}, {top: "50%", left: "-50%"}, 0);
        tl.fromTo($bottomRightSlide, .5, {top: "100%", right: "-100%"}, {top: "50%", right: "-50%"}, 0);
    }
}

// Don`t forget to export your transition
export default CustomTransition;