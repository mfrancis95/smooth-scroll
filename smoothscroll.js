function smoothScroll(position, duration, ease, interruptable, callback) {
    position = position || 0;
    var start = window.scrollY;
    if (position === start) {
        if (callback) {
            callback();
        }
    }
    else {
        duration = duration || 500;
        if (!ease) {
            ease = function(time, start, change, duration) {
                return change * time / duration + start;
            };
        }
        var run = true;
        if (interruptable) {
            interruptable = function() {
                run = false;
            };
            window.addEventListener("wheel", interruptable);
        }
        var startTime = Date.now();
        var change = position - start;
        var step = function () {
            if (run) {
                var time = Date.now() - startTime;
                if (time <= duration) {
                    window.scrollTo(0, ease(time, start, change, duration));
                }
                else {
                    run = false;
                    window.scrollTo(0, position);
                }
                requestAnimationFrame(step);
            }
            else {
                if (interruptable) {
                    window.removeEventListener("wheel", interruptable);
                }
                if (callback) {
                    callback();
                }
            }
        };
        step();
    }
}