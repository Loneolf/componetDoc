'use strict';

//该模块应用jquery，因所有页面均引用，在此不单独引用jquery
define(function (require, exports, module) {
    var a = require('../css/index.css#');
    var template = require('../html/index.html');
    module.exports = {
        props: {
            showLastMonth: {//首日非周一是否展示上个月的日期
                type: Boolean,
                default: false
            },
            date: {//默认日期
                default: {year:new Date().getFullYear(),month: new Date().getMonth() + 1}
            },
            minDate: {
                
            },
            maxDate: {
                
            },
            profitData: {
                default: []
            },
            showDate: {
                default: true
            }
        }, 
        data: function data() {
            return {
                calendarArr: [],
                currentYear: new Date().getFullYear(),
                currentMonth: new Date().getMonth() + 1,
                showDatePicker: false,
                currentDate: new Date().getDate(),
                min:'',
                max: '',
            };
        },
       
        created: function () {
            var dateObj = this.date 
            this.currentDate = new Date(dateObj.year, dateObj.month - 1,1)
            console.log(dateObj);
            this.showCalendar(dateObj.year, dateObj.month)
            
        },
        mounted: function mounted () {
            console.log(this.profitData);
           this.updateProfitData(this.profitData)
        },
        methods: {
            getYTDS:function getYTDS(n) {
                n = n + '';
                var year = n.substr(0, 4),
                  months = n.substr(4, 2),
                  days = n.substr(6, 8);
                return year + "-" + months + "-" + days;
              },
            
            showCalendar: function showCalendar(currentYear, currentMonth) {
                var firstDate = new Date(currentYear, currentMonth - 1, 1);
                var lastDate = new Date(currentYear, currentMonth, 0);
                var firstDay = firstDate.getDay();
                var lastDay = lastDate.getDay();
                if (firstDay == 6) {
                    firstDate = new Date(currentYear, currentMonth - 1, 3);
                }else if (firstDay == 0) {
                    firstDate = new Date(currentYear, currentMonth - 1, 2); 
                }
                if (lastDay == 6) {
                    lastDate = new Date(currentYear, currentMonth, -1); 
                }else if (lastDay == 0) {
                    lastDate = new Date(currentYear, currentMonth, -2); 
                }
                firstDay = firstDate.getDay();
                lastDay = lastDate.getDay();
                console.log(lastDate);
                for (var i = firstDate.getDate(); i <= lastDate.getDate(); i++) {
                    var day = new Date(currentYear, currentMonth - 1, i).getDay();
                    if(day>0&&day<6){
                        this.calendarArr.push({
                            date: i,
                            income: '',
                            selected:false
                        })
                    }
                   
                }
                if (firstDay > 1) {
                    for (var j = 1; j < firstDay; j++) {
                        this.calendarArr.unshift({
                            date: new Date(currentYear, currentMonth - 1, 1-j).getDate(),
                            isLastMonth: true,
                            selected:false
                        })
                    }
                }
                console.log(this.calendarArr); 
            },
            handleConfirm: function (date) {
                var val=new Date(date)
                this.currentMonth = val.getMonth()+1
                this.currentYear = val.getFullYear()
                this.calendarArr = []
                this.showCalendar(this.currentYear, this.currentMonth)
                this.showDatePicker = false
                this.$emit('confirm',this.currentYear,this.currentMonth)
            },
            handleClick: function (item) {
                if (item.selected) {
                    item.selected = false
                    return
                }
                for(var i=0;i<this.calendarArr.length;i++){
                    this.calendarArr[i].selected=false 
                }
                item.selected = !item.selected
                var month=this.currentMonth
                
                var date=item.date
                if(date<10){
                    date='0'+item.date 
                }
                this.$emit('itemclick',item,this.currentYear+'-'+month+'-'+date)
            },
            formatter:function (type, val) {
                if (type === 'month') {
                  return val+'月';
                } else if (type === 'year') {
                  return val+'年';
                }
                return val;
            },
            updateProfitData: function (val) {
                this.$nextTick(function () {
                    for (var i = 0; i < this.calendarArr.length; i++){
                        if (this.calendarArr[i].isLastMonth) {
                            continue;
                        }
                        for (var j = 0; j < val.length; j++){
                            if (val[j].date== this.calendarArr[i].date) {
                                this.calendarArr[i].income=val[j].income>0?'+'+val[j].income:val[j].income
                            }
                            
                        }
                    }
                })
            }
        },
        watch: {
            date: function (val) {
                console.log(val);
                this.currentYear = val.year;
                this.currentMonth = val.month;
                this.showCalendar(this.currentYear, this.currentMonth);
                this.currentDate = new Date(val.year, val.month - 1)
                console.log(this.currentDate);
            },
            profitData: {
                handler:function (val) {
                    this.updateProfitData(val)
                },
                deep:true
            }
           
        },
        template: template
    };
});