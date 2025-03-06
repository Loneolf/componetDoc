import * as dealUtil from './dealUtil.js'
import * as accountMap from './accontMap.js'
import { hsExchangeTypeMap } from './accontMap.js'


export function turn117ToObj(data, exchangeRateHKDtoUSD) {
    let _data = JSON.parse(JSON.stringify(data))

    let INDEX = {}
    let arr = []

    if (!data.GRID0.length) {
        return { INDEX, data: {} }
    }
    INDEX.STOCKCODEINDEX = data.STOCKCODEINDEX;
    INDEX.YKLINDEX = data.YKLINDEX;
    INDEX.DATEFORMINDEX = data.DATEFORMINDEX;
    INDEX.ZZPINDEX = data.ZZPINDEX;
    INDEX.STOCKNAMEINDEX = data.STOCKNAMEINDEX;
    INDEX.STOCKNAMELONGIDXINDEX = data.STOCKNAMELONGIDXINDEX;
    INDEX.STOCKCODE_TYPEINDEX = data.STOCKCODE_TYPEINDEX;
    INDEX.WTACCOUNTTYPEINDEX = data.WTACCOUNTTYPEINDEX;
    INDEX.WTACCOUNTTYPENAMEINDEX = data.WTACCOUNTTYPENAMEINDEX;
    INDEX.STOCKNUMINDEX = data.STOCKNUMINDEX;
    INDEX.KYINDEX = data.KYINDEX;
    INDEX.KEEPPRICEINDEX = data.KEEPPRICEINDEX;
    INDEX.LASTPRICEINDEX = data.LASTPRICEINDEX;
    INDEX.STOCKVALUEINDEX = data.STOCKVALUEINDEX;
    INDEX.YKINDEX = data.YKINDEX;
    INDEX.FROZENINDEX = data.FROZENINDEX;
    INDEX.DELISTFLAGNAMEINDEX = data.DELISTFLAGNAMEINDEX;
    INDEX.ACCOUNTINDEX = data.ACCOUNTINDEX;
    INDEX.FUNDACCOUNTINDEX = data.FUNDACCOUNTINDEX;
    INDEX.YKWITHOUTFAREINDEX = '16';
    INDEX.STBLAYERFLAGINDEX = data.STBLAYERFLAGINDEX;
    INDEX.ASSETPRICEINDEX = data.ASSETPRICEINDEX;
    INDEX.SUBSTOCKTYPEINDEX = data.SUBSTOCKTYPEINDEX;
    INDEX.COSTBALANCEINDEX = data.COSTBALANCEINDEX;
    INDEX.PARVALUEINDEX = data.PARVALUEINDEX;
    INDEX.PREDRPRICEINDEX = data.PREDRPRICEINDEX;
    data.GRID0 && data.GRID0.shift();
    

    data.GRID0.forEach((item, index) => {
       let itemArr = item.split('|') 
       let chiCangItem = {}
       chiCangItem.code=itemArr[data.STOCKINDEX || data.STOCKCODEINDEX];
       chiCangItem.yingKui=itemArr[data.YKINDEX];
       chiCangItem.yingKuiLv= itemArr[data.YKLINDEX];
       chiCangItem.chiCang= itemArr[data.STOCKNUMINDEX];
       chiCangItem.keYong=itemArr[data.KYINDEX];
       chiCangItem.chengBen=itemArr[data.KEEPPRICEINDEX];
       chiCangItem.shiJia=itemArr[data.LASTPRICEINDEX];
       chiCangItem.shiZhi=itemArr[data.STOCKVALUEINDEX];
       chiCangItem.wtAccountType = itemArr[data.WTACCOUNTTYPEINDEX];
       chiCangItem.stbLayerFlag = itemArr[data.STBLAYERFLAGINDEX];
       chiCangItem.stockName = itemArr[data.STOCKNAMEINDEX];
       if(chiCangItem.code == '888880' || chiCangItem.code == '131990'){
           chiCangItem.stockName = '国债逆回购标准券';
       }
       chiCangItem.stockNameLongId = itemArr[data.STOCKNAMELONGIDXINDEX];

       if(chiCangItem.wtAccountType == 'SBACCOUNT' && chiCangItem.stbLayerFlag == '3'){
           chiCangItem.wtAccountTypeName = '北京A';
       }
       else{
           chiCangItem.wtAccountTypeName = itemArr[data.WTACCOUNTTYPENAMEINDEX];
       }

       chiCangItem.frozen = itemArr[data.FROZENINDEX];
       chiCangItem.delistFlagName = itemArr[data.DELISTFLAGNAMEINDEX];
       chiCangItem.account = itemArr[data.ACCOUNTINDEX];
       chiCangItem.fundAccount = itemArr[data.FUNDACCOUNTINDEX];
       chiCangItem.yingKuiWithoutFare = itemArr[16];
       
       chiCangItem.stockCodeType = itemArr[data.STOCKCODE_TYPEINDEX];
       chiCangItem.assetPrice = itemArr[data.ASSETPRICEINDEX];
       chiCangItem.subStockType = itemArr[data.SUBSTOCKTYPEINDEX];
       chiCangItem.costBalance = itemArr[data.COSTBALANCEINDEX];

       chiCangItem.realBuyBalance = itemArr[data.REALBUYBALANCEINDEX];
       chiCangItem.realSellBalance = itemArr[data.REALSELLBALANCEINDEX];
       chiCangItem.realBuyAmount = itemArr[data.REALBUYAMOUNTINDEX];
       chiCangItem.realSellAmount = itemArr[data.REALSELLAMOUNTINDEX];
       chiCangItem.parValue = itemArr[data.PARVALUEINDEX];
       chiCangItem.preDrPrice = itemArr[data.PREDRPRICEINDEX];

       let stockname_long_temp = chiCangItem.stockNameLongId;
       let stockname_temp = chiCangItem.stockName;
       if(stockname_long_temp && stockname_long_temp.replace(/\s+/g,"").length>0) {
           item = item.replace('|'+stockname_temp+'|','|'+stockname_long_temp+'|');
           data.GRID0[index] = item;
           chiCangItem.name = geshiValue(stockname_long_temp,data.STOCKNAMELONGIDXINDEX, undefined, INDEX);
       } else {
           chiCangItem.name = geshiValue(stockname_temp,data.STOCKNAMEINDEX, undefined, INDEX);
       };

       chiCangItem.ratio = chiCangItem.ratio || '--';

       chiCangItem.oWTINFO = {
           ACCOUNTINDEX: chiCangItem.account,
           WTACCOUNTTYPEINDEX: chiCangItem.wtAccountType,
           STOCKCODE_TYPEINDEX: chiCangItem.stockCodeType,
           STOCKINDEX: chiCangItem.code,
           STOCKNAMEINDEX: chiCangItem.stockName,
           shiZhiIndex: chiCangItem.shiZhi,
           yingkuiIndex: chiCangItem.yingKui ,
           chengbenjiaIndex: chiCangItem.chengBen,
           chicangNumIndex: chiCangItem.chiCang
       };
       chiCangItem.isUplistShow = chiCangItem.isUplistShow || false;
       chiCangItem.newMarketNo = chiCangItem.newMarketNo;
       chiCangItem.stockProCode = chiCangItem.stockProCode;

       chiCangItem.domKey = chiCangItem.code + '|' + chiCangItem.wtAccountType + '|' + chiCangItem.account;
       chiCangItem.todayPl = chiCangItem.todayPl || '--';                

       chiCangItem.isActive = true;
       arr.push(chiCangItem);
    })
    arr = getTodayPl(arr, exchangeRateHKDtoUSD)
    return { INDEX, data: arr, originData: _data}

}

