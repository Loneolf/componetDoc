"use strict";
define(function (require, exports) {
	var inputField = require('../js/index');
	var app;
	
	initVue();
	function initVue() {
		//根据实际情况进行初始化
		app = new Vue({
			el: "#container",
			data: {
				price:300
			},
			
			methods: {
                plus: function () {
					this.price += 100
				}
			},
			components: {
				inputField:inputField
			}
		});
	}
});

