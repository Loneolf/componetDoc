# 方法文档

## 去掉字符串最后的那个符号，默认为顿号，可通过参数控制
```js
exports.moveLastComma = moveLastComma
function moveLastComma(str, symbol) {
    if (!str) return str
    if (str[str.length - 1] === (symbol || '、')) {
        return str.substring(0, str.length - 1)
    }
    return str
}
```

## 对数据按照指定规则进行排序
```js
/**
    * 对数据进行排序
    * @param {Array} data - 要排序的数据
    * @param {Array} rule - 排序规则
    * @param {Array} indexs - 可选参数，用于指定在数据中查找规则的索引
    * @returns {Array} - 排序后的数据
    */
exports.ruleSort = ruleSort
function ruleSort(data, rule, indexs) {
    if (!data || !rule) return data
    data.sort(function (a, b) {
        for (var i = 0; i < rule.length; i++) {
            var key = rule[i];
            if (indexs) {
                if (a[indexs] === key) {
                    return -1;
                } else if (b[indexs] === key) {
                    return 1;
                }
            } else {
                if (a === key) {
                    return -1;
                } else if (b === key) {
                    return 1;
                }
            }
        }
        return 0;
    });
    return data
}
```