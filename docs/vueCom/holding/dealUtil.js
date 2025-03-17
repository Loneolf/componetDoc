
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
    // 代码黑名单
    if((obj.code == '161838' || obj.code == '161022') && obj.wtAccountType == 'SZACCOUNT'){
        return false;
    }
    // 标准券不记盈亏
    if(obj.code == '888886' || obj.code == '200000'|| obj.code == '131990' || obj.code == '131991' || obj.code == '888880'){
        return false;
    }
    // 深圳的特殊业务, 深圳-基金认购'K'-159代码段不计算盈亏
    if(obj.wtAccountType == 'SZACCOUNT' && (obj.stockCodeType == '8' || (obj.stockCodeType == 'K' && obj.code.startsWith('159')))){
        return false;
    }
    // 上海-证券类别为M、K、S、L不计算盈亏
    if(obj.wtAccountType == 'SHACCOUNT' && (obj.stockCodeType == 'M' || obj.stockCodeType == 'K' || obj.stockCodeType == 'S' || obj.stockCodeType == 'L' || (obj.stockCodeType == 'A' && obj.code.startsWith('519')))){
        return false;
    }
    // 沪深京
    // 1.标准券（888886，200000，131990，131991，888880）
    // 2.报价回购（stock_type=Z&& sub_stock_type=z1）
    // 3.配股权证（stock_type=3）
    // 4.普通申购（stock_type=4）
    // 5.债券申购（stock_type=G）
    if(obj.stockCodeType == '3' || obj.stockCodeType == '4' || obj.stockCodeType == 'G' || (obj.stockCodeType == 'Z' && obj.subStockType == 'z1')){
        return false;
    }
    return true;
}

