import { accountTypeMap } from './accontMap.js'

export const calculateOData = (gridData, HKStockExchangeRateList, exchangeRateHKDtoUSD, fareMap) => {
    let isNoFareClient = false
    console.log("aaaa23333", JSON.parse(JSON.stringify(gridData)), HKStockExchangeRateList, exchangeRateHKDtoUSD, fareMap)
    try {
        gridData.forEach((o)=> {
            let co = {}
            // 港股通
            if(accountTypeMap['0_HK'].includes(o.wtAccountType)){
                // 市值 = 市值价 * 持仓
                var marketValue = new Big(o.assetPrice).times(new Big(o.chiCang)).toFixed(2).toString();
                // console.log('aaaHKStockExchangeRateList', HKStockExchangeRateList, o.wtAccountType)
                co.shiZhi = new Big(marketValue).times(new Big(HKStockExchangeRateList[o.wtAccountType].middleRate)).toFixed(2).toString();
                o.shiZhiEX = `
                    市值 = 市值价 * 持仓 * 港元中间汇率<br />
                    市值 = ${o.assetPrice} * ${o.chiCang} * ${HKStockExchangeRateList[o.wtAccountType].middleRate} = ${co.shiZhi} <br />
                    计算结果为：${o.shiZhi}
                    接口返回市值：${o.shiZhi} 计算市值：${co.shiZhi} <br />
                    <span class='fontWeight'>结论：${o.shiZhi == co.shiZhi ? '相等' : '不相等'}</span>
                `
                // 计算盈亏率
                calYingKuiLv(o, co)
                calYingKu({isNoFareClient, o, co, fareMap, marketValue, HKStockExchangeRateList, accountTypeMap})
            } else if (!!o.code && !!o.wtAccountType && !!o.account){
                // 市值 = 市值价（含利息）* 持仓
                var marketValue = new Big(o.assetPrice).times(new Big(o.chiCang)).toFixed(2).toString();
                // 沪B转H市值 = 市值价（含利息）* 持仓 * 汇率
                if(accountTypeMap['1'].indexOf(o.wtAccountType) > -1 && o.stockCodeType === 'h'){                                                             
                    co.shiZhi = new Big(marketValue).times(new Big(exchangeRateHKDtoUSD)).toFixed(2).toString();
                    o.shiZhiEX = `
                        沪B转H市值 = 市值价 * 持仓 * 汇率<br />
                        市值 = ${o.assetPrice} * ${o.chiCang} * ${exchangeRateHKDtoUSD} = ${co.shiZhi} <br />
                        接口返回市值：${o.shiZhi} 计算市值：${co.shiZhi} <br />
                        <span class='fontWeight'>结论：${o.shiZhi == co.shiZhi ? '相等' : '不相等'}</span>
                    `
                }
                else{
                    co.shiZhi = marketValue;
                    o.shiZhiEX = `
                        市值 = 市值价 * 持仓<br />
                        市值 = ${o.assetPrice} * ${o.chiCang} = ${co.shiZhi} <br />
                        接口返回市值：${o.shiZhi} 计算市值：${co.shiZhi} <br />
                        <span class='fontWeight'>结论：${o.shiZhi == co.shiZhi ? '相等' : '不相等'}</span>
                    `
                }
                
                calYingKuiLv(o, co)
                calYingKu({isNoFareClient, o, co, fareMap, marketValue, exchangeRateHKDtoUSD, accountTypeMap})
            }
            o.co = co
        });
    }
    catch(e){
        console.error(e);
    }
    return gridData
}


