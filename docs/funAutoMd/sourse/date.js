'use strict';

define(function (require, exports, module) {
    /**
     * 日期转字符串
     * @param {Date} dateObject 需要转换的 Date
     * @param {String} [split = ""] 年月日的间隔符（默认为空：20150531）
     * @returns {String} dateStr
     */
    function formateDateToString(dateObject, split) {
        if (typeof split == 'undefined') {
            split = '';
        }
        var fullYear = dateObject.getFullYear();
        var m = dateObject.getMonth() + 1;
        var month = m >= 10 ? m : '0' + m;
        var d = dateObject.getDate();
        var day = d >= 10 ? d : '0' + d;
        var dateStr = '' + fullYear + split + month + split + day;
        return dateStr
    }

    /**
     * 字符串转日期
     * @param {YYYYMMDD} dateString
     * @returns {Date} dateObject 
     */
    function formateStringToDate(dateString) {
        var ds = dateString.slice(0, 4) + '-' + dateString.slice(4, 6) + '-' + dateString.slice(6, 8);
        return new Date(ds);
    }

    /**
     * 返回【当天、近一周、近一月、近三月、近一年】的开始、结束时间
     * @param {Date} time 需要转换的 Date
     * @param {Boolean} includeTody  是否把当天时间当做近一周...的结束时间
     * @returns {Object} options - 配置选项
     * @returns {String} options.today - 今天
     * @returns {Object} options.weekly - 近一周
     * @returns {String} options.weekly.beginDate- 近一周--开始日期
     * @returns {String} options.weekly.endDate - 近一周--结束日期
     * @returns {Object} options.userDefined - 用户定义
     * @returns {String} options.userDefined.beginDate- 用户定义--开始日期
     * @returns {String} options.userDefined.endDate - 用户定义--结束日期
     * @returns {Object} options.month - 近一月
     * @returns {String} options.month.beginDate- 近一月--开始日期
     * @returns {String} options.month.endDate - 近一月--结束日期
     * @returns {Object} options.threeMonth - 近三月
     * @returns {String} options.threeMonth.beginDate- 近三月--开始日期
     * @returns {String} options.threeMonth.endDate - 近三月--开始日期
     * @returns {Object} options.oneYear - 近一年
     * @returns {String} options.oneYear.beginDate- 近一年--开始日期
     * @returns {String} options.oneYear.endDate - 近一年--开始日期
     */
    function getNearTime(time, includeTody) {
        if (!time) time = new Date()
        var colTime = time
        if (!includeTody) {
            colTime = getDiffDate(time, 1).time
        }
        var endDate = getDiffDate(colTime, 1 - Number(includeTody)).timeText
        var monthBegin = new Date(colTime.getFullYear(), colTime.getMonth() - 1, colTime.getDate() + 1)
        var threeMonthBegin = new Date(colTime.getFullYear(), colTime.getMonth() - 3, colTime.getDate() + 1)
        var oneYearBegin = new Date(colTime.getFullYear() - 1, colTime.getMonth(), colTime.getDate() + 1)
        return {
            today: getDiffDate(time, 0).timeText,
            weekly: {
                beginDate: getDiffDate(colTime, 7).timeText,
                endDate: endDate,
            },
            userDefined: {
                beginDate: getDiffDate(monthBegin, 0).timeText,
                endDate: endDate,
            },
            month: {
                beginDate: getDiffDate(monthBegin, 0).timeText,
                endDate: endDate,
            },
            threeMonth: {
                beginDate: getDiffDate(threeMonthBegin, 0).timeText,
                endDate: endDate,
            },
            oneYear: {
                beginDate: getDiffDate(oneYearBegin, 0).timeText,
                endDate: endDate,
            },
        }
    }

    /**
     * 计算两个日期的间隔天数
     * @param {String} date1Str 
     * @param {String} date2Str 
     */
    function getDiffDays(date1Str, date2Str) {
        var date1 = new Date(date1Str.substring(0, 4), parseInt(date1Str.substring(4, 6)) - 1, date1Str.substring(6));
        var date2 = new Date(date2Str.substring(0, 4), parseInt(date2Str.substring(4, 6)) - 1, date2Str.substring(6));

        var diffTime = date2.getTime() - date1.getTime();
        var diffDays = diffTime / (1000 * 60 * 60 * 24);

        return diffDays;
    }

    /**
     * 返回对应的时间戳和转换的文字日期
     * @param {Date} time 传入的时间戳或日期数据
     * @param {Number} diff 与传入时间戳的差值(天数)
     * @returns {Object}  返回一个对象：
     */
    function getDiffDate(time, diff) {
        if (!diff) diff = 0;
        var diffTime = new Date(new Date(time).getTime() - 24 * 60 * 60 * 1000 * diff);
        var timeString = diffTime.getFullYear() + '-' + (diffTime.getMonth() + 1) + '-' + diffTime.getDate();
        return {
            timestamp: diffTime.getTime(),
            timeText: addTimeZero(timeString),
            time: diffTime
        };
    }

    /**
     * 日期格式补齐两位
     * @param {YYYYMMDD} timeText 日期格式 eg: 2015-5-31
     * @param {String} [operate = "-"] 年月日间隔符默认“-”
     * @returns {YYYYMMDD} 返回补齐后的日期：2015-05-31
     */
    function addTimeZero(timeText, operate) {
        if (!operate) operate = "-";
        var arr = timeText.split(operate);
        arr.forEach(function (item, index) {
            if (Number(item) < 10) arr[index] = "0" + item;
        });
        return arr.join(operate);
    }

    /**
     * 倒计时
     * @param {expireNum} * 倒计时时间戳
     * @param {nowNum} * 现在时间戳
     */
    function dateCount(expireNum, nowNum) {
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
     * 获取传入日期对应月份的起始、结束日期
     * @param {Date} dateObject 需要转换的 Date
     * @returns {object} 返回一个对象
     */
    function getMonthBeginEndDate(date) {
        var monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        return {
            beginDate: getDiffDate(monthEnd, monthEnd.getDate() - 1),
            endDate: getDiffDate(monthEnd, 0)
        }
    }

    exports.addTimeZero = addTimeZero;
    exports.getDiffDate = getDiffDate;
    exports.getNearTime = getNearTime;
    exports.formateDateToString = formateDateToString;
    exports.formateStringToDate = formateStringToDate;
    exports.dateCount = dateCount;
    exports.getMonthBeginEndDate = getMonthBeginEndDate;
});