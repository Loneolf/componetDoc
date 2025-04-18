'use strict';

//该模块应用jquery，因所有页面均引用，在此不单独引用jquery
define(function (require, exports, module) {
    var a = require('../css/index.css#');
    var template = require('../html/index.html');
    var api = require('../../../api/api.js');
    var tools=require('../../../common/tools');
    module.exports = {
        props: {
            showLastMonth: {//首日非周一是否展示上个月的日期
                type: Boolean,
                default: false
            },
            date: {//默认日期
                default: new Date()
            },
            minDate: {
                
            },
            maxDate: {
                
            },
            profitData: {
                default: []
            }
        }, 
        data: function data() {
            return {
                calendarArr: [],
                currentYear: new Date().getFullYear(),
                currentMonth: new Date().getMonth() + 1,
                showDatePicker: false,
                currentDate: '',
                min:'',
                max: '',
            };
        },
       
        created: function () {
            var that = this;
            var dateObj = this.date
            T.readFileMesg(
                'lhsydata',
                function (oData) {
                  var lhsydata = JSON.parse(decodeURI(oData))
                  var start = tools.getYTDS(lhsydata.start_date).split('-')
                  var end = tools.getYTDS(lhsydata.end_date).split('-')
                  that.minDate = new Date(start[0], start[1] - 1, 1)
                  that.maxDate = new Date(end[0], end[1] - 1,1)
                  console.log(that.minDate,that.maxDate);
                }
              )
            console.log( '最大最小范围：',this.minDate,this.maxDate);
           
        },
        mounted: function() {
           
        },
        methods: {
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
                console.log(firstDay,'firstDay',lastDay,lastDate,this.calendarArr);
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
        },
        watch: {
            date: function (val) {
                this.currentYear = val.year;
                this.currentMonth = val.month;
                this.showCalendar(this.currentYear, this.currentMonth);
                this.currentDate = new Date(val.year, val.month - 1)
                console.log(this.currentDate);
            },
            profitData: {
                handler:function (val) {
                    this.$nextTick(function () {
                        for (var i = 0; i < this.calendarArr.length; i++){
                            if (this.calendarArr[i].isLastMonth) {
                                continue;
                            }
                            for (var j = 0; j < val.length; j++){
                                if (val[j].trade_date.slice(6) == this.calendarArr[i].date) {
                                    this.calendarArr[i].income=val[j].qt0_pnl>0?'+'+val[j].qt0_pnl:val[j].qt0_pnl
                                    this.calendarArr[i].vac_pnl_id=val[j].vac_pnl_id
                                }
                                
                            }
                        }
                    })
                },
                deep:true
            }
           
        },
        template: template
    };
});