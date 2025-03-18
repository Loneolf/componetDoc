# 搜索组件

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
<iframe class="iframeBox" src="https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/search/demo/demo.html" width="375px" height="700px"></iframe>

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
| isrepetpop    | 是否开启重复代码弹框   | Boolear  |true/false| false |
| placeholder    | 输入框默认显示文字   | String  || '名称/代码/首字母' |
| type| 类型，普通账户还是信用账户，请求action32接口数据是需要携带改参数 | string |normal/cridet| normal |


## Events

| 参数    | 说明   | 参数 | 参数示例 |
| ------- | ------- | ------- | ------- |
| onsearch | 触发搜索的事件，输入框无内容关闭弹框或者点击搜索项都会触发 | `{code: string/股票代码, mktype: string/市场类型}` | `{code: "600070", mktype: "SHACCOUNT"}` |

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