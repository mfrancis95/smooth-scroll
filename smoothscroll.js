var smoothScroll = function(properties) {
    properties = properties || {};
    var callback = properties.callback;
    var duration = properties.duration || 500;
    var ease = properties.ease;
    if (!ease) {
        ease = function(time, start, change, duration) {
            return change * time / duration + start;
        };
    }
    var position = properties.position || 0;
    var start = window.scrollY;
    var change = position - start;
    var startTime = Date.now();
    var step = function() {
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
};