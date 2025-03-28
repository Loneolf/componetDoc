import { accountTypeMap } from './accontMap.js'
import { isComputeCostPrice } from './dealUtil.js'
import { getTodayPl } from './dealMainData.js'
import { calFare } from './calculate.js'

export const deal60Data = (oData, gridData, HKStockExchangeRateList, exchangeRateHKDtoUSD, fareMap) => {
    if (!oData.NEWMARKETNO || !oData.NEWMARKETNO.length) return;
    // 股票市场列表
    let newmarket_arr = oData.NEWMARKETNO.split('|');
    let stock_pro_arr = oData.STOCKPROP.split('|');
    if(oData.GRID0 && oData.GRID0.length>0){
        // oData.GRID0.shift();
        for(let i=0; i<oData.GRID0.length; i++) {
            let item = oData.GRID0[i].split('|');
            // 更新股票中的股票代码
            let code = item[oData.STOCKCODEINDEX]+'';

            try{
                let newPrice = item[oData.NEWPRICEINDEX];
                // 没有最新市价则不进行计算
                if(!newPrice || isNaN(newPrice) || !parseFloat(newPrice)){
                    continue;
                }
                let itemArr = gridData.filter((o) => {
                    return (accountTypeMap['0_HK'].includes(o.wtAccountType) && ('H' + o.code) == code) || (!!o.code && !!o.wtAccountType && !!o.account && o.code == code)
                })
                itemArr?.forEach((o)=>{
                    o.isUp = true
                    let co = {}
                    // 特定业务 或 市价不变 不重新计算
                    if(!isComputeCostPrice(o) || parseFloat(newPrice) == parseFloat(o.shiJia)){
                        return;
                    }

                    // 新市值价 = 原市值价 - 原最新价 + 新最新价
                    let newAssetPriceEX = new Big(o.assetPrice).minus(new Big(o.shiJia)).plus(newPrice).toFixed(4).toString();
                    o.assetPriceEX = `
                        新市值价 = 原市值价 - 原最新价 + 新最新价<br />
                        新市值价 = ${o.assetPrice} - ${o.shiJia} + ${newPrice} = ${newAssetPriceEX}
                    `
                    o.assetPrice = newAssetPriceEX
                    o.shiJia = newPrice;
                    o.shiJiaEX = `最新价 =  ${newPrice}`
                    // 市值 = 市值价（含利息）* 持仓
                    let marketValue = new Big(o.assetPrice).times(new Big(o.chiCang)).toFixed(2).toString();

                    co.oYingKuiLv = o.yingKuiLv
                    if(parseFloat(o.chengBen) > 0){
                        o.yingKuiLv = new Big(o.assetPrice).minus(new Big(o.chengBen)).times(100).div(new Big(o.chengBen)).toFixed(2).toString();
                        o.yingKuiLvEX = `
                            盈亏率 = (新市值价 - 成本价) / 成本价 * 100<br />
                            盈亏率 = (${o.assetPrice} - ${o.chengBen}) / ${o.chengBen} * 100 = ${o.yingKuiLv}%
                        `
                    } else {
                        o.yingKuiLv = '0.00';
                        o.yingKuiLvEX = ` 成本价小于等于0，盈亏率显示0.00`
                    }

                    let cRes = calFare({o, co, fareMap, marketValue, exchangeRateHKDtoUSD, HKStockExchangeRateList, accountTypeMap})

                    // 港股通
                    if(accountTypeMap['0_HK'].includes(o.wtAccountType)){
                        o.shiZhi = new Big(marketValue).times(new Big(HKStockExchangeRateList[o.wtAccountType].middleRate)).toFixed(2).toString();
                        o.shiZhiEX = `
                            市值 = 市值价 * 持仓 * 港元中间汇率<br />
                            市值 = ${marketValue} * ${o.chiCang} * ${HKStockExchangeRateList[o.wtAccountType].middleRate} = ${o.shiZhi}
                        `
                    // 沪B转H市值 = 市值价（含利息）* 持仓 * 汇率
                    } else if (accountTypeMap['1'].indexOf(o.wtAccountType) > -1 && o.stockCodeType === 'h'){
                        // console.log('aaaa23333INNormal', o.wtAccountType, o.code, code)
                        o.shiZhi = new Big(marketValue).times(new Big(exchangeRateHKDtoUSD)).toFixed(2).toString();
                        o.shiZhiEX = `
                            沪B转H市值 = 市值价 * 持仓 * 汇率<br />
                            市值 = ${marketValue} * ${o.chiCang} * ${exchangeRateHKDtoUSD} = ${o.shiZhi}
                        `
                    } else{
                        o.shiZhi = marketValue;
                        o.shiZhiEX = `
                            市值 = 市值价 * 持仓<br />
                            市值 = ${marketValue} * ${o.chiCang} = ${o.shiZhi}
                        `
                    }
                        
                    try{
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
                                盈亏不计算费用 = 市值 - 成本价<br />
                                盈亏 = ${o.shiZhi} - ${o.costBalance} = ${o.yingKuiWithoutFare}
                            `
                        }
                        catch(e){
                            o.yingKuiWithoutFare = '--'; 
                        } 
                    }   
                })
            }
            catch(e){
                console.error(e);
            }
        }
    }

    return getTodayPl(gridData, exchangeRateHKDtoUSD, HKStockExchangeRateList)
}

export function checkMarketAva (markettype,marketcode) {
    let market_code_map = {
        'SHACCOUNT':'|4352|4367|4353|4356|4365|4355|4359|4361|4360|4364|4354|',
        'SZACCOUNT':'|4608|4609|4611|4617|4614|4612|4616|4618|4619|4610|4620|4613|4623|',
        'SBACCOUNT':'|5120|5121|5135|',
        'SHBACCOUNT':'',
        'SZBACCOUNT':'',
        'SBBACCOUNT':'',
        'HKACCOUNT':'',
        'HKSZACCOUNT':''
    }
    let result = true;
    // 对返回的不足4位市场代码过滤
    if(marketcode && marketcode.length<4) {
        result = false;
    }
    // 目前仅沪深有重复代码，仅作沪深市场的校验
    if(!!marketcode && !!markettype && (markettype.toUpperCase()=='SHACCOUNT' || markettype.toUpperCase()=='SZACCOUNT')) {
        let all_code = market_code_map[markettype.toUpperCase()];
        if(all_code.indexOf('|'+marketcode+'|')>-1) {
            result = true;
        }else{
            result = false;
        }
    }
    return result;
}
