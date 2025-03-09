<template>
    <div class="parseHoldingData">
        <div class="oprateBtn">
            <el-button type="primary" @click="parseBtn">解析</el-button>
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
                            <el-button class="m-2">详情</el-button>
                        </template>
                    </el-popover>
                    <el-button v-if="oprateItem.showText" @click="$copyString(oprateItem.showText)">复制</el-button>
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
                            v-if="item.totalFrom"
                            placement="bottom"
                            :width="600"
                            trigger="hover"
                            :content="item.totalFrom"
                        >
                            <template #reference>
                                <el-button  type="primary" class="m-2">累加标注</el-button>
                            </template>
                        </el-popover>
                        <span class="explan" v-if="item.totalEX">---{{ item.totalEX }}</span>
                        
                    </p>
                    <p>
                        <label>总市值</label>：
                        <span>{{ item.sz }}</span>
                        <span class="explan" v-if="item.szEX">---{{ item.szEX }}</span>
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
                        <span class="explan" v-if="item.ylEX">---{{ item.ylEX }}</span>
                    </p>
                    <p>
                        <label>当日参考盈亏</label>：
                        <span>{{ item.todayPl }}</span>
                        <el-popover
                            v-if="item.todayPl !== '--'"
                            placement="bottom"
                            :width="600"
                            trigger="hover"
                            :content="item.todayPlFrom"
                        >
                            <template #reference>
                                <el-button  type="primary" class="m-2">累加标注</el-button>
                            </template>
                        </el-popover>
                        <span class="explan" v-if="item.todayPlEX">---{{ item.todayPlEX }}</span>
                    </p>
                    <p>
                        <label>仓位百分比</label>：
                        <span>{{ Nutil.toPercentage(item.ratio) }}</span>
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
                                <label>市值</label>：<span>{{ si.shiZhiShow}}</span>
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
                                <label>盈亏</label>：<span>{{ si.yingKuiShow}}</span>
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
                                <label>盈亏率</label>：<span>{{ si.yingKuiLvShow}}%</span>
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
                                <label>持仓</label>：<span>{{ si.chiCangShow}}</span>
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
                                <label>可用</label>：<span>{{ si.keYongShow}}</span>
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
                                <label>成本</label>：<span>{{ si.chengBenShow}}</span>
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
                                <label>市价</label>：<span>{{ si.assetPriceShow}}</span>
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
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from "vue";
    import { ElMessage } from 'element-plus'
    import * as DealMainData from './dealMainData'
    import * as DealAccontData from './dealAccontData'
    import * as Nutil from './dealUtil'
    import * as Amp from './accontMap'
    import * as tUtil from '../comUtil/tabelUtil'
    // import * as mockData from './holdMock'
    import * as mockData from './holdA5Mock'
    

    const allOpratedata = ref([
        {
            title: '117持仓接口',
            action: '117',
            data: "",
            // showText: "",
            showText: JSON.stringify(mockData.mockdata117, null, 4) ,
            dealData: {},
        },
        {
            title: '116资金账号',
            action: '116',
            data: "",
            showText: "",
            // showText: JSON.stringify(mockData.mockdata116, null, 4) ,
        },
        {
            title: '5106港股通持仓',
            action: '5106',
            data: "",
            showText: JSON.stringify(mockData.mockdata5106, null, 4)
        },
        {
            title: '5107获取港股通汇率',
            action: '5107',
            data: "",
            showText: JSON.stringify(mockData.mockdata5107, null, 4),
        },
        {
           title: '5659港币美元汇率',
           action: '5659',
           data: "",
           showText: JSON.stringify(mockData.mockdata5696, null, 4), 
        },
        {
            title: '5850客户费率',
            action: '5850',
            data: "",
            showText: "",
        },
        {
            title: '60刷新',
            action: '60',
            data: "",
            showText: "",
            isUpBtn: true,
        },
    ])
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
    const dataList = ref([])
    const activeAccont = ref('0')
    const HKStockExchangeRateList = ref({})
    const exchangeRateHKDtoUSD = ref('0.12813000')



    onMounted(() => {
        parseBtn()
    })

    // 60刷新
    function up60(value) {
        if (!value) {
            ElMessage.error('请输入60接口数据')
            return
        }
        console.log('aaaa23333up60') 
    }

    // 切换账户
    function changeActiveAccount(bztype) {
        activeAccont.value = bztype
    }

    function parseBtn() {
        const list = allOpratedata.value
        if (!list.some(item => item.action === '117' && item.showText)) {
            ElMessage.error('请输入117持仓接口数据')
            return 
        }
        

        list.forEach((item) => {
            if (item.showText) {
                try {
                    // 将字符串转化为json对象
                    item.data = strToJson(item.showText) 

                    // 处理117数据，转化为对象
                    if (item.action === '117') {
                        item.dealData = DealMainData.turn117ToObj(item.data, exchangeRateHKDtoUSD.value)
                    }

                    // 处理港股通5106数据，转化为对象
                    if (item.action === '5106' && item.data) {
                        // 如果有人民币港股数据，则需要有对应的汇率，否则无法计算
                        let data5107 = getActionData('5107', 'all')
                        if (data5107.showText) {
                            try {
                                HKStockExchangeRateList.value = DealMainData.getHKStockExchangeRate(strToJson(data5107.showText))
                            } catch (error) {
                                console.log('5107error', error)
                            }
                        } else {
                            ElMessage.error('请输入5107港股通汇率数据')
                        }
                        item.dealData = DealMainData.turn5106ToObj(item.data, HKStockExchangeRateList.value)
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

        // 对数据根据账户类型进行分类
        let accontKey = {}, sortList = []
        data117.dealData.data.forEach((item) => {
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
            sortList.push(accontKey[key]) 
        }
        dataList.value = sortList
        // console.log('dataList', JSON.parse(JSON.stringify(dataList.value)))

        console.log('aaadata5106', JSON.parse(JSON.stringify(data117.dealData.data)))
        initAccount(data117.dealData.data, data117.data, data5106.data)
    }

    function initAccount(gridData, oData, oData1) {
        console.log('initAccount', gridData, oData, oData1)
        var that = this;
        if(!oData.GRID2){
            return;
        }
        // A5柜台
        if(oData.APEX_A5_SPECFLAG && oData.APEX_A5_SPECFLAG == '1'){
            service_ptjy.require5735({}).then(function(data){
                if (data.ERRORNO < 0) {
                    alert(data.ERRORMESSAGE);
                    oData.TOTALASSET_RMB = '--';
                    oData.TOTALASSET_USD = '--';
                    oData.TOTALASSET_HK = '--';
                    DealAccontData.computeAccountData(gridData, oData, oData1, undefined, false);
                    return;
                }
                data.GRID0.shift();            
                data.GRID0.forEach((o)=>{
                    var arr = o.split('|');
                    switch(arr[data.MONEYTYPEINDEX]){
                        case '0':
                            oData.TOTALASSET_RMB = new Big(oData.TOTALASSET_RMB).plus(new Big(arr[data.PRODMARKETVALUEINDEX])).toFixed(2).toString();
                            break;
                        case '1':
                            oData.TOTALASSET_USD = new Big(oData.TOTALASSET_USD).plus(new Big(arr[data.PRODMARKETVALUEINDEX])).toFixed(2).toString();
                            break;
                        case '2':
                            oData.TOTALASSET_HK = new Big(oData.TOTALASSET_HK).plus(new Big(arr[data.PRODMARKETVALUEINDEX])).toFixed(2).toString();
                            break;
                        default:
                            break;
                    }
                });
                that.getOTCData(function(OTCData, OTCStatus){
                    DealAccontData.computeAccountData(gridData, oData, oData1, OTCData, OTCStatus);
                });
            });
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
        return JSON.parse(str)
    }
  
</script>
  
  
<style lang="less" >
    @import './index.less';
</style>