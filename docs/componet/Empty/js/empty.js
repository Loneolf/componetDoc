'use strict'

//该模块应用jquery，因所有页面均引用，在此不单独引用jquery

define(function (require, exports, module) {
    // require('/vue/components/jiaoyi-empty/css/empty.css#')
    require('../css/empty.css#')
    var template = require('../html/template.html')
    
    //初始化
    
    module.exports = {
        props: ['width', 'height', 'emptyText','imgSrc'],
        data: function data() {
            return {}
        },
        template: template,
    }
   
})
