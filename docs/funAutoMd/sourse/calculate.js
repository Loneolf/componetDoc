'use strict';

define(function (require, exports, module) {
    /**
     * 加法函数，用来得到精确的加法结果(js 中两个浮点数相加有误差)
     * @param {number} arg1 加数
     * @param {number} arg2 被加数
     * @returns {number}  arg1 加 arg2的精确结果
     */
    function accAdd(arg1, arg2) {
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
     * 减法函数，用来得到精确的减法结果(js 中两个浮点数相减有误差)
     * @param {number} arg1 减数
     * @param {number} arg2 被减数
     * @returns {number}  arg1 减 arg2的精确结果
     */
    function accSub(arg1, arg2) {
        var t1 = 0,
            t2 = 0,
            r1,
            r2;
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) { }
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) { }
        // with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return r1 / r2 * Math.pow(10, t2 - t1);
        // }
    }

    /**
     * 乘法函数，用来得到精确的乘法结果(js 中两个浮点数相乘有误差)
     * @param {number} arg1 乘数
     * @param {number} arg2 被乘数
     * @returns {number}  arg1 乘 arg2的精确结果
     */
    function accMul(arg1, arg2) {
        var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) { }
        try {
            m += s2.split(".")[1].length;
        } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    }

    /**
     * 除法函数，用来得到精确的除法结果(js 中两个浮点数相除有误差)
     * @param {number} arg1 除数
     * @param {number} arg2 被除数
     * @returns {number}  arg1 除 arg2的精确结果
     */
    function accDiv(arg1, arg2) {
        var t1 = 0,
            t2 = 0,
            r1,
            r2;
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) { }
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) { }
        // with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return r1 / r2 * Math.pow(10, t2 - t1);
        // }
    }
    exports.accAdd = accAdd;
    exports.accSub = accSub;
    exports.accMul = accMul;
    exports.accDiv = accDiv;
});