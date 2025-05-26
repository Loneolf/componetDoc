# 通用函数
## formateDateToString 日期转字符串
日期转字符串

**参数**

| 参数 | 参数类型 |
|------|------|
| dateObject | `Date`|
| split | `String`|

**返回值**
- _String_ : split为-  则为YYYY-MM-DD，不传默认为&#x27;&#x27;为YYYYMMDD

**引用及使用**
```javascript
var util = require('vue/utils/common')
util.formateDateToString...
```
**函数体**
```javascript
function formateDateToString(dateObject, split) {
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
```
## formateStringToDate 字符串转日期
字符串转日期

**参数**

| 参数 | 参数类型 |
|------|------|
| dateString | `YYYYMMDD`|


**引用及使用**
```javascript
var util = require('vue/utils/common')
util.formateStringToDate...
```
**函数体**
```javascript
function formateStringToDate(dateString) {
    var ds = dateString.slice(0, 4) + '-' + dateString.slice(4, 6) + '-' + dateString.slice(6, 8);
    return new Date(ds);
}
```
## dateCount 倒计时
倒计时

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| * | `expireNum` | 倒计时时间戳 |
| * | `nowNum` | 现在时间戳 |



**引用及使用**
```javascript
var util = require('vue/utils/common')
util.dateCount...
```
**函数体**
```javascript
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
```
## accAdd * 加法函数，用来得到精确的加法结果
* 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
* 调用：accAdd(arg1,arg2)
* 返回值：arg1加上arg2的精确结果
* 加法函数，用来得到精确的加法结果
* 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
* 调用：accAdd(arg1,arg2)
* 返回值：arg1加上arg2的精确结果



**引用及使用**
```javascript
var util = require('vue/utils/common')
util.accAdd...
```
**函数体**
```javascript
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
```
## accMul * 乘法函数，用来得到精确的乘法结果
* 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
* 调用：accMul(arg1,arg2)
* 返回值：arg1乘以 arg2的精确结果
* 乘法函数，用来得到精确的乘法结果
* 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
* 调用：accMul(arg1,arg2)
* 返回值：arg1乘以 arg2的精确结果



**引用及使用**
```javascript
var util = require('vue/utils/common')
util.accMul...
```
**函数体**
```javascript
function accMul(arg1, arg2) {
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
```
## accDiv * 除法函数，用来得到精确的除法结果
* 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
* 调用：accDiv(arg1,arg2)
* 返回值：arg1除以arg2的精确结果
* 除法函数，用来得到精确的除法结果
* 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
* 调用：accDiv(arg1,arg2)
* 返回值：arg1除以arg2的精确结果



**引用及使用**
```javascript
var util = require('vue/utils/common')
util.accDiv...
```
**函数体**
```javascript
function accDiv(arg1, arg2) {
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
```
## isTradeDate 前端判断是否为交易日期
前端判断是否为交易日期

**参数**

| 参数 | 参数类型 |
|------|------|
| Date | `dateObject`|
| Array | `nonTradingDate`|

**返回值**
- __ : Boolean

**引用及使用**
```javascript
var util = require('vue/utils/common')
util.isTradeDate...
```
**函数体**
```javascript
function isTradeDate(dateObject, nonTradingDate) {
    var dateString = formateDateToString(dateObject, '');
    if (nonTradingDate.indexOf(dateString) !== -1) {
        return false;
    }
    var day = dateObject.getDay();
    return day !== 6 && day !== 0;
}
```
## abbreviation 字符串超长缩写
字符串超长缩写

**参数**

| 参数 | 参数类型 |
|------|------|
| 字符串 | `string`|
| 保留长度 | `length`|


**引用及使用**
```javascript
var util = require('vue/utils/common')
util.abbreviation...
```
**函数体**
```javascript
function abbreviation(string, length = 17) {
    if (string.length <= length) {
        return string;
    }
    return string.slice(0, length) + '...';
}
```
## compare 比较函数
比较函数

**参数**

| 参数 | 参数类型 |
|------|------|
| any | `pro`|


**引用及使用**
```javascript
var util = require('vue/utils/common')
util.compare...
```
**函数体**
```javascript
function compare(pro) {
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
```
## getDiffDays 计算两个日期的间隔
计算两个日期的间隔

**参数**

| 参数 | 参数类型 |
|------|------|
| String | `date1Str`|
| String | `date2Str`|


**引用及使用**
```javascript
var util = require('vue/utils/common')
util.getDiffDays...
```
**函数体**
```javascript
function getDiffDays(date1Str, date2Str) {
    var date1 = new Date(date1Str.substring(0, 4), parseInt(date1Str.substring(4, 6)) - 1, date1Str.substring(6));
    var date2 = new Date(date2Str.substring(0, 4), parseInt(date2Str.substring(4, 6)) - 1, date2Str.substring(6));

    var diffTime = date2.getTime() - date1.getTime();
    var diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays;
}
```
## getLastTradingDay 

**参数**

| 参数 | 参数类型 |
|------|------|
| Array | `nonTradingDays`|
| Array | `serverTime`|

**返回值**
- __ : Date

**引用及使用**
```javascript
var util = require('vue/utils/common')
util.getLastTradingDay...
```
**函数体**
```javascript
function getLastTradingDay(nonTradingDays, serverTime) {
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
```
