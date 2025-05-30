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
							width:'3rem',
							textColor:'#fff',
							color:'#e83333'
						}, 
						{
							text: '按钮2',
							width:'3rem',
							textColor:'#e83333',
							color: '#e83333',
							plain:true,
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

