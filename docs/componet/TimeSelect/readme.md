# 时间选择控件

## 依赖文件
使用sea.js将文件模块化，并需要是用css和text插件引入css及template
```js
<script type="text/javascript" src="/c_modules/sea.js"></script>
<script type="text/javascript" src="/z_modules/common/js/seajs-css.min.js"></script>
<script type="text/javascript" src="/z_modules/xet-vue-components/sea/seajs-text.js"></script>
<script type="text/javascript" src="/z_modules/vue/vue@2.6.12.min.js"></script>
<script type="text/javascript" src="/z_modules/vant/vant@2.12.min.js"></script>
```

## 效果展示
<iframe class="iframeBox" src="https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/TimeSelect/demo/demo.html"></iframe>


## 基础用法
```js
// 引入文件
var TimeSelect = require('vue/TimeSelect/index');
var util = require('vue/common/util')

// 请求时间，初始化时间，获取最近的当日、一周、一月、三月时间
funs.action5(function(res) {
    TimeSelect.init('time-select');
    var timestamp = new Date(res)
    pageData.nearTime = util.getNearTime(timestamp, false)
})

data: {
    isShow: false,
    // 查询的开始时间和结束时间
    beginDate: nearTime.weekly.beginDate,
    endDate: nearTime.weekly.endDate,
    minDate: new Date(2010, 0, 1),
    maxDate: new Date(),
},
methods: {
    onConfirm: function() {
        this.isShow = false;
        alert('开始时间:' + this.beginDate +'、'+ '结束时间:' + this.endDate);
    },
    onDateChange: function(beginDate, endDate) {
        this.beginDate = beginDate;
        this.endDate = endDate;
    },
    formatter: function(type, val) {
        if (type === 'year') {
            return val + '\u5E74';
        } else if (type === 'month') {
            return val + '\u6708';
        } else if (type === 'day') {
            return val + '\u65E5';
        }
        return val;
    },
    openTimeSelect: function() {
        this.isShow = true;
    }
}


```
## html中使用
```html
<time-select
    :min-date="minDate" 
    :max-date="maxDate" 
    :begin-date="beginDate" 
    :end-date="endDate"
    :is-show="isShow"
    :max-diff="31"
    :formatter="formatter" 
    @confirm="onConfirm"
    @datechange="onDateChange"
></time-select>
```
## API

| 参数    | 说明   | 类型    | 可选值                                             | 默认值  |
| ------- | ------ | ------- | -------------------------------------------------- | ------- |
| min-date    | 可选的最小时间，精确到分钟   | Date  || new Date(2010, 0, 1) |
| max-date    | 可选的最大时间，精确到分钟   | Date  || 当天 |
| begin-date | 开始时间 | String || 最近一周的开始   |
| end-date | 结束时间 | String || 最近一周的结束   |
| is-show | 是否显示时间选择器 | Boolean |false、true| false |
| max-diff | 最大时间差，单位为天 | Number || 31 |
| formatter | 格式化时间 | function | | |



## Events

| 参数    | 说明   | 参数 | 参数示例 |
| ------- | ------ | ------- | ------- |
| confirm | 确认函数 |  | |
| datechange | 时间控件中的时间发生变化，给begin-data和end-data重新赋值 | beginDate, endDate |
