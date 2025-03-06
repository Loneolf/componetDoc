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
                    <el-button  type="primary" v-if="oprateItem.isUpBtn" @click="oprateItem.showText = ''">更新</el-button>
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
                            <label>当日盈亏</label>：<span>{{ si.todayPl}}</span>
                            <el-popover
                                v-if="si.todayPlEX"
                                placement="bottom"
                                :width="800"
                                trigger="hover"
                            >
                                <template #reference>
                                    <el-button class="m-2">计算过程</el-button>
                                </template>
                                <p class="popverp" v-html="si.todayPlEX"></p>
                            </el-popover>
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
    import * as mockData from './holdMock'
    

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
            // showText: "",
            showText: JSON.stringify(mockData.mockdata116, null, 4) ,
        },
        {
            title: '5735多金产品市值',
            action: '5735',
            data: "",
            showText: "",
        },
        {
            title: '5107获取港股通汇率',
            action: '5107',
            data: "",
            showText: "",
        },
        {
           title: '5659港币美元汇率',
           action: '5659',
           data: "",
           showText: JSON.stringify(mockData.mockdata5696, null, 4), 
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
    const ggtMiddleRate = ref('')
    const exchangeRateHKDtoUSD = ref('0.12813000')



    onMounted(() => {
        parseBtn()
    })

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
                    item.data = strToJson(item.showText) 
                    if (item.action === '117') {
                        item.dealData = DealMainData.turn117ToObj(item.data, exchangeRateHKDtoUSD.value)
                        let accontKey = {}, sortList = []
                        item.dealData.data.forEach((item) => {
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
                        console.log('dataList', JSON.parse(JSON.stringify(dataList.value)))
                    }
                } catch (error) {
                    console.error(error)                    
                }
            } 
        })
        let data117 = getActionData('117', 'all')
        // console.log('aaadata117', JSON.parse(JSON.stringify(data117)))
        initAccount(data117.dealData.data, data117.data)
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
            console.log('aaaa2333adata', adata)
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