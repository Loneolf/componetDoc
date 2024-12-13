'use strict';

//该模块应用jquery，因所有页面均引用，在此不单独引用jquery

define(function (require, exports, module) {
    require('./css/index.css#');
    var fun = require('./fun')
    //初始化
    function init(componentsName, Vue) {
        Vue = Vue ? Vue : window.Vue;
        if (!componentsName) {
            console.error('缺少组件名称');
            return false;
        }
        if (!Vue) {
            console.error('加载Vue组件失败！');
            return false;
        }
        var timer
        var lastSearchId = 0
        var badgeConfig = {
            '京': {
                color: '#FF7F0E',
                bgColor: '#fff2e6',
            },
            '深': {
                color: '#136ef2',
                bgColor: '#e6edff',
            },
            '沪': {
                color: '#FD242A',
                bgColor: '#fff4f4',
            },
            'df': {
                color: '#ffffff',
                bgColor: '#fd242a',
            }
        }
        Vue.component(componentsName, {
			props: {
				type: {
				  type: String,
				  default: 'normal'
				},
				placeholder: {
					type: String,
				  	default: '名称/代码/首字母'
				},
				maxLen: {
					type: Number,
				  	default: 6
				},
				isrepetpop: {
					type: Boolean,
					default: false
				}
			},
            
            template: "\n<div class=\"searchcomBox\">\n    <div class=\"searchInput\">\n        <img class=\"seachIcon\" src=\"./img/seachIcon.png\"/>\n        <input \n            v-model=\"searchValue\" \n            @click=\"inputClick\" \n            :placeholder=\"placeholder\"\n        />\n        <img v-if=\"searchValue\" class=\"clear\" src=\"./img/clear.png\" @click.stop=\"clearSeach\">\n    </div>\n    <van-popup\n        v-model=\"isShowSeachPop\"\n        position=\"bottom\"\n        :close-on-click-overlay=\"false\"\n        @click-overlay=\"onCancel\"\n    >\n        <div class=\"search-box\" ref=\"searchbox\">\n            <div class=\"width-center vantSearchBox\">\n                <van-search\n                    v-model=\"searchValue\"\n                    :placeholder=\"placeholder\"\n                    @input=\"onInput\"\n                    shape=\"round\"\n                    clearable\n                    ref=\"searchRef\"\n                    :maxlength=\"maxLen\"\n                ></van-search>\n                <div class=\"close\" @click=\"onCancel\">\u5173\u95ED</div>\n            </div>\n        </div>\n        <div class=\"search-list width-center\">\n            <div class=\"empty\" v-show=\"isEmpty && searchValue != ''\">\n                <img src=\"./img/noData.png\" alt=\"\" />\n                <div class=\"empty-text\">\u672A\u627E\u5230\u641C\u7D22\u7ED3\u679C</div>\n                <div\n                    class=\"empty-button\"\n                    v-show=\"searchValue.length === 6 && !isNaN(searchValue)\"\n                    @click=\"useCode\"\n                >\n                    \u76F4\u63A5\u4F7F\u7528\u6B64\u4EE3\u7801\n                </div>\n            </div>\n            <div v-show=\"!isEmpty && searchValue\">\n                <div\n                    class=\"search-list-item\"\n                    v-for=\"(item, i) in searchList\"\n                    :key=\"i\"\n                    @click.stop=\"itemClick(item)\"\n                >\n                    <div class=\"badge\" :style=\"{ color: item.label.color,background: item.label.bgColor}\">\n                        {{ item.label.value }}\n                    </div>\n                    <span v-html=\"item.stockCode\" class=\"stock-code\"></span>\n                    <span v-html=\"item.stockName\" class=\"stock-name\"></span>\n                </div>\n            </div>\n        </div>\n        <van-popup v-model=\"confrimPopUp\">\n            <div class='confirmContent'>\n                <div \n                    class='confirmItem'\n                    v-for='item in searchList' \n                    @click='itemClick(item, true)'\n                    :key='item.rawName'\n                >\n                    <span class='code'>{{item.rawCode}}</span>\n                    <span class='name'>{{item.rawName}}</span>\n                </div>\n            </div>\n        </van-popup>\n    </van-popup>\n    \n</div>\n",

            data: function data() {
                return {
                    componentName: componentsName,
                    isShowSeachPop: false,
                    isEmpty: false,
                    searchValue: '',
                    searchList: [],
					confirmPopData: [],
					confrimPopUp: false,
                };
            },
            mounted: function mounted() {},
            methods: {
                itemClick: function (item, noRepet, toUse) {
					console.log('aaaavalue', item, this.isrepetpop, noRepet)
					var that = this
					// item.rawCode = 160105
					if (!this.isrepetpop || noRepet) {
						getInforBack(this)
						return
					}
					fun.action5061(item.rawCode, that.type, function (data) {
						var res = []
						for (var i = 1; i < data.GRID0.length; i++) {
							var itemArray = data.GRID0[i].split('|');
							var resi = {
								rawCode: itemArray[data.STOCKCODEINDEX],
								rawName: itemArray[data.STOCKNAMEINDEX],
								stockCode: itemArray[data.STOCKCODEINDEX],
								stockName: itemArray[data.STOCKNAMEINDEX],
								label: item.label,
								mkType: itemArray[data.WTACCOUNTTYPEINDEX],
							};
							res.push(resi);
						}
						if (res.length >= 2) {
							that.confrimPopUp = true
							that.searchList = res
							that.confirmPopData = res
							that.searchValue = item.rawCode
						} else {
							getInforBack(that)
						}
					}, function () {
						getInforBack(that)
					})
					function getInforBack(vm) {
						vm.confrimPopUp = false
						vm.isShowSeachPop = false
						if (vm.searchValue != item.rawCode) {
							vm.searchValue = item.rawCode
						}
						item.stockCode = '<span class="red">' + item.rawCode + '</span>'
						if (!toUse) {
							vm.searchList = [item]
						}
						vm.$emit('search', {code: item.rawCode, mkType: item.mkType});
					}
				},

                onCancel: function () {
                    this.isShowSeachPop = false
					if (!this.searchValue) {
						this.$emit('search', {});
					}
                },
                useCode : function () {
					this.itemClick({rawCode: this.searchValue}, true, true)
				},
                onInput: function () {
					if (this.confrimPopUp) return
					if (timer) clearTimeout(timer)
					var that = this
					var sv = this.searchValue
					var reg = /^\d+$/g
					var reg3 = /^[a-zA-Z]+$/g
					var reg2 = /^[\u4e00-\u94a5]+$/g
					if (reg.test(sv) || reg3.test(sv)) {
						this.maxLen = 6
					} else if (reg2.test(sv)) {
						this.maxLen = 8
					}
					timer = setTimeout(function () {
						that.getSearchData(sv, function (result) {
							// console.log(result)
							that.searchList = result
							if (result.length > 0) {
								that.isEmpty = false
							}
							if (result.length == 1) {
								if (that.searchValue.length > 6) {
									// itemClick(result[0])
								}
							} else if (result.length == 0) {
								that.isEmpty = true
								if (that.searchValue.length === 1) {
									that.isEmpty = false
								}
							}
						})
					}, 300)
				},
                getSearchData: function (stockCode, fnSuccess) {
					var result = []
					var queryId = ++lastSearchId
					var sl = this.searchValue
					var that = this
					if (typeof stockCode == 'undefined' || stockCode == '' ||stockCode.length === 1) {
						//1位时不调用接口
						fnSuccess(result)
						return
					}
					var dealSearchResult = function (data){
						if (queryId != lastSearchId) {
							return
						}
						if (data.BINDATA) {
							var arr = data.BINDATA.split('|')
							var item = {stockCode: '',stockName: '',}
							for (var i = 0; i < arr.length; i++) {
								var regExp = new RegExp(sl)
								if (i % 2 == 0) {
									item.rawCode = arr[i]
									item.stockCode = arr[i].replace(regExp,'<span class="red">' + sl + '</span>')
								} else {
									item.rawName = arr[i]
									item.stockName = arr[i].replace(regExp,'<span class="red">' + sl + '</span>')
									result.push(JSON.parse(JSON.stringify(item)))
								}
							}
							if (data.STOCKLABEL) {
								var stockLabel = data.STOCKLABEL.split('|')
								for (var i = 0; i < result.length; i++) {
									var v = badgeConfig[stockLabel[i]] || badgeConfig.df
									// console.log('aaaa2333', stockLabel[i])
									result[i].label = {
										value: stockLabel[i],
										color: v.color,
										bgColor: v.bgColor,
									}
								}
							}
							fnSuccess(result)
						} else {
							fnSuccess(result)
						}
					}
					var testData = {
						"ERRORMESSAGE": "搜索到多个相近股票代码,请选择!",
						"MAXCOUNT": "110",
						"MARKETFLAG": "1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|2|1|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|",
						"REQNO": "100",
						"THROUGHFLAG": "4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|4|0|0|4|4|4|4|4|4|4|4|4|4|4|4|4|0|0|0|4|4|4|4|0|0|0|4|0|4|0|0|4|4|4|4|0|0|0|4|4|4|0|4|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|",
						"PRODUCTTYPE": "0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|",
						"INSTRUMENTTYPE": "0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|",
						"ERRORNO": "-206010",
						"TZTUSEDTIME": "218",
						"COMMMODE": "4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4361|4361|4355|4355|4355|4355|4355|4355|4355|4355|4355|4355|4355|4611|4360|24832|24832|24832|24832|24832|24832|24832|24832|25088|25088|25088|25088|25088|25088|25088|25088|24416|24416|",
						"ACTION": "32",
						"WARRANTTYPE": "0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|",
						"NEWMARKETNO": "4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4353|4361|4361|4355|4355|4355|4355|4355|4355|4355|4355|4355|4355|4355|4611|4360|24832|24832|24832|24832|24832|24832|24832|24832|25088|25088|25088|25088|25088|25088|25088|25088|24416|24416|",
						"STOCKPROP": "xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx000000000000000000000000001010000x0000000000|xxx000000000000000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx000000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000000000000000000001010000x0000000000|xxx000000000000000000000000001010000x0000000001|xxx001000000000000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000000000000000000001010000x0000000000|xxx000000000000000000000000001010000x0000000001|xxx000000000000000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx000000000000000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx000000000000000000000000001010000x0000000000|xxx001000000000000000000000001010000x0000000000|xxx000000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx000000000000000000000000001010000x0000000001|xxx000000000000000000000000001010000x0000000001|xxx000000000000000000000000001010000x0000000001|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx000000000000000000000000001010000x0000000000|xxx110000000010000000000000001010000x0000000000|xxx000000000000000000000000001010000x0000000000|xxx000000000000000000000000001130000x0000000000|xxx000000000000000000000000001130000x0000000000|xxx000000000000000000000000101210000x0000000010|xxx000000000000000000000000101210000x0000000010|xxx000000000000000000000000101210000x0000000010|xxx000000000000000000000000101210000x0000000010|xxx000000000000000000000000101210000x0000000010|xxx000000000000000000000000101210000x0000000010|xxx000000000000000000000000001060000x0000000000|xxx000000000000000000000000001060000x0000000000|xxx000000000000000000000000001060000x0000000000|xxx000000000000000000000000001060000x0000000000|xxx000000000000000000000000001060000x0000000000|xxx000000000000000000000000102210000x0000000010|xxx000000000000000000000000001160000x1000000000|xxx000000000000000000000000000340000x0000000000|xxx000000000000000000000000000340000x0000000000|xxx000000000000000000000000000340000x0000000000|xxx000000000000000000000000000340000x0000000000|xxx000000000000000000000000000340000x0000000000|xxx000000000000000000000000000340000x0000000000|xxx000000000000000000000000000340000x0000000000|xxx000000000000000000000000000340000x0000000000|xxx000000000000000000000000000330000x0000000010|xxx000000000000000000000000000330000x0000000010|xxx000000000000000000000000000330000x0000000010|xxx000000000000000000000000000330000x0000000010|xxx000000000000000000000000000330000x0000000010|xxx000000000000000000000000000330000x0000000010|xxx000000000000000000000000000330000x0000000010|xxx000000000000000000000000000330000x0000000010|xxx000000000000000000000000000000000x0000000000|xxx000000000000000000000000000000000x0000000000|",
						"SUSPFLAG": "1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|1|2|1|1|1|1|1|1|2|1|1|1|1|1|1|1|1|1|1|2|2|2|1|1|1|1|1|1|1|1|2|2|2|1|2|1|0|0|0|0|0|0|1|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|",
						"BINDATA": "600000|浦发银行|600004|白云机场|600006|东风股份|600007|中国国贸|600008|首创环保|600009|上海机场|600010|包钢股份|600011|华能国际|600012|皖通高速|600015|华夏银行|600016|民生银行|600017|日照港|600018|上港集团|600019|宝钢股份|600020|中原高速|600021|上海电力|600022|山东钢铁|600023|浙能电力|600025|华能水电|600026|中远海能|600027|华电国际|600028|中国石化|600029|南方航空|600030|中信证券|600031|三一重工|600032|浙江新能|600033|福建高速|600035|楚天高速|600036|招商银行|600037|歌华有线|600038|中直股份|600039|四川路桥|600048|保利发展|600050|中国联通|600051|宁波联合|600052|东望时代|600053|九鼎投资|600054|黄山旅游|600055|万东医疗|600056|XD中国医|600057|厦门象屿|600058|五矿发展|600059|古越龙山|600060|海信视像|600061|国投资本|600062|华润双鹤|600063|皖维高新|600064|南京高科|600066|宇通客车|600067|冠城大通|600068|葛洲坝|600070|*ST富润|600071|凤凰光学|600072|中船科技|600073|光明肉业|600075|新疆天业|600076|康欣新材|600077|*ST宋都|600078|澄星股份|600079|人福医药|600080|金花股份|600081|东风科技|600082|海泰发展|600083|*ST博信|600084|中信尼雅|600085|同仁堂|600088|中视传媒|600089|特变电工|600090|退市济堂|600091|退市明科|600093|退市易见|600094|大名城|600095|湘财股份|600096|云天化|600097|开创国际|600098|广州发展|600099|林海股份|516000|数据ETF|560000|智慧电车ETF|160000|19深圳21|160001|19深圳22|160002|19北京14|160003|19北京15|160009|19北京21|186000|21浙江21|360001|农行优1|360003|浦发优1|360005|兴业优1|360008|浦发优2|360009|农行优2|196000|河北2336|506000|科创板基金|10007974|500ETF沽10月6000|10007972|500ETF购10月6000|10007978|500ETF沽11月6000|10007976|500ETF购11月6000|10007330|500ETF沽12月6000|10007321|500ETF购12月6000|10007694|500ETF购3月6000|10007696|500ETF沽3月6000|90004121|中证500ETF购10月6000|90004122|中证500ETF沽10月6000|90004194|中证500ETF沽11月6000|90004185|中证500ETF购11月6000|90003582|中证500ETF沽12月6000|90003573|中证500ETF购12月6000|90003892|中证500ETF沽3月6000|90003891|中证500ETF购3月6000|VH8W|HSI 16000MBePW240927|FHRW|NKY 36000MBePW241213|",
						"IPHONEKEY": "1728356971813",
						"STOCKNAMEEXT": "浦发银行|白云机场|东风股份|中国国贸|首创环保|上海机场|包钢股份|华能国际|皖通高速|华夏银行|民生银行|日照港|上港集团|宝钢股份|中原高速|上海电力|山东钢铁|浙能电力|华能水电|中远海能|华电国际|中国石化|南方航空|中信证券|三一重工|浙江新能|福建高速|楚天高速|招商银行|歌华有线|中直股份|四川路桥|保利发展|中国联通|宁波联合|东望时代|九鼎投资|黄山旅游|万东医疗|XD中国医药|厦门象屿|五矿发展|古越龙山|海信视像|国投资本|华润双鹤|皖维高新|南京高科|宇通客车|冠城大通||*ST富润|凤凰光学|中船科技|光明肉业|新疆天业|康欣新材|*ST宋都|澄星股份|人福医药|金花股份|东风科技|海泰发展|*ST博信|中信尼雅|同仁堂|中视传媒|特变电工||||大名城|湘财股份|云天化|开创国际|广州发展|林海股份|数据ETF|智慧电车ETF|19深圳21|19深圳22|19北京14|19北京15|19北京21|21浙江21|农行优1|浦发优1|兴业优1|浦发优2|农行优2|河北2336|科创板基金|||||||||中证500ETF购10月6000|中证500ETF沽10月6000|中证500ETF沽11月6000|中证500ETF购11月6000|中证500ETF沽12月6000|中证500ETF购12月6000|中证500ETF沽3月6000|中证500ETF购3月6000|||",
						"STOCKLABEL": "沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|沪A|已退市|ST|沪A|沪A|沪A|沪A|沪A|已退市|沪A|沪A|沪A|沪A|沪A|ST|沪A|沪A|沪A|沪A|已退市|已退市|已退市|沪A|沪A|沪A|沪A|沪A|沪A|ETF|ETF|债券|债券|债券|债券|债券|债券|债券|债券|债券|债券|债券|债券|LOF|期权|期权|期权|期权|期权|期权|期权|期权|期权|期权|期权|期权|期权|期权|期权|期权|新加坡|新加坡|",
						"STOCKFLAG": "|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||科|||||||||||||||||||",
						"MARKETSTATUS": "3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|3|4|3|3|3|3|3|3|4|3|3|3|3|3|3|3|3|3|3|4|4|4|3|3|3|3|3|3|3|3|4|4|4|3|4|3|3|3|3|3|3|0|3|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|"
					}
					// return dealSearchResult(testData)
					fun.action32(sl, dealSearchResult, dealSearchResult, that.type)
				},
                inputClick: function () {
					this.isShowSeachPop = true
					this.$nextTick(function () {
						this.$refs.searchRef.querySelector('input').focus()
						var h = document.documentElement.scrollTop || document.body.scrollTop
						var el = this.$refs.searchbox
						if (T.isIos()) {
							el.style.opacity = 0
							setTimeout(function () {
								window.scrollTo(0, Math.max(h - 1, 0))
								el.style.opacity = 1
							}, 100)
						}
					})
				},
				clearSeach: function () {
					this.searchValue = ''
					this.$emit('search', {});
				},
            },
            computed: {
                
            },
            
        });
    }

    exports.init = init;
});