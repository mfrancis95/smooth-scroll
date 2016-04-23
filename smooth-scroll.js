var easingFunctions = {
    linear: function(time, start, change, duration) {
        return change * time / duration + start;
    },
    easeInQuad: function(time, start, change, duration) {
        return change * (time /= duration) * time + start;
    },
    easeOutQuad: function(time, start, change, duration) {
        return -change * (time /= duration) * (time - 2) + start;
    },
    easeInOutQuad: function(time, start, change, duration) {
        if ((time /= duration / 2) < 1) {
            return change / 2 * time * time + start;
        } 
        return -change / 2 * ((--time) * (time - 2) - 1) + start;
    },
    easeInCubic: function(time, start, change, duration) {
        return change * (time /= duration) * time * time + start;
    },
    easeOutCubic: function(time, start, change, duration) {
        return change * ((time = time / duration - 1) * time * time + 1) + start;
    },
    easeInOutCubic: function(time, start, change, duration) {
        if ((time /= duration / 2) < 1) {
            return change / 2 * time * time * time + start;
        }
        return change / 2 * ((time -= 2) * time * time + 2) + start;
    },
    easeInQuart: function(time, start, change, duration) {
        return change * (time /= duration) * time * time * time + start;
    },
    easeOutQuart: function(time, start, change, duration) {
        return -change * ((time = time / duration - 1) * time * time * time - 1) + start;
    },
    easeInOutQuart: function(time, start, change, duration) {
        if ((time /= duration / 2) < 1) {
            return change / 2 * time * time * time * time + start;
        }
        return -change / 2 * ((time -= 2) * time * time * time - 2) + start;
    },
    easeInQuint: function(time, start, change, duration) {
        return change * (time /= duration) * time * time * time * time + start;
    },
    easeOutQuint: function(time, start, change, duration) {
        return change * ((time = time / duration - 1) * time * time * time * time + 1) + start;
    },
    easeInOutQuint: function(time, start, change, duration) {
        if ((time /= duration / 2) < 1) {
            return change / 2 * time * time * time * time * time + start;
        }
        return change / 2 * ((time -= 2) * time * time * time * time + 2) + start;
    },
    easeInSine: function(time, start, change, duration) {
        return -change * Math.cos(time / duration * Math.PI / 2) + change + start;
    },
    easeOutSine: function(time, start, change, duration) {
        return change * Math.sin(time / duration * Math.PI / 2) + start;
    },
    easeInOutSine: function(time, start, change, duration) {
        return -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + start;
    },
    easeInExpo: function(time, start, change, duration) {
        return time === 0 ? start : change * Math.pow(2, 10 * (time / duration - 1)) + start;
    },
    easeOutExpo: function(time, start, change, duration) {
        return time === duration ? start + change : change * (-Math.pow(2, -10 * time / duration) + 1) + start;
    },
    easeInOutExpo: function(time, start, change, duration) {
        if (time === 0) {
            return start;
        }
        if (time === duration) {
            return start + change;
        }
        if ((time /= duration / 2) < 1) {
            return change / 2 * Math.pow(2, 10 * (time - 1)) + start;
        }
        return change / 2 * (-Math.pow(2, -10 * --time) + 2) + start;
    },
    easeInCirc: function(time, start, change, duration) {
        return - change * (Math.sqrt(1 - (time /= duration) * time) - 1) + start;
    },
    easeOutCirc: function(time, start, change, duration) {
        return change * Math.sqrt(1 - (time = time / duration - 1) * time) + start;
    },
    easeInOutCirc: function(time, start, change, duration) {
        if ((time /= duration / 2 ) < 1) {
            return -change / 2 * (Math.sqrt(1 - time * time) - 1) + start;
        }
        return change / 2 * (Math.sqrt(1 - (time -= 2) * time ) + 1) + start;
    }
};

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
        switch (typeof ease) {
            case "function":
                break;
            case "string":
                ease = easingFunctions[ease] || easingFunctions.linear;
                break;
            default:
                ease = easingFunctions.linear;
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
        var step = function() {
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

Element.prototype.smoothScrollify = function() {
    var self = this;
    self.addEventListener("click", function(event) {
        event.preventDefault();
        var dataset = self.dataset;
        var href = self.getAttribute("href");
        if (dataset.history) {
            history.pushState(null, null, href);
        }
        var position = document.getElementById(href.slice(1)).offsetTop;
        smoothScroll(position, dataset.duration, dataset.ease, dataset.interruptible);
    });
};
