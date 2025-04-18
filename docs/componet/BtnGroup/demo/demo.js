"use strict";
define(function (require, exports) {
    var btnGroup = require('../js/index');
	var app;
	
	initVue();
	function initVue() {
		//根据实际情况进行初始化
		app = new Vue({
			el: "#container",
			data: {
				btnConfig: [
				{
					text: '量化智盈',
					active: true,
					
				},
				{
					text: '非量化智盈',
					active: false,
				}],
				btnConfig2:[
					{
						text: '量化智盈',
						active: true,
						
					},{
						text: '非量化智盈',
						active: false,
					},{
						text: '量化盈亏',
						active: false,
					},{
						text: '非量化盈亏',
						active: false,
					}
				]
			},
			
			methods: {
				btnClick: function (item) {
					for (var i = 0; i < this.btnConfig.length; i++) {
						this.btnConfig[i].active = false;
					}
					item.active = true;

					alert('btnClick')
				},
				btnClick2: function (item) {
					for (var i = 0; i < this.btnConfig2.length; i++) {
						this.btnConfig2[i].active = false;
					}
					item.active = true;
				}
			},
			components: {
				btnGroup:btnGroup
			}
		});
	}
});

