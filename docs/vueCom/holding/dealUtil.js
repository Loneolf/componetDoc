
export function format (num, dig,index) {
    //数字转换成小数两位
    //return Math.round(num*Math.pow(10,Number(dig)))/Math.pow(10,Number(dig));
    var f = parseFloat(num);
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0 && dig > 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + Number(dig)) {
        s += '0';
    }
    if (rs >= 1 && (f.toString().length - rs > dig)) {

        if (Number(dig) > 0) {
            var l = (num.toString().indexOf('.')) + 1;
            s = num.toString().slice(0, l + Number(dig));
        } else {
            //s = Math.round(num*Math.pow(10,Number(dig)))/Math.pow(10,Number(dig));
            var wz = num.toString().indexOf('.');
            if (wz > 0) {
                s = num.toString().substr(0, wz);
            } else {
                s = num;
            }
        }

    }
    // 持仓/可用数据 小数为00保留整数截断处理
    if(index == '1' || index == '2'){
        if(Number(s).toFixed(0) == 'NaN') {
            var tm = s.split('.')[1];
            var t = tm.slice(0,2)
            var m = tm.slice(2)
            s =  t == '00' ? s.split('.')[0] + m :s;
        }else {
            s =  Number(s).toFixed(2).split('.')[1] == '00' ? s.split('.')[0] :Number(s).toFixed(2);
        }
    }
    return s;
}
export function unit (num, digit,index) {
    var dig = digit || 0;
    // var dig = 2; //德邦要求保留3位
    if (num == '' || typeof num == void 0) {
        return '';
    }
    if (isNaN(num)) {
        return num;
    }
    var arrNum = num.split('.');
    var arrln = arrNum[0].length;
    if (!digit) {
        return num;
    }
    if (arrln >= 6 && arrln < 9) {
        return (format(num / 10000, dig,index) + '万');
    } else if (arrln >= 9) {
        return (format(num / 100000000, dig,index) + '亿');
    } else {
        return (format(num, dig,index));
    }
}

//时间日期转换
export function dateform (str, index, DATEFORMINDEX) {
    if (!DATEFORMINDEX || !index) {
        return str;
    }
    var arrIndex = DATEFORMINDEX.split(','), arrNum = [], arrSuo = [];
    for (var i = 0; i < arrIndex.length; i++) {
        arrNum[i] = arrIndex[i].split('|')[0];
        arrSuo[i] = arrIndex[i].split('|')[1];
    }
    var suoindex = arrNum.indexOf(index);
    if (suoindex >= 0) {
        if (arrSuo[suoindex] && arrSuo[suoindex].indexOf('yyyy') == '0') {
            var s = arrSuo[suoindex].replace(/yyyy/g, '$1').replace(/mm/g, '$2').replace(/dd/g, '$3');
            return str.replace(/\-/g, '').replace(/^(\d{4})(\d{2})(\d{2})$/i, s);
        } else if (arrSuo[suoindex] && arrSuo[suoindex].indexOf('hh') == '0') {
            if (str.length == 5 || str.length == 7) {
                str = '0' + str;
            }
            var s = arrSuo[suoindex].replace(/hh/g, '$1').replace(/mm/g, '$2').replace(/ss/g, '$3');
            return str.replace(/\:/g, '').substr(0, 6).replace(/^(\d{2})(\d{2})(\d{2})$/i, s);
        } else {
            return str;
        }
    } else {
        return str;
    }
}

//检查金额索引和日期索索引变动
export function formatZZDate (str, index, ZZPINDEX, DATEFORMINDEX, noUnit) {
    if ((!ZZPINDEX && !DATEFORMINDEX) || typeof index == void 0 || typeof index == 'null') return str;
    if ((!ZZPINDEX || ZZPINDEX.indexOf(index + '|') < 0) && (!DATEFORMINDEX || DATEFORMINDEX.indexOf(index + '|') < 0)) return str;
    var aZzIndex = [], zzArrNum = [], zzArrSuo = [],
        aDateIndex = [], dateArrNum = [], dateArrSuo = [];
    if (!!ZZPINDEX) {
        aZzIndex = ZZPINDEX.split(',');
        for (var i = 0; i < aZzIndex.length; i++) {
            zzArrNum[i] = aZzIndex[i].split('|')[0];
            zzArrSuo[i] = aZzIndex[i].split('|')[1];
        }
    }
    if (!!DATEFORMINDEX) {
        aDateIndex = DATEFORMINDEX.split(',');
        for (var i = 0; i < aDateIndex.length; i++) {
            dateArrNum[i] = aDateIndex[i].split('|')[0];
            dateArrSuo[i] = aDateIndex[i].split('|')[1];
        }
    }

    if (zzArrNum.indexOf(index) >= 0) { //金额格式化
        if(noUnit){
            return format(str, zzArrSuo[zzArrNum.indexOf(index)],index);
        }
        return unit(str, zzArrSuo[zzArrNum.indexOf(index)],index);
    } else if (dateArrNum.indexOf(index) >= 0) { //日期时间
        var suoindex = dateArrNum.indexOf(index);
        if (suoindex >= 0) {
            if (arrSuo[suoindex] && arrSuo[suoindex].indexOf('yyyy') == '0') {
                var s = arrSuo[suoindex].replace(/yyyy/g, '$1').replace(/mm/g, '$2').replace(/dd/g, '$3');
                return str.replace(/\-/g, '').replace(/^(\d{4})(\d{2})(\d{2})$/i, s);
            } else if (arrSuo[suoindex] && arrSuo[suoindex].indexOf('hh') == '0') {
                if (str.length == 5 || str.length == 7) {
                    str = '0' + str;
                }
                var s = arrSuo[suoindex].replace(/hh/g, '$1').replace(/mm/g, '$2').replace(/ss/g, '$3');
                return str.replace(/\:/g, '').substr(0, 6).replace(/^(\d{2})(\d{2})(\d{2})$/i, s);
            } else {
                return str;
            }
        } else {
            return str;
        }
    } else {
        return str;
    }
}

