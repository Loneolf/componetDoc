'use strict'

/*
* 委托价格输入框
可传参数：
1.step:步长，默认0.001
2.placeholder:默认值，默认'委托价格'
3.tofixed:保留小数位数，默认3
4.needtips:是否展示顶部tip，默认true
5.unit:单位，默认''
6.thousandth:是否需要千分位，默认false
7.start:最小值，默认0
8.end:最大值，默认''
9.maxlen:最大长度，默认13

事件：
1.input:输入事件，返回值为输入的值
2.minus:减号点击事件，返回值为输入的值
3.plus:加号点击事件，返回值为输入的值

插槽
left-tip:底部左侧插槽
right-tip:底部右侧插槽
*/

define(function (require, exports, module) {
    require('../css/index.css#')
    var template = require('../html/template.html')
    
    //初始化
    
    module.exports = {
        props: {
            step: {
                default: 0.001,
            },
            placeholder: { default: '委托价格' },
            tofixed: {
                default: 3,
            },
            needtips: {
                default: true,
            },
            unit: {
                default: '',
            },
            start: {
                default: 0,
            },
            end: {
                default: '',
            },
            thousandth: {
                default: false,
                type: Boolean,
            },
            maxlen:{
                default: 13,
            },
            modelprice: {
                default: '',
            },
        },
        data: function data() {
            return {
                price: null,
                popoverText: '万',
                showPopover: false,
                popoverObj: {
                    5: '万',
                    6: '十万',
                    7: '百万',
                    8: '千万',
                    9: '亿',
                    10: '十亿',
                    11: '百亿',
                    12: '千亿',
                    13: '万亿',
                },
                offset:[0,8]
            }
        },
        created: function () {
            if (this.tofixed === 0 && String(this.step).indexOf('.') !== -1) {
                console.error('toFixed为0时，step不能为小数')
            }
            
        },
        mounted: function () {
            var rate = window.innerWidth / 750 * 100 
            var w = $('.zx-input-field input').width()
            console.log();
            this.offset = [rate/50*(w/-2+8),rate/50*5]
        },
        methods: {
            minus: function minus () {
                this.focus()
                if (this.price === null) {
                    this.price = 0
                }
                this.price = (this.price * 10000 - this.step * 10000) / 10000
                if (this.price === 0) {
                    this.price = ''
                    this.$emit('minus', '')
                    return
                }
                this.price = this.price.toFixed(this.tofixed)
                var metaPrice = this.price
                if (Number(this.price) <= Number(this.start)) {
                    this.price = Number(this.start).toFixed(this.tofixed)
                    if (this.price * 1 == 0) {
                        this.price = ''
                        this.$emit('minus', '')
                        return
                    }
                    this.$emit('minus', metaPrice)
                    return
                }
                this.showPopoverFn()
                this.$emit('minus', metaPrice)
                this.blur()
            },
            plus: function plus () {
                this.focus()
                if (this.price === null) {
                    this.price = 0
                }
                var result = ((this.price * 10000 + this.step * 10000) / 10000).toFixed(this.tofixed)
                if (result*1 === 0) {
                    this.price = ''
                    this.$emit('plus', '')
                    return
                }
                if (this.end !== '' && Number(result) >= Number(this.end)) {
                    this.price = this.end
                    return
                }
                var metaPrice = this.price
                if (String(result).length > this.maxlen) {
                    if (this.thousandth) {
                        this.price = this.thousandthFn(this.price)
                    }
                    return
                }
                
                this.price = result
                this.showPopoverFn()
                this.$emit('plus',result)
                this.blur()
            },
            focus: function focus () {
                var reg = /[^\d\.-]/g

                if (reg.test(String(this.price))&&this.price) {
                    this.price = this.price.replace(/[^\d\.-]/g, '')
                }
                this.$emit('focus','')
            },
            blur: function blur () {
                if(this.price === ''||this.price === null){
                    this.$emit('blur', '')
                   return 
                }
                var reg=/^\./
                if (reg.test(this.price)) {
                    this.price = ('0' + this.price) * 1
                    if(this.price === 0){
                        this.price = ''
                        this.$emit('blur', '')
                        return 
                    }
                }
                if (this.price === '0') {
                    this.price = ''
                    this.$emit('blur', '')
                    return
                }
               
                if (String(this.price).split('.')[1]) {
                    var floatPart = String(this.price).split('.')[1].slice(0, this.tofixed)//小数部分
                    var len = floatPart.length
                    if (floatPart.length < this.tofixed) {
                        for (var i = 0; i < this.tofixed -len ; i++) {
                            floatPart += '0'
                        }
                    }
                    this.price = parseInt(this.price) + '.' + floatPart
                }
                var metaPrice=this.price
                if (this.thousandth) {
                    this.price = this.thousandthFn(this.price)
                } else {
                    this.price = this.formatData(this.price)
                }
               this.$emit('blur', metaPrice)
            },
            inputPrice: function inputPrice() {
                this.price = this.price.replace(/[^\d\.-]/g, '')
                // var floatPart =
                //     this.tofixed > 0 ? String(value).split('.')[1] || '' : '' //小数部分
                // this.price = String(value).split('.')[0] //获取整数部分
                if (this.price.length > this.maxlen) {
                    this.price = this.price.slice(0, this.maxlen)
                }
                this.showPopoverFn()
                // if (floatPart) {
                //     this.price += '.' + floatPart
                // }
                this.$emit('input', this.price)
                
            },
            thousandthFn: function (value) {
                if (!value) {
                    if(this.tofixed === 0){
                        return '0'
                    }
                    return '0.000'
                }
                var fu=false
                if (value < 0) {
                    fu = true
                    value = Math.abs(value)
                }
                var intPart = parseInt(value)  //获取整数部分
                var floatPart = this.tofixed>0?String(value).split('.')[1] :'' //小数部分
                var intPartFormat = intPart
                    .toString()
                    .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')//将整数部分逢三一断
                if (floatPart) {
                    if(fu) return '-'+intPartFormat+'.'+floatPart
                    return  intPartFormat+'.'+floatPart
                }
                if (this.tofixed > 0){
                    intPartFormat += '.'
                }
                if(fu) return '-'+intPartFormat+this.padEnd('',this.tofixed,'0')
                return intPartFormat+this.padEnd('',this.tofixed,'0')
            }, 
            formatData: function (value) {
                if (!value) {
                    if(this.tofixed === 0){
                        return '0'
                    }
                    return '0.000'
                }
                var fu=false
                if (value < 0) {
                    fu = true
                    value = Math.abs(value)
                }
                var intPart = parseInt(value)  //获取整数部分
                var floatPart = this.tofixed>0?String(value).split('.')[1] :'' //小数部分
                if (floatPart) {
                    if(fu) return '-'+intPart+'.'+floatPart
                    return  intPart+'.'+floatPart
                }
                if (this.tofixed > 0){
                    intPart += '.'
                }
                if(fu) return '-'+intPart+this.padEnd('',this.tofixed,'0')
                return intPart+this.padEnd('',this.tofixed,'0')
            },
            showPopoverFn: function showPopoverFn() {
                 if (this.price >= 10000 && this.price < 10000000000000&&this.needtips) {
                     this.showPopover = true
                     this.popoverText =
                         this.popoverObj[parseInt(this.price).toString().length]
                 } else {
                     this.showPopover = false
                 }
            },
            setPrice:function(value){
                this.price = value
                this.showPopoverFn()
                this.blur()
            },
            padEnd: function (str, len, ch) {
                var length = len - str.length
                for (var i = 0; i < length; i++) {
                    str += ch 
                }
                return str
            }
        },
        filter: {},
        watch: {
            modelprice: function (value) {
                this.setPrice(value)
                console.log(value,this.price,'value');
            }
        },
        template: template,
    }
   
})
