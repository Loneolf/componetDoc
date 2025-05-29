/**
 * 节流
 * @param {function} fn 节流要执行的函数
 * @param {number} [interval = 500] 时间间隔(默认 500毫秒)
 * @returns {function}  
 */
export function throttle(fn, interval) {
    var last;
    var timer;
    var interval = interval || 500;
    return function () {
        var th = this;
        var args = arguments;
        var now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                fn.apply(th, args);
            }, interval);
        } else {
            last = now;
            fn.apply(th, args);
        }
    };
}

/**
 * 防抖
 * @param {function} fn 节流要执行的函数
 * @param {number} [interval = 500] 时间间隔(默认 500毫秒)
 * @returns {function}  
 */
export function debounce(fn, delay) {
    var delay = delay || 500;
    var timer;
    return function () {
        var th = this;
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            timer = null;
            fn.apply(th, args);
        }, delay);
    };
}