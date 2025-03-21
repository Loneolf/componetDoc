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
<iframe class="iframeBox" src="https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/TimeSelect/demo/demo.html" width="375px" height="700px"></iframe>


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
    pageData.time = util.getDiffDate(timestamp, 1).time
})

data: {
    activeTab: 'weekly',
    // 时间赋初值
    beginDate:  pageData.nearTime.weekly.beginDate,
    endDate:  pageData.nearTime.weekly.endDate,
    minDate: new Date(2010, 0, 1),
    maxDate: pageData.time,
},



```
## html中使用
```html
<time-select
    :min-date="minDate" 
    :max-date="maxDate" 
    :begin-date="beginDate" 
    :end-date="endDate"
    @confirm="onConfirm" 
    @datechange="onDateChange"
    @tabchange="onTabChange"
></time-select>
```
## API

| 参数    | 说明   | 类型    | 可选值                                             | 默认值  |
| ------- | ------ | ------- | -------------------------------------------------- | ------- |
| min-date    | 可选的最小时间，精确到分钟   | Date  || new Date(2010, 0, 1) |
| max-date    | 可选的最大时间，精确到分钟   | Date  || 当天 |
| begin-date | 开始时间 | string || 最近一周的开始   |
| end-date | 结束时间 | string || 最近一周的结束   |



## Events

| 参数    | 说明   | 参数 | 参数示例 |
| ------- | ------ | ------- | ------- |
| confirm | 确认函数 |  | |
| datechange | 时间控件中的时间发生变化，给begin-data和end-data重新赋值 | beginDate, endDate |

<style scoped>
    .iframeBox{
        /* position:absolute;
        top: 100px;
        right: 30px; */
        border-radius: 5px;
        border:none;
        background: #fff;
        box-shadow: 0 0 10px #ccc;
    }
</style>


