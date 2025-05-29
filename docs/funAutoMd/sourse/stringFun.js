'use strict';

define(function (require, exports, module) {
    /**
     * 字符串超长缩写
     * @param {String} string 
     * @returns {string}  
     */
    function abbreviation(string) {
        var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 17;

        if (string.length <= length) {
            return string;
        }
        return string.slice(0, length) + '...';
    }

    exports.abbreviation = abbreviation;
});