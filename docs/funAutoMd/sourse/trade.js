'use strict';

define(function (require, exports, module) {
    /** 判断是否是顶点 
     *  @param {object} data 接口数据
     */
    function checkIsA5(data) {
        if (data && data.APEX_A5_SPECFLAG && data.APEX_A5_SPECFLAG == '1') {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 前端判断是否为交易日期
     * @param {Date} dateObject 
     * @param {Array} nonTradingDate 
     * @returns {Boolean}
     */
    function isTradeDate(dateObject, nonTradingDate) {
        var dateString = formateDateToString(dateObject, '');
        if (nonTradingDate.indexOf(dateString) !== -1) {
            return false;
        }
        var day = dateObject.getDay();
        return day !== 6 && day !== 0;
    }

    /**
     * @param {Array} nonTradingDays 
     * @param {Array} serverTime 
     * @returns {Array}
     */
    function getLastTradingDay(nonTradingDays, serverTime) {
        var today = new Date();
        if (serverTime && serverTime[0]) {
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

    exports.checkIsA5 = checkIsA5;
    exports.isTradeDate = isTradeDate;
    exports.getLastTradingDay = getLastTradingDay;
});
