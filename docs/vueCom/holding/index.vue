<template>
    <div class="parseHoldingData">
        <div class="oprateBtn">
            <el-button type="primary" @click="parseBtn">解析117</el-button>
            <el-button type="primary" @click="calculate">数据计算</el-button>
            <el-button type="primary" @click="downDialog = true">Excel下载</el-button>
            <el-button type="primary" @click="clearData()">清空内容</el-button>
        </div>
        <div class="sourceData">
            <div 
                class="sourceItem" 
                v-for="oprateItem in allOpratedata" 
                :key="oprateItem.title"
            >
                <p>
                    {{ oprateItem.title }}
                    <el-popover
                        v-if="oprateItem.showText"
                        placement="bottom"
                        :width="700"
                        trigger="hover"
                        :content="oprateItem.showText"
                    >
                        <template #reference>
                            <el-button class="m-2" @click="copyDetail(oprateItem)">详情</el-button>
                        </template>
                    </el-popover>
                    <el-popover
                        v-if="oprateItem.isShowCode"
                        placement="bottom"
                        :width="700"
                        trigger="hover"
                        :content="oprateItem.code"
                    >
                        <template #reference>
                            <el-button class="m-2" @click="$copyString(oprateItem.code)">获取代码</el-button>
                        </template>
                    </el-popover>
                    <!-- <el-button v-if="oprateItem.showText" @click="$copyString(oprateItem.showText)">复制</el-button> -->
                    <el-button  type="primary" v-if="oprateItem.isUpBtn" @click="up60(oprateItem.showText)">更新</el-button>
                    <el-button  type="primary" v-if="oprateItem.showParse" @click="extract(oprateItem.showText)">提取</el-button>
                    <el-button  type="primary" v-if="oprateItem.isAfter" @click="afterCal(oprateItem.showText)">盘后盈亏计算</el-button>
                </p>
                <textarea v-model="oprateItem.showText" class="textarea"  />
            </div>
        </div>
        <div class="exchange">
            <label>请输入港币兑美元汇率</label><el-input v-model="exchangeRateHKDtoUSD" style="width:240px" placeholder="如果没有沪B转H，无需填写该值" />
        </div>
        <br />
        <div class="parseContent" v-loading="loading">
            <div v-if="accountList.length" class="titleArea">
                <div class="accontBtn">
                    <span
                        v-for="item in accountList" 
                        :key="item.bztype" 
                        class="accontBtnItem"
                        :class="item.bztype === activeAccont ? 'active' : ''"
                        @click="changeActiveAccount(item.bztype)"
                    >{{ Amp.moneyTypeMap[item.bztype] }}</span>
                </div>

                <div 
                    class="accountItem" 
                    v-for="item in accountList" 
                    :key="item.bztype" 
                    v-show="item.bztype === activeAccont"
                >
                    <p>
                        <label>账户类型</label>：
                        <span>{{ Amp.moneyTypeMap[item.bztype] }} ---(源数据：{{ item.bztype }})</span>

                    </p>
                    <p>
                        <label>总资产</label>：
                        <span>{{ item.total }}</span>
                        <el-popover
                            v-if="item.totalEX"
                            placement="bottom"
                            :width="600"
                            trigger="hover"
                        >
                            <template #reference>
                                <el-button class="m-2">来源</el-button>
                            </template>
                            <p class="popverp" v-html="item.totalEX"></p>
                        </el-popover>
                    </p>
                    <p>
                        <label>总市值</label>：
                        <span>{{ item.sz }}</span>
                        <el-popover
                            v-if="item.szEX"
                            placement="bottom"
                            :width="600"
                            trigger="hover"
                        >
                            <template #reference>
                                <el-button class="m-2">来源</el-button>
                            </template>
                            <p class="popverp" v-html="item.szEX"></p>
                        </el-popover>
                    </p>
                    <p>
                        <label>可取</label>：
                        <span>{{ item.kq }}</span>
                        <span class="explan" v-if="item.kqEX">---{{ item.kqEX }}</span>
                    </p>
                    <p>
                        <label>可用</label>：
                        <span>{{ item.ky }}</span>
                        <span class="explan" v-if="item.kyEX">---{{ item.kyEX }}</span>
                    </p>
                    <p>
                        <label>浮动盈亏</label>：
                        <span>{{ item.yl }}</span>
                        <el-popover
                            v-if="item.ylEX"
                            placement="bottom"
                            :width="600"
                            trigger="hover"
                        >
                            <template #reference>
                                <el-button class="m-2">来源</el-button>
                            </template>
                            <p class="popverp" v-html="item.ylEX"></p>
                        </el-popover>
                    </p>
                    <p>
                        <label>当日参考盈亏</label>：
                        <span>{{ item.todayPl }}</span>
                        <el-popover
                            v-if="item.todayPl !== '--'"
                            placement="bottom"
                            :width="600"
                            trigger="hover"
                        >
                            <template #reference>
                                <el-button class="m-2">来源</el-button>
                            </template>
                            <p class="popverp" v-html="item.todayPlFrom"></p>
                        </el-popover>
                        <span class="explan" v-if="item.todayPlEX">---{{ item.todayPlEX }}</span>
                    </p>
                    <p>
                        <label>仓位百分比</label>：
                        <span>{{ Nutil.toPercentage(item.sz / item.total) }}</span>
                        <span class="explan" v-if="item.ratioEX">---{{ item.ratioEX }} ({{ item.sz }}/{{ item.total }})</span>
                    </p>
                    <br />
                    <p>分割线--------------------------------------------------------------------------------------------------------</p>
                    <br />
                </div>
            </div>
            <div class="listBox" v-bind="containerProps" :style="{height: '1000px'}">
                <div v-bind="wrapperProps">
                    <p class="listItem" v-for="{data: si} in list" :key="si.domKey" style="height: 100px">
                        <span class="name">{{ si.name }}</span>-----
                        <span class="itemSi">
                            <label>市值</label>：<span>{{ geshiValue(si.shiZhi, INDEXO.STOCKVALUEINDEX, undefined, INDEXO) }}</span>
                            <el-popover
                                v-if="si.shiZhiEX"
                                placement="bottom"
                                :width="600"
                                trigger="hover"
                            >
                                <template #reference>
                                    <el-button class="m-2">来源</el-button>
                                </template>
                                <p class="popverp" v-html="si.shiZhiEX"></p>
                            </el-popover>
                        </span>
                        <span class="itemSplit">|</span>
                        <span class="itemSi">
                            <label>当日盈亏</label>：<span>{{ si.todayPl}}</span>
                            <el-popover
                                v-if="si.todayPlEX"
                                placement="bottom"
                                :width="900"
                                trigger="hover"
                            >
                                <template #reference>
                                    <el-button class="m-2">来源</el-button>
                                </template>
                                <p class="popverp" v-html="si.todayPlEX"></p>
                            </el-popover>
                        </span>
                        <span class="itemSplit">|</span>
                        <span class="itemSi">
                            <label>盈亏</label>：<span>{{ geshiValue(si.yingKui, INDEXO.YKINDEX, undefined, INDEXO) }}</span>
                            <el-popover
                                v-if="si.yingKuiEX"
                                placement="bottom"
                                :width="600"
                                trigger="hover"
                            >
                                <template #reference>
                                    <el-button class="m-2">来源</el-button>
                                </template>
                                <p class="popverp" v-html="si.yingKuiEX"></p>
                            </el-popover>
                        </span>
                        <span class="itemSplit">|</span>
                        <span class="itemSi">
                            <label>盈亏率</label>：<span>{{ si.yingKuiLv}}%</span>
                            <el-popover
                                v-if="si.yingKuiLvEX"
                                placement="bottom"
                                :width="600"
                                trigger="hover"
                            >
                                <template #reference>
                                    <el-button class="m-2">来源</el-button>
                                </template>
                                <p class="popverp" v-html="si.yingKuiLvEX"></p>
                            </el-popover>
                        </span>
                        <span class="itemSplit">|</span>
                        <span class="itemSi">
                            <label>持仓</label>：<span>{{ geshiValue(si.chiCang, INDEXO.STOCKNUMINDEX, undefined, INDEXO) }}</span>
                            <el-popover
                                v-if="si.chiCangEX"
                                placement="bottom"
                                :width="600"
                                trigger="hover"
                            >
                                <template #reference>
                                    <el-button class="m-2">来源</el-button>
                                </template>
                                <p class="popverp" v-html="si.chiCangEX"></p>
                            </el-popover>
                        </span>
                        <span class="itemSplit">|</span>
                        <span class="itemSi">
                            <label>可用</label>：<span>{{  geshiValue(si.keYong, INDEXO.KYINDEX, undefined, INDEXO) }}</span>
                            <el-popover
                                v-if="si.keYongEX"
                                placement="bottom"
                                :width="600"
                                trigger="hover"
                            >
                                <template #reference>
                                    <el-button class="m-2">来源</el-button>
                                </template>
                                <p class="popverp" v-html="si.keYongEX"></p>
                            </el-popover>
                        </span>
                        <span class="itemSplit">|</span>
                        <span class="itemSi">
                            <label>成本</label>：<span>{{ geshiValue(si.chengBen, INDEXO.KEEPPRICEINDEX, undefined, INDEXO) }}</span>
                            <el-popover
                                v-if="si.chengBenEX"
                                placement="bottom"
                                :width="600"
                                trigger="hover"
                            >
                                <template #reference>
                                    <el-button class="m-2">来源</el-button>
                                </template>
                                <p class="popverp" v-html="si.chengBenEX"></p>
                            </el-popover>
                        </span>
                        <span class="itemSplit">|</span>
                        <span class="itemSi">
                            <label>市价</label>：<span>{{  geshiValue(si.assetPrice, INDEXO.ASSETPRICEINDEX, undefined, INDEXO) }}</span>
                            <el-popover
                                v-if="si.assetPriceEX"
                                placement="bottom"
                                :width="600"
                                trigger="hover"
                            >
                                <template #reference>
                                    <el-button class="m-2">来源</el-button>
                                </template>
                                <p class="popverp" v-html="si.assetPriceEX"></p>
                            </el-popover>
                        </span>
                        <span class="itemSplit">|</span>
                        <span class="itemSi">
                            <label>个股仓位</label>：<span>{{  si.ratio }}</span>
                            <el-popover
                                v-if="si.ratioEX"
                                placement="bottom"
                                :width="600"
                                trigger="hover"
                            >
                                <template #reference>
                                    <el-button class="m-2">来源</el-button>
                                </template>
                                <p class="popverp" v-html="si.ratioEX"></p>
                            </el-popover>
                        </span>
                        <span class="itemSplit">|</span>
                        <span class="selfUpdata">
                            <el-input v-model="si.selfUpNum" style="width: 140px" placeholder="请输入更新数据" />
                            <el-button @click="selfUpdata(si)">手动更新</el-button>
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <el-dialog v-model="downDialog" title="选择要下载的项目" width="600">
            <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
            >全选</el-checkbox>
            <el-checkbox-group
                v-model="excelItemSelect"
                @change="handleCheckChange"
            >
                <el-checkbox v-for="excelItem in excelItems" :key="excelItem" :label="excelItem" :value="excelItem">
                    {{ excelItem }}
                </el-checkbox>
            </el-checkbox-group>
            <div class="dialog-footer">
                <el-button @click="downDialog = false">取消</el-button>
                <el-button type="primary" @click="downExcel">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script setup>
    import { ref, onMounted, computed } from "vue";
    // import { useData, watch } from 'vitepress'
    import { ElMessage } from 'element-plus'
    import * as DealMainData from './dealMainData'
    import { geshiValue } from './dealMainData'
    import * as DealAccontData from './dealAccontData'
    import { deal60Data, selfUpDataF } from './deal60Data'
    import { calculateOData } from './calculate'
    import * as Nutil from './dealUtil'
    import * as Amp from './accontMap'
    import { excelItems } from './accontMap'
    import { strToJson, copyString } from '@com/util.js'
    import { useVirtualList } from '@vueuse/core'
    // 生成Excel表格并支持下载
    import * as XLSX from "xlsx";
    
    const allOpratedata = ref(Amp.opratedata)
    const accountList = ref([
        {
            bztype: '0',
            total: '--',
            sz: '--',
            kq: '--',
            ky: '--',
            yl: '--',
            todayPl: '--',
            ratio: '--'
        }
    ])
    const activeAccont = ref('0')
    const HKStockExchangeRateList = ref({})
    // const exchangeRateHKDtoUSD = ref('0.12813000')
    const exchangeRateHKDtoUSD = ref('')
    const INDEXO = ref({})
    const loading = ref(false)

    // 下载excel 相关
    const downDialog = ref(false)
    // 以选项，默认选择名称，当日盈亏，当日盈亏来源
    const excelItemSelect = ref(['名称', '当日盈亏', '当日盈亏来源'])
    // 不确定状态，全选按钮在全选与非全选之间的状态，可去掉
    const isIndeterminate = ref(false)
    // 全选按钮是否选中
    const checkAll = ref(false)

    onMounted(() => {
        // parseBtn()
    })

    const dataList = computed(() => {
        // 对数据根据账户类型进行分类
        let data117 = getActionData('117', 'all')
        if (!data117?.dealData?.data) {
            return []
        }
        let accontKey = {}, sortList = []
        // var forData = JSON.parse(JSON.stringify(data117.dealData.data))
        data117.dealData.data?.forEach((item) => {
            let bztype = Amp.bzTypeMap[item.wtAccountType]
            if (!accontKey[bztype]) {
                accontKey[bztype] = {
                    bztype,
                    list: [item]
                }
            } else {
                accontKey[bztype].list.push(item)
            }
        })
        for (let key in accontKey) {
            accontKey[key].list.sort((a, b) => {
                return b.shiZhi - a.shiZhi
            })
            // console.log('aaaa23333', JSON.parse(JSON.stringify(accontKey[key])))
            sortList.push(accontKey[key]) 
        }
        // console.log('dataList', JSON.parse(JSON.stringify(sortList)))
        return sortList
    });

    const showList = computed(() => {
        // console.log("aaaashowLIst", dataList.value.find(item => item.bztype === activeAccont.value)?.list)
        return dataList.value.find(item => item.bztype === activeAccont.value)?.list || []
    })
    
    const { list, containerProps, wrapperProps } = useVirtualList(
        showList,
        { itemHeight: 100},
    )

    // 提取数据
    function extract(value) {
        if (!value) {
            ElMessage.error('请粘贴全部数据')
            return
        }
        // 分割请求与应答，将请求移除，保留应答的部分
        const firstSplit = value.split('请求');
        const result = [];
        firstSplit.forEach(item => {
            item = `请求${item}`
            const secondSplit = item.split('应答');
            secondSplit?.forEach(si => {
                if (!si?.startsWith('请求')) {
                    result.push(`应答${si}`)
                }
            })
        });
        // 将保留下来的应答，根据action，填写到对应的输入框
        result?.forEach(ri => {
            let action
            let res
            try {
                res = strToJson(ri)
                // console.log('aaaaaaextract', res)
                action = res?.ACTION
            } catch (e) {
                // console.log('aaaaaaextract', e, ri)
            }
            if (!action) return
            let oprateItem = allOpratedata.value.find(item => {
                // 盘后的48230需要额外处理，因为返回了数个48230
                if (action === '48230') {
                    return item.action === action && res?.data?.data?.list 
                }
                return item.action === action
            })
            if (oprateItem) {
                oprateItem.showText = ri 
            }
        })
        ElMessage({
            message: '已完成',
            type: 'success',
            duration: 1000,
        })
    }

    // 刷新前 数据计算
    function calculate() {
        // console.log('aaaacalculater')
        console.log('aaa2333get', zget(dataList))
        let fareData = getActionData('5850')
        // console.log('aaaa23333fareData', fareData)
        if (!fareData) {
            ElMessage.error('请输入需要计算的费率，5850接口数据')
            return
        }
        let list = getActionData('117', 'all')?.dealData?.data
        if (!list) {
            ElMessage.error('请输入持仓117接口数据')
            return 
        }
        calculateOData(list, HKStockExchangeRateList.value, exchangeRateHKDtoUSD.value, fareData)

        // console.log('aaaa23333calculate', JSON.parse(JSON.stringify(dataList.value))) 
        // 顶部数据也要刷新，如总市值，浮动盈亏，当日盈亏都需要重新计算
        accountList.value = DealAccontData.calAccontData(accountList.value, dataList.value)
        ElMessage({
            message: '刷新前计算完毕',
            type: 'success',
            duration: 1000,
        })
    }

    // 清除数据
    function clearData(noInput = false) {
        accountList.value = []
        allOpratedata.value.forEach(item => {
            if (!noInput) {
                item.showText = ''
                item.data = ''
            }
            item.dealData = undefined
        })
    }

    // 盘后计算当日盈亏
    function afterCal(value) {
        if (!value) {
            ElMessage.error('请粘贴盘后接口数据')
            return
        }
        let afterData = strToJson(value)?.data?.data
        if (!afterData) {
            ElMessage.error('数据解析异常，请核验')
            return
        }
        let time = new Date().getTime()
        loading.value = true
        setTimeout(() => {
            try {
                let list = getActionData('117', 'dealData').data
                list?.forEach((chiCangItem) => {
                    let upInfo = ''
                    if(afterData?.list?.length) {
                        let obj = afterData?.list?.find((o)=>{
                            if (!o.trust_seat) o.trust_seat = undefined
                            if (!o.circulate_type) o.circulate_type = undefined
                            if (!o.stock_attr) o.stock_attr = undefined
                            
                            let A5Key = o.trust_seat == chiCangItem.fidtrustseat && o.circulate_type == chiCangItem.circulatype && o.stock_attr == chiCangItem.stbproperty;
                            return o.stock_code == chiCangItem.code && Amp.hsExchangeTypeMap[o.exchange_type] == chiCangItem.wtAccountType && o.stock_account == chiCangItem.account && A5Key;
                        });
                        if(obj){
                            if (chiCangItem.realBuyAmount - obj.real_buy_amount != 0) {
                                upInfo += `回报买入数量更新：${chiCangItem.realBuyAmount} -> ${obj.real_buy_amount}<br/>`
                            }
                            if (chiCangItem.realBuyBalance - obj.real_buy_balance!= 0) {
                                upInfo += `回报买入金额更新：${chiCangItem.realBuyBalance} -> ${obj.real_buy_balance}<br/>` 
                            }
                            if (chiCangItem.realSellAmount - obj.real_sell_amount!= 0) {
                                upInfo += `回报卖出数量更新：${chiCangItem.realSellAmount} -> ${obj.real_sell_amount}<br/>` 
                            }
                            if (chiCangItem.realSellBalance - obj.real_sell_balance!= 0) {
                                upInfo += `回报卖出金额更新：${chiCangItem.realSellBalance} -> ${obj.real_sell_balance}<br/>` 
                            }
                            chiCangItem.realBuyAmount = obj.real_buy_amount;
                            chiCangItem.realBuyBalance = obj.real_buy_balance;
                            chiCangItem.realSellAmount = obj.real_sell_amount;
                            chiCangItem.realSellBalance = obj.real_sell_balance;
                        }
                    }
                    
                    if(afterData?.price_list?.length){
                        let obj = afterData.price_list.find((o)=>{
                            return o.stock_code == chiCangItem.code && Amp.hsExchangeTypeMap[o.exchange_type] == chiCangItem.wtAccountType;
                        });
                        if(obj){
                            if (chiCangItem.preDrPrice - obj.pre_dr_price!= 0) {
                                upInfo += `前收盘价格更新：${chiCangItem.preDrPrice} -> ${obj.pre_dr_price}<br/>` 
                            }
                            chiCangItem.preDrPrice = obj.pre_dr_price;
                        }
                    }
                    DealMainData.getTodayPlItem(chiCangItem, exchangeRateHKDtoUSD.value, HKStockExchangeRateList.value)
                    chiCangItem.todayPlEX = upInfo + chiCangItem.todayPlEX;
    
                    accountList.value = DealAccontData.upAccountData(accountList.value, dataList.value)
                })
                ElMessage.success('盘后计算当日盈亏完毕')
            } catch (error) {
                console.error('Error:', error);
                ElMessage.error('数据解析异常，请核验')
            }
            console.log(new Date().getTime() - time, time)
            loading.value = false
        }, 50);
    }

    // 手动更新单条数据
    function selfUpdata(si) {
        if (isNaN(si.selfUpNum) || !si.selfUpNum) {
            ElMessage.error('请输入正确的数字')
            return 
        }
        if (si.selfUpNum == si.assetPrice) {
            ElMessage.error('输入的最新市值价无变更，请核对后重新输入')
            return
        }
        let fareData = getActionData('5850')
        console.log('aaaa23333fareData', fareData)
        selfUpDataF(si, HKStockExchangeRateList.value, exchangeRateHKDtoUSD.value, fareData)
        // console.log('aaaa23333up60', res) 
        // 顶部数据也要刷新，如总市值，浮动盈亏，当日盈亏都需要重新计算
        accountList.value = DealAccontData.upAccountData(accountList.value, dataList.value)
        ElMessage.success('手动刷新完毕')
        console.log('aaaa233', si)
    }

    // 60刷新
    function up60(value) {
        if (!value) {
            ElMessage.error('请粘贴60接口数据')
            return
        }
        let data60 = strToJson(value)
        let fareData = getActionData('5850')
        console.log('aaaa23333fareData', fareData)
        let list = getActionData('117', 'all').dealData.data
        // 60数据刷新
        deal60Data(data60, list, HKStockExchangeRateList.value, exchangeRateHKDtoUSD.value, fareData)
        // console.log('aaaa23333up60', res) 
        // 顶部数据也要刷新，如总市值，浮动盈亏，当日盈亏都需要重新计算
        accountList.value = DealAccontData.upAccountData(accountList.value, dataList.value)
        ElMessage.success('刷新完毕')
    }

    // 切换账户
    function changeActiveAccount(bztype) {
        activeAccont.value = bztype
    }

    function parseBtn() {
        const list = allOpratedata.value
        if (!list.some(item => item.action === '117' && item.showText)) {
            accountList.value = []
            getActionData('117', 'all').dealData = undefined
            ElMessage.error('请粘贴117持仓接口数据')
            return 
        }
        
        list.forEach((item) => {
            if (item.action === 'all') return
            if (item.showText) {
                try {
                    // 将字符串转化为json对象
                    if (item.showText) {
                        item.data = strToJson(item.showText) 
                    } else {
                        item.data = ''
                    }

                    // 处理5107数据，获取港币兑换人民币汇率
                    if (item.action === '5107') {
                        HKStockExchangeRateList.value = DealMainData.getHKStockExchangeRate(strToJson(item.showText))
                    }

                    // 处理5696数据，获取港币兑美元汇率
                    if (item.action === '5696') {
                        // console.log('aaaitemdata', JSON.parse(JSON.stringify(item.data)))
                        try {
                            exchangeRateHKDtoUSD.value = item?.data?.GRID0[1]?.split('|')?.[0] || exchangeRateHKDtoUSD.value
                        } catch (error) {
                            console.error('5659error', error)                            
                        }
                    }
                    
                    // 处理5850数据，获取费率
                    if (item.action === '5850') {
                        if (item.data?.GRID0) {
                            item.data = DealMainData.parseFareData(item.data, Amp.exchangeTypeMap)
                        }
                        // console.log('aaaa2333item5850', JSON.parse(JSON.stringify(item)))
                    }

                } catch (error) {
                    console.error(error)                    
                }
            } 
        })

        // 处理117数据，转化为对象
        let data117 = getActionData('117', 'all')
        data117.dealData = DealMainData.turn117ToObj(data117.data, exchangeRateHKDtoUSD.value)
        INDEXO.value = data117.dealData.INDEX

        // 处理5106数据，转化为对象
        let data5106 = getActionData('5106', 'all')
        if (data5106.showText) {
            data5106.dealData = DealMainData.turn5106ToObj(data5106.data, HKStockExchangeRateList.value)
            data117.dealData.data = data117.dealData.data.concat(data5106.dealData.data)
        }

        // console.log('aaadata5106', JSON.parse(JSON.stringify(data117.dealData.data)))
        initAccount(data117.dealData.data, data117.data, data5106.data)
    }

    function initAccount(gridData, oData, oData1) {
        // console.log('initAccount', gridData, oData, oData1)
        if(!oData.GRID2){
            return;
        }
        // A5柜台
        if(oData.APEX_A5_SPECFLAG && oData.APEX_A5_SPECFLAG == '1'){
            const data = getActionData('5735')
            // if (!data) {
            //     ElMessage.error('请输入5735接口数据')
            //     return 
            // }
            // console.log('data5735', JSON.parse(JSON.stringify(data)))
            if (!data || data.ERRORNO < 0) {
                oData.rmbEX = `取值117接口 TOTALASSET_RMB 字段值：${oData.TOTALASSET_RMB}`
                oData.usdEX = `取值117接口 TOTALASSET_USD 字段值：${oData.TOTALASSET_USD}`
                oData.hkEX = `取值117接口 TOTALASSET_HK 字段值：${oData.TOTALASSET_HK}`
                accountList.value = DealAccontData.computeAccountData(gridData, oData, oData1, undefined, undefined);
                return;
            }
            // console.log('aaa23333GRID0', GRID0)
            data.GRID0.shift();            
            data.GRID0.forEach((o)=>{
                var arr = o.split('|');
                switch(arr[data.MONEYTYPEINDEX]){
                    case '0':
                        oData.TOTALASSET_RMB = new Big(oData.TOTALASSET_RMB).plus(new Big(arr[data.PRODMARKETVALUEINDEX])).toFixed(2).toString();
                        oData.rmbEX = `取值117接口 TOTALASSET_RMB 字段加上5735接口多金市值 PRODMARKETVALUEINDEX 字段值：${oData.TOTALASSET_RMB} + ${arr[data.PRODMARKETVALUEINDEX]} = ${oData.TOTALASSET_RMB}`
                        break;
                    case '1':
                        oData.TOTALASSET_USD = new Big(oData.TOTALASSET_USD).plus(new Big(arr[data.PRODMARKETVALUEINDEX])).toFixed(2).toString();
                        oData.usdEX = `取值117接口 TOTALASSET_USD 字段加上5735接口多金市值 PRODMARKETVALUEINDEX 字段值：${oData.TOTALASSET_USD} + ${arr[data.PRODMARKETVALUEINDEX]} = ${oData.TOTALASSET_USD}`
                        break;
                    case '2':
                        oData.TOTALASSET_HK = new Big(oData.TOTALASSET_HK).plus(new Big(arr[data.PRODMARKETVALUEINDEX])).toFixed(2).toString();
                        oData.hkEX = `取值117接口 TOTALASSET_HK 字段加上5735接口多金市值 PRODMARKETVALUEINDEX 字段值：${oData.TOTALASSET_HK} + ${arr[data.PRODMARKETVALUEINDEX]} = ${oData.TOTALASSET_HK}`
                        break;
                    default:
                        break;
                }
            });
            // console.log('aaa23333', oData)
            accountList.value = DealAccontData.computeAccountData(gridData, oData, oData1, undefined, undefined);
            // that.getOTCData(function(OTCData, OTCStatus){
            // });
        }
        else{
            var _oData = JSON.parse(JSON.stringify(oData));
            var data116 = getActionData('116');
            let adata = DealAccontData.getAllZongZiChan(_oData, data116)
            // console.log('aaaa2333adata', adata)
            oData.TOTALASSET_RMB =  adata.TOTALASSET_RMB;
            oData.TOTALASSET_USD =  adata.TOTALASSET_USD;
            oData.TOTALASSET_HK =  adata.TOTALASSET_HK;
            oData.rmbEX =  adata.rmbEX;
            oData.usdEX =  adata.usdEX;
            oData.hkEX =  adata.hkEX;
            var accontArr = DealAccontData.computeAccountData(gridData, oData, oData1, undefined, undefined);
            accountList.value = accontArr
            // console.log('accontArr', accontArr)
            // DealAccontData.computeAccountData(gridData, oData, oData1, OTCData, OTCStatus);
                // that.getOTCData(function(OTCData, OTCStatus){
                // });
        }
    }

    const handleCheckAllChange = (val) => {
        excelItemSelect.value = val ? excelItems : []
        isIndeterminate.value = false
    }
    const handleCheckChange = (value) => {
        const checkedCount = value.length
        checkAll.value = checkedCount === excelItems.length
        isIndeterminate.value = checkedCount > 0 && checkedCount < excelItems.length
    }

    function downExcel() {
        if (!excelItemSelect.value?.length) {
            ElMessage.error('请选择要下载的项目')
            return
        }
        if(!dataList.value?.length){
            ElMessage.error('当前没有可下载数据')
            return
        }
        downDialog.value = false

        const wb = XLSX.utils.book_new();
        // 遍历持仓数据，生成每个账户的Excel表格，每个账户都是一个sheet，sheet名称为账户类型
        dataList.value?.forEach(listItem => {
            let data = [excelItemSelect.value]
            if (!listItem.list?.length) return
            listItem.list.forEach(item => {
                let dataI = []
                excelItemSelect.value.forEach(title => {
                    // 将解释中的换行符替换为空格
                    dataI.push(item[Amp.excelTitleMap[title]].replace(/<br\s*\/?>/gi, ''))
                })
                data.push(dataI)
            })
            const ws = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, Amp.moneyTypeMap[listItem.bztype]);
            // console.log('aaa2333data', data)
        })
        
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'parseData.xlsx';
        a.click();
        URL.revokeObjectURL(url);
    }

    function copyDetail(item) {
        // let str = item.data ? JSON.stringify(item.data, null, 4) : item.showText
        copyString(item.showText)
    }

    // 获取对应action 输入框中的数据，可以换key获取指定的对应数据
    function getActionData(action, key = 'data') {
        if (key === 'all') return allOpratedata.value.find(item => item.action === action)
        return allOpratedata.value.find(item => item.action === action)[key] 
    }

</script>
  
  
<style lang="less" >
    @import './index.less';
</style>