# 交易日历
Author:[zhangjin](mailto:ex_zhangjin@citics.com)
## 前置依赖
使用sea.js将文件模块化，并需要使用css和text插件引入css及html文件
所有的组件都是基于Vue和vant开发，所以需要引入Vue和vant，以及jQuery进行请求数据
```js
<script type="text/javascript" src="/z_modules/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="/z_modules/vue/vue@2.6.12.min.js"></script>
// 基于vant组件库
<script type="text/javascript" src="/z_modules/vant/vant@2.12.min.js"></script>
<script type="text/javascript" src="/c_modules/sea.js"></script>
// 通过seajs-css插件加载css文件
<script type="text/javascript" src="/z_modules/common/js/seajs-css.min.js"></script>
// 通过seajs-`text插件加载html文件
<script type="text/javascript" src="/z_modules/xet-vue-components/sea/seajs-text.js"></script>
```

## 效果展示
<iframe class="iframeBox" src="https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/TradeCalendar/demo/demo.html" width="375px" height="700px"></iframe>

## 基础用法

```js
// 引入文件
var comsearch = require('/vue/components/search/index');
comsearch.init('com-search');
// methods中需要有承载search的方法
methods: {
	onsearch: function (params) {
		console.log('aaasearchgetData', params)
	}
},
```

## html中使用
```html
<com-search 
	isrepetpop
	placeholder="请输入证券名称/代码/首字母搜索合约" 
	type="credit"
	@search="onsearch" 
></com-search>
```
## API

| 参数    | 说明   | 类型    | 可选值  | 默认值  |
| ------- | ------- | ------- | ------- | ------- |
| showLastMonth    | 首日非周一是否展示上个月的日期   | Boolean  |true/false| false |
| date    | 默认展示的日历月份  | Object  |--| 当月月份，示例：`{year:2025,month:4}`|
| minDate|月份可选最小范围 | Date |--|-- |
| maxDate| 月份可选最大范围 | Date |--| -- |
| profitData| 日历中要填入的数据 | Array | 示例：`{date:3,income:1000,selected:false}`| [] |
| showDate| 是否展示顶部选择月份选项 | Boolean  |true/false| true |
## Events

| 参数    | 说明   | 参数 | 参数示例 |
| ------- | ------- | ------- | ------- |
| confirm | 选择月份后触发的方法 | `{currentYear: string/选择的年, currentMonth: string/选择的月份}` | `{currentYear: "2025", currentMonth: "04"}` |
| itemclick | 点击日历中子项触发 | `{item: Object/点击子项的数据, date: string/当前选择的日期}` | `{item: "{date:3,income:1000,selected:false}", date: "20250409"}` |
