define(function (require, exports, module) {
    var TimeSelect = require('../index');
    var util = require('../../util')
    var nearTime = util.getNearTime(new Date(), false)
    TimeSelect.init('time-select');
    new Vue({
        el: "#app",
        data: {
            activeTab: 'weekly',
            // 查询的开始时间和结束时间
            beginDate: nearTime.weekly.beginDate,
            endDate: nearTime.weekly.endDate,
            minDate: new Date(2010, 0, 1),
            maxDate: new Date(),
        },
        methods: {
            onConfirm: function() {
                console.log('onConfirm')
            },
            onDateChange: function(beginDate, endDate) {
                this.beginDate = beginDate;
                this.endDate = endDate;
            },
            onTabChange: function (tab) { 
                this.activeTab = tab
                if (this.activeTab!== 'today') {
                    this.beginDate = nearTime[this.activeTab].beginDate;
                    this.endDate = nearTime[this.activeTab].endDate;
                }
            },
        }
    })
});