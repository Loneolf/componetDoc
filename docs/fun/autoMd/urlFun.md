# 通用 url 处理

<ClientOnly>
  <DrawerTestDoc url='https://qing-1258827329.cos.ap-beijing.myqcloud.com/componet/coverage/lcov-report/urlFun.js.html'/>
</ClientOnly>

<script setup>
  import DrawerTestDoc from '../../vueCom/drawerTestDoc.vue';
</script>


## getParameter 取出Url中的参数
取出Url中的参数

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| name | `string` | 需要取url地址中的名字 |


**返回值**
- _string,null_ : 

**引用及使用**
```javascript
var util = require('vue/utils/urlFun')
util.getParameter...
```
**函数体**
```javascript
function getParameter(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
```



## toQueryParams url参数转换对象
url参数转换对象


**返回值**
- _object_ : json 格式url参数

**引用及使用**
```javascript
var util = require('vue/utils/urlFun')
util.toQueryParams...
```
**函数体**
```javascript
function toQueryParams() {
    var search = window.location.search.replace(/^\s+/, '').replace(/\s+$/, '').match(/([^?#]*)(#.*)?$/); //提取location.search中'?'后面的部分
    if (!search) {
        return {};
    }
    var searchStr = search[1];
    var searchHash = searchStr.split('&');

    var ret = {};
    for (var i = 0, len = searchHash.length; i < len; i++) {
        //这里可以调用each方法
        var pair = searchHash[i];
        if ((pair = pair.split('='))[0]) {
            var key = decodeURIComponent(pair.shift());
            var value = pair.length > 1 ? pair.join('=') : pair[0];

            if (value != undefined) {
                value = decodeURIComponent(value);
            }
            if (key in ret) {
                if (ret[key].constructor != Array) {
                    ret[key] = [ret[key]];
                }
                ret[key].push(value);
            } else {
                ret[key] = value;
            }
        }
    }
    return ret;
}
```



## toQueryString 对象转换url参数
对象转换url参数

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| name | `object` | 需要取url地址中的名字 |


**返回值**
- _string_ : url格式参数

**引用及使用**
```javascript
var util = require('vue/utils/urlFun')
util.toQueryString...
```
**函数体**
```javascript
function toQueryString(obj) {
    var ret = [];
    for (var key in obj) {
        key = encodeURIComponent(key);
        var values = obj[key];
        if (values && values.constructor == Array) {
            //数组
            var queryValues = [];
            for (var i = 0, len = values.length, value; i < len; i++) {
                value = values[i];
                queryValues.push(toQueryPair(key, value));
            }
            ret = ret.concat(queryValues);
        } else {
            //字符串
            ret.push(toQueryPair(key, values));
        }
    }
    return ret.join('&');
}
```



## toQueryPair 转换encodeURI
转换encodeURI

**参数**
| 参数 | 参数类型 | 描述 |
|------|------|------|
| key | `string` | url地址中的名字 |
| value | `string` | url地址中的值 |


**返回值**
- _string_ : url格式参数

**引用及使用**
```javascript
var util = require('vue/utils/urlFun')
util.toQueryPair...
```
**函数体**
```javascript
function toQueryPair(key, value) {
    if (typeof value == 'undefined') {
        return key;
    }
    return key + '=' + encodeURIComponent(value === null ? '' : String(value));
}
```
