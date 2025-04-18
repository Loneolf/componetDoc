# 输入组件
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
<iframe class="iframeBox" src="https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/InputField/html/demo/demo.html" width="375px" height="700px"></iframe>

## 基础用法

```js
// 引入文件
var inputField = require('/vue/components/jiaoyi-input-field/js/index.js');

components: {
    inputField:inputField
}
```

## html中使用
```html
<input-field style="padding-top:50px;"  step="1000" tofixed="0" :needtips="true" :thousandth="false" maxlen="4" :modelprice="price" start="0" end="10000">
    <template v-slot:left-tip>
        <div>跌停1.109</div>
    </template>
    <template #right-tip>
        <div>跌停1.109</div>
    </template>
</input-field>
```
## API

| 参数    | 说明   | 类型    | 可选值  | 默认值  |
| ------- | ------- | ------- | ------- | ------- |
| step    | 步长   | String  |--| 0.001 |
| placeholder    | 输入框默认显示文字   | String  |--| 委托价格 |
| tofixed| 保留小数位数 | string |--| 3 |
| needtips| 是否展示顶部tip | Boolean |true/false| true |
| unit| 右侧展示单位 | string |--| -- |
| thousandth| 是否需要千分位 |Boolean |true/false| false |
| start| 最小值 | string |--| 0 |
| end| 最大值 | string |--| -- |
| maxlen| 最大长度 | string |--| 13 |



## Events

| 参数    | 说明   | 参数 | 参数示例 |
| ------- | ------- | ------- | ------- |
| input | 输入事件，返回值为输入的值 |  |
| minus | 输入事件，返回值为输入的值 |  |
| plus | 输入事件，返回值为输入的值 |  |


## Slots

| 参数    | 说明   | 
| ------- | ------- | 
| right-tip | 底部右侧插槽 |
| left-tip | 底部左侧插槽 | 

<style scoped>
    .iframeBox{
        height:300px;
    }
</style>