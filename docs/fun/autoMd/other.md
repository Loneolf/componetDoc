# 其它函数

<ClientOnly>
  <DrawerTestDoc url='https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/coverage/lcov-report/other.js.html'/>
</ClientOnly>

<script setup>
  import DrawerTestDoc from '../../vueCom/drawerTestDoc.vue';
</script>


## toQueryString 将 JavaScript 对象转换为 URL 查询参数字符串。
将 JavaScript 对象转换为 URL 查询参数字符串。

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| obj | `Object` | 要转换为查询参数字符串的 JavaScript 对象。 |


**返回值**
- _string_ : - 转换后的 URL 查询参数字符串，参数之间使用 &#x27;&amp;&#x27; 分隔。

**引用及使用**
```javascript
var util = require('vue/utils/other')
util.toQueryString...
```
**函数体**
```javascript
function toQueryString(obj) {
    var ret = [];
    for (var key in obj) {
        key = encodeURIComponent(key);
        var values = obj[key];
        if (values && values.constructor == Array) {
            //数组
            var queryValues = [];
            for (var i = 0, len = values.length, value; i < len; i++) {
                value = values[i];
                queryValues.push(toQueryPair(key, value));
            }
            ret = ret.concat(queryValues);
        } else {
            //字符串
            ret.push(toQueryPair(key, values));
        }
    }
    return ret.join('&');
}
```



## toQueryParams 将 URL 查询参数转换为 JavaScript 对象。该函数会从当前页面的 URL 中提取查询参数部分，并将其解析为键值对对象。如果参数名重复，则对应的值会被存储为数组。
将 URL 查询参数转换为 JavaScript 对象。该函数会从当前页面的 URL 中提取查询参数部分，并将其解析为键值对对象。如果参数名重复，则对应的值会被存储为数组。


**返回值**
- _Object_ : 包含 URL 查询参数的键值对对象。

**引用及使用**
```javascript
var util = require('vue/utils/other')
util.toQueryParams...
```
**函数体**
```javascript
function toQueryParams() {
    var search = location.search.replace(/^\s+/, '').replace(/\s+$/, '').match(/([^?#]*)(#.*)?$/); //提取location.search中'?'后面的部分
    if (!search) {
        return {};
    }
    var searchStr = search[1];
    var searchHash = searchStr.split('&');

    var ret = {};
    for (var i = 0, len = searchHash.length; i < len; i++) {
        //这里可以调用each方法
        var pair = searchHash[i];
        if ((pair = pair.split('='))[0]) {
            var key = decodeURIComponent(pair.shift());
            var value = pair.length > 1 ? pair.join('=') : pair[0];

            if (value != undefined) {
                value = decodeURIComponent(value);
            }
            if (key in ret) {
                if (ret[key].constructor != Array) {
                    ret[key] = [ret[key]];
                }
                ret[key].push(value);
            } else {
                ret[key] = value;
            }
        }
    }
    return ret;
}
```



## toQueryPair 将键值对转换为 URL 查询参数的字符串形式。
将键值对转换为 URL 查询参数的字符串形式。

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| key | `string` | URL 查询参数的键，已经经过 URI 编码处理。 |
| value | `*` | URL 查询参数的值，可以是任意类型。 |


**返回值**
- _string_ : - 转换后的 URL 查询参数的字符串形式，格式为 &quot;key&#x3D;value&quot; 或仅 &quot;key&quot;。

**引用及使用**
```javascript
var util = require('vue/utils/other')
util.toQueryPair...
```
**函数体**
```javascript
function toQueryPair(key, value) {
    if (typeof value == 'undefined') {
        return key;
    }
    return key + '=' + encodeURIComponent(value === null ? '' : String(value));
}
```



## zhangHongDieLv 根据传入的数值判断涨跌状态，返回对应的 CSS 类名。若数值为正数，表示上涨，返回 &#x27;f-red&#x27;；若为负数，表示下跌，返回 &#x27;f-green&#x27;；若数值为 0 或非有效数字，则返回空字符串。
根据传入的数值判断涨跌状态，返回对应的 CSS 类名。若数值为正数，表示上涨，返回 &#x27;f-red&#x27;；若为负数，表示下跌，返回 &#x27;f-green&#x27;；若数值为 0 或非有效数字，则返回空字符串。

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| orig | `string,number` | 传入的原始数值，可以是字符串或数字类型。 |


**返回值**
- _string_ : - 根据数值涨跌状态返回对应的 CSS 类名，无效数值或 0 时返回空字符串。

**引用及使用**
```javascript
var util = require('vue/utils/other')
util.zhangHongDieLv...
```
**函数体**
```javascript
function zhangHongDieLv(orig) {
    var n = parseFloat(orig);
    if (isNaN(n) || n == 0) {
        return '';
    }
    return n > 0 ? 'f-red' : 'f-green';
}
```



## getNearTime 传入一个时间，返回该时间当天、近一周、近一月、近三月、近一年的时间范围
传入一个时间，返回该时间当天、近一周、近一月、近三月、近一年的时间范围

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| time | `Date,number,string` | 传入的时间，可以是日期对象、时间戳或能被 Date 构造函数解析的字符串，默认为当前时间 |
| includeTody | `boolean` | 是否把当天时间当做近一周、近一月等时间范围的结束时间，默认为 false |


**返回值**
- _Object_ : - 包含当天、近一周、近一月、近三月、近一年时间范围的对象

**引用及使用**
```javascript
var util = require('vue/utils/other')
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



## getDiffDate 为时间字符串中的每个部分添加前导零，确保其格式统一。例如，将 &quot;2023-5-9&quot; 转换为 &quot;2023-05-09&quot;。
为时间字符串中的每个部分添加前导零，确保其格式统一。例如，将 &quot;2023-5-9&quot; 转换为 &quot;2023-05-09&quot;。

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| timeText | `string` | 输入的时间字符串，格式可能为 &quot;YYYY-M-D&quot; 或 &quot;YYYY/M/D&quot; 等。 |
| operate | `string` | 时间字符串中各部分的分隔符，默认为 &quot;-&quot;。 |


**返回值**
- _string_ : - 处理后的时间字符串，每个部分都包含前导零。

**引用及使用**
```javascript
var util = require('vue/utils/other')
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



## addTimeZero 为时间字符串中的每个部分添加前导零，确保其格式统一。例如，将 &quot;2023-5-9&quot; 转换为 &quot;2023-05-09&quot;。
为时间字符串中的每个部分添加前导零，确保其格式统一。例如，将 &quot;2023-5-9&quot; 转换为 &quot;2023-05-09&quot;。

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| timeText | `string` | 输入的时间字符串，格式可能为 &quot;YYYY-M-D&quot; 或 &quot;YYYY/M/D&quot; 等。 |
| operate | `string` | 时间字符串中各部分的分隔符，默认为 &quot;-&quot;。 |


**返回值**
- _string_ : - 处理后的时间字符串，每个部分都包含前导零。

**引用及使用**
```javascript
var util = require('vue/utils/other')
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



## getMonthBeginEndDate 获取指定日期所在月份的起始和结束日期信息
获取指定日期所在月份的起始和结束日期信息

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| date | `Date` | 传入的日期对象，用于确定要获取哪个月份的起始和结束日期 |


**返回值**
- _Object_ : - 包含起始日期和结束日期信息的对象，每个日期信息包含时间戳、格式化后的日期文本和日期对象

**引用及使用**
```javascript
var util = require('vue/utils/other')
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
