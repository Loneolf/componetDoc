import { accountTypeMap, bzTypeMap } from './accontMap'

export function computeAccountData(gridData, oData, oData1, OTCData, OTCStatus){
    // console.log('aaaaacomputerAccountData', gridData, oData, oData1, OTCData, OTCStatus);

    let accountList = []

    oData.GRID2.shift();
    //个人资产
    oData.GRID2.forEach(function (oitem, oindex) {
        // console.log('aaa2233oitem', oitem);
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
                    accountItem.totalEX = oData.rmbEX
                }
            }
            catch(e){
                accountItem.total = '--';
                console.error(e)
            }
            try{
                // 市值 = 证券市值（沪深京、港股、天天利财） - 天天利财市值
                accountItem.sz = new Big(oData.MKTVAL_RMB).minus(new Big(oData['MKTVAL_ONEDAYBJHG'] || '0')).minus(new Big(oData['MKTVAL_MULTIDAYBJHG'] || '0')).toFixed(2).toString();  
                accountItem.szEX = `117接口 MKTVAL_RMB 字段值 - MKTVAL_ONEDAYBJHG(天天理财)  - MKTVAL_MULTIDAYBJHG <br />
                     = ${oData.MKTVAL_RMB} - ${oData['MKTVAL_ONEDAYBJHG'] || '0'} - ${oData['MKTVAL_MULTIDAYBJHG'] || '0'} = ${accountItem.sz}
                `
            }
            catch(e){
                accountItem.sz = '--';
                console.error(e)
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
                    console.error(e)
                }
                accountItem.yl = val;
                accountItem.ylEX = `117接口 TOTALYK_RMB 字段值 - TOTALYK_ONEDAYBJHG(天天理财)  - TOTALYK_MULTIDAYBJHG <br />
                    = ${oData.TOTALYK_RMB} - ${oData['TOTALYK_ONEDAYBJHG'] || '0'} - ${oData['TOTALYK_MULTIDAYBJHG'] || '0'} = ${accountItem.yl}
                `
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
                        // 计算个股的持仓占比
                        if (accountItem.total !== '--' && o.shiZhi !== '--' && !isNaN(o.shiZhi)) {
                            o.ratio = new Big(o.shiZhi).div(new Big(accountItem.total)).times(new Big(100)).toFixed(2).toString() + '%';
                            o.ratioEX = `个股市值 ${o.shiZhi} / 总资产 ${accountItem.total} = ${o.ratio}`
                        } else {
                            o.ratio = '--';
                            o.ratioEX = `个股市值为${o.shiZhi} ---- 总资产为${accountItem.total} 异常未计算`
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
                console.error(e)
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
            accountItem.totalEX = oData.usdEX
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
                        // 计算个股的持仓占比
                        if (accountItem.total !== '--' && o.shiZhi !== '--' && !isNaN(o.shiZhi)) {
                            o.ratio = new Big(o.shiZhi).div(new Big(accountItem.total)).times(new Big(100)).toFixed(2).toString() + '%';
                            o.ratioEX = `个股市值 ${o.shiZhi} / 总资产 ${accountItem.total} = ${o.ratio}`
                        } else {
                            o.ratio = '--';
                            o.ratioEX = `个股市值为${o.shiZhi} ---- 总资产为${accountItem.total} 异常未计算`
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
            accountItem.totalEX = oData.hkEX
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
            // console.log('aaahkHoldingList', hkHoldingList);
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
                        // 计算个股的持仓占比
                        if (accountItem.total !== '--' && o.shiZhi !== '--' && !isNaN(o.shiZhi)) {
                            o.ratio = new Big(o.shiZhi).div(new Big(accountItem.total)).times(new Big(100)).toFixed(2).toString() + '%';
                            o.ratioEX = `个股市值 ${o.shiZhi} / 总资产 ${accountItem.total} = ${o.ratio}`
                        } else {
                            o.ratio = '--';
                            o.ratioEX = `个股市值为${o.shiZhi} ---- 总资产为${accountItem.total} 异常未计算`
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
        // console.log('aaarmbHKHoldingList', JSON.parse(JSON.stringify(rmbHKHoldingList)));
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
                    // 计算个股的持仓占比
                    if (accountItem.total !== '--' && o.shiZhi !== '--' && !isNaN(o.shiZhi)) {
                        o.ratio = new Big(o.shiZhi).div(new Big(accountItem.total)).times(new Big(100)).toFixed(2).toString() + '%';
                        o.ratioEX = `个股市值 ${o.shiZhi} / 总资产 ${accountItem.total} = ${o.ratio}`
                    } else {
                        o.ratio = '--';
                        o.ratioEX = `个股市值为${o.shiZhi} ---- 总资产为${accountItem.total} 异常未计算`
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
        // console.log('accountItem.todayPl', JSON.parse(JSON.stringify(accountItem)));
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

export function upAccountData(accountList, dataList) {
    var accountListTemp = JSON.parse(JSON.stringify(accountList));
    accountListTemp.forEach((o)=>{
        for(var k in o){
            if(k === 'sz' || k === 'yl' || k === 'todayPl' || k === 'ratio'){
                o[k] = 0;
            }
            if(k === 'szEX' || k === 'ylEX' || k === 'todayPlFrom'){
                o[k] = ''; 
            }
        }
    });
    let len = dataList.length;
    dataList.forEach((o1, index)=>{
        // console.log('aaaares', o1.todayPl, len, Amp.bzTypeMap[o1.wtAccountType])
        try{
            var accountItem = accountListTemp.find((o2)=>{
                return o2.bztype == bzTypeMap[o1.wtAccountType];
            });
            if(accountItem){
                if(o1.sz != '--'){
                    accountItem.sz = new Big(accountItem.sz).plus(new Big(o1.shiZhi)).toFixed(2).toString();
                    accountItem.szEX += `(${o1.name}：${o1.shiZhi}) ${len === index  ? ' || ' : ' ' }`
                }             
                if(o1.yingKui != '--'){
                    accountItem.yl = new Big(accountItem.yl).plus(new Big(o1.yingKui)).toFixed(2).toString();
                    accountItem.ylEX += `(${o1.name}：${o1.yingKui}) ${len === index ?' || ' : ' ' }`
                }

                if(o1.todayPl != '--'){
                    // console.log('aaaaintadayPl', accountItem.todayPlFrom)
                    accountItem.todayPl = new Big(accountItem.todayPl).plus(new Big(o1.todayPl)).toFixed(2).toString();
                    accountItem.todayPlFrom += `(${o1.name}：${o1.todayPl}) ${len === index ? ' || ' : ' ' }`
                }   
            }   
        }
        catch(e){
            console.error(e);
        }
    })

    accountListTemp.forEach((o, i)=>{
        if(o.bztype == '0' || o.bztype == '0_HK'){
            try{
                var rmbIndex = accountList.findIndex((item)=>{
                    return item.bztype == '0'; 
                });
                var rmbHKIndex = accountList.findIndex((item)=>{
                    return item.bztype == '0_HK'; 
                });
                var rmbSzDiffer = '0.00';
                try{
                    rmbSzDiffer = new Big(accountListTemp[rmbIndex].sz).minus(new Big(accountList[rmbIndex].sz));
                }
                catch(e){
                    rmbSzDiffer = '0.00';
                }
                var rmbHKSzDiffer = '0.00';
                try{
                    rmbHKSzDiffer = new Big(accountListTemp[rmbHKIndex].sz).minus(new Big(accountList[rmbHKIndex].sz));
                }
                catch(e){
                    rmbHKSzDiffer = '0.00';
                }
                o.total = new Big(o.total).plus(new Big(rmbSzDiffer)).plus(new Big(rmbHKSzDiffer)).toFixed(2).toString();
            }
            catch(e){
                console.error(e)
                o.total = '--';
            }
        }
        else{
            try{
                var szDiffer = '0.00';
                try{
                    szDiffer = new Big(o.sz).minus(new Big(accountList[i].sz));
                }
                catch(e){
                    szDiffer = '0.00';
                }
                o.total = new Big(o.total).plus(new Big(szDiffer)).toFixed(2).toString();
            }
            catch(e){
                console.error(e)
                o.total = '--';
            }
        }
    });
    return accountListTemp;
}


export function calAccontData(accountList, dataList) {
    var accountListTemp = JSON.parse(JSON.stringify(accountList));
    accountListTemp.forEach((item, index)=>{
        let list = dataList.find((o)=>{
            return o.bztype == item.bztype;
        })?.list
        
        item.szEX += '<br />'
        item.ylEX += '<br />'
        let szEXO = '接口返回市值累加 <br />';
        let szEXC = '使用计算进行的市值累加< br />';
        let szO = 0;
        let szC = 0;
        let ylEXO = '接口返回的盈亏累加 <br />';
        let ylEXC = '使用计算进行的盈亏累加 <br />';
        let ylO = 0;
        let ylC = 0;
        list?.forEach((si)=>{
            si.co = si.co || {};
            szO += isNaN(si.shiZhi) ? 0 : Number(si.shiZhi);
            szEXO += `${si.name}：${si.shiZhi} 、`;
            szC += isNaN(si.co.shiZhi)? 0 : Number(si.co.shiZhi);
            szEXC += `${si.name}：${si.co.shiZhi} 、`;
            ylO += isNaN(si.yingKui)? 0 : Number(si.yingKui);
            ylEXO += `${si.name}：${si.yingKui} 、`;
            ylC += isNaN(si.co.yingKui)? 0 : Number(si.co.yingKui);
            ylEXC += `${si.name}：${si.co.yingKui} 、`;
        })
        item.szEX += `
            ${szEXO} <br />
            持仓接口返回值累加结果为：${szO} <br />
            是否和117接口返回值一致：${Number(szO).toFixed(2) === Number(item.sz).toFixed(2) ? '是' : '否'} <br />
            ${szEXC} <br />
            持仓计算结果累加结果为：${szC} <br />
            是否和117接口返回值一致：${Number(szC).toFixed(2) === Number(item.sz).toFixed(2)? '是' : '否'} <br />
        `;
        item.ylEX += `
            ${ylEXO} <br />
            盈亏接口返回值累加结果为：${ylO} <br />
            是否和117接口返回值一致：${Number(ylO).toFixed(2) === Number(item.yl).toFixed(2)? '是' : '否'} <br />
            ${ylEXC} <br />
            盈亏计算结果累加结果为：${ylC} <br />
            是否和117接口返回值一致：${Number(ylC).toFixed(2) === Number(item.yl).toFixed(2)? '是' : '否'} <br />
        `;
    });
    console.log('aaaaccountListTemp', accountListTemp);
    return accountListTemp;
    // dataList.forEach((o1, index)=>{
    //     // console.log('aaaares', o1.todayPl, len, Amp.bzTypeMap[o1.wtAccountType])
    //     try{
    //         var accountItem = accountListTemp.find((o2)=>{
    //             return o2.bztype == bzTypeMap[o1.wtAccountType];
    //         });
    //         if(accountItem){
    //             if(o1.sz != '--'){
    //                 accountItem.sz = new Big(accountItem.sz).plus(new Big(o1.shiZhi)).toFixed(2).toString();
    //                 accountItem.szEX += `(${o1.name}：${o1.shiZhi}) ${len === index  ? ' || ' : ' ' }`
    //             }             
    //             if(o1.yingKui != '--'){
    //                 accountItem.yl = new Big(accountItem.yl).plus(new Big(o1.yingKui)).toFixed(2).toString();
    //                 accountItem.ylEX += `(${o1.name}：${o1.yingKui}) ${len === index ?' || ' : ' ' }`
    //             }

    //             if(o1.todayPl != '--'){
    //                 // console.log('aaaaintadayPl', accountItem.todayPlFrom)
    //                 accountItem.todayPl = new Big(accountItem.todayPl).plus(new Big(o1.todayPl)).toFixed(2).toString();
    //                 accountItem.todayPlFrom += `(${o1.name}：${o1.todayPl}) ${len === index ? ' || ' : ' ' }`
    //             }   
    //         }   
    //     }
    //     catch(e){
    //         console.error(e);
    //     }
    // })

    // accountListTemp.forEach((o, i)=>{
    //     if(o.bztype == '0' || o.bztype == '0_HK'){
    //         try{
    //             var rmbIndex = accountList.findIndex((item)=>{
    //                 return item.bztype == '0'; 
    //             });
    //             var rmbHKIndex = accountList.findIndex((item)=>{
    //                 return item.bztype == '0_HK'; 
    //             });
    //             var rmbSzDiffer = '0.00';
    //             try{
    //                 rmbSzDiffer = new Big(accountListTemp[rmbIndex].sz).minus(new Big(accountList[rmbIndex].sz));
    //             }
    //             catch(e){
    //                 rmbSzDiffer = '0.00';
    //             }
    //             var rmbHKSzDiffer = '0.00';
    //             try{
    //                 rmbHKSzDiffer = new Big(accountListTemp[rmbHKIndex].sz).minus(new Big(accountList[rmbHKIndex].sz));
    //             }
    //             catch(e){
    //                 rmbHKSzDiffer = '0.00';
    //             }
    //             o.total = new Big(o.total).plus(new Big(rmbSzDiffer)).plus(new Big(rmbHKSzDiffer)).toFixed(2).toString();
    //         }
    //         catch(e){
    //             console.error(e)
    //             o.total = '--';
    //         }
    //     }
    //     else{
    //         try{
    //             var szDiffer = '0.00';
    //             try{
    //                 szDiffer = new Big(o.sz).minus(new Big(accountList[i].sz));
    //             }
    //             catch(e){
    //                 szDiffer = '0.00';
    //             }
    //             o.total = new Big(o.total).plus(new Big(szDiffer)).toFixed(2).toString();
    //         }
    //         catch(e){
    //             console.error(e)
    //             o.total = '--';
    //         }
    //     }
    // });
    // return accountListTemp;
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
                            rmbEX += `116接口子账号累加：(账号: ${itemV[zhhData.FUNDACCOUNTINDEX]}_资金:${mzZichanRmb}) ${zhhData.GRID0[j + 1] ? '+' : ''} `
                        } catch (e) {
                            mzZichanAllRmb = data.TOTALASSET_RMB || '--';
                        }
                    } else if (itemV[zhhData.MONEYTYPEINDEX] == '1') {
                        try {
                            mzZichanUSD = new Big(mzZichanUSD).plus(new Big(Number(itemV[zhhData.ASSETTOTALINDEX]))).toString();
                            mzZichanAllUSD = new Big(data.TOTALASSET_USD).plus(new Big(mzZichanUSD)).toString();
                            usdEX += `116接口子账号累加：(账号: ${itemV[zhhData.FUNDACCOUNTINDEX]}_资金:${mzZichanUSD}) ${zhhData.GRID0[j + 1] ? '+' : ''}  `
                        } catch (e) {
                            mzZichanAllUSD = data.TOTALASSET_USD || '--';
                        }
                    } else if (itemV[zhhData.MONEYTYPEINDEX] == '2') {
                        try {
                            mzZichanHK = new Big(mzZichanHK).plus(new Big(Number(itemV[zhhData.ASSETTOTALINDEX]))).toString();
                            mzZichanAllHK = new Big(data.TOTALASSET_USD).plus(new Big(mzZichanHK)).toString();
                            hkEX += `116接口子账号累加：(账号: ${itemV[zhhData.FUNDACCOUNTINDEX]}_资金:${mzZichanHK}) ${zhhData.GRID0[j + 1] ? '+' : ''}  `
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
            res.rmbEX = rmbEX || '117接口，取值: TOTALASSET_RMB 字段';
            res.usdEX = usdEX || '117接口，取值: TOTALASSET_USD 字段';
            res.hkEX = hkEX || '117接口，取值: TOTALASSET_HK 字段';
        };
    }
    return res;
}