export function toPercentage(num) {
    return `${(num * 100).toFixed(2)}%`;
}



export function convertToBigJsExpression(expression, decimalPlaces = 2) {
    expression = expression.replace(/\s/g, ''); // 去除空格
    expression = expression.replace(/(\d)\(/g, '$1*('); // 处理括号前的数字
    const operatorMap = {
        '+': 'plus',
        '-': 'minus',
        '*': 'times',
        '/': 'div'
    };

    function parseExpression(subExpression) {
        let stack = [];
        let currentOperand = '';

        for (let i = 0; i < subExpression.length; i++) {
            const char = subExpression[i];
            if (char === '(') {
                let openCount = 1;
                let j = i + 1;
                while (j < subExpression.length && openCount > 0) {
                    if (subExpression[j] === '(') {
                        openCount++;
                    } else if (subExpression[j] === ')') {
                        openCount--;
                    }
                    j++;
                }
                const innerExpression = subExpression.slice(i + 1, j - 1);
                const parsedInner = parseExpression(innerExpression);
                stack.push(parsedInner);
                i = j - 1;
            } else if (Object.keys(operatorMap).includes(char)) {
                if (currentOperand) {
                    stack.push(`new Big('${currentOperand}')`);
                    currentOperand = '';
                }
                stack.push(operatorMap[char]);
            } else {
                currentOperand += char;
            }
        }

        if (currentOperand) {
            stack.push(`new Big('${currentOperand}')`);
        }

        let resultExpression = stack[0];
        for (let i = 1; i < stack.length; i += 2) {
            resultExpression = `${resultExpression}.${stack[i]}(${stack[i + 1]})`;
        }
        return resultExpression;
    }

    let baseExpression = parseExpression(expression);
    if (typeof decimalPlaces === 'number' && decimalPlaces >= 0) {
        baseExpression += `.toFixed(${decimalPlaces}).toString()`;
    }
    return baseExpression;
}

export function formatLocalTime(data = new Date()) {
    // 创建一个 Date 对象，它会自动获取本地时间

    // 获取小时、分钟和秒数
    const hours = String(data.getHours()).padStart(2, '0');
    const minutes = String(data.getMinutes()).padStart(2, '0');
    const seconds = String(data.getSeconds()).padStart(2, '0');

    // 拼接成指定格式的时间字符串
    return `${hours}${minutes}${seconds}`;
}

export function isComputeCostPrice (obj) {
    let text = '';
    let isCompute = true
    // 代码黑名单
    if((obj.code == '161838' || obj.code == '161022') && obj.wtAccountType == 'SZACCOUNT'){
        text =  `代码code为${obj.code}，且市场类型为${obj.wtAccountType} 属于代码黑名单，不进行刷新计算`
        isCompute = false
    }
    // 标准券不记盈亏
    if(obj.code == '888886' || obj.code == '200000'|| obj.code == '131990' || obj.code == '131991' || obj.code == '888880'){
        text =  `代码code为${obj.code}的标准券不进行刷新计算`
        isCompute = false
    }
    // 深圳的特殊业务, 深圳-基金认购'K'-159代码段不计算盈亏
    if(obj.wtAccountType == 'SZACCOUNT' && (obj.stockCodeType == '8' || (obj.stockCodeType == 'K' && obj.code.startsWith('159')))){
        text = `市场类型为${obj.wtAccountType} 并且stockCodeType为${obj.stockCodeType}，深圳特殊业务，不进行刷新计算`
        isCompute = false
    }
    // 上海-证券类别为M、K、S、L不进行刷新计算
    if(obj.wtAccountType == 'SHACCOUNT' && (obj.stockCodeType == 'M' || obj.stockCodeType == 'K' || obj.stockCodeType == 'S' || obj.stockCodeType == 'L' || (obj.stockCodeType == 'A' && obj.code.startsWith('519')))){
        text = `市场类型为${obj.wtAccountType} 并且stockCodeType为${obj.stockCodeType}，上海特殊业务，不进行刷新计算`
        isCompute = false
    }
    // 沪深京
    // 1.标准券（888886，200000，131990，131991，888880）
    // 2.报价回购（stock_type=Z&& sub_stock_type=z1）
    // 3.配股权证（stock_type=3）
    // 4.普通申购（stock_type=4）
    // 5.债券申购（stock_type=G）
    if(obj.stockCodeType == '3' || obj.stockCodeType == '4' || obj.stockCodeType == 'G' || (obj.stockCodeType == 'Z' && obj.subStockType == 'z1')){
        text = `stockCodeType 为${obj.stockCodeType}，subStockType为${obj.subStockType}，沪深京特殊业务，不计算盈亏`
        isCompute = false
    }
    return {
        text,
        isCompute
    };
}

export default {
    format,
    unit,
    dateform,
    formatZZDate
}
