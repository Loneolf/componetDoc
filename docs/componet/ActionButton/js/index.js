
'use strict';
/**
 * @file 交易操作按钮组件
 * @description 该组件用于处理交易操作按钮的相关逻辑，接受一个按钮配置数组作为属性。
 * @usage
   btnConfig: [
        {
            text: '按钮1',
            width:宽度，默认自适应
            textColor:文字颜色
            color:背景颜色
        }, 
   ]
   插槽为默认插槽
 * @author zhangjin
 * @date 2025-03-07
 */



//该模块应用jquery，因所有页面均引用，在此不单独引用jquery
define(function (require, exports, module) {
    var a = require('../css/index.css#');
    var template = require('../html/index.html');

    module.exports = {
        props: {
            btnConfig: {
                type: Array,
            }
        }, 
        data: function data() {
            return {
                
            };
        },
       
        created: function(){

        },
        mounted: function() {
        },
        methods: {
            handleClick: function(item) {
                this.$emit('click',item)
            }
        },
        template: template
    };
});