// 获取港币转人民币汇率
export function getHKStockExchangeRate(data) {
    let HKStockExchangeRateList = {}
    if (data.ERRORNO < 0 || !data.GRID0 || data.GRID0.length < 2) {
        isExchangeRateError = true;
        HKStockExchangeRateList['HKACCOUNT'] = {};
        HKStockExchangeRateList['HKACCOUNT'].buyRate = '--';
        HKStockExchangeRateList['HKACCOUNT'].sellRate = '--';
        HKStockExchangeRateList['HKACCOUNT'].middleRate = '--';
        HKStockExchangeRateList['HKSZACCOUNT'] = {};
        HKStockExchangeRateList['HKSZACCOUNT'].buyRate = '--';
        HKStockExchangeRateList['HKSZACCOUNT'].sellRate = '--';
        HKStockExchangeRateList['HKSZACCOUNT'].middleRate = '--';
        alert(data.ERRORMESSAGE);
        return HKStockExchangeRateList
    }
    data.GRID0.shift();
    data.GRID0.forEach((o)=>{
        var exchangeRateInfo = o.split('|');
        var exchangeType = exchangeRateInfo[data.WTACCOUNTTYPEINDEX];
        if(!HKStockExchangeRateList[exchangeType]){
            HKStockExchangeRateList[exchangeType] = {};
        }
        HKStockExchangeRateList[exchangeType].buyRate = new Big(exchangeRateInfo[data.BUYRATEINDEX]).toFixed(4).toString();
        HKStockExchangeRateList[exchangeType].sellRate = new Big(exchangeRateInfo[data.SELLRATEINDEX]).toFixed(4).toString();
        HKStockExchangeRateList[exchangeType].middleRate = new Big(HKStockExchangeRateList[exchangeType].buyRate).plus(new Big(HKStockExchangeRateList[exchangeType].sellRate)).div(2).toFixed(4).toString();
    });
}

