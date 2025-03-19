import * as accountMap from './accontMap.js'
import { isComputeCostPrice } from './dealUtil.js'
import { getTodayPl } from './dealMainData.js'

export const deal60Data = (oData, gridData, HKStockExchangeRateList, exchangeRateHKDtoUSD, fareMap) => {
    let isNoFareClient = false
    if (!oData.NEWMARKETNO || !oData.NEWMARKETNO.length) return;
    // 股票市场列表
    var newmarket_arr = oData.NEWMARKETNO.split('|');
    var stock_pro_arr = oData.STOCKPROP.split('|');
    if(oData.GRID0 && oData.GRID0.length>0){
        // oData.GRID0.shift();
        for(var i=0; i<oData.GRID0.length; i++) {
            var item = oData.GRID0[i].split('|');
            // 更新股票中的股票代码
            var code = item[oData.STOCKCODEINDEX]+'';
            gridData.forEach((o)=>{
                // 给持仓列表数据加上 市场 与 STOCKPROP
                if(accountMap.accountTypeMap['0_HK'].includes(o.wtAccountType) && ('H' + o.code) == code){
                    o.newMarketNo = newmarket_arr[i];
                    o.stockProCode = stock_pro_arr[i];
                }
                else if (o.code == code){
                    var newMarketNo = newmarket_arr[i];
                    if(checkMarketAva(o.wtAccountType, newMarketNo)){
                        o.newMarketNo = newMarketNo;
                        o.stockProCode = stock_pro_arr[i];
                    }
                }
            });

            try{
                var newPrice = item[oData.NEWPRICEINDEX];
                // 没有最新市价则不进行计算
                if(!newPrice || isNaN(newPrice) || !parseFloat(newPrice)){
                    continue;
                }
                var itemArr = gridData.filter((o)=>{
                    return (accountMap.accountTypeMap['0_HK'].includes(o.wtAccountType) && ('H' + o.code) == code) || (!!o.code && !!o.wtAccountType && !!o.account && o.code == code)
                })
                gridData.forEach((o)=>{
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
                    
                    // 人民币A股或港股通
                    // if(that.currAccount == '0' || that.currAccount == '0_HK'){
                    //     // 美元港币 不重新计算
                    //     if(accountMap.accountTypeMap['1'].indexOf(o.wtAccountType) > -1 || accountMap.accountTypeMap['2'].indexOf(o.wtAccountType) > -1){
                    //         return;
                    //     }
                    // }
                    // else{
                    //     if(accountMap.accountTypeMap[that.currAccount].indexOf(o.wtAccountType) == -1){
                    //         return;
                    //     }
                    // } 
                    // 港股通
                    if(accountMap.accountTypeMap['0_HK'].includes(o.wtAccountType) && ('H' + o.code) == code){
                        console.log('aaaain港股通', o.wtAccountType, o.code, code)
                        // 特定业务 或 市价不变 不重新计算
                        if(!isComputeCostPrice(o) || parseFloat(newPrice) == parseFloat(o.shiJia)){
                            return;
                        }
                        // 新市值价 = 原市值价 - 原最新价 + 新最新价
                        var newAssetPriceEX = new Big(o.assetPrice).minus(new Big(o.shiJia)).plus(newPrice).toFixed(4).toString();
                        o.assetPriceEX = `
                            新市值价 = 原市值价 - 原最新价 + 新最新价<br />
                            新市值价 = ${o.assetPrice} - ${o.shiJia} + ${newPrice} = ${newAssetPriceEX}
                        `
                        o.assetPrice = newAssetPriceEX

                        o.shiJia = newPrice;
                        o.shiJiaEX = `最新价 =  ${newPrice}`

                        // 市值 = 市值价 * 持仓
                        var marketValue = new Big(o.assetPrice).times(new Big(o.chiCang)).toFixed(2).toString();
                        // console.log('aaaHKStockExchangeRateList', HKStockExchangeRateList, o.wtAccountType)
                        o.shiZhi = new Big(marketValue).times(new Big(HKStockExchangeRateList[o.wtAccountType].middleRate)).toFixed(2).toString();
                        o.shiZhiEX = `
                            市值 = 市值价 * 持仓 * 港元中间汇率<br />
                            市值 = ${marketValue} * ${o.chiCang} * ${HKStockExchangeRateList[o.wtAccountType].middleRate} = ${o.shiZhi}
                        `
                        if(parseFloat(o.chengBen) > 0){
                            o.yingKuiLv = new Big(o.assetPrice).minus(new Big(o.chengBen)).times(100).div(new Big(o.chengBen)).toFixed(2).toString();
                            o.yingKuiLvEX = `
                                盈亏率 = (新市值价 - 成本价) / 成本价 * 100<br />
                                盈亏率 = (${o.assetPrice} - ${o.chengBen}) / ${o.chengBen} * 100 = ${o.yingKuiLv}%
                            `
                        }
                        else{
                            o.yingKuiLv = '0.00';
                            o.yingKuiLvEX = ` 成本价小于等于0，盈亏率显示0.00`
                        }
                        try{
                            if(!isNoFareClient && !!o.wtAccountType && !!fareMap[o.wtAccountType] && !!fareMap[o.wtAccountType][o.stockCodeType]){                                                             
                                if(o.chiCang > 0){
                                    console.log('aaafaremap', o.wtAccountType, o.stockCodeType, o.subStockType, fareMap[o.wtAccountType][o.stockCodeType]['!'])
                                    if(!!fareMap[o.wtAccountType][o.stockCodeType][o.subStockType]){
                                        totalFare = fareMap[o.wtAccountType][o.stockCodeType][o.subStockType];
                                    }
                                    else{
                                        totalFare = fareMap[o.wtAccountType][o.stockCodeType]['!'];
                                    }
                                    co.fare0 = new Big(totalFare.fare0).times(new Big(marketValue)).plus(new Big(totalFare.fare0_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                                    fare0 = new Big(co.fare0).gt(new Big(totalFare.min_fare0)) ? co.fare0 : totalFare.min_fare0;
                                    if(totalFare.max_fare0 > 0){
                                        fare0 = new Big(fare0).lt(new Big(totalFare.max_fare0)) ? fare0 : totalFare.max_fare0;
                                    }
                                    var fare0EX = `
                                        fare0:佣金计算过程，fare0 * 市值 + fare0_par * 持仓 * 每手价值<br />
                                        ${totalFare.fare0} * ${marketValue} + ${totalFare.fare0_par} * ${o.chiCang} * ${o.parValue} = ${co.fare0}<br />
                                        然后这个值和手续费下限min_fare0: ${totalFare.min_fare0}比较，谁大取值谁，再和手续费上限 max_fare0(如果大于0): ${totalFare.max_fare0}比较，谁小取值谁<br />
                                        佣金最终计算结果为：${fare0}<br />
                                    `
                                    co.fare1 = new Big(totalFare.fare1).times(new Big(marketValue)).plus(new Big(totalFare.fare1_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                                    var fare1 = new Big(co.fare1).gt(new Big(totalFare.min_fare1)) ? co.fare1 : totalFare.min_fare1;
                                    if(totalFare.max_fare1 > 0){
                                        fare1 = new Big(fare1).lt(new Big(totalFare.max_fare1)) ? fare1 : totalFare.max_fare1;
                                    }
                                    fare1 = Math.ceil(fare1);
                                    var fare1EX = `
                                        fare1:印花税计算过程，fare1 * 市值 + fare1_par * 持仓 * 每手价值<br />
                                        ${totalFare.fare1} * ${marketValue} + ${totalFare.fare1_par} * ${o.chiCang} * ${o.parValue} = ${co.fare1}<br />
                                        然后这个值和印花税下限min_fare1: ${totalFare.min_fare1}比较，谁大取值谁，再和印花税上限 max_fare1 (如果大于0): ${totalFare.max_fare1}比较，谁小取值谁<br />
                                        印花税最终计算结果为：${fare1}<br />
                                    `
                                    co.fare2 = new Big(totalFare.fare2).times(new Big(marketValue)).plus(new Big(totalFare.fare2_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                                    var fare2 = new Big(co.fare2).gt(new Big(totalFare.min_fare2)) ? co.fare2 : totalFare.min_fare2;
                                    if(totalFare.max_fare2 > 0){
                                        fare2 = new Big(fare2).lt(new Big(totalFare.max_fare2)) ? fare2 : totalFare.max_fare2;
                                    }
                                    var fare2EX = `
                                        fare2:过户费计算过程, fare2 * 市值 + fare2_par * 持仓 * 每手价值<br />
                                        ${totalFare.fare2} * ${marketValue} + ${totalFare.fare2_par} * ${o.chiCang} * ${o.parValue} = ${co.fare2}<br />
                                        然后这个值和过户费下限min_fare2: ${totalFare.min_fare2}比较，谁大取值谁，再和印花税上限 max_fare2 (如果大于0): ${totalFare.max_fare2}比较，谁小取值谁<br />
                                        过户费最终计算结果为：${fare2}<br />
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
                                        委托费最终计算结果为：${fare3}<br />
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
                            o.yingKui = new Big(o.shiZhi).minus(new Big(o.costBalance)).minus(new Big(fare)).toFixed(2).toString();
                            o.yingKuiEX = `
                                盈亏 = 市值 - 成本价 - 预估卖出费用<br />
                                盈亏 = ${o.shiZhi} - ${o.costBalance} - ${fare} = ${o.yingKui} <br />
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
                            finally{
                                try{
                                    if(!o.preDrPrice || isNaN(o.preDrPrice) || !parseFloat(o.preDrPrice)){
                                        return;
                                    }
                                    var rateItem = HKStockExchangeRateList[o.wtAccountType]
                                    var todayHoldPl = new Big(o.chiCang).minus(new Big(o.realBuyAmount)).times(new Big(o.assetPrice).minus(new Big(o.preDrPrice))).toFixed(2).toString();
                                    var todayBuyPl = new Big(new Big(o.realBuyAmount).times(new Big(o.assetPrice))).minus(new Big(o.realBuyBalance).div(new Big(HKStockExchangeRateList[o.wtAccountType].sellRate))).toFixed(2).toString();
                                    var todaySellPl = new Big(o.realSellBalance).div(new Big(HKStockExchangeRateList[o.wtAccountType].buyRate)).minus(new Big(new Big(o.realSellAmount).times(new Big(o.preDrPrice)))).toFixed(2).toString();
                                    o.todayPlHKD = new Big(todayBuyPl).plus(new Big(todaySellPl)).plus(new Big(todayHoldPl)).toFixed(2).toString();
                                    o.todayPl = new Big(o.todayPlHKD).times(HKStockExchangeRateList[o.wtAccountType].middleRate).toFixed(2).toString();
                                    o.todayPlEX = `
                                        当日参考盈亏 = (昨日持有到现在的股票盈亏+今日新买入的股票到现在的盈亏+今日卖出的股票到卖出时点的盈亏) * 港币兑人民币汇率 <br/>
                                        昨日持有到现在的股票盈亏: (持有股票-新买入的股票数)*(最新价-前收盘价) : (${o.chiCang} - ${o.realBuyAmount}) * (${o.assetPrice} - ${o.preDrPrice}) = ${todayHoldPl}<br/>
                                        今日新买入的股票到现在的盈亏: 今日买入的股票数量 * 市值价 - 买入金额 / 卖出汇率: ${o.realBuyAmount} * ${o.assetPrice} - ${o.realBuyBalance} / ${rateItem.sellRate} = ${todayBuyPl}<br/>
                                        今日卖出的股票到卖出时点的盈亏: 今日卖出金额 / 买入汇率 - (卖出数量 * 前收盘价)): ${o.realSellBalance} / ${rateItem.buyRate} - ${o.realSellAmount} * ${ o.preDrPrice } = ${todaySellPl}<br/>
                                        当日参考盈亏 = (${todayHoldPl} + ${todayBuyPl} + ${todaySellPl} ) * ${rateItem.middleRate} = ${o.todayPl}
                                    `
                                }
                                catch(e){
                                    o.todayPlHKD = '--';
                                    o.todayPl = '--';
                                }
                            } 
                            
                        } 
                    }
                    else if (!!o.code && !!o.wtAccountType && !!o.account && o.code == code){
                        // console.log('aaaa23333INNormal', o.wtAccountType, o.code, code)
                        // if(!!o.code && !!o.wtAccountType && !!o.account && o.code == code && o.wtAccountType == that.chiCangHqDaiCha[i].split('|')[1]){
                        // 特定业务 或 市价不变 不重新计算
                        if(!isComputeCostPrice(o) || parseFloat(newPrice) == parseFloat(o.shiJia)){
                            return;
                        }
                        // 新市值价 = 原市值价 - 原最新价 + 新最新价
                        var newAssetPriceEX = new Big(o.assetPrice).minus(new Big(o.shiJia)).plus(newPrice).toFixed(4).toString();
                        o.assetPriceEX = `
                            新市值价 = 原市值价 - 原最新价 + 新最新价<br />
                            新市值价 = ${o.assetPrice} - ${o.shiJia} + ${newPrice} = ${newAssetPriceEX}
                        `
                        o.assetPrice = newAssetPriceEX

                        o.shiJia = newPrice;
                        o.shiJiaEX = `最新价 =  ${newPrice}`

                        
                        // 市值 = 市值价（含利息）* 持仓
                        var marketValue = new Big(o.assetPrice).times(new Big(o.chiCang)).toFixed(2).toString();
                        // 沪B转H市值 = 市值价（含利息）* 持仓 * 汇率
                        if(accountMap.accountTypeMap['1'].indexOf(o.wtAccountType) > -1 && o.stockCodeType === 'h'){                                                             
                            o.shiZhi = new Big(marketValue).times(new Big(exchangeRateHKDtoUSD)).toFixed(2).toString();
                            o.shiZhiEX = `
                                沪B转H市值 = 市值价 * 持仓 * 汇率<br />
                                市值 = ${marketValue} * ${o.chiCang} * ${exchangeRateHKDtoUSD} = ${o.shiZhi}
                            `
                        }
                        else{
                            o.shiZhi = marketValue;
                            o.shiZhiEX = `
                                市值 = 市值价 * 持仓<br />
                                市值 = ${marketValue} * ${o.chiCang} = ${o.shiZhi}
                            `
                        }
                        
                        if(parseFloat(o.chengBen) > 0){
                            o.yingKuiLv = new Big(o.assetPrice).minus(new Big(o.chengBen)).times(100).div(new Big(o.chengBen)).toFixed(2).toString();
                            o.yingKuiLvEX = `
                                盈亏率 = (新市值价 - 成本价) / 成本价 * 100<br />
                                盈亏率 = (${o.assetPrice} - ${o.chengBen}) / ${o.chengBen} * 100 = ${o.yingKuiLv}%
                            `
                        }
                        else{
                            o.yingKuiLv = '0.00';
                            o.yingKuiLvEX = ` 成本价小于等于0，盈亏率显示0.00`
                        }
                        try{
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
                                        佣金最终计算结果为：${fare0}<br />
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
                                        印花税最终计算结果为：${fare1}<br />
                                    `
                                    // H股全流通、B转H印花税向上取整
                                    if(o.wtAccountType === 'R' || o.stockCodeType === 'h'){
                                        fare1 = Math.ceil(fare1);
                                        fare1EX += `
                                            因为是属于是H股全流通、B转H，印花税向上取整 Math.ceil(fare1) ，最终计算结果为${fare1}<br />
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
                                        过户费最终计算结果为：${fare2}<br />
                                    `

                                    co.fare3 = new Big(totalFare.fare3).times(new Big(marketValue)).plus(new Big(totalFare.fare3_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                                    fare3 = new Big(co.fare3).gt(new Big(totalFare.min_fare3)) ? co.fare3 : totalFare.min_fare3;
                                    if(totalFare.max_fare3 > 0){
                                        fare3 = new Big(fare3).lt(new Big(totalFare.max_fare3)) ? fare3 : totalFare.max_fare3;
                                    }                           
                                    var fare3EX = `
                                        fare3:委托费计算过程, fare3 * 市值 + fare3_par * 持仓 * 每手价值<br />
                                        ${totalFare.fare3} * ${marketValue} + ${totalFare.fare3_par} * ${o.chiCang} * ${o.parValue} = ${co.fare3}<br />
                                        然后这个值和委托费下限min_fare3: ${totalFare.min_fare3}比较，谁大取值谁，再和委托费上限 max_fare3 (如果大于0): ${totalFare.max_fare3}比较，谁小取值谁<br />
                                        委托费最终计算结果为：${fare3}<br />
                                    `                                      
                                    co.farex = new Big(totalFare.farex).times(new Big(marketValue)).plus(new Big(totalFare.farex_par).times(new Big(o.chiCang)).times(new Big(o.parValue))).toFixed(2).toString();
                                    farex = new Big(co.farex).gt(new Big(totalFare.min_farex)) ? co.farex : totalFare.min_farex;
                                    if(totalFare.max_farex > 0){
                                        farex = new Big(farex).lt(new Big(totalFare.max_farex)) ? farex : totalFare.max_farex;
                                    }   
                                    var farexEX = `
                                        farex:其他费计算过程, farex * 市值 + farex_par * 持仓 * 每手价值<br />
                                        ${totalFare.farex} * ${marketValue} + ${totalFare.farex_par} * ${o.chiCang} * ${o.parValue} = ${co.farex}<br />
                                        然后这个值和其他费下限min_farex: ${totalFare.min_farex}比较，谁大取值谁，再和其他费上限 max_farex (如果大于0): ${totalFare.max_farex}比较，谁小取值谁<br />
                                        其他费最终计算结果为：${farex}<br />
                                    `
                                    fare = new Big(fare0).plus(new Big(fare1)).plus(new Big(fare2)).plus(new Big(fare3)).plus(new Big(farex)).toFixed(2).toString();
                                    var fareEX = `
                                        预估卖出费用 = 佣金 + 印花税 + 过户费 + 委托费 + 其他费<br />
                                        = (${fare0} + ${fare1} + ${fare2} + ${fare3} + ${farex}) = ${fare}<br /> 
                                    `
                                    // 沪B转H
                                    if(accountMap.accountTypeMap['1'].indexOf(o.wtAccountType) > -1 && o.stockCodeType === 'h'){
                                        fare = new Big(fare).times(new Big(exchangeRateHKDtoUSD)).toFixed(2).toString();
                                        fareEX = `
                                            预估卖出费用 = (佣金 + 印花税 + 过户费 + 委托费 + 其他费) * 港股转美元汇率<br />
                                            = (${fare0} + ${fare1} + ${fare2} + ${fare3} + ${farex}) * ${exchangeRateHKDtoUSD} = ${fare}<br /> 
                                        `
                                    }
                                    fareText = `${fare0EX}${fare1EX}${fare2EX}${fare3EX}${farexEX}${fareEX}`
                                }
                            }
                            o.yingKui = new Big(o.shiZhi).minus(new Big(o.costBalance)).minus(new Big(fare)).toFixed(2).toString();
                            o.yingKuiEX = `
                                盈亏 = 市值 - 成本价 - 预估卖出费用<br />
                                盈亏 = ${o.shiZhi} - ${o.costBalance} - ${fare} = ${o.yingKui} <br />
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
                            finally{
                                if(!o.preDrPrice || isNaN(o.preDrPrice) || !parseFloat(o.preDrPrice)){
                                    return;
                                }
                                // 沪B转H
                                if(accountMap.accountTypeMap['1'].indexOf(o.wtAccountType) > -1 && o.stockCodeType === 'h'){ 
                                    try{
                                        var todayBuyPl = new Big(new Big(o.realBuyAmount).times(new Big(o.assetPrice))).minus(new Big(o.realBuyBalance).div(new Big(exchangeRateHKDtoUSD))).toFixed(2).toString();
                                        var todaySellPl = new Big(o.realSellBalance).div(new Big(exchangeRateHKDtoUSD)).minus(new Big(new Big(o.realSellAmount).times(new Big(o.preDrPrice)))).toFixed(2).toString();
                                        var todayHoldPl = new Big(o.chiCang).minus(new Big(o.realBuyAmount)).times(new Big(o.assetPrice).minus(new Big(o.preDrPrice))).toFixed(2).toString();
                                        o.todayPl = new Big(todayBuyPl).plus(new Big(todaySellPl)).plus(new Big(todayHoldPl)).toFixed(2).toString();
                                        o.todayPl = new Big(o.todayPl).times(exchangeRateHKDtoUSD).toFixed(2).toString();
                                        o.todayPlEX = `
                                            沪B转H当日参考盈亏 = (昨日持有到现在的股票盈亏+今日新买入的股票到现在的盈亏+今日卖出的股票到卖出时点的盈亏) * 港币兑美元汇率 <br/>
                                            昨日持有到现在的股票盈亏: (持有股票-新买入的股票数)*(最新价-前收盘价) : (${o.chiCang} - ${o.realBuyAmount}) * (${o.assetPrice} - ${o.preDrPrice}) = ${todayHoldPl}<br/>
                                            今日新买入的股票到现在的盈亏: 今日买入的股票数量 * 市值价 - 买入金额 / 卖出汇率: ${o.realBuyAmount} * ${o.assetPrice} - ${o.realBuyBalance} / ${rateItem.sellRate} = ${todayBuyPl}<br/>
                                            今日卖出的股票到卖出时点的盈亏: 今日卖出金额 / 买入汇率 - (卖出数量 * 前收盘价)): ${o.realSellBalance} / ${rateItem.buyRate} - ${o.realSellAmount} * ${ o.preDrPrice } = ${todaySellPl}<br/>
                                            当日参考盈亏 = (${todayHoldPl} + ${todayBuyPl} + ${todaySellPl} ) * ${exchangeRateHKDtoUSD} = ${o.todayPl}
                                        `
                                    }
                                    catch(e){
                                        o.todayPl = '--';
                                    }
                                }
                                else{ 
                                    try{
                                        var todayBuyPl = new Big(o.realBuyAmount).times(new Big(o.assetPrice)).minus(new Big(o.realBuyBalance)).toFixed(2).toString();
                                        var todaySellPl = new Big(o.realSellBalance).minus(new Big(o.realSellAmount).times(new Big(o.preDrPrice))).toFixed(2).toString();
                                        var todayHoldPl = new Big(o.chiCang).minus(new Big(o.realBuyAmount)).times(new Big(o.assetPrice).minus(new Big(o.preDrPrice))).toFixed(2).toString();
                                        o.todayPl = new Big(todayBuyPl).plus(new Big(todaySellPl)).plus(new Big(todayHoldPl)).toFixed(2).toString();
                                        o.todayPlEX = `
                                            当日参考盈亏 = 昨日持有到现在的股票盈亏+今日新买入的股票到现在的盈亏+今日卖出的股票到卖出时点的盈亏<br/>
                                            昨日持有到现在的股票盈亏: (持有股票-新买入的股票数)*(最新价-前收盘价) : (${o.chiCang} - ${o.realBuyAmount}) * (${o.assetPrice} - ${o.preDrPrice}) = ${todayHoldPl}<br/>
                                            今日新买入的股票到现在的盈亏: 今日买入的股票数量 *（最新价 - 今日买入的股票均价）: ${o.realBuyAmount} * (${o.assetPrice} - ${o.realBuyBalance}) = ${todayBuyPl}<br/>
                                            今日卖出的股票到卖出时点的盈亏: 今日卖出金额 - (今日卖出股票均价 * 前收盘价)): ${o.realSellBalance} - ${o.realSellAmount} * ${o.preDrPrice} = ${todaySellPl}<br/>
                                            当日参考盈亏 = ${todayHoldPl} + ${todayBuyPl} + ${todaySellPl} = ${o.todayPl}
                                        `
                                    }
                                    catch(e){
                                        o.todayPl = '--';
                                    }
                                }
                            } 
                        }   
                    }     
                });
            }
            catch(e){
                console.error(e);
            }
        }
    }

    return getTodayPl(gridData, exchangeRateHKDtoUSD, HKStockExchangeRateList)
}

export function checkMarketAva (markettype,marketcode) {
    var market_code_map = {
        'SHACCOUNT':'|4352|4367|4353|4356|4365|4355|4359|4361|4360|4364|4354|',
        'SZACCOUNT':'|4608|4609|4611|4617|4614|4612|4616|4618|4619|4610|4620|4613|4623|',
        'SBACCOUNT':'|5120|5121|5135|',
        'SHBACCOUNT':'',
        'SZBACCOUNT':'',
        'SBBACCOUNT':'',
        'HKACCOUNT':'',
        'HKSZACCOUNT':''
    }
    var result = true;
    // 对返回的不足4位市场代码过滤
    if(marketcode && marketcode.length<4) {
        result = false;
    }
    // 目前仅沪深有重复代码，仅作沪深市场的校验
    if(!!marketcode && !!markettype && (markettype.toUpperCase()=='SHACCOUNT' || markettype.toUpperCase()=='SZACCOUNT')) {
        var all_code = market_code_map[markettype.toUpperCase()];
        if(all_code.indexOf('|'+marketcode+'|')>-1) {
            result = true;
        }else{
            result = false;
        }
    }
    return result;
}
