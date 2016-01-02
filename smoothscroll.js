function smoothScroll(position, duration, ease, callback) {
    position = position || 0;
    var start = window.scrollY;
    if (position === start) {
        if (callback) {
            callback();
        }
    }
    else {
        var change = position - start;
        duration = duration || 500;
        if (!ease) {
            ease = function (time, start, change, duration) {
                return change * time / duration + start;
            };
        }
        var startTime = Date.now();
        var step = function () {
            var time = Date.now() - startTime;
            if (time <= duration) {
                window.scrollTo(0, ease(time, start, change, duration));
                requestAnimationFrame(step);
            }
            else {
                window.scrollTo(0, position);
                if (callback) {
                    callback();
                }
            }
        };
        step();
    }
}