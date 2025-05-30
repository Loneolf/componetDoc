'use strict'

//该模块应用jquery，因所有页面均引用，在此不单独引用jquery
/*height: 高度
activeColor: 选中颜色
btnConfig: 按钮配置
    {
        text: 按钮文字
        active: 是否选中
        textColor: 文字颜色
        activeTextColor: 选中文字颜色
        backgroundColor: 背景颜色
        activeBackgroundColor: 选中背景颜色
        borderColor: 边框颜色
        activeBorderColor: 选中边框颜色
    }

*/
define(function (require, exports, module) {
    var a = require('../css/index.css#')
    var template = require('../html/index.html')

    module.exports = {
        props: {
            height: {
                default: 60,
            },
            width: {
                default: 100,
            },
            activeColor: {
                default: '#fd242a',
                type: String,
            },
            textColor: {
                default: '#586673',
                type: String,
            },
            backgroundColor: {
                default: '#fff',
                type: String, 
            },
            borderColor: {
                default: 'rgba(205,209,213,1)',
                type: String,
            },
            activeTextColor: {
                default: '#E83333',
                type: String,
            },
            activeBackgroundColor: {
                default: '#FDECEC',
                type: String, 
            },
            activeBorderColor: {
                default: 'rgba(250,214,214,1)',
                type: String,
            },
            btnConfig: {
                type: Object,
            },
        },
        methods: {
            clickFn: function (item) {
                this.$emit('btnclick', item)
            },
        },

        template: template,
    }
})
