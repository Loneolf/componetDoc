import dealUtil from './dealUtil.js'

export function turn117ToObj(data) {
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

    return { INDEX, data: arr, originData: _data}

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