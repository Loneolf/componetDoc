"use strict";
define(function (require, exports) {
    var empty = require('../js/empty');
	var app;
	initVue();
	function initVue() {
		//根据实际情况进行初始化
		app = new Vue({
			el: "#container",
			data: {

			},
			
            components: {
                empty:empty
            }
		});
	}
});