// 获取当日盈亏
export function getTodayPl(chicangList, exchangeRateHKDtoUSD) {
    const time = dealUtil.formatLocalTime()

        console.log('aaaa3333isTradeDateWithCache', time)
        // 交易日 08:00:00 - 09:10:00 不计算当日盈亏
        if(time >= '080000' && time < '091000'){
            chicangList.forEach((o)=>{
                // 港股通
                if(accountMap.accountTypeMap['0_HK'].includes(o.wtAccountType)){
                    o.oWTINFO.todayPlHKD = o.todayPlHKD;
                } 
                o.oWTINFO.todayPl = o.todayPl;
            });
        }
        else{
            chicangList.forEach((o)=>{
                getTodayPlItem(o, exchangeRateHKDtoUSD);
            });
        }

    return chicangList
}

function getTodayPlItem(chiCangItem, exchangeRateHKDtoUSD) {
    if(!chiCangItem.assetPrice || isNaN(chiCangItem.assetPrice) || !parseFloat(chiCangItem.assetPrice) || !chiCangItem.preDrPrice || isNaN(chiCangItem.preDrPrice) || !parseFloat(chiCangItem.preDrPrice) || !notComputeTodayPl(chiCangItem)){
        chiCangItem.todayPl = '--';
        chiCangItem.oWTINFO.todayPl = chiCangItem.todayPl;
        return;
    }
    // 沪B转H
    if(accountMap.accountTypeMap['1'].indexOf(chiCangItem.wtAccountType) > -1 && chiCangItem.stockCodeType === 'h'){ 
        try{
            var todayBuyPl = new Big(new Big(chiCangItem.realBuyAmount).times(new Big(chiCangItem.assetPrice))).minus(new Big(chiCangItem.realBuyBalance).div(new Big(exchangeRateHKDtoUSD))).toFixed(2).toString();
            var todaySellPl = new Big(chiCangItem.realSellBalance).div(new Big(exchangeRateHKDtoUSD)).minus(new Big(new Big(chiCangItem.realSellAmount).times(new Big(chiCangItem.preDrPrice)))).toFixed(2).toString();
            var todayHoldPl = new Big(chiCangItem.chiCang).minus(new Big(chiCangItem.realBuyAmount)).times(new Big(chiCangItem.assetPrice).minus(new Big(chiCangItem.preDrPrice))).toFixed(2).toString();
            chiCangItem.todayPl = new Big(todayBuyPl).plus(new Big(todaySellPl)).plus(new Big(todayHoldPl)).toFixed(2).toString();
            chiCangItem.todayPl = new Big(chiCangItem.todayPl).times(exchangeRateHKDtoUSD).toFixed(2).toString();
        }
        catch(e){
            chiCangItem.todayPl = '--';
        }
        finally{
            chiCangItem.oWTINFO.todayPl = chiCangItem.todayPl;
        } 
    }
    else{
        try{
            var todayHoldPl = new Big(chiCangItem.chiCang).minus(new Big(chiCangItem.realBuyAmount)).times(new Big(chiCangItem.assetPrice).minus(new Big(chiCangItem.preDrPrice))).toFixed(2).toString();
            var todayBuyPl = new Big(chiCangItem.realBuyAmount).times(new Big(chiCangItem.assetPrice)).minus(new Big(chiCangItem.realBuyBalance)).toFixed(2).toString();
            var todaySellPl = new Big(chiCangItem.realSellBalance).minus(new Big(chiCangItem.realSellAmount).times(new Big(chiCangItem.preDrPrice))).toFixed(2).toString();
            chiCangItem.todayPl = new Big(todayBuyPl).plus(new Big(todaySellPl)).plus(new Big(todayHoldPl)).toFixed(2).toString();
            chiCangItem.todayPlEX = `
                当日参考盈亏 = 昨日持有到现在的股票盈亏+今日新买入的股票到现在的盈亏+今日卖出的股票到卖出时点的盈亏<br/>
                昨日持有到现在的股票盈亏: (持有股票-新买入的股票数)*(最新价-前收盘价) : (${chiCangItem.chiCang} - ${chiCangItem.realBuyAmount}) * (${chiCangItem.assetPrice} - ${chiCangItem.preDrPrice})<br/>
                今日新买入的股票到现在的盈亏: 今日买入的股票数量 *（最新价 - 今日买入的股票均价）: ${chiCangItem.realBuyAmount} * (${chiCangItem.assetPrice} - ${chiCangItem.realBuyBalance})<br/>
                今日卖出的股票到卖出时点的盈亏: 今日卖出金额 - (今日卖出股票均价 * 前收盘价)): ${chiCangItem.realSellBalance} - ${chiCangItem.realSellAmount} * ${chiCangItem.preDrPrice}<br/>
            `
        }
        catch(e){
            console.log(e)
            chiCangItem.todayPl = '--';
        }
        finally{
            chiCangItem.oWTINFO.todayPl = chiCangItem.todayPl;
        } 
    }
} 


