"use strict";

/**
 *  管理所有ajax请求方法
 */
define(function (require, exports) {
	var isMock = true
	var config = require('./config')
	var jingMarket = [
		"5121",
		"5122",
		"5123",
		"5124",
		"5125",
		"5126",
		"5127",
		"5128",
		"5129",
		"5130",
		"5131",
		"5132",
		"5133",
		"5134",
		"5135",
	];
	exports.jingMarket = jingMarket

	var shenMarket = [
		"4609",
		"4611",
		"4612",
		"4614",
		"4616",
		"4617",
		"4618",
		"4619",
		"4620",
		"4621",
		"4622",
		"4623",
	];
	exports.shenMarket = shenMarket
	
	var huMarket = [
		"4353",
		"4355",
		"4356",
		"4357",
		"4358",
		"4359",
		"4360",
		"4361",
		"4362",
		"4363",
		"4364",
		"4365",
		"4366",
		"4367",
	];
	exports.huMarket = huMarket
	
	exports.action32 = function (val, fn, fnFail, type) {
		var oSend = {
			action: 32,
			StockCode: val,
			ReqLinkType: "0",
			NewMarketNo: jingMarket.concat(shenMarket, huMarket).join(","),
			account: "1",
		};
		var logintype;
		if (type == "nomal") {
			oSend.tokentype = "0";
			logintype = 1;
		} else {
			oSend.tokentype = "1";
			logintype = 2;
		}

		if(isMock){
			fn(config.mock32)
			return
		}

		$.getData({
			oSendData: oSend,
			logintype: logintype,
			fnSuccess: function fnSuccess(oData) {
				fn(oData);
			},
			oConfig: function oConfig(data) {
				fnFail(data);
			},
		});
	};

	exports.action5061 = function (val, type, fn, fnFail) {
		var oSend = {
			action: 5061,
			stockCode: val,
			ReqLinkType: "1",
			NewMarketNo: "0",
			account: "1",
		};
		var logintype;
		if (type == "nomal") {
			oSend.tokentype = "0";
			logintype = 1;
		} else {
			oSend.tokentype = "1";
			logintype = 2;
		}

		if(isMock){
			fn(config.mock5061)
			return
		}

		$.getData({
			oSendData: oSend,
			// logintype: logintype,
			fnSuccess: function fnSuccess(oData) {
				fn(oData);
			},
			oConfig: function oConfig(data) {
				fnFail(data);
			},
		});
	};

});
