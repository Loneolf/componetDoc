/**
 * 用户反馈接口
 * @param {String} message 
 * @param {String} SDKLog 
 */
function feedBack(message, SDKLog) {
    if (typeof message != 'string') {
        return;
    }
    if (typeof SDKLog != 'string') {
        SDKLog = '';
    }
    var deviveInfo = '';
    if (typeof cNative != 'undefined') {
        deviveInfo = cNative.getDeviceInfo();
    }
    var oSend = {
        action: 49001,
        function: '11001',
        SDKLog: SDKLog,
        message: message.slice(0, 100),
        deviceInfo: typeof deviveInfo == 'string' ? deviveInfo : ''
    };
    try {
        $.getData({
            oSendData: oSend,
            fnSuccess: function fnSuccess(oSend) {
                console.log('提交成功', oSend);
            },
            fnFail: function fnFail(oSend) {
                console.error(oSend);
            }
        });
    } catch (e) {}
}

/**
 * 判断是否非交易日
 */
function isTradeDate(fnSuc) {
    var oSendData = {
        action: '41083',
        ReqlinkType: 2
    };
    $.getData({
        oSendData: oSendData,
        fnSuccess: function fnSuccess(oData) {
            var IS_TRADE_DATE = oData.IS_TRADE_DATE;
            if (IS_TRADE_DATE === '1') {
                fnSuc && fnSuc(true);
            } else {
                fnSuc && fnSuc(false);
            }
        },
        oConfig: function oConfig(data) {
            //默认为交易日
            fnSuc && fnSuc(true);
        }
    });
}

// export const feedBack = feedBack;
// export const isTradeDate = isTradeDate;