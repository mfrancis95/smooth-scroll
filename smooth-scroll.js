const easingFunctions = {
    easeInCirc: (time, start, change, duration) => -change * (Math.sqrt(1 - (time /= duration) * time) - 1) + start,
    easeInCubic: (time, start, change, duration) => change * (time /= duration) * time * time + start,
    easeInExpo: (time, start, change, duration) =>  time === 0 ? start : change * Math.pow(2, 10 * (time / duration - 1)) + start,
    easeInOutCirc: (time, start, change, duration) => {
        if ((time /= duration / 2 ) < 1) {
            return -change / 2 * (Math.sqrt(1 - time * time) - 1) + start;
        }
        return change / 2 * (Math.sqrt(1 - (time -= 2) * time ) + 1) + start;
    },
    easeInOutCubic: (time, start, change, duration) => {
        if ((time /= duration / 2) < 1) {
            return change / 2 * time * time * time + start;
        }
        return change / 2 * ((time -= 2) * time * time + 2) + start;
    },
    easeInOutExpo: (time, start, change, duration) => {
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
    easeInOutQuad: (time, start, change, duration) => {
        if ((time /= duration / 2) < 1) {
            return change / 2 * time * time + start;
        }
        return -change / 2 * ((--time) * (time - 2) - 1) + start;
    },
    easeInOutQuart: (time, start, change, duration) => {
        if ((time /= duration / 2) < 1) {
            return change / 2 * time * time * time * time + start;
        }
        return -change / 2 * ((time -= 2) * time * time * time - 2) + start;
    },
    easeInOutQuint: (time, start, change, duration) => {
        if ((time /= duration / 2) < 1) {
            return change / 2 * time * time * time * time * time + start;
        }
        return change / 2 * ((time -= 2) * time * time * time * time + 2) + start;
    },
    easeInOutSine: (time, start, change, duration) => -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + start,
    easeInQuad: (time, start, change, duration) => change * (time /= duration) * time + start,
    easeInQuart: (time, start, change, duration) => change * (time /= duration) * time * time * time + start,
    easeInQuint: (time, start, change, duration) =>  change * (time /= duration) * time * time * time * time + start,
    easeInSine: (time, start, change, duration) => -change * Math.cos(time / duration * Math.PI / 2) + change + start,
    easeOutCirc: (time, start, change, duration) => change * Math.sqrt(1 - (time = time / duration - 1) * time) + start,
    easeOutCubic: (time, start, change, duration) => change * ((time = time / duration - 1) * time * time + 1) + start,
    easeOutExpo: (time, start, change, duration) => time === duration ? start + change : change * (-Math.pow(2, -10 * time / duration) + 1) + start,
    easeOutQuad: (time, start, change, duration) => -change * (time /= duration) * (time - 2) + start,
    easeOutQuart: (time, start, change, duration) => -change * ((time = time / duration - 1) * time * time * time - 1) + start,
    easeOutQuint: (time, start, change, duration) => change * ((time = time / duration - 1) * time * time * time * time + 1) + start,
    easeOutSine: (time, start, change, duration) => change * Math.sin(time / duration * Math.PI / 2) + start,
    linear: (time, start, change, duration) => change * time / duration + start
};

async function smoothScroll(position = 0, duration = 500, ease = easingFunctions.linear, interruptible = []) {
    const start = window.scrollY;
    if (position === start) {
        return;
    }
    const easingFunction = typeof ease === 'string' ? easingFunctions[ease] ?? easingFunctions.linear : ease;
    let run = true;
    const interrupt = () => {
        run = false;
    };
    interruptible.forEach(event => {
        document.addEventListener(event, interrupt)
    });
    const startTime = Date.now();
    const change = position - start;
    return new Promise(resolve => {
        const step = () => {
            if (run) {
                const time = Date.now() - startTime;
                if (time <= duration) {
                    window.scrollTo(0, easingFunction(time, start, change, duration));
                }
                else {
                    run = false;
                    window.scrollTo(0, position);
                }
                requestAnimationFrame(step);
            }
            else {
                interruptible.forEach(event => {
                    document.removeEventListener(event, interrupt);
                });
                resolve();
            }
        };
        requestAnimationFrame(step);
    });
}

HTMLElement.prototype.smoothScrollify = function() {
    const { dataset } = this;
    this.addEventListener('click', async event => {
        event.preventDefault();
        const href = this.getAttribute('href');
        if (dataset.history) {
            history.pushState(null, '', href);
        }
        await smoothScroll(document.getElementById(href.slice(1)).offsetTop, dataset.duration, dataset.ease, dataset.interruptible?.split(' '));
        window[dataset.callback]?.();
    });
};

for (const element of document.getElementsByClassName('smooth-scroll')) {
    element.smoothScrollify();
}
