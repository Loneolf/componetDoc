# 通用日期处理

<ClientOnly>
  <DrawerTestDoc url='https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/coverage/lcov-report/date.js.html'/>
</ClientOnly>

<script setup>
  import DrawerTestDoc from '../../vueCom/drawerTestDoc.vue';
</script>


## formateDateToString 日期转字符串
日期转字符串

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| dateObject | `Date` | 需要转换的 Date |
| split | `String` | 年月日的间隔符（默认为空：20150531） |


**返回值**
- _String_ : dateStr

**引用及使用**
```javascript
var util = require('vue/utils/date')
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
    var dateStr = '' + fullYear + split + month + split + day;
    return dateStr
}
```



## formateStringToDate 字符串转日期
字符串转日期

**参数**

| 参数 | 参数类型 |
|------|------|
| dateString | `YYYYMMDD`|

**返回值**
- _Date_ : dateObject

**引用及使用**
```javascript
var util = require('vue/utils/date')
util.formateStringToDate...
```
**函数体**
```javascript
function formateStringToDate(dateString) {
    var ds = dateString.slice(0, 4) + '-' + dateString.slice(4, 6) + '-' + dateString.slice(6, 8);
    return new Date(ds);
}
```



## getNearTime 返回【当天、近一周、近一月、近三月、近一年】的开始、结束时间
返回【当天、近一周、近一月、近三月、近一年】的开始、结束时间

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| time | `Date` | 需要转换的 Date |
| includeTody | `Boolean` | 是否把当天时间当做近一周...的结束时间 |


**返回值**
- _Object_ : options - 配置选项

**引用及使用**
```javascript
var util = require('vue/utils/date')
util.getNearTime...
```
**函数体**
```javascript
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
```



## getDiffDays 计算两个日期的间隔天数
计算两个日期的间隔天数

**参数**

| 参数 | 参数类型 |
|------|------|
| date1Str | `String`|
| date2Str | `String`|


**引用及使用**
```javascript
var util = require('vue/utils/date')
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



## getDiffDate 返回对应的时间戳和转换的文字日期
返回对应的时间戳和转换的文字日期

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| time | `Date` | 传入的时间戳或日期数据 |
| diff | `Number` | 与传入时间戳的差值(天数) |


**返回值**
- _Object_ : 返回一个对象：

**引用及使用**
```javascript
var util = require('vue/utils/date')
util.getDiffDate...
```
**函数体**
```javascript
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
```



## addTimeZero 日期格式补齐两位
日期格式补齐两位

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| timeText | `YYYYMMDD` | 日期格式 eg: 2015-5-31 |
| operate | `String` | 年月日间隔符默认“-” |


**返回值**
- _YYYYMMDD_ : 返回补齐后的日期：2015-05-31

**引用及使用**
```javascript
var util = require('vue/utils/date')
util.addTimeZero...
```
**函数体**
```javascript
function addTimeZero(timeText, operate) {
    if (!operate) operate = "-";
    var arr = timeText.split(operate);
    arr.forEach(function (item, index) {
        if (Number(item) < 10) arr[index] = "0" + item;
    });
    return arr.join(operate);
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
var util = require('vue/utils/date')
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



## getMonthBeginEndDate 获取传入日期对应月份的起始、结束日期
获取传入日期对应月份的起始、结束日期

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| dateObject | `Date` | 需要转换的 Date |


**返回值**
- _object_ : 返回一个对象

**引用及使用**
```javascript
var util = require('vue/utils/date')
util.getMonthBeginEndDate...
```
**函数体**
```javascript
function getMonthBeginEndDate(date) {
    var monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return {
        beginDate: getDiffDate(monthEnd, monthEnd.getDate() - 1),
        endDate: getDiffDate(monthEnd, 0)
    }
}
```
