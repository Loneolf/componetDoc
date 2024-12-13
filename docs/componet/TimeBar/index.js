'use strict';

//该模块应用jquery，因所有页面均引用，在此不单独引用jquery

define(function (require, exports, module) {
    var timePicker = require('../TimeSelect/index');
    require('./assets/index.css#');
    //初始化
    function init(componentsName, Vue) {
        timePicker.init('time-picker');
        Vue = Vue ? Vue : window.Vue;
        if (!componentsName) {
            console.error('缺少组件名称');
            return false;
        }
        if (!Vue) {
            console.error('加载Vue组件失败！');
            return false;
        }
        Vue.component(componentsName, {
            props: {
                'minDate': {
                    type: Date,
                },
                'maxDate': {
                    type: Date,
                },
                'beginDate': {
                    type: String,
                },
                'endDate': {
                    type: String,
                },
                'maxDiff': {
                    type: Number,
                    default: '31'
                },
                'istoday': {
                    type: Boolean,
                    default: true,
                },
                'activeTab': {
                    type: String,
                    default: 'weekly',
                },
            },
            
            template:  `
                <div class="timeBarBox">
                    <div class="tabBox">
                        <div 
                            class="tabItem" 
                            v-for="item in timeArr"
                            :class="item.value == activeTab ? 'activeBar' : ''" 
                            :key="item.value"
                            @click="tabClick(item)"
                        >{{item.text}}</div>
                    </div>
                    <time-picker
                        :is-show="activeTab == 'userDefined'"
                        :formatter="formatter" 
                        :min-date="minDate" 
                        :max-date="maxDate" 
                        :begin-date="beginDate" 
                        :end-date="endDate" 
                        :max-diff="31"
                        @confirm="onConfirm" 
                        @datechange="onDateChange"
                    ></time-picker>
                </div>
            `,

            data: function data() {
                return {
                    timeArr: [
                        { text: "当日", value: "today"},
                        { text: "近一周", value: "weekly"},
                        { text: "近一月", value: "month"},
                        { text: "自定义", value: "userDefined"},
                    ],
                };
            },
            mounted: function mounted() {
                console.log('timebar mounted')
                if (!this.istoday) {
                    this.timeArr.shift()
                }
            },
            methods: {

                tabClick: function tabClick(item) {
                    console.log('tabClick', item)
                    this.$emit('tabchange', item.value);
                },

                onDateChange: function onDateChange(beginDate, endDate) {
                    this.$emit('datechange', beginDate, endDate);
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

                onConfirm: function onConfirm() {
                    this.$emit('confirm');
                },
                
            },
            
        });
    }

    exports.init = init;
});