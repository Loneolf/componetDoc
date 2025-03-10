import { accountTypeMap } from './accontMap'

export function computeAccountData(gridData, oData, oData1, OTCData, OTCStatus){
    // console.log('aaaaacomputerAccountData', gridData, oData, oData1, OTCData, OTCStatus);

    let accountList = []

    oData.GRID2.shift();
    //个人资产
    oData.GRID2.forEach(function (oitem, oindex) {
        console.log('aaa2233oitem', oitem);
        var aIt = oitem.split('|');
        //币种 人民币  美元 港币
        var type = aIt[oData['2_MONEYTYPECODEINDEX']] || aIt[oData['2_MONEYTYPEINDEX']];
        //可取
        var sKq = aIt[oData['2_AVAILABLEINDEX']];
        //可用
        var sKy = aIt[oData['2_USABLEINDEX']];
        var accountItem = {};
        accountItem.kqEX = `取值117接口"GRID2"列表中对应"2_AVAILABLEINDEX"字段值`
        accountItem.kyEX = `取值117接口"GRID2"列表中对应"2_USABLEINDEX"字段值`
        if (type == '0' || type =='RMB' || type=='rmb') {
            accountItem.bztype = '0';
            var rmbHoldingList = gridData.filter((o)=>{
                return accountTypeMap[accountItem.bztype].indexOf(o.wtAccountType) > -1;
            });
            // console.log('aaa2233rembholdinglist', rmbHoldingList);
            try{
                if(OTCStatus == false){
                    accountItem.total = '--';
                }
                else{
                    accountItem.total = new Big(oData.TOTALASSET_RMB).plus(new Big(OTCData || 0)).toFixed(2).toString();
                    accountItem.totalEX = `从116接口获取所有子账户，过滤所有人民币账户资产进行相加  若无子账户 117接口，取值: TOTALASSET_RMB，本次取值: ${oData.rmbEX ? '116子账户累加，具体请看标注': '117接口 TOTALASSET_RMB'}`
                    accountItem.totalFrom = oData.rmbEX
                }
            }
            catch(e){
                accountItem.total = '--';
                console.log(e)
            }
            try{
                // 市值 = 证券市值（沪深京、港股、天天利财） - 天天利财市值
                accountItem.sz = new Big(oData.MKTVAL_RMB).minus(new Big(oData['MKTVAL_ONEDAYBJHG'] || '0')).minus(new Big(oData['MKTVAL_MULTIDAYBJHG'] || '0')).toFixed(2).toString();  
                accountItem.szEX = `117接口 MKTVAL_RMB 字段值 - MKTVAL_ONEDAYBJHG(天天理财)  - MKTVAL_MULTIDAYBJHG`
            }
            catch(e){
                accountItem.sz = '--';
                console.log(e)
            }
            // 人民币持仓为空时展示为--
            if(accountItem.sz == 0 && (!rmbHoldingList || !rmbHoldingList.length)){ 
                accountItem.sz = '--';
            }
            accountItem.kq = sKq;
            accountItem.ky = sKy;
            // 人民币持仓为空时展示为--
            if(oData.TOTALYK_RMB == 0 && (!rmbHoldingList || !rmbHoldingList.length)){ 
                accountItem.yl = '--';
            }
            else{
                var val = '';
                try{
                    // 浮动盈亏 = 沪深京总盈亏（不含港股） - 天天利财盈亏
                    val = new Big(oData.TOTALYK_RMB).minus(new Big(oData['TOTALYK_ONEDAYBJHG'] || '0')).minus(new Big(oData['TOTALYK_MULTIDAYBJHG'] || '0')).toFixed(2).toString();
                }
                catch(e){
                    val = '--';
                    console.log(e)
                }
                accountItem.yl = val;
                accountItem.ylEX = `117接口 TOTALYK_RMB 字段值 - TOTALYK_ONEDAYBJHG(天天理财)  - TOTALYK_MULTIDAYBJHG`
            }
            // console.log('aaaarmbHoldingList', rmbHoldingList);
            // 人民币持仓为空时展示为--
            accountItem.todayPlEX = `所有人民币A股持仓当日盈亏累加之和`
            accountItem.todayPlFrom = '';
            if(!rmbHoldingList || !rmbHoldingList.length){ 
                accountItem.todayPl = '--';
            } else {
                var isTodayPlValid = false;
                var todayPl = '0.00';
                try{
                    rmbHoldingList.forEach(function(o, oi){
                        if(o.todayPl != '--'){
                            isTodayPlValid = true;
                            todayPl = new Big(todayPl).plus(new Big(o.todayPl)).toFixed(2).toString();
                            accountItem.todayPlFrom += `(${o.name}:: ${o.todayPl}) ${rmbHoldingList[oi + 1] ? '+' : ''} `
                        }  
                    });
                    if(!isTodayPlValid){
                        todayPl = '--';
                    }
                    accountItem.todayPl = todayPl;
                }
                catch(e){
                    console.error(e)
                    accountItem.todayPl = '--';
                }
            }
            try{
                accountItem.ratio = new Big(accountItem.sz).div(new Big(accountItem.total)).toFixed(4).toString();
                accountItem.ratioEX = `总市值 / 总资产`
            }
            catch(e){
                accountItem.ratio = '--';
                console.log(e)
            }
            // console.log('aaaaaaccountItem', JSON.parse(JSON.stringify(accountItem)))
            accountList.push(accountItem);
        }
        //美元
        else if (type == '1' || type =='USD' || type=='usd') {
            accountItem.bztype = '1';
            var usdHoldingList = gridData.filter((o)=>{
                return accountTypeMap[accountItem.bztype].indexOf(o.wtAccountType) > -1;
            });
            accountItem.total = oData.TOTALASSET_USD;
            accountItem.totalEX = `从116接口获取所有子账户，过滤所有美元账户资产进行相加  若无子账户 117接口，取值: TOTALASSET_USD，本次取值: ${oData.usdEX ? '116子账户累加，具体请看标注': '117接口 TOTALASSET_USD'}`
            accountItem.totalFrom = oData.usdEX
            try{
                // 美元持仓为空时展示为--
                if(oData.MKTVAL_USD == 0 && (!usdHoldingList || !usdHoldingList.length)){ 
                    accountItem.sz = '--';
                }
                else{
                    accountItem.sz = new Big(oData.MKTVAL_USD).toFixed(2).toString();
                    accountItem.szEX = `117接口 MKTVAL_USD 字段值`
                }  
            }
            catch(e){
                accountItem.sz = '--';
            }
            accountItem.kq = sKq;
            accountItem.ky = sKy;
            try{
                // 美元持仓为空时展示为--
                if(oData.TOTALYK_USD == 0 && (!usdHoldingList || !usdHoldingList.length)){ 
                    accountItem.yl = '--';
                }
                else{
                    var val = oData.TOTALYK_USD;
                    accountItem.yl = new Big(val).toFixed(2).toString();
                    accountItem.ylEX = `117接口 TOTALYK_USD 字段值`
                }                           
            }
            catch(e){
                accountItem.yl = '--';
            }

            // 美元持仓为空时展示为--
            accountItem.todayPlEX = `所有美元持仓当日盈亏累加之和`
            accountItem.todayPlFrom = '';
            if(!usdHoldingList || !usdHoldingList.length){ 
                accountItem.todayPl = '--';
            }
            else{
                var isTodayPlValid = false;
                var todayPl = '0.00';
                try{
                    usdHoldingList.forEach(function(o, oi){
                        if(o.todayPl != '--'){
                            isTodayPlValid = true;
                            todayPl = new Big(todayPl).plus(new Big(o.todayPl)).toFixed(2).toString();
                            accountItem.todayPlFrom += `(${o.name}:: ${o.todayPl}) ${usdHoldingList[oi + 1] ? '+' : ''} `
                        }     
                    });
                    if(!isTodayPlValid){
                        todayPl = '--';
                    }
                    accountItem.todayPl = todayPl;
                }
                catch(e){
                    accountItem.todayPl = '--';
                }
            }
        
            try{
                accountItem.ratio = new Big(accountItem.sz).div(new Big(accountItem.total)).toFixed(4).toString();
                accountItem.ratioEX = `总市值 / 总资产`
            }
            catch(e){
                accountItem.ratio = '--';
            }
            accountList.push(accountItem);
        }
        //港币
        else if (type == '2' || type =='HK' || type=='hk') {
            accountItem.bztype = '2';
            var hkHoldingList = gridData.filter((o)=>{
                return accountTypeMap[accountItem.bztype].indexOf(o.wtAccountType) > -1;
            });
            accountItem.total = oData.TOTALASSET_HK;
            accountItem.totalEX = `从116接口获取所有子账户，过滤所有美元账户资产进行相加  若无子账户 117接口，取值: TOTALASSET_HK，本次取值: ${oData.hkEX ? '116子账户累加，具体请看标注': '117接口 TOTALASSET_HK'}`
            accountItem.totalFrom = oData.hkEX
            try{
                // 港币持仓为空时展示为--
                if(oData.MKTVAL_HK == 0 && (!hkHoldingList || !hkHoldingList.length)){ 
                    accountItem.sz = '--';
                }
                else{
                    accountItem.sz = new Big(oData.MKTVAL_HK).toFixed(2).toString();
                    accountItem.szEX = `117接口 MKTVAL_HK 字段值`
                }   
            }
            catch(e){
                accountItem.sz = '--';
            }
            accountItem.kq = sKq;
            accountItem.ky = sKy;
            try{
                // 港币持仓为空时展示为--
                if(oData.TOTALYK_HK == 0 && (!hkHoldingList || !hkHoldingList.length)){ 
                    accountItem.yl = '--';
                }
                else{
                    var val = oData.TOTALYK_HK;
                    accountItem.yl = new Big(val).toFixed(2).toString();
                    accountItem.ylEX = `117接口 TOTALYK_HK 字段值`
                }  
            }
            catch(e){
                accountItem.yl = '--';
            }

            // 港币持仓为空时展示为--
            accountItem.todayPlEX = `所有港币持仓当日盈亏累加之和`
            accountItem.todayPlFrom = '';
            console.log('aaahkHoldingList', hkHoldingList);
            if(!hkHoldingList || !hkHoldingList.length){ 
                accountItem.todayPl = '--';
            }
            else{
                var isTodayPlValid = false;
                var todayPl = '0.00';
                try{
                    hkHoldingList.forEach(function(o, oi){
                        if(o.todayPl != '--'){
                            isTodayPlValid = true;
                            todayPl = new Big(todayPl).plus(new Big(o.todayPl)).toFixed(2).toString();
                            accountItem.todayPlFrom += `(${o.name}:: ${o.todayPl}) ${hkHoldingList[oi + 1] ? '+' : ''} `
                        }      
                    });
                    if(!isTodayPlValid){
                        todayPl = '--';
                    }
                    accountItem.todayPl = todayPl;
                }
                catch(e){
                    accountItem.todayPl = '--';
                }
            }
            
            try{
                accountItem.ratio = new Big(accountItem.sz).div(new Big(accountItem.total)).toFixed(4).toString();
                accountItem.ratioEX = `总市值 / 总资产`
            }
            catch(e){
                accountItem.ratio = '--';
            }
            accountList.push(accountItem);  
        }  
    })

    if(oData1){
        var accountItem = {};
        accountItem.bztype = '0_HK';
        var rmbHKHoldingList = gridData.filter((o)=>{
            return accountTypeMap[accountItem.bztype].indexOf(o.wtAccountType) > -1;
        });
        console.log('aaarmbHKHoldingList', JSON.parse(JSON.stringify(rmbHKHoldingList)));
        try{
            if(OTCStatus == false){
                accountItem.total = '--';
            }
            else{
                accountItem.total = new Big(oData.TOTALASSET_RMB).plus(new Big(OTCData || 0)).toFixed(2).toString();
                accountItem.totalEX = `取值人民币A股总资产`
            }
        }
        catch(e){
            accountItem.total = '--';
        }
        try{
            // 港股持仓为空时展示为--
            if(oData1.MKTVAL_HK == 0 && (!rmbHKHoldingList || !rmbHKHoldingList.length)){
                accountItem.sz = '--';
            }
            else{
                accountItem.sz = new Big(oData1.MKTVAL_HK).toFixed(2).toString();
                accountItem.szEX = `5106接口 MKTVAL_HK 字段值`
            }
        }
        catch(e){
            accountItem.sz = '--';
        }
        try{
            // 港股持仓为空时展示为--
            if(oData1.MKTVAL_HK == 0 && (!rmbHKHoldingList || !rmbHKHoldingList.length)){
                accountItem.yl = '--';
            }
            else{
                var val = oData1.TOTALYK_HK;
                accountItem.yl =  new Big(val).toFixed(2).toString();
                accountItem.ylEX = `5106接口 TOTALYK_HK 字段值`
            }
        }
        catch(e){
            accountItem.yl = '--';
        }
        try{
            accountItem.kq = new Big(oData1.AVAILABLE).toFixed(2).toString();
            accountItem.kqEX = `5106接口 AVAILABLE 字段值`
        }
        catch(e){
            accountItem.kq = '--';
        }
        try{
            accountItem.ky = new Big(oData1.USABLE).toFixed(2).toString();
            accountItem.kyEX = `5106接口 USABLE 字段值`
        }
        catch(e){
            accountItem.ky = '--';
        }

        // 港股持仓为空时展示为--
        if(!rmbHKHoldingList?.length){ 
            accountItem.todayPl = '--';
        }
        else{
            var isTodayPlValid = false;
            var todayPl = '0.00';
            accountItem.todayPlEX = `所有人民币港股持仓当日盈亏累加之和`
            accountItem.todayPlFrom = '';
            try{
                rmbHKHoldingList.forEach(function(o, oi){
                    // console.log('aaaahk0', JSON.parse(JSON.stringify(o)));
                    if(o.todayPl != '--'){
                        isTodayPlValid = true;
                        todayPl = new Big(todayPl).plus(new Big(o.todayPl)).toFixed(2).toString();
                        accountItem.todayPlFrom += `(${o.name}:: ${o.todayPl}) ${rmbHKHoldingList[oi + 1] ? '+' : ''} `
                    }                             
                });
                if(!isTodayPlValid){
                    todayPl = '--';
                }
                accountItem.todayPl = todayPl;
            }
            catch(e){
                console.error(e)
                accountItem.todayPl = '--';
            }
        }
        console.log('accountItem.todayPl', JSON.parse(JSON.stringify(accountItem)));
        try{
            accountItem.ratio = new Big(accountItem.sz).div(new Big(accountItem.total)).toFixed(4).toString();
            accountItem.ratioEX = `总市值 / 总资产`
        }
        catch(e){
            accountItem.ratio = '--';
        }
        var rmbIndex = accountList.findIndex(function(o){
            return o.bztype == '0';
        });
        accountList.splice(rmbIndex + 1, 0, accountItem);
    }  

    return accountList;
}


