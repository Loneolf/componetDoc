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
<iframe class="iframeBox" src="https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/BtnGroup/demo/demo.html" width="375px" height="700px"></iframe>

## 基础用法

```js
// 引入文件
var comsearch = require('/vue/components/jiaoyi-btngroup/js/index.js');

// methods中需要有承载search的方法
methods: {
	btnClick: function (item) {
        for (var i = 0; i < this.btnConfig.length; i++) {
            this.btnConfig[i].active = false;
        }
        item.active = true;

        alert('btnClick')
    }
},
components: {
    btnGroup:btnGroup
}
```

## html中使用
```html
<btn-group :btn-config="btnConfig" height="28"  @btnclick="btnClick" style="margin-bottom:10px;"></btn-group>
    
 <btn-group :btn-config="btnConfig2" 
    height="28" 
    @btnclick="btnClick2" 
    text-color='black'
    active-text-color='#fff'
    background-color='#ebebeb'
    active-background-color='blueviolet'
    border-color='#ebebeb'
    active-border-color= 'blueviolet'>
</btn-group>
```
## API

| 参数    | 说明   | 类型    | 可选值  | 默认值  |
| ------- | ------- | ------- | ------- | ------- |
| activeTextColor    | 选中文字颜色   | String  |--| #E83333 |
| textColor    | 文字颜色   | String  |--| #586673 |
| backgroundColor    | 背景颜色   | String  |--| #fff |
| activeBackgroundColor    | 选中背景颜色   | String  |--| #FDECEC |
| borderColor    | 边框颜色   | String  |--| rgba(205,209,213,1) |
| activeBorderColor    | 选中边框颜色   | String  |--| rgba(250,214,214,1) |
| btnConfig    | 按钮配置   | Object  |--| -- |

##btnConfig
| 参数    | 说明   | 类型    | 可选值  | 默认值  |
| ------- | ------- | ------- | ------- | ------- |
| text    | 按钮文字   | String  |--| -- |
| active    | 是否选中   | Boolean  |true/false| -- |



## Events

| 参数    | 说明   | 参数 | 参数示例 |
| ------- | ------- | ------- | ------- |
| btnClick | 点击按钮时触发 | `{item: Object/当前选中子项配置对象}` | `{text: '非量化盈亏'active: false,}` |

<style scoped>
    .iframeBox{
        height:200px;
    }
</style>