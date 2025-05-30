"use strict";
define(function (require, exports) {
    var actionButton = require('../js/index');
	var app;
	// actionButton.init('com-search');
	initVue();
	function initVue() {
		//根据实际情况进行初始化
		app = new Vue({
			el: "#container",
			data: function () {
				return {
					btnConfig: [
						{
							text: '按钮1',
							// width:宽度，默认自适应
							textColor:'#fff',
							color:'#e83333'
						}, 
				   ]	
				}
			},
			
			methods: {
                handleClick: function () {
                    alert('handleClick')	
                }
			},
            components: {
                'action-button': actionButton	
            }
		});
	}
});

