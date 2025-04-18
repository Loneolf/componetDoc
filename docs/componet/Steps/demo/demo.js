"use strict";
define(function (require, exports) {
	var steper = require('../js/index.js')

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
               handleClick:function(current){
                   alert(current)
               }
			},
			components: {
				steper:steper
			}
		});
	}
});

