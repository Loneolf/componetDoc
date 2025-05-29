'use strict';

define(function (require, exports, module) {
    /**
     * 格式化正整数-每三位逗号
     * @param {Number} num 整数
     * @returns {String} output
     */
    function thousandFormat(num) {
        var output = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return output;
    }

    exports.thousandFormat = thousandFormat;
});