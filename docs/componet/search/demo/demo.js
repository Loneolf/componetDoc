"use strict";
define(function (require, exports) {
    var comsearch = require('../index');
	var app;
	comsearch.init('com-search');
	initVue();
	function initVue() {
		//根据实际情况进行初始化
		app = new Vue({
			el: "#container",
			data: {

			},
			
			methods: {
                searchGetData: function (params) {
                    console.log('aaasearchgetData', params)
                }
			},
            
		});
	}
});

