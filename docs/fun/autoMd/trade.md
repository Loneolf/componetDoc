# 通用交易处理

<ClientOnly>
  <DrawerTestDoc url='https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/coverage/lcov-report/trade.js.html'/>
</ClientOnly>

<script setup>
  import DrawerTestDoc from '../../vueCom/drawerTestDoc.vue';
</script>


## checkIsA5 判断是否是顶点
判断是否是顶点

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| data | `object` | 接口数据 |



**引用及使用**
```javascript
var util = require('vue/utils/trade')
util.checkIsA5...
```
**函数体**
```javascript
function checkIsA5(data) {
    if (data && data.APEX_A5_SPECFLAG && data.APEX_A5_SPECFLAG == '1') {
        return true;
    }
    else {
        return false;
    }
}
```



## isTradeDate 前端判断是否为交易日期
前端判断是否为交易日期

**参数**

| 参数 | 参数类型 |
|------|------|
| dateObject | `Date`|
| nonTradingDate | `Array`|

**返回值**
- _Boolean_ : 

**引用及使用**
```javascript
var util = require('vue/utils/trade')
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



## getLastTradingDay 

**参数**

| 参数 | 参数类型 |
|------|------|
| nonTradingDays | `Array`|
| serverTime | `Array`|

**返回值**
- _Array_ : 

**引用及使用**
```javascript
var util = require('vue/utils/trade')
util.getLastTradingDay...
```
**函数体**
```javascript
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
```
