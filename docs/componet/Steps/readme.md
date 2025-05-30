# 步骤条组件
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
<iframe class="iframeBox" src="https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/Steps/demo/demo.html" width="375px" height="700px"></iframe>

## 基础用法

```js
// 引入文件
var steper = require('/vue/components/jiaoyi-steps/js/index.js');

components: {
    steper:steper
}
```

## html中使用
```html
    <steper :navigator="['权重设置','参数设置','算法设置']" current="2"></steper>
```
## API

| 参数    | 说明   | 类型    | 可选值  | 默认值  |
| ------- | ------- | ------- | ------- | ------- |
| navigator    | 导航数组   | Array  |--| [] |
| width    | 宽度   | String  |--| 6.3rem|
| current| 当前步骤 | string |--| 1 |
| showIndex| 是否显示步骤索引 | Boolean |true/false| true |


## Events

| 参数    | 说明   | 参数 | 参数示例 |
| ------- | ------- | ------- | ------- |
| click | 点击步骤条事件 | `{current: 当前步骤}` | `{current: 1}` |

<style scoped>
    .iframeBox{
        height:200px;
    }
</style>