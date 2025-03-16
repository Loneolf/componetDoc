import * as accountMap from './accontMap.js'

export const calculateOData = (gridData, HKStockExchangeRateList, exchangeRateHKDtoUSD, fareMap) => {
    let isNoFareClient = false
    console.log("aaaa23333", JSON.parse(JSON.stringify(gridData)), HKStockExchangeRateList, exchangeRateHKDtoUSD, fareMap)
    try{
        gridData.forEach((o)=>{
            let co = {}
            var fare = '0', fareText = '';

            // 港股通
            if(accountMap.accountTypeMap['0_HK'].includes(o.wtAccountType)){
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
                            var totalFare = {};
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
                        计算盈亏与接口返回盈亏是否相等： 接口返回盈亏：${o.yingKui} 计算盈亏：${co.yingKui} 结论：${o.yingKui == co.yingKui? '相等' : '不相等'}<br />
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
                if(accountMap.accountTypeMap['1'].indexOf(o.wtAccountType) > -1 && o.stockCodeType === 'h'){                                                             
                    co.shiZhi = new Big(marketValue).times(new Big(exchangeRateHKDtoUSD)).toFixed(2).toString();
                    o.shiZhiEX = `
                        沪B转H市值 = 市值价 * 持仓 * 汇率<br />
                        市值 = ${marketValue} * ${o.chiCang} * ${exchangeRateHKDtoUSD} = ${o.shiZhi} <br />
                        计算市值与接口返回市值是否相等： 接口返回市值：${o.shiZhi} 计算市值：${co.shiZhi} 结论：${o.shiZhi == co.shiZhi ? '相等' : '不相等'}
                    `
                }
                else{
                    co.shiZhi = marketValue;
                    o.shiZhiEX = `
                        市值 = 市值价 * 持仓<br />
                        市值 = ${marketValue} * ${o.chiCang} = ${co.shiZhi} <br />
                        计算市值与接口返回市值是否相等： 接口返回市值：${o.shiZhi} 计算市值：${marketValue} 结论：${o.shiZhi == marketValue ? '相等' : '不相等'}
                    `
                }
                
                if(parseFloat(o.chengBen) > 0){
                    co.yingKuiLv = new Big(o.assetPrice).minus(new Big(o.chengBen)).times(100).div(new Big(o.chengBen)).toFixed(2).toString();
                    o.yingKuiLvEX = `
                        盈亏率 = (市值价 - 成本价) / 成本价 * 100<br />
                        盈亏率 = (${o.assetPrice} - ${o.chengBen}) / ${o.chengBen} * 100 = ${co.yingKuiLv}% <br />
                        计算盈亏率与接口返回盈亏率是否相等： 接口返回盈亏率：${o.yingKuiLv}% 计算盈亏率：${co.yingKuiLv}% 结论：${o.yingKuiLv == co.yingKuiLv? '相等' : '不相等'}
                    `
                } else{
                    co.yingKuiLv = '0.00';
                    o.yingKuiLvEX = ` 成本价小于等于0，盈亏率显示0.00 <br />
                        计算盈亏率与接口返回盈亏率是否相等： 接口返回盈亏率：${o.yingKuiLv}% 计算盈亏率：${'0.00'}% 结论：${o.yingKuiLv == '0.00'? '相等' : '不相等'}
                    `
                }
                try{
                    console.log('aaaaaaincalculate', o.name, !isNoFareClient, !!o.wtAccountType, !!fareMap[o.wtAccountType], !!fareMap[o.wtAccountType][o.stockCodeType])
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
                    co.yingKui = new Big(co.shiZhi).minus(new Big(o.costBalance)).minus(new Big(fare)).toFixed(2).toString();
                    o.yingKuiEX = `
                        盈亏 = 市值 - 成本价 - 预估卖出费用<br />
                        盈亏 = ${co.shiZhi} - ${o.costBalance} - ${fare} = ${co.yingKui} <br />
                        计算盈亏与接口返回盈亏是否相等： 接口返回盈亏：${o.yingKui} 计算盈亏：${co.yingKui} 结论：${o.yingKui == co.yingKui? '相等' : '不相等'}<br />
                        预估卖出费用计算过程如下：<br />
                        ${fare0EX}${fare1EX}${fare2EX}${fare3EX}${farexEX}${fareEX}
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
        });
    }
    catch(e){
        console.error(e);
    }
    return gridData
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