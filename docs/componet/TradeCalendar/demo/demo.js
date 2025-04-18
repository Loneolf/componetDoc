"use strict";
define(function (require, exports) {
	var tradeCalendar = require("../js/index.js");

	var app;
	initVue();
	function initVue() {
		//根据实际情况进行初始化
		app = new Vue({
			el: "#container",
			data: {
				dateObj: {year: 2025, month: 3},
				minDate: new Date(2025, 3, 1),
				maxDate: new Date(2025, 11, 31),
				profitData: [],
			},
			
			methods: {
                itemClick: function (item,date) {
					console.log(item,date);
					
				},
				
				handleDateConfirm: function (year, month) {
					console.log(year, month);
					
				},
			},
			created: function () {

			},
			components:{
				tradeCalendar:tradeCalendar
			}
            
		});
	}
});

