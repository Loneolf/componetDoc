# 时间处理相关方法

## 引入
```
var timeUtil = require('/vue/components/timeUtil');
```


## 格式化日期，添加年月日文字
```js
/**
 * 将日期格式化为指定的字符串格式
 * @param {string|number} value - 要格式化的日期，可以是字符串或数字
 * @param {string} [operate] - 格式化的操作符，默认为 '年-月-日'
 * @returns {string} - 格式化后的日期字符串
 */
exports.dataFormat = function (value, operate) {
    var str = value + "";
    var rule = operate ? ('$1' + operate + '$2' + operate+ '$3') : "$1年$2月$3日"
    return str.replace(/(\d{4})(\d{2})(\d{2})/g, rule);
}

// 示例1：使用默认的操作符
var result1 = exports.dataFormat("20230101");
console.log(result1); // 输出: "2023年01月01日"

// 示例2：使用自定义的操作符
var result2 = exports.dataFormat("20230101", "/");
console.log(result2); // 输出: "2023/01/01"

// 示例3：传入非日期格式的值
var result3 = exports.dataFormat("not a date");
console.log(result3); // 输出: "not a date"

```

## 时分秒时间格式化
```js
/**
 * 将时间格式化为指定的字符串格式
 * @param {string} time - 要格式化的时间字符串
 * @returns {string} - 格式化后的时间字符串
 */
exports.timeFormat = timeFormat
function timeFormat (time) {
    if (!time || time === '0') return '--'
    if (time.length < 6) {
        time = '0' + time
        return timeFormat(time)
    }
    return time.replace(/(\d{2})(\d{2})(\d{2})/, "$1:$2:$3")
}

// 示例1：传入一个合法的时间字符串
var result1 = timeFormat("123456");
console.log(result1); // 输出: "12:34:56"

// 示例2：传入一个长度小于6的时间字符串
var result2 = timeFormat("123");
console.log(result2); // 输出: "01:23:00"

// 示例3：传入一个空字符串
var result3 = timeFormat("");
console.log(result3); // 输出: "--"

// 示例4：传入一个0
var result4 = timeFormat("0");
console.log(result4); // 输出: "--"
```
## 获取最近时间：当天、近一周、近一月、近三月

```js
/**
 * 获取指定时间的近期时间范围
 * @param {Date|string} time - 要计算的时间，可以是 Date 对象或字符串
 * @param {boolean} [includeTody] - 是否包含当天，默认为 true
 * @returns {Object} - 包含近期时间范围的对象
 */
exports.getNearTime = getNearTime
function getNearTime(time, includeTody) {
    if (!time) time = new Date()
    var colTime = time
    if (!includeTody) {
        colTime = getDiffDate(time, 1).time
    }
    var endDate = getDiffDate(colTime, 0).timeText
    var monthBegin = new Date(colTime.getFullYear(), colTime.getMonth() - 1, colTime.getDate() + 1) 
    var threeMonthBegin = new Date(colTime.getFullYear(), colTime.getMonth() - 3, colTime.getDate() + 1) 
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
    }
}

// 示例1：传入一个时间，包含当天
var result1 = getNearTime(new Date(2023-11-11));
console.log(result1);
/* 输出:
{
  today: "2023-11-11",
  weekly: {
    beginDate: "2023-11-04",
    endDate: "2023-11-11"
  },
  userDefined: {
    beginDate: "2023-10-12",
    endDate: "2023-11-11"
  },
  month: {
    beginDate: "2023-10-12",
    endDate: "2023-11-11"
  },
  threeMonth: {
    beginDate: "2023-08-12",
    endDate: "2023-11-11"
  }
}
*/

// 示例2：传入昨天的时间，不包含当天
var result2 = getNearTime(new Date('2023-11-10'), false);
console.log(result2);
/* 输出:
{
  today: "2023-11-10",
  weekly: {
    beginDate: "2023-11-03",
    endDate: "2023-11-10"
  },
  userDefined: {
    beginDate: "2023-10-11",
    endDate: "2023-11-10"
  },
  month: {
    beginDate: "2023-10-11",
    endDate: "2023-11-10"
  },
  threeMonth: {
    beginDate: "2023-08-11",
    endDate: "2023-11-10"
  }
}
*/

```

## 计算传入时间与当前时间的差值

```js
/**
 * 计算传入时间与当前时间的差值
 * @param {Date|string} time - 要计算的时间，可以是 Date 对象或字符串
 * @param {number} [diff] - 与当前时间的差值，单位为天，默认为 0
 * @returns {Object} - 包含时间戳、格式化日期字符串和日期对象的对象
 */
exports.getDiffDate = getDiffDate 
function getDiffDate (time, diff) {
    if (!diff) diff = 0;
    var diffTime = new Date(new Date(time).getTime() - 24 * 60 * 60 * 1000 * diff);
    return {
        timestamp: diffTime.getTime(),
        timeText: addTimeZero(diffTime.toLocaleDateString().replace(/\//g, "-")),
        time: diffTime,
    };
}

// 示例：计算差值1天的时间
var result = getDiffDate(new Date('2023-06-11'), 1);
console.log(result);
/* 输出:
{
    "timestamp": 1686355200000,
    "timeText": "2023-06-10",
    "time": "2023-06-10T00:00:00.000Z"
}
*/

// 示例：计算差值30天的时间
var result2 = getDiffDate(new Date('2023-06-13'), 30);
console.log(result2);
/* 输出:
{
    "timestamp": 1684022400000,
    "timeText": "2023-05-14",
    "time": "2023-05-14T00:00:00.000Z"
}
*/
```

## 时间补零
```js
/**
 * 在日期字符串中添加前导零
 * @param {string} timeText - 要处理的日期字符串
 * @param {string} [operate] - 分隔符，默认为 "-"
 * @returns {string} - 添加了前导零的日期字符串
 */
function addTimeZero (timeText, operate) {
    if (!operate) operate = "-";
    var arr = timeText.split(operate);
    arr.forEach(function (item, index) {
        if (Number(item) < 10) arr[index] = "0" + item;
    });
    return arr.join(operate);
}
// 示例1：传入一个日期字符串，分隔符为 "-"
var result1 = addTimeZero("2023-6-11");
console.log(result1); // 输出: "2023-06-11"

// 示例2：传入一个日期字符串，分隔符为 "/"
var result2 = addTimeZero("2023/6/11", "/");
console.log(result2); // 输出: "2023/06/11"

// 示例3：传入一个日期字符串，其中已经包含前导零
var result3 = addTimeZero("2023-06-11");
console.log(result3); // 输出: "2023-06-11"
```

## 时间戳转日期
```js
/**
 * 获取传入时间当天零时的时间戳，new Date('2023-11-11'),这种时间格式在webView中无法正常解析，需要额外处理下
 * @param {string} day - 要转换的日期字符串，格式为 "YYYY-MM-DD"
 * @returns {number} - 转换后的时间戳
 */
exports.getDayTime = getDayTime
function getDayTime(day) {
    return new Date(day.replace('/-/g', '/')).getTime()
}
// 示例1：传入一个日期字符串
var result1 = getDayTime("2023-06-11");
console.log(result1); // 输出: 1686428800000

// 示例2：传入/的日期字符串
var result2 = getDayTime("2023/06/11");
console.log(result2); // 输出: 1686428800000
```