// 不进行计算当日盈亏
export function notComputeTodayPl(obj) {
    // 标准券不记盈亏
    if(obj.code == '888886' || obj.code == '200000'|| obj.code == '131990' || obj.code == '131991' || obj.code == '888880'){
        return false;
    }
    // 深圳的特殊业务, 深圳-基金认购'K'-159代码段不计算盈亏
    if(obj.wtAccountType == 'SZACCOUNT' && (obj.stockCodeType == '8' || (obj.stockCodeType == 'K' && obj.code.startsWith('159')))){
        return false;
    }
    // 上海-证券类别为M、K、S不计算盈亏
    if(obj.wtAccountType == 'SHACCOUNT' && (obj.stockCodeType == 'M' || obj.stockCodeType == 'K' || obj.stockCodeType == 'S' || (obj.stockCodeType == 'A' && obj.code.startsWith('519')))){
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

export function geshiValue(name, index, noUnit, INDEXO){
    if(!name || name === '--'){
        return '--';
    }
    if(name.indexOf('-') > -1 || name.indexOf('+') > -1){
        return name.substr(0, 1) + dealUtil.formatZZDate(name.substr(1, name.length),index, INDEXO.ZZPINDEX, INDEXO.DATEFORMINDEX, noUnit);
    }
    return dealUtil.formatZZDate(name, index, INDEXO.ZZPINDEX, INDEXO.DATEFORMINDEX, noUnit);
}