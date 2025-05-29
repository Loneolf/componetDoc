# 通用用户环境处理

<ClientOnly>
  <DrawerTestDoc url='https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/coverage/lcov-report/userEnv.js.html'/>
</ClientOnly>

<script setup>
  import DrawerTestDoc from '../../vueCom/drawerTestDoc.vue';
</script>


## isIOS 日期转字符串
日期转字符串



**引用及使用**
```javascript
var util = require('vue/utils/userEnv')
util.isIOS...
```
**函数体**
```javascript
function isIOS() {
    var u = navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}
```



## getIosVersion 获取客户端iOS版本
获取客户端iOS版本



**引用及使用**
```javascript
var util = require('vue/utils/userEnv')
util.getIosVersion...
```
**函数体**
```javascript
function getIosVersion() {
    if (isIOS()) {
        var str = navigator.userAgent.toLowerCase();
        var ver = str.match(/cpu iphone os (.*?) like mac os/);
        return Number(ver[1].replace(/_/g, '.').split('.')[0]);
    } else {
        return -1;
    }
}
```
