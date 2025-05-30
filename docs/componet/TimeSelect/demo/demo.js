define(function (require, exports, module) {
    var TimeSelect = require('../index');
    var util = require('../../util')
    var nearTime = util.getNearTime(new Date(), false)
    TimeSelect.init('time-select');
    new Vue({
        el: "#app",
        data: {
            isShow: false,
            // 查询的开始时间和结束时间
            beginDate: nearTime.weekly.beginDate,
            endDate: nearTime.weekly.endDate,
            minDate: new Date(2010, 0, 1),
            maxDate: new Date(),
        },
        methods: {
            onConfirm: function() {
                this.isShow = false;
                alert('开始时间:' + this.beginDate +'、'+ '结束时间:' + this.endDate);
            },
            onDateChange: function(beginDate, endDate) {
                this.beginDate = beginDate;
                this.endDate = endDate;
            },
            formatter: function(type, val) {
                if (type === 'year') {
                    return val + '\u5E74';
                } else if (type === 'month') {
                    return val + '\u6708';
                } else if (type === 'day') {
                    return val + '\u65E5';
                }
                return val;
            },
            openTimeSelect: function() {
                this.isShow = true;
            }
        }
    })
});