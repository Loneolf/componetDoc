# 通用优化处理

<ClientOnly>
  <DrawerTestDoc url='https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/coverage/lcov-report/optimization.js.html'/>
</ClientOnly>

<script setup>
  import DrawerTestDoc from '../../vueCom/drawerTestDoc.vue';
</script>


## throttle 节流
节流

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| fn | `function` | 节流要执行的函数 |
| interval | `number` | 时间间隔(默认 500毫秒) |


**返回值**
- _function_ : 

**引用及使用**
```javascript
var util = require('vue/utils/optimization')
util.throttle...
```
**函数体**
```javascript
function throttle(fn, interval) {
    var last;
    var timer;
    var interval = interval || 500;
    return function () {
        var th = this;
        var args = arguments;
        var now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                fn.apply(th, args);
            }, interval);
        } else {
            last = now;
            fn.apply(th, args);
        }
    };
}
```



## debounce 防抖
防抖

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| fn | `function` | 节流要执行的函数 |
| interval | `number` | 时间间隔(默认 500毫秒) |


**返回值**
- _function_ : 

**引用及使用**
```javascript
var util = require('vue/utils/optimization')
util.debounce...
```
**函数体**
```javascript
function debounce(fn, delay) {
    var delay = delay || 500;
    var timer;
    return function () {
        var th = this;
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            timer = null;
            fn.apply(th, args);
        }, delay);
    };
}
```
