'use strict';

define(function (require, exports, module) {
    /**
     * 日期转字符串
     */
    function isIOS() {
        var u = navigator.userAgent;
        return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    }

    /**
     * 获取客户端iOS版本
     */
    function getIosVersion() {
        if (isIOS()) {
            var str = navigator.userAgent.toLowerCase();
            var ver = str.match(/cpu iphone os (.*?) like mac os/);
            return Number(ver[1].replace(/_/g, '.').split('.')[0]);
        } else {
            return -1;
        }
    }

    exports.isIOS = isIOS;
    exports.getIosVersion = getIosVersion;
});