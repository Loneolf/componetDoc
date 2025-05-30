# 按钮组
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
<iframe class="iframeBox" src="https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/ActionButton/demo/demo.html" width="375px" height="700px"></iframe>

## 基础用法

```js
// 引入文件
var actionButton = require('/vue/components/jiaoyi-action-button/index');

data: function () {
    return {
        btnConfig: [
            {
                text: '按钮1',
                // width:宽度，默认自适应
                width:'3rem',
                textColor:'#fff',
                color:'#e83333'
            }, 
            {
                text: '按钮2',//按钮文字
                width:'3rem',
                textColor:'#e83333',//文本颜色
                color: '#e83333',//背景色
                plain:true,//是否镂空，去除背景色
            }, 
    ]	
    }
},

methods: {
    handleClick: function () {
        alert('handleClick')	
    }
},
components: {
    'action-button': actionButton	
}
```


## 多个底部按钮
<iframe class="iframeBox" src="https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/ActionButton/demo2/demo.html" width="375px" height="700px"></iframe>

## html中使用
```html
<action-button :btn-config="btnConfig" @click="handleClick"></action-button>
```
## API

| 参数    | 说明   | 类型    | 可选值  | 默认值  |
| ------- | ------- | ------- | ------- | ------- |
| btnConfig   | 按钮配置   | Object  |--| -- |
   
## btnConfig 
| 参数    | 说明   | 类型    | 可选值  | 默认值  |
| ------- | ------- | ------- | ------- | ------- |
 |  text  |按钮文字   | String    | --| --|
 |  width  |宽度，默认自适应   | String    | --|-- |
 |  textColor  |文本颜色   | String    |-- | #E83333 |
 |  color  |背景色   | String    |-- |linear-gradient(90deg, #FF3542 30%, #FF8989 100%) |
 |  plain  |是否镂空，去除背景色   | Boolean    | true| false |
                
## Events

| 参数    | 说明   | 参数 | 参数示例 |
| ------- | ------- | ------- | ------- |
| click | 点击按钮时触发 | -- |-- |

<style scoped>
    .iframeBox{
        height:200px;
    }
</style>