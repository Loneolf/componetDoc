<template>
    <div class="parseHoldingData">
        <div class="oprateBtn">
            <el-button type="primary" @click="parseBtn">解析117</el-button>
            <el-button type="primary" @click="calculate">数据计算</el-button>
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
                            <el-button class="m-2" @click="$copyString(oprateItem.showText)">详情</el-button>
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
                </p>
                <textarea v-model="oprateItem.showText" class="textarea"  />
            </div>
        </div>
        <div class="exchange">
            <label>请输入港币兑美元汇率</label><el-input v-model="exchangeRateHKDtoUSD" style="width:240px" placeholder="如果没有沪B转H，无需填写该值" />
        </div>
        <br />
        <div class="parseContent">
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
            <div v-if="dataList.length" class="listBox">
                <div 
                    class="listWrap" 
                    v-for="item in dataList" 
                    :key="item.bztype" 
                    v-show="item.bztype === activeAccont"
                >
                    <div class="listItem" v-for="si in item.list" :key="si.domKey">
                        <p>
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
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
    import { ref, onMounted, computed } from "vue";
    import { ElMessage } from 'element-plus'
    import * as DealMainData from './dealMainData'
    import { geshiValue } from './dealMainData'
    import * as DealAccontData from './dealAccontData'
    import { deal60Data } from './deal60Data'
    import { calculateOData } from './calculate'
    import * as Nutil from './dealUtil'
    import * as Amp from './accontMap'
    import * as tUtil from '../comUtil/tabelUtil'
    
    

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
    // const dataList = ref([])
    const activeAccont = ref('0')
    const HKStockExchangeRateList = ref({})
    // const exchangeRateHKDtoUSD = ref('0.12813000')
    const exchangeRateHKDtoUSD = ref('')
    const INDEXO = ref({})


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
            console.log('aaaa23333', JSON.parse(JSON.stringify(accontKey[key])))
            sortList.push(accontKey[key]) 
        }
        console.log('dataList', JSON.parse(JSON.stringify(sortList)))
        return sortList
    });

    function calculate() {
        console.log('aaaacalculater')
        let fareData = getActionData('5850')
        let list = getActionData('117', 'all').dealData.data
        let res = calculateOData(list, HKStockExchangeRateList.value, exchangeRateHKDtoUSD.value, fareData)
        // console.log('aaaa23333up60', res) 
        // 顶部数据也要刷新，如总市值，浮动盈亏，当日盈亏都需要重新计算
        // accountList.value = DealAccontData.upAccountData(accountList.value, res)
    }

    function clearData(noInput = false) {
        accountList.value = []
        allOpratedata.value.forEach(item => {
            if (!noInput) {
                item.showText = ''
            }
            item.dealData = undefined
        })
    }

    // 60刷新
    function up60(value) {
        if (!value) {
            ElMessage.error('请输入60接口数据')
            return
        }
        // let data60 = getActionData('60')
        let data60 = strToJson(value)
        let fareData = getActionData('5850')
        console.log('aaaa23333fareData', fareData)
        let list = getActionData('117', 'all').dealData.data
        // 60数据刷新
        let res = deal60Data(data60, list, HKStockExchangeRateList.value, exchangeRateHKDtoUSD.value, fareData)
        // console.log('aaaa23333up60', res) 
        // 顶部数据也要刷新，如总市值，浮动盈亏，当日盈亏都需要重新计算
        accountList.value = DealAccontData.upAccountData(accountList.value, res)
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
            ElMessage.error('请输入117持仓接口数据')
            return 
        }
        

        list.forEach((item) => {
            if (item.showText) {
                try {
                    // 将字符串转化为json对象
                    if (item.showText) {
                        item.data = strToJson(item.showText) 
                    } else {
                        item.data = ''
                    }
                    // console.log('aaa2333', item.data)
                    // 处理117数据，转化为对象
                    if (item.action === '117') {
                        item.dealData = DealMainData.turn117ToObj(item.data, exchangeRateHKDtoUSD.value)
                        INDEXO.value = item.dealData.INDEX
                    }

                    // 处理港股通5106数据，转化为对象
                    if (item.action === '5106' && item.data) {
                        // 如果有人民币港股数据，则需要有对应的汇率，否则无法准确计算
                        let data5107 = getActionData('5107', 'all')
                        if (data5107.showText) {
                            try {
                                HKStockExchangeRateList.value = DealMainData.getHKStockExchangeRate(strToJson(data5107.showText))
                            } catch (error) {
                                console.error('5107error', error)
                            }
                        } else {
                            ElMessage.error('请输入5107港股通汇率数据')
                        }
                        item.dealData = DealMainData.turn5106ToObj(item.data, HKStockExchangeRateList.value)
                    }
                    // 处理5696数据，获取港币兑美元汇率
                    if (item.action === '5696') {
                        console.log('aaaitemdata', JSON.parse(JSON.stringify(item.data)))
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
                        console.log('aaaa2333item', JSON.parse(JSON.stringify(item)))
                    }
                } catch (error) {
                    console.error(error)                    
                }
            } 
        })
        let data117 = getActionData('117', 'all')

        let data5106 = getActionData('5106', 'all')
        if (data5106?.dealData?.data?.length) {
            data117.dealData.data = data117.dealData.data.concat(data5106.dealData.data)
        }

        // console.log('aaadata5106', JSON.parse(JSON.stringify(data117.dealData.data)))
        initAccount(data117.dealData.data, data117.data, data5106.data)
    }

    function initAccount(gridData, oData, oData1) {
        console.log('initAccount', gridData, oData, oData1)
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
            console.log('aaa23333', oData)
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
            console.log('accontArr', accontArr)
            // DealAccontData.computeAccountData(gridData, oData, oData1, OTCData, OTCStatus);
                // that.getOTCData(function(OTCData, OTCStatus){
                // });
        }
    }

    // 获取对应action 输入框中的数据，可以换key获取指定的对应数据
    function getActionData(action, key = 'data') {
        if (key === 'all') return allOpratedata.value.find(item => item.action === action)
        return allOpratedata.value.find(item => item.action === action)[key] 
    }

    function strToJson(str) {
        if (str.includes("GRID0=") || str.includes("Grid=")) {
            str = str.replace(/Grid=/g, 'GRID0=');
            return DealMainData.serveDataToObj(str)
        }
        return JSON.parse(str)
    }
  
</script>
  
  
<style lang="less" >
    @import './index.less';
</style>