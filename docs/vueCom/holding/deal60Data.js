import { accountTypeMap } from './accontMap.js'
import { isComputeCostPrice } from './dealUtil.js'
import { getTodayPl } from './dealMainData.js'
import { calFare } from './calculate.js'

export const deal60Data = (oData, gridData, HKStockExchangeRateList, exchangeRateHKDtoUSD, fareMap) => {
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
                if(accountTypeMap['0_HK'].includes(o.wtAccountType) && ('H' + o.code) == code){
                    o.newMarketNo = newmarket_arr[i];
                    o.stockProCode = stock_pro_arr[i];
                } else if (o.code == code){
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
                    return (accountTypeMap['0_HK'].includes(o.wtAccountType) && ('H' + o.code) == code) || (!!o.code && !!o.wtAccountType && !!o.account && o.code == code)
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
                    //     if(accountTypeMap['1'].indexOf(o.wtAccountType) > -1 || accountTypeMap['2'].indexOf(o.wtAccountType) > -1){
                    //         return;
                    //     }
                    // }
                    // else{
                    //     if(accountTypeMap[that.currAccount].indexOf(o.wtAccountType) == -1){
                    //         return;
                    //     }
                    // } 
                    // 港股通
                    if(accountTypeMap['0_HK'].includes(o.wtAccountType) && ('H' + o.code) == code){
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

                        calYingKuiLv(o, co)
                        
                        try{
                            let cRes = calFare({o, co, fareMap, marketValue, exchangeRateHKDtoUSD, HKStockExchangeRateList, accountTypeMap})
                            
                            o.yingKui = new Big(o.shiZhi).minus(new Big(o.costBalance)).minus(new Big(cRes.fare)).toFixed(2).toString();
                            o.yingKuiEX = `
                                盈亏 = 市值 - 持仓成本 - 预估卖出费用<br />
                                盈亏 = ${o.shiZhi} - ${o.costBalance} - ${cRes.fare} = ${o.yingKui} <br />
                                预估卖出费用计算过程如下：<br />
                                账户类型wtAccountType:${o.wtAccountType}---- 股票类型stockCodeType:${o.stockCodeType}----子股票类型subStockType:${o.subStockType} <br />
                                ${cRes.fareText}
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
                                    盈亏不计算费用 = 市值 - 持仓成本<br />
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
                        if(accountTypeMap['1'].indexOf(o.wtAccountType) > -1 && o.stockCodeType === 'h'){                                                             
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
                        calYingKuiLv(o, co)
                        
                        try{
                            let cRes = calFare({o, co, fareMap, marketValue, exchangeRateHKDtoUSD, HKStockExchangeRateList, accountTypeMap})
                            o.yingKui = new Big(o.shiZhi).minus(new Big(o.costBalance)).minus(new Big(cRes.fare)).toFixed(2).toString();
                            o.yingKuiEX = `
                                盈亏 = 市值 - 成本价 - 预估卖出费用<br />
                                盈亏 = ${o.shiZhi} - ${o.costBalance} - ${cRes.fare} = ${o.yingKui} <br />
                                预估卖出费用计算过程如下：<br />
                                账户类型wtAccountType:${o.wtAccountType}---- 股票类型stockCodeType:${o.stockCodeType}----子股票类型subStockType:${o.subStockType} <br />
                                ${cRes.fareText}
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
                                if(accountTypeMap['1'].indexOf(o.wtAccountType) > -1 && o.stockCodeType === 'h'){ 
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

function calYingKuiLv(o, co) {
    co.oYingKuiLv = o.yingKuiLv
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
    return { o, co }
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
