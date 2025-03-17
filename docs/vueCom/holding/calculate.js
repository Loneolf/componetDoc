import { accountTypeMap } from './accontMap.js'
import { calProcess } from './dealUtil'

export const calculateOData = (gridData, HKStockExchangeRateList, exchangeRateHKDtoUSD, fareMap) => {
    let isNoFareClient = false
    console.log("aaaa23333", JSON.parse(JSON.stringify(gridData)), HKStockExchangeRateList, exchangeRateHKDtoUSD, fareMap)
    try{
        gridData.forEach((o)=>{
            calProcess({o, accountTypeMap, fareMap, HKStockExchangeRateList, exchangeRateHKDtoUSD, isNoFareClient})
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