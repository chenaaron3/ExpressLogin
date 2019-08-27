import Highway from "@dogstudio/highway";
import $ from "jquery"

// Import Renderers
import QuarterRenderer from "./quarterRenderer";

// Import Transitions
import QuarterTransition from "./quarterTransition";

$(() => {
    console.log("Document Ready from animations");
    // Call Highway.Core once.
// Relate transitions to pages with the label of the `data-router-view`.
    const H = new Highway.Core({
        renderers: {
            quarter: QuarterRenderer,
        },
        transitions: {
            default: QuarterTransition,
        }
    });
})