function smoothScroll(position, duration, ease, interruptible, callback) {
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
        if (interruptible) {
            interruptible = function() {
                run = false;
            };
            window.addEventListener("touchmove", interruptible);
            window.addEventListener("wheel", interruptible);
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
                if (interruptible) {
                    window.removeEventListener("touchmove", interruptible);
                    window.removeEventListener("wheel", interruptible);
                }
                if (callback) {
                    callback();
                }
            }
        };
        step();
    }
}
