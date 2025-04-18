# 空状态
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
<iframe class="iframeBox" src="https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/Empty/demo/demo.html" width="375px" height="700px"></iframe>

## 基础用法

```js
// 引入文件
var empty = require('/vue/components/jiaoyi-empty/js/empty.js');

components: {
    empty:empty
}
```

## html中使用
```html
<empty img-src="../img/empty.png" width="210px"></empty>

```
## API

| 参数    | 说明   | 类型    | 可选值  | 默认值  |
| ------- | ------- | ------- | ------- | ------- |
| width    | 宽度   | String  |--| 4.2rem |
| height    | 高度   | String  |--| 2.8rem |
| emptyText    | 底部提示文字   | String  |--| 暂无数据 |
| imgSrc    | 图片链接   | String  |--| 6.0信小福暂无数据图片 |

## Events
无
<style scoped>
    .iframeBox{
      height:300px;
    }
</style>