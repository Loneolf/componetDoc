"use strict";

/**
 *  管理所有ajax请求方法
 */
define(function (require, exports) {
	
	exports.action32 = function (val, fn, fnFail, type){
		var oSend = {
			action: 32,
			StockCode: val,
			ReqLinkType: '0',
			NewMarketNo: '0',
			account: '1',
		}
		var logintype
		if (type == 'nomal') {
			oSend.tokentype = '0'
			logintype = 1
		} else {
			oSend.tokentype = '1'
			logintype = 2
		}
	
		$.getData({
			oSendData: oSend,
			logintype: logintype,
			fnSuccess: function fnSuccess(oData) {
				fn(oData)
			},
			oConfig: function oConfig(data) {
				fnFail(data)
			},
		})
	}

	exports.action5061 = function (val, type, fn, fnFail){
		var oSend = {
			action: 5061,
			stockCode: val,
			ReqLinkType: '1',
			NewMarketNo: '0',
			account: '1',
		}
		var logintype
		if (type == 'nomal') {
			oSend.tokentype = '0'
			logintype = 1
		} else {
			oSend.tokentype = '1'
			logintype = 2
		}
	
		$.getData({
			oSendData: oSend,
			// logintype: logintype,
			fnSuccess: function fnSuccess(oData) {
				fn(oData)
			},
			oConfig: function oConfig(data) {
				fnFail(data)
			},
		})
	}

	function ms5061(oSend, fn) {
        var oSendData = {
            action: 5061
        };
        tzt.extend(oSendData, oSend);
        $.getData({ oSendData: oSendData, fnSuccess: fn });
    }
});