# 日期选择器
> 日期选择器就是时间选择控件加了个可以选择当日(可选）、近一周、近一月、近三月的tab
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
<iframe class="iframeBox" src="https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/TimeBar/demo/demo.html"></iframe>


## 基础用法
```js
// 引入文件
var TimeBar = require('vue/TimeBar/index');
var util = require('vue/common/util')

// 请求时间，初始化时间，获取最近的当日、一周、一月、三月时间
funs.action5(function(res) {
    TimeBar.init('time-bar');
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
methods: {
    onConfirm: function() {
        console.log('onConfirm')
    },
    onDateChange: function(beginDate, endDate) {
        this.beginDate = beginDate;
        this.endDate = endDate;
    },
    onTabChange: function (tab) { 
        this.activeTab = tab
        if (this.activeTab!== 'today') {
            this.beginDate = nearTime[this.activeTab].beginDate;
            this.endDate = nearTime[this.activeTab].endDate;
        }
    },
}


```
## html中使用
```html
<time-bar
    :min-date="minDate" 
    :max-date="maxDate" 
    :begin-date="beginDate" 
    :end-date="endDate"
    :active-tab="activeTab"
    :isshowtime="true"
    @confirm="onConfirm" 
    @datechange="onDateChange"
    @tabchange="onTabChange"
></time-bar>
```
## API

| 参数    | 说明   | 类型    | 可选值                                             | 默认值  |
| ------- | ------ | ------- | -------------------------------------------------- | ------- |
| min-date    | 可选的最小时间，精确到分钟   | Date  || new Date(2010, 0, 1) |
| max-date    | 可选的最大时间，精确到分钟   | Date  || 当天 |
| begin-date | 开始时间 | String || 最近一周的开始   |
| end-date | 结束时间 | String || 最近一周的结束   |
| active-tab | 当前激活的tab | String | today、weekly、month、userDefined | weekly   |
| isshowtime | 选中近一周近一月是否展示时间区间内容 | Boolean | true、false | false   |


## Events

| 参数    | 说明   | 参数 | 参数示例 |
| ------- | ------ | ------- | ------- |
| confirm | 确认函数 |  | |
| datechange | 时间控件中的时间发生变化，给begin-data和end-data重新赋值 | beginDate, endDate |
| tabchange | 点击tab事件 | tab | today、weekly、month、userDefined |
