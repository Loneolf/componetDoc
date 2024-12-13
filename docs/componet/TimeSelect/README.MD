#### 时间区间选择控件

原html片段如下，如要修改改片段，可以使用ES6的字符串片段进行修改，并使用在线ES6转ES5进行转换，例如[在线转换](https://www.gongjuhao.com/jsconvert/),[在线转换2](https://jstool.gitlab.io/zh-cn/babel-es6-to-es5/)
请保持该片段与index.js中的转换一致，利于后续的正常维护
```
`
<div class="monthDateWrap" v-show="isShow">
    <div class="dateChoice">
        <span class="dateText begindate" type="text" id="date1" @click="setPopDate('begin', 'wrap')">{{beginDate}}</span>
        <span class="dateMiddleText">至</span>
        <span class="dateText enddate" type="text" id="date2" @click="setPopDate('end', 'wrap')">{{endDate}}</span>
    </div>
    <van-popup v-model="isDatePickerOpen" position="bottom" @click-overlay="onCancel">
        <div class="month-date-picker">
            <van-datetime-picker 
                v-model="selectedDate" 
                :type="datePickerType" 
                :formatter="formatter" 
                :min-date="minDate" 
                :max-date="maxDate" 
                swipe-duration=100
                @confirm="onConfirm" 
                @cancel="onCancel" 
                @change="onChange"
            >
                <template #title>
                    <div class="month-date-picker-types">
                        <div 
                            class="month-date-picker-type date" 
                            :class="{active:datePickerType == 'date'}" 
                            @click="chooseDatePickerType('date')"
                        > 按日选择</div>
                        <div 
                            class="month-date-picker-type month" 
                            :class="{active:datePickerType == 'year-month'}" 
                            @click="chooseDatePickerType('year-month')"
                        >按月选择</div>
                    </div>
                </template>
                <template #columns-top>
                    <div class="month-date-picker-dates" :class="datePickerType === 'date' ? '': 'monthTimeWrap'">
                        <div v-if="datePickerType !== 'date'" class="leftLine"></div>
                        <div class="month-date-picker-date" :class="{active:dateType == 'begin' && datePickerType == 'date'}" @click="setPopDate('begin')">
                            {{ datePickerType === 'date' ? beginDateTemp : monthBegin }}
                        </div>
                        <div style="margin: 0 0.2rem; color: #222222; line-height: 0.7rem; height: 0.7rem">至</div>
                        <div class="month-date-picker-date" :class="{active:dateType == 'end' && datePickerType == 'date'}" @click="setPopDate('end')">
                            {{ datePickerType === 'date' ? endDateTemp : monthEnd }}
                        </div>
                        <div v-if="datePickerType !== 'date'" class="rightLine"></div>
                    </div>
                </template>
            </van-datetime-picker>
            <van-toast></van-toast>
        </div>
    </van-popup>
</div>
`
```