export function calProcess({o, accountTypeMap, fareMap, HKStockExchangeRateList, exchangeRateHKDtoUSD, isNoFareClient = false}) {
    let co = {}
    var fare = '0', fareText = '';
    var totalFare = undefined;
    if (!(!!fareMap[o.wtAccountType] && !!fareMap[o.wtAccountType][o.stockCodeType])) {
        fareText = `市场类别wtAccountType为${o.wtAccountType}, <br />
            证券类别stockCodeType为${o.stockCodeType}, <br />
            证券类别子类subStockType为${o.subStockType}<br />
            未匹配到对应的利率，不计算预估卖出费用
        `
    }
    // 港股通
    if(accountTypeMap['0_HK'].includes(o.wtAccountType)){
        // console.log('aaaain港股通', o.wtAccountType, o.code)
        // 特定业务 或 市价不变 不重新计算
        // if(!isComputeCostPrice(o)){
        //     return;
        // }

        // 市值 = 市值价 * 持仓
        var marketValue = new Big(o.assetPrice).times(new Big(o.chiCang)).toFixed(2).toString();
        // console.log('aaaHKStockExchangeRateList', HKStockExchangeRateList, o.wtAccountType)
        co.shiZhi = new Big(marketValue).times(new Big(HKStockExchangeRateList[o.wtAccountType].middleRate)).toFixed(2).toString();
        o.shiZhiEX = `
            市值 = 市值价 * 持仓 * 港元中间汇率<br />
            市值 = ${marketValue} * ${o.chiCang} * ${HKStockExchangeRateList[o.wtAccountType].middleRate} = ${o.shiZhi} <br />
            计算结果为：${o.shiZhi}
        `
        if(parseFloat(o.chengBen) > 0){
            co.yingKuiLv = new Big(o.assetPrice).minus(new Big(o.chengBen)).times(100).div(new Big(o.chengBen)).toFixed(2).toString();
            o.yingKuiLvEX = `
                盈亏率 = (市值价 - 成本价) / 成本价 * 100<br />
                盈亏率 = (${o.assetPrice} - ${o.chengBen}) / ${o.chengBen} * 100 = ${o.yingKuiLv}%
            `
        }
        else{
            o.yingKuiLv = '0.00';
            o.yingKuiLvEX = ` 成本价小于等于0，盈亏率显示0.00`
        }
        try{
            if(!isNoFareClient && !!o.wtAccountType && !!fareMap[o.wtAccountType] && !!fareMap[o.wtAccountType][o.stockCodeType]){    
                // console.log('aao.chiCang', o.chiCang, o.chiCang > 0)                                                         
                if(o.chiCang > 0){
                    // console.log('aaafaremap', o.wtAccountType, o.stockCodeType, o.subStockType, fareMap[o.wtAccountType][o.stockCodeType]['!'])
                    if(!!fareMap[o.wtAccountType][o.stockCodeType][o.subStockType]){
                        totalFare = fareMap[o.wtAccountType][o.stockCodeType][o.subStockType];
                    }
                    else{
                        totalFare = fareMap[o.wtAccountType][o.stockCodeType]['!'];
                    }
                    // console.log('aaatotalFare', JSON.parse(JSON.stringify(totalFare)))
                    var fare0 = new Big(totalFare.fare0).times(new Big(marketValue)).plus(new Big(totalFare.fare0_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                    fare0 = new Big(fare0).gt(new Big(totalFare.min_fare0)) ? fare0 : totalFare.min_fare0;
                    if(totalFare.max_fare0 > 0){
                        fare0 = new Big(fare0).lt(new Big(totalFare.max_fare0)) ? fare0 : totalFare.max_fare0;
                    }
                    var fare0EX = `
                        fare0:佣金计算过程，fare0 * 市值 + fare0_par * 持仓 * 每手价值<br />
                        ${totalFare.fare0} * ${marketValue} + ${totalFare.fare0_par} * ${o.chiCang} * ${o.parValue} = ${fare0}<br />
                        然后这个值和手续费下限min_fare0: ${totalFare.min_fare0}比较，谁大取值谁，再和手续费上限 max_fare0(如果大于0): ${totalFare.max_fare0}比较，谁小取值谁<br />
                        佣金最终计算结果为：${fare0}<br />
                    `
                    var fare1 = new Big(totalFare.fare1).times(new Big(marketValue)).plus(new Big(totalFare.fare1_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                    fare1 = new Big(fare1).gt(new Big(totalFare.min_fare1)) ? fare1 : totalFare.min_fare1;
                    if(totalFare.max_fare1 > 0){
                        fare1 = new Big(fare1).lt(new Big(totalFare.max_fare1)) ? fare1 : totalFare.max_fare1;
                    }
                    fare1 = Math.ceil(fare1);
                    var fare1EX = `
                        fare1:印花税计算过程，fare1 * 市值 + fare1_par * 持仓 * 每手价值<br />
                        ${totalFare.fare1} * ${marketValue} + ${totalFare.fare1_par} * ${o.chiCang} * ${o.parValue} = ${fare1}<br />
                        然后这个值和印花税下限min_fare1: ${totalFare.min_fare1}比较，谁大取值谁，再和印花税上限 max_fare1 (如果大于0): ${totalFare.max_fare1}比较，谁小取值谁<br />
                        印花税最终计算结果为：${fare1}<br />
                    `
                    var fare2 = new Big(totalFare.fare2).times(new Big(marketValue)).plus(new Big(totalFare.fare2_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                    fare2 = new Big(fare2).gt(new Big(totalFare.min_fare2)) ? fare2 : totalFare.min_fare2;
                    if(totalFare.max_fare2 > 0){
                        fare2 = new Big(fare2).lt(new Big(totalFare.max_fare2)) ? fare2 : totalFare.max_fare2;
                    }
                    var fare2EX = `
                        fare2:过户费计算过程, fare2 * 市值 + fare2_par * 持仓 * 每手价值<br />
                        ${totalFare.fare2} * ${marketValue} + ${totalFare.fare2_par} * ${o.chiCang} * ${o.parValue} = ${fare2}<br />
                        然后这个值和过户费下限min_fare2: ${totalFare.min_fare2}比较，谁大取值谁，再和印花税上限 max_fare2 (如果大于0): ${totalFare.max_fare2}比较，谁小取值谁<br />
                        过户费最终计算结果为：${fare2}<br />
                    `
                    var fare3 = new Big(totalFare.fare3).times(new Big(marketValue)).plus(new Big(totalFare.fare3_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                    fare3 = new Big(fare3).gt(new Big(totalFare.min_fare3)) ? fare3 : totalFare.min_fare3;
                    if(totalFare.max_fare3 > 0){
                        fare3 = new Big(fare3).lt(new Big(totalFare.max_fare3)) ? fare3 : totalFare.max_fare3;
                    }
                    var fare3EX = `
                        fare3:委托费计算过程, fare3 * 市值 + fare3_par * 持仓 * 每手价值<br />
                        ${totalFare.fare3} * ${marketValue} + ${totalFare.fare3_par} * ${o.chiCang} * ${o.parValue} = ${fare3}<br />
                        然后这个值和委托费下限min_fare3: ${totalFare.min_fare3}比较，谁大取值谁，再和委托费上限 max_fare3 (如果大于0): ${totalFare.max_fare3}比较，谁小取值谁<br />
                        委托费最终计算结果为：${fare3}<br />
                    `
                    var farex = new Big(totalFare.farex).times(new Big(marketValue)).plus(new Big(totalFare.farex_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                    farex = new Big(farex).gt(new Big(totalFare.min_farex)) ? farex : totalFare.min_farex;
                    if(totalFare.max_farex > 0){
                        farex = new Big(farex).lt(new Big(totalFare.max_farex)) ? farex : totalFare.max_farex;
                    }
                    var farexEX = `
                        farex:其他费计算过程, farex * 市值 + farex_par * 持仓 * 每手价值<br />
                        ${totalFare.farex} * ${marketValue} + ${totalFare.farex_par} * ${o.chiCang} * ${o.parValue} = ${farex}<br />
                        然后这个值和其他费下限min_farex: ${totalFare.min_farex}比较，谁大取值谁，再和其他费上限 max_farex (如果大于0): ${totalFare.max_farex}比较，谁小取值谁<br />
                        其他费最终计算结果为：${farex}<br />
                    `
                    
                    fare = new Big(fare0).plus(new Big(fare1)).plus(new Big(fare2)).plus(new Big(fare3)).plus(new Big(farex)).toFixed(2).toString();
                    fare = new Big(fare).times(new Big(HKStockExchangeRateList[o.wtAccountType].middleRate)).toFixed(2).toString();
                    fareEX = `
                        预估卖出费用 = (佣金 + 印花税 + 过户费 + 委托费 + 其他费) * 港股通中间汇率<br />
                        = (${fare0} + ${fare1} + ${fare2} + ${fare3} + ${farex}) * ${HKStockExchangeRateList[o.wtAccountType].middleRate} = ${fare}<br /> 
                    `
                    fareText = `${fare0EX}${fare1EX}${fare2EX}${fare3EX}${farexEX}${fareEX}`

                }        
            }
            co.yingKui = new Big(o.shiZhi).minus(new Big(o.costBalance)).minus(new Big(fare)).toFixed(2).toString();
            o.yingKuiEX = `
                盈亏 = 市值 - 成本价 - 预估卖出费用<br />
                盈亏 = ${o.shiZhi} - ${o.costBalance} - ${fare} = ${o.yingKui} <br />
                接口返回盈亏：${o.yingKui} 计算盈亏：${co.yingKui} <br />
                <span class='fontWeight'>结论：${o.yingKui == co.yingKui? '相等' : '不相等'}</span><br />
                预估卖出费用计算过程如下：<br />
                ${fareText}
            `
        }
        catch(e){
            console.error(e)
            // o.yingKui = '--'; 
        }
        finally{
            try{
                o.yingKuiWithoutFare = new Big(o.shiZhi).minus(new Big(o.costBalance)).toFixed(2).toString(); 
                o.yingKuiWithoutFareEX = `
                    盈亏不计算费用 = 市值 - 成本价<br />
                    盈亏 = ${o.shiZhi} - ${o.costBalance} = ${o.yingKuiWithoutFare}
                `
            }
            catch(e){
                o.yingKuiWithoutFare = '--'; 
            }
        } 
    } else if (!!o.code && !!o.wtAccountType && !!o.account){
        console.log('aao.chiCang', o.name, o.chiCang, o.chiCang > 0)
        // console.log('aaaa23333INNormal', o.wtAccountType, o.code, code)
        // if(!!o.code && !!o.wtAccountType && !!o.account && o.code == code && o.wtAccountType == that.chiCangHqDaiCha[i].split('|')[1]){
        // 特定业务 或 市价不变 不重新计算
        // if(!isComputeCostPrice(o) || parseFloat(newPrice) == parseFloat(o.shiJia)){
        //     return;
        // }
        
        // 市值 = 市值价（含利息）* 持仓
        var marketValue = new Big(o.assetPrice).times(new Big(o.chiCang)).toFixed(2).toString();
        // 沪B转H市值 = 市值价（含利息）* 持仓 * 汇率
        if(accountTypeMap['1'].indexOf(o.wtAccountType) > -1 && o.stockCodeType === 'h'){                                                             
            co.shiZhi = new Big(marketValue).times(new Big(exchangeRateHKDtoUSD)).toFixed(2).toString();
            o.shiZhiEX = `
                沪B转H市值 = 市值价 * 持仓 * 汇率<br />
                市值 = ${marketValue} * ${o.chiCang} * ${exchangeRateHKDtoUSD} = ${o.shiZhi} <br /><br />
                接口返回市值：${o.shiZhi} 计算市值：${co.shiZhi} <br />
                <span class='fontWeight'>结论：${o.shiZhi == co.shiZhi ? '相等' : '不相等'}</span>
            `
        }
        else{
            co.shiZhi = marketValue;
            o.shiZhiEX = `
                市值 = 市值价 * 持仓<br />
                市值 = ${marketValue} * ${o.chiCang} = ${co.shiZhi} <br /><br />
                接口返回市值：${o.shiZhi} 计算市值：${marketValue} <br />
                <span class='fontWeight'>结论：${o.shiZhi == co.shiZhi ? '相等' : '不相等'}</span>
            `
        }
        
        if(parseFloat(o.chengBen) > 0){
            co.yingKuiLv = new Big(o.assetPrice).minus(new Big(o.chengBen)).times(100).div(new Big(o.chengBen)).toFixed(2).toString();
            o.yingKuiLvEX = `
                盈亏率 = (市值价 - 成本价) / 成本价 * 100<br />
                盈亏率 = (${o.assetPrice} - ${o.chengBen}) / ${o.chengBen} * 100 = ${co.yingKuiLv}% <br /><br />
                接口返回盈亏率：${o.yingKuiLv}% 计算盈亏率：${co.yingKuiLv}% <br />
                <span class='fontWeight'>结论：${o.yingKuiLv == co.yingKuiLv? '相等' : '不相等'}</span>
            `
        } else{
            co.yingKuiLv = '0.00';
            o.yingKuiLvEX = ` 成本价小于等于0，盈亏率显示0.00 <br /><br />
                接口返回盈亏率：${o.yingKuiLv}% 计算盈亏率：${'0.00'}% <br />
                <span class='fontWeight'>结论：${o.yingKuiLv == '0.00'? '相等' : '不相等'}</span>
            `
        }
        try{
            // console.log('aaaaaaincalculate', o.name, !isNoFareClient, !!o.wtAccountType, !!fareMap[o.wtAccountType], !!fareMap[o.wtAccountType][o.stockCodeType])
            if(!isNoFareClient && !!o.wtAccountType && !!fareMap[o.wtAccountType] && !!fareMap[o.wtAccountType][o.stockCodeType]){
                if(o.chiCang > 0){
                    var totalFare = {};
                    if(!!fareMap[o.wtAccountType][o.stockCodeType][o.subStockType]){
                        totalFare = fareMap[o.wtAccountType][o.stockCodeType][o.subStockType];
                    }
                    else{
                        totalFare = fareMap[o.wtAccountType][o.stockCodeType]['!'];
                    }
                    var fare0 = new Big(totalFare.fare0).times(new Big(marketValue)).plus(new Big(totalFare.fare0_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                    fare0 = new Big(fare0).gt(new Big(totalFare.min_fare0)) ? fare0 : totalFare.min_fare0;
                    if(totalFare.max_fare0 > 0){
                        fare0 = new Big(fare0).lt(new Big(totalFare.max_fare0)) ? fare0 : totalFare.max_fare0;
                    }
                    var fare0EX = `
                        fare0:佣金计算过程，fare0 * 市值 + fare0_par * 持仓 * 每手价值<br />
                        ${totalFare.fare0} * ${marketValue} + ${totalFare.fare0_par} * ${o.chiCang} * ${o.parValue} = ${fare0}<br />
                        然后这个值和手续费下限min_fare0: ${totalFare.min_fare0}比较，谁大取值谁，再和手续费上限 max_fare0(如果大于0): ${totalFare.max_fare0}比较，谁小取值谁<br />
                        佣金最终计算结果为：${fare0}<br />
                    `

                    var fare1 = new Big(totalFare.fare1).times(new Big(marketValue)).plus(new Big(totalFare.fare1_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                    fare1 = new Big(fare1).gt(new Big(totalFare.min_fare1)) ? fare1 : totalFare.min_fare1;
                    if(totalFare.max_fare1 > 0){
                        fare1 = new Big(fare1).lt(new Big(totalFare.max_fare1)) ? fare1 : totalFare.max_fare1;
                    }
                    var fare1EX = `
                        fare1:印花税计算过程，fare1 * 市值 + fare1_par * 持仓 * 每手价值<br />
                        ${totalFare.fare1} * ${marketValue} + ${totalFare.fare1_par} * ${o.chiCang} * ${o.parValue} = ${fare1}<br />
                        然后这个值和印花税下限min_fare1: ${totalFare.min_fare1}比较，谁大取值谁，再和印花税上限 max_fare1 (如果大于0): ${totalFare.max_fare1}比较，谁小取值谁<br />
                        印花税最终计算结果为：${fare1}<br />
                    `
                    // H股全流通、B转H印花税向上取整
                    if(o.wtAccountType === 'R' || o.stockCodeType === 'h'){
                        fare1 = Math.ceil(fare1);
                        fare1EX += `
                            因为是属于是H股全流通、B转H，印花税向上取整 Math.ceil(fare1) ，最终计算结果为${fare1}<br />
                        `
                    }
                    
                    var ofare2 = new Big(totalFare.fare2).times(new Big(marketValue)).plus(new Big(totalFare.fare2_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                    var fare2 = new Big(ofare2).gt(new Big(totalFare.min_fare2)) ? ofare2 : totalFare.min_fare2;
                    if(totalFare.max_fare2 > 0){
                        fare2 = new Big(fare2).lt(new Big(totalFare.max_fare2)) ? fare2 : totalFare.max_fare2;
                    } 
                    var fare2EX = `
                        fare2:过户费计算过程, fare2 * 市值 + fare2_par * 持仓 * 每手价值<br />
                        ${totalFare.fare2} * ${marketValue} + ${totalFare.fare2_par} * ${o.chiCang} * ${o.parValue} = ${ofare2}<br />
                        然后这个值和过户费下限min_fare2: ${totalFare.min_fare2}比较，谁大取值谁，再和过户费上限 max_fare2 (如果大于0): ${totalFare.max_fare2}比较，谁小取值谁<br />
                        过户费最终计算结果为：${fare2}<br />
                    `

                    var fare3 = new Big(totalFare.fare3).times(new Big(marketValue)).plus(new Big(totalFare.fare3_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                    fare3 = new Big(fare3).gt(new Big(totalFare.min_fare3)) ? fare3 : totalFare.min_fare3;
                    if(totalFare.max_fare3 > 0){
                        fare3 = new Big(fare3).lt(new Big(totalFare.max_fare3)) ? fare3 : totalFare.max_fare3;
                    }                           
                    var fare3EX = `
                        fare3:委托费计算过程, fare3 * 市值 + fare3_par * 持仓 * 每手价值<br />
                        ${totalFare.fare3} * ${marketValue} + ${totalFare.fare3_par} * ${o.chiCang} * ${o.parValue} = ${fare3}<br />
                        然后这个值和委托费下限min_fare3: ${totalFare.min_fare3}比较，谁大取值谁，再和委托费上限 max_fare3 (如果大于0): ${totalFare.max_fare3}比较，谁小取值谁<br />
                        委托费最终计算结果为：${fare3}<br />
                    `                                      
                    var farex = new Big(totalFare.farex).times(new Big(marketValue)).plus(new Big(totalFare.farex_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                    farex = new Big(farex).gt(new Big(totalFare.min_farex)) ? farex : totalFare.min_farex;
                    if(totalFare.max_farex > 0){
                        farex = new Big(farex).lt(new Big(totalFare.max_farex)) ? farex : totalFare.max_farex;
                    }   
                    var farexEX = `
                        farex:其他费计算过程, farex * 市值 + farex_par * 持仓 * 每手价值<br />
                        ${totalFare.farex} * ${marketValue} + ${totalFare.farex_par} * ${o.chiCang} * ${o.parValue} = ${farex}<br />
                        然后这个值和其他费下限min_farex: ${totalFare.min_farex}比较，谁大取值谁，再和其他费上限 max_farex (如果大于0): ${totalFare.max_farex}比较，谁小取值谁<br />
                        其他费最终计算结果为：${farex}<br />
                    `
                    fare = new Big(fare0).plus(new Big(fare1)).plus(new Big(fare2)).plus(new Big(fare3)).plus(new Big(farex)).toFixed(2).toString();
                    var fareEX = `
                        预估卖出费用 = 佣金 + 印花税 + 过户费 + 委托费 + 其他费<br />
                        = (${fare0} + ${fare1} + ${fare2} + ${fare3} + ${farex}) = ${fare}<br /> 
                    `
                    // 沪B转H
                    if(accountTypeMap['1'].indexOf(o.wtAccountType) > -1 && o.stockCodeType === 'h'){
                        fare = new Big(fare).times(new Big(exchangeRateHKDtoUSD)).toFixed(2).toString();
                        fareEX = `
                            预估卖出费用 = (佣金 + 印花税 + 过户费 + 委托费 + 其他费) * 港股转美元汇率<br />
                            = (${fare0} + ${fare1} + ${fare2} + ${fare3} + ${farex}) * ${exchangeRateHKDtoUSD} = ${fare}<br /> 
                        `
                    }
                    fareText = `${fare0EX}${fare1EX}${fare2EX}${fare3EX}${farexEX}${fareEX}`
                }
            }
            co.yingKui = new Big(co.shiZhi).minus(new Big(o.costBalance)).minus(new Big(fare)).toFixed(2).toString();
            o.yingKuiEX = `
                盈亏 = 市值 - 成本价 - 预估卖出费用<br />
                盈亏 = ${co.shiZhi} - ${o.costBalance} - ${fare} = ${co.yingKui} <br /> <br />
                账户类型wtAccountType：${o.wtAccountType} 股票类型stockCodeType：${o.stockCodeType} 子股票类型subStockType：${o.subStockType} <br />
                接口返回盈亏：${o.yingKui} 计算盈亏：${co.yingKui} <br />
                <span class='fontWeight'>结论：${o.yingKui == co.yingKui? '相等' : '不相等'}</span><br />
                预估卖出费用计算过程如下：<br />
                ${fareText}
            `
        }
        catch(e){
            console.error(e)
            o.yingKui = '--'; 
        }
        finally{
            try{
                o.yingKuiWithoutFare = new Big(o.shiZhi).minus(new Big(o.costBalance)).toFixed(2).toString(); 
                o.yingKuiWithoutFareEX = `
                    盈亏不计算费用 = 市值 - 成本价<br />
                    盈亏 = ${o.shiZhi} - ${o.costBalance} = ${o.yingKuiWithoutFare}
                `
            }
            catch(e){
                o.yingKuiWithoutFare = '--'; 
            }
        }   
    } 
}


export default {
    format,
    unit,
    dateform,
    formatZZDate
}