export function calYingKu({isNoFareClient, o, co, fareMap, marketValue, exchangeRateHKDtoUSD, HKStockExchangeRateList, accountTypeMap}) {
    var fare = '0', fareText = '';
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
                co.fare0 = new Big(totalFare.fare0).times(new Big(marketValue)).plus(new Big(totalFare.fare0_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                var fare0 = new Big(co.fare0).gt(new Big(totalFare.min_fare0)) ? co.fare0 : totalFare.min_fare0;
                if(totalFare.max_fare0 > 0){
                    fare0 = new Big(fare0).lt(new Big(totalFare.max_fare0)) ? fare0 : totalFare.max_fare0;
                }
                var fare0EX = `
                    fare0:佣金计算过程，fare0 * 市值 + fare0_par * 持仓 * 每手价值<br />
                    ${totalFare.fare0} * ${marketValue} + ${totalFare.fare0_par} * ${o.chiCang} * ${o.parValue} = ${co.fare0}<br />
                    然后这个值和手续费下限min_fare0: ${totalFare.min_fare0}比较，谁大取值谁，再和手续费上限 max_fare0(如果大于0): ${totalFare.max_fare0}比较，谁小取值谁<br />
                    <span class='fontWeight'>佣金最终计算结果为：${fare0}</span><br />
                `

                co.fare1 = new Big(totalFare.fare1).times(new Big(marketValue)).plus(new Big(totalFare.fare1_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                var fare1 = new Big(co.fare1).gt(new Big(totalFare.min_fare1)) ? co.fare1 : totalFare.min_fare1;
                if(totalFare.max_fare1 > 0){
                    fare1 = new Big(fare1).lt(new Big(totalFare.max_fare1)) ? fare1 : totalFare.max_fare1;
                }
                var fare1EX = `
                    fare1:印花税计算过程，fare1 * 市值 + fare1_par * 持仓 * 每手价值<br />
                    ${totalFare.fare1} * ${marketValue} + ${totalFare.fare1_par} * ${o.chiCang} * ${o.parValue} = ${co.fare1}<br />
                    然后这个值和印花税下限min_fare1: ${totalFare.min_fare1}比较，谁大取值谁，再和印花税上限 max_fare1 (如果大于0): ${totalFare.max_fare1}比较，谁小取值谁<br />
                    <span class='fontWeight'>印花税最终计算结果为：${fare1}</span><br />
                `
                // H股全流通、B转H、港股通、印花税向上取整
                if(o.wtAccountType === 'R' || o.stockCodeType === 'h' || accountTypeMap['0_HK'].includes(o.wtAccountType)){
                    fare1 = Math.ceil(fare1);
                    let textType = ''
                    if(o.wtAccountType === 'R'){
                        textType = 'H股全流通'
                    } else if(o.stockCodeType === 'h'){
                        textType = 'B转H'
                    } else if(accountTypeMap['0_HK'].includes(o.wtAccountType)){
                        textType = '港股通'
                    }
                    fare1EX += `
                        因为是属于是${textType}，印花税向上取整 Math.ceil(fare1) ，<span class='fontWeight'>故最终计算结果为${fare1}</span><br />
                    `
                }
                
                co.fare2 = new Big(totalFare.fare2).times(new Big(marketValue)).plus(new Big(totalFare.fare2_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                var fare2 = new Big(co.fare2).gt(new Big(totalFare.min_fare2)) ? co.fare2 : totalFare.min_fare2;
                if(totalFare.max_fare2 > 0){
                    fare2 = new Big(fare2).lt(new Big(totalFare.max_fare2)) ? fare2 : totalFare.max_fare2;
                } 
                var fare2EX = `
                    fare2:过户费计算过程, fare2 * 市值 + fare2_par * 持仓 * 每手价值<br />
                    ${totalFare.fare2} * ${marketValue} + ${totalFare.fare2_par} * ${o.chiCang} * ${o.parValue} = ${co.fare2}<br />
                    然后这个值和过户费下限min_fare2: ${totalFare.min_fare2}比较，谁大取值谁，再和过户费上限 max_fare2 (如果大于0): ${totalFare.max_fare2}比较，谁小取值谁<br />
                    <span class='fontWeight'>过户费最终计算结果为：${fare2}</span><br />
                `

                co.fare3 = new Big(totalFare.fare3).times(new Big(marketValue)).plus(new Big(totalFare.fare3_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                var fare3 = new Big(co.fare3).gt(new Big(totalFare.min_fare3)) ? co.fare3 : totalFare.min_fare3;
                if(totalFare.max_fare3 > 0){
                    fare3 = new Big(fare3).lt(new Big(totalFare.max_fare3)) ? fare3 : totalFare.max_fare3;
                }                           
                var fare3EX = `
                    fare3:委托费计算过程, fare3 * 市值 + fare3_par * 持仓 * 每手价值<br />
                    ${totalFare.fare3} * ${marketValue} + ${totalFare.fare3_par} * ${o.chiCang} * ${o.parValue} = ${co.fare3}<br />
                    然后这个值和委托费下限min_fare3: ${totalFare.min_fare3}比较，谁大取值谁，再和委托费上限 max_fare3 (如果大于0): ${totalFare.max_fare3}比较，谁小取值谁<br />
                    <span class='fontWeight'>委托费最终计算结果为：${fare3}</span><br />
                `                                      
                co.farex = new Big(totalFare.farex).times(new Big(marketValue)).plus(new Big(totalFare.farex_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                var farex = new Big(co.farex).gt(new Big(totalFare.min_farex)) ? co.farex : totalFare.min_farex;
                if(totalFare.max_farex > 0){
                    farex = new Big(farex).lt(new Big(totalFare.max_farex)) ? farex : totalFare.max_farex;
                }   
                var farexEX = `
                    farex:其他费计算过程, farex * 市值 + farex_par * 持仓 * 每手价值<br />
                    ${totalFare.farex} * ${marketValue} + ${totalFare.farex_par} * ${o.chiCang} * ${o.parValue} = ${co.farex}<br />
                    然后这个值和其他费下限min_farex: ${totalFare.min_farex}比较，谁大取值谁，再和其他费上限 max_farex (如果大于0): ${totalFare.max_farex}比较，谁小取值谁<br />
                    <span class='fontWeight'>其他费最终计算结果为：${farex}</span><br />
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

                // 港股通
                if(accountTypeMap['0_HK'].includes(o.wtAccountType)){
                    fare = new Big(fare).times(new Big(HKStockExchangeRateList[o.wtAccountType].middleRate)).toFixed(2).toString();
                    fareEX = `
                        预估卖出费用 = (佣金 + 印花税 + 过户费 + 委托费 + 其他费) * 港股通中间汇率<br />
                        = (${fare0} + ${fare1} + ${fare2} + ${fare3} + ${farex}) * ${HKStockExchangeRateList[o.wtAccountType].middleRate} = ${fare}<br /> 
                    `
                }
                fareText = `${fare0EX}${fare1EX}${fare2EX}${fare3EX}${farexEX}${fareEX}`
            }
        } else {
            fareText = `市场类别wtAccountType为${o.wtAccountType}, <br />
                证券类别stockCodeType为${o.stockCodeType}, <br />
                证券类别子类subStockType为${o.subStockType}<br />
                未匹配到对应的利率，不计算预估卖出费用
            `
        }
        co.yingKui = new Big(co.shiZhi).minus(new Big(o.costBalance)).minus(new Big(fare)).toFixed(2).toString();
        o.yingKuiEX = `
            盈亏 = 市值 - 成本价 - 预估卖出费用<br />
            盈亏 = ${co.shiZhi} - ${o.costBalance} - ${fare} = ${co.yingKui} <br />
            接口返回盈亏：${o.yingKui} 计算盈亏：${co.yingKui} <br />
            <span class='fontWeight'>结论：${o.yingKui == co.yingKui? '相等' : '不相等'}</span><br />
            预估卖出费用计算过程如下：<br />
            账户类型wtAccountType:${o.wtAccountType}---- 股票类型stockCodeType:${o.stockCodeType}----子股票类型subStockType:${o.subStockType} <br />
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

export function calYingKuiLv(o, co, isUp) {
    if(parseFloat(o.chengBen) > 0){
        var calYingkuilv = new Big(o.assetPrice).minus(new Big(o.chengBen)).times(100).div(new Big(o.chengBen)).toFixed(2).toString();
        if (isUp) {
            o.yingKuiLv = calYingkuilv;
        } else {
            co.yingKuiLv = calYingkuilv;
        }
        o.yingKuiLvEX = `
            盈亏率 = (市值价 - 成本价) / 成本价 * 100<br />
            盈亏率 = (${o.assetPrice} - ${o.chengBen}) / ${o.chengBen} * 100 = ${o.yingKuiLv}%<br />
            接口返回盈亏率：${o.yingKuiLv}% 计算盈亏率：${co.yingKuiLv}% <br />
            <span class='fontWeight'>结论：${o.yingKuiLv == co.yingKuiLv? '相等' : '不相等'}</span>
        `
    }
    else{
        o.yingKuiLv = '0.00';
        o.yingKuiLvEX = ` 成本价小于等于0，盈亏率显示0.00<br />
            接口返回盈亏率：${o.yingKuiLv}% 计算盈亏率：${'0.00'}% <br />
            <span class='fontWeight'>结论：${o.yingKuiLv == '0.00'? '相等' : '不相等'}</span>
        `
    }
    return { o, co }
}
