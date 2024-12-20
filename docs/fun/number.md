# 金额数字处理方法


## 金额处理，是否转换为以万为单位
```js
/**
 * 将金额格式化为指定的字符串格式
 * @param {number} num - 要格式化的金额数字
 * @returns {string} - 格式化后的金额字符串
 */
exports.formatNum = formatNum
function formatNum(num) {
    if (!num) return
    // 如果存在小数点数据，不处理数据
    if (String(num).includes('.')) return num
    // 当对100求余为0，当以万为单位最多只有两位小数时，则显示万
    if (num == 0) return Number(num).toFixed()
    if (num % 100 === 0) {
        return num / 10000 + '万'
    }
    return Number(num).toFixed()
}

/// 示例1：传入一个可以被100整除的数字
var result1 = formatNum(10000);
console.log(result1); // 输出: "1万"

// 示例2：传入一个不能被100整除的数字
var result2 = formatNum(12345);
console.log(result2); // 输出: "12345"

// 示例3：传入一个带有小数部分的数字
var result3 = formatNum(12345.67);
console.log(result3); // 输出: "12345.67"

// 示例4：传入一个0
var result4 = formatNum(0);
console.log(result4); // 输出: "0"
```

## 保留小数点后几位
```js
exports.numFixed = numFixed
function numFixed(num, fixed) {
    if (!num) return ''
    return Number(num).toFixed(fixed)
}
```