/**
 * 日期转字符串
 * @param {Date} dateObject 
 * @param {String} split 
 * @returns {String} split为-  则为YYYY-MM-DD，不传默认为''为YYYYMMDD
 */
export function formateDateToString(dateObject, split) {
    if (typeof split == 'undefined') {
        split = '';
    }
    var fullYear = dateObject.getFullYear();
    var m = dateObject.getMonth() + 1;
    var month = m >= 10 ? m : '0' + m;
    var d = dateObject.getDate();
    var day = d >= 10 ? d : '0' + d;
    return '' + fullYear + split + month + split + day;
}

/**
 * 字符串转日期
 * @param {YYYYMMDD} dateString 
 */
export function formateStringToDate(dateString) {
    var ds = dateString.slice(0, 4) + '-' + dateString.slice(4, 6) + '-' + dateString.slice(6, 8);
    return new Date(ds);
}

/**
 * 倒计时
 * @param {expireNum} * 倒计时时间戳
 * @param {nowNum} * 现在时间戳
 */
export function dateCount(expireNum, nowNum) {
    var expireDate = new Date(expireNum);
    var nowDate;
    if (typeof nowNum == 'undefined') {
        nowDate = new Date();
    } else {
        nowDate = new Date(nowNum);
    }
    var diffSec = (expireDate - nowDate) / 1000 >> 0;
    var date = diffSec / 60 / 60 / 24 >> 0;
    var hour = diffSec / 60 / 60 % 24 >> 0;
    var min = diffSec / 60 % 60 >> 0;
    var sec = diffSec % 60;
    if (date < 0 || hour < 0 || min < 0) {
        return '';
    }
    return date + '天' + hour + '时' + min + '分';
}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
export function accMul(arg1, arg2) {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {}
    try {
        m += s2.split(".")[1].length;
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/** 
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
export function accDiv(arg1, arg2) {
    var t1 = 0,
        t2 = 0,
        r1,
        r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    } catch (e) {}
    try {
        t2 = arg2.toString().split(".")[1].length;
    } catch (e) {}
    // with (Math) {
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return r1 / r2 * Math.pow(10, t2 - t1);
    // }
}

/**
 * 格式化数字，用来每三位加逗号
 * @param {num} 数字
 * @returns {String} 格式化数字的结果
 */
export function thousandFormat(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 前端判断是否为交易日期
 * @param {dateObject} Date  
 * @param {nonTradingDate} Array  
 * 
 * @returns Boolean
 */
export function isTradeDate(dateObject, nonTradingDate) {
    var dateString = formateDateToString(dateObject, '');
    if (nonTradingDate.indexOf(dateString) !== -1) {
        return false;
    }
    var day = dateObject.getDay();
    return day !== 6 && day !== 0;
}

/**
 * 字符串超长缩写
 * @param {string}  字符串
 * @param {length}  保留长度
 */
export function abbreviation(string, length = 17) {
    if (string.length <= length) {
        return string;
    }
    return string.slice(0, length) + '...';
}

/**
 * 比较函数
 * @param {pro} any  
 */
export function compare(pro) {
    var desc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    return function (obj1, obj2) {
        var val1 = Number(obj1[pro]);
        var val2 = Number(obj2[pro]);
        if (val1 < val2 || isNaN(val1)) {
            return desc ? 1 : -1;
        } else if (val1 > val2 || isNaN(val2)) {
            return desc ? -1 : 1;
        } else {
            return 0;
        }
    };
}

// 获取客户端iOS版本
export function getIosVersion() {
    if (isIOS()) {
        var str = navigator.userAgent.toLowerCase();
        var ver = str.match(/cpu iphone os (.*?) like mac os/);
        return Number(ver[1].replace(/_/g, '.').split('.')[0]);
    } else {
        return -1;
    }
}

// 判断客户端iOS
export function isIOS() {
    var u = navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

/**
 * 计算两个日期的间隔
 * @param {date1Str} String  
 * @param {date2Str} String  
 */
export function getDiffDays(date1Str, date2Str) {
    var date1 = new Date(date1Str.substring(0, 4), parseInt(date1Str.substring(4, 6)) - 1, date1Str.substring(6));
    var date2 = new Date(date2Str.substring(0, 4), parseInt(date2Str.substring(4, 6)) - 1, date2Str.substring(6));

    var diffTime = date2.getTime() - date1.getTime();
    var diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays;
}

/**
 * @param {nonTradingDays} Array  
 * @param {serverTime} Array  
 * @returns Date
 */
export function getLastTradingDay(nonTradingDays, serverTime) {
    var today = new Date();
    if(serverTime && serverTime[0]) {
        today = formateStringToDate(serverTime[0]);
    }
    var lastTradingDay = new Date(today.setDate(today.getDate() - 1));
    var lastTradingDayStr = formateDateToString(lastTradingDay);

    while (nonTradingDays.indexOf(lastTradingDayStr) != -1 || lastTradingDay.getDay() == 6 || lastTradingDay.getDay() == 0) {
        lastTradingDay = new Date(lastTradingDay.setDate(lastTradingDay.getDate() - 1));
        lastTradingDayStr = formateDateToString(lastTradingDay);
    }

    return lastTradingDay;
}