export function getAllZongZiChan(data, zhhData) {
    var mzZichanRmb = 0, mzZichanAllRmb;
    var mzZichanUSD = 0, mzZichanAllUSD;
    var mzZichanHK = 0, mzZichanAllHK;
    var rmbEX = '', usdEX = '', hkEX = '';
    var res = { }
    if (data?.GRID2?.length > 1) {
        data.GRID2.shift();
        var mzzhFlag = data.GRID2.some(function (i) {
            i = i.split('|');
            return i[data['2_FUNDACCOUNTTYPEINDEX']] == '1'
        });
        if (!mzzhFlag) return data
        // console.log('zhhData', zhhData);
        if (zhhData?.GRID0?.length > 1) {
            zhhData.GRID0.shift();
            for (var j = 0; j < zhhData.GRID0.length; j++) {
                var itemV = zhhData.GRID0[j].split('|');
                // console.log('itemV', itemV)
                if (itemV[zhhData.FUNDACCOUNTTYPEINDEX] == '2') {
                    if (itemV[zhhData.MONEYTYPEINDEX] == '0') {
                        try {
                            mzZichanRmb = new Big(mzZichanRmb).plus(new Big(Number(itemV[zhhData.ASSETTOTALINDEX]))).toString();
                            mzZichanAllRmb = new Big(data.TOTALASSET_RMB).plus(new Big(mzZichanRmb)).toString();
                            rmbEX += `(账号: ${itemV[zhhData.FUNDACCOUNTINDEX]}_资金:${mzZichanRmb}) ${zhhData.GRID0[j + 1] ? '+' : ''} `
                        } catch (e) {
                            mzZichanAllRmb = data.TOTALASSET_RMB || '--';
                        }
                    } else if (itemV[zhhData.MONEYTYPEINDEX] == '1') {
                        try {
                            mzZichanUSD = new Big(mzZichanUSD).plus(new Big(Number(itemV[zhhData.ASSETTOTALINDEX]))).toString();
                            mzZichanAllUSD = new Big(data.TOTALASSET_USD).plus(new Big(mzZichanUSD)).toString();
                            usdEX += `(账号: ${itemV[zhhData.FUNDACCOUNTINDEX]}_资金:${mzZichanUSD}) ${zhhData.GRID0[j + 1] ? '+' : ''}  `
                        } catch (e) {
                            mzZichanAllUSD = data.TOTALASSET_USD || '--';
                        }
                    } else if (itemV[zhhData.MONEYTYPEINDEX] == '2') {
                        try {
                            mzZichanHK = new Big(mzZichanHK).plus(new Big(Number(itemV[zhhData.ASSETTOTALINDEX]))).toString();
                            mzZichanAllHK = new Big(data.TOTALASSET_USD).plus(new Big(mzZichanHK)).toString();
                            hkEX += `(账号: ${itemV[zhhData.FUNDACCOUNTINDEX]}_资金:${mzZichanHK}) ${zhhData.GRID0[j + 1] ? '+' : ''}  `
                        } catch (e) {
                            mzZichanAllHK = data.TOTALASSET_HK || '--';
                        }
                    } else {
                        mzZichanAllRmb = data.TOTALASSET_RMB || '--';
                        mzZichanAllUSD = data.TOTALASSET_USD || '--';
                        mzZichanAllHK = data.TOTALASSET_HK || '--';
                    };

                }
            };
            res.TOTALASSET_RMB = mzZichanAllRmb || data.TOTALASSET_RMB || '--';
            res.TOTALASSET_USD = mzZichanAllUSD || data.TOTALASSET_USD || '--';
            res.TOTALASSET_HK = mzZichanAllHK || data.TOTALASSET_HK || '--';
            res.rmbEX = rmbEX;
            res.usdEX = usdEX;
            res.hkEX = hkEX;
        };
    }
    return res;
}