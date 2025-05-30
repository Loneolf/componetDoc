'use strict'

/**
 * 步骤条
 * @author zhangjin
 * 可传参数：
 * 1.navigator:导航数组，默认[]
 * 2.width:宽度，默认6.3rem
 * 3.current:当前步骤，默认1
 * 4.showIndex:是否显示步骤索引，默认true
 * 
 * 事件：
 * 1.click:点击步骤条事件，返回值为当前步骤
 */

define(function (require, exports, module) {
    require('../css/index.css#')
    var template = require('../html/template.html')
    
    //初始化
    
    module.exports = {
        props: {
            navigator: {
                default: [],
            },
            width: {
                default: 6.3,
            },
            current: {
                default: 1,
            },
            showIndex: {
               default:true 
            }
        },
        data: function data() {
            return {
                cellWidth: 0,
            }
        },
        created: function () {
            this.cellWidth = this.width / this.navigator.length
        },
        computed: {
            widthCal: function () {
                if (this.current == this.navigator.length) {
                    return '100%'
                }
                return this.cellWidth * (this.current - 1 + 0.5) + 'rem'
            },
            leftCal: function () {
                return this.cellWidth * (this.current - 1 + 0.5) + 'rem'
            },
        },
        methods: {
            handleClick:function(){
                this.$emit('click',this.current)
            }
        },
        template: template,
    }
   
})
