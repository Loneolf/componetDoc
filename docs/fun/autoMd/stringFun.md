# 通用字符串处理

<ClientOnly>
  <DrawerTestDoc url='https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/coverage/lcov-report/stringFun.js.html'/>
</ClientOnly>

<script setup>
  import DrawerTestDoc from '../../vueCom/drawerTestDoc.vue';
</script>


## abbreviation 字符串超长缩写
字符串超长缩写

**参数**

| 参数 | 参数类型 |
|------|------|
| string | `String`|

**返回值**
- _string_ : 

**引用及使用**
```javascript
var util = require('vue/utils/stringFun')
util.abbreviation...
```
**函数体**
```javascript
function abbreviation(string) {
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 17;

    if (string.length <= length) {
        return string;
    }
    return string.slice(0, length) + '...';
}
```
