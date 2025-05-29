# 通用数字处理

<ClientOnly>
  <DrawerTestDoc url='https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/coverage/lcov-report/numbers.js.html'/>
</ClientOnly>

<script setup>
  import DrawerTestDoc from '../../vueCom/drawerTestDoc.vue';
</script>


## thousandFormat 格式化正整数-每三位逗号
格式化正整数-每三位逗号

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| num | `Number` | 整数 |


**返回值**
- _String_ : output

**引用及使用**
```javascript
var util = require('vue/utils/numbers')
util.thousandFormat...
```
**函数体**
```javascript
function thousandFormat(num) {
    var output = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return output;
}
```
