'use strict';

//该模块应用jquery，因所有页面均引用，在此不单独引用jquery

define(function (require, exports, module) {
    require('./css/index.css#');
    var fun = require('./fun')
	var html = require('./template.html')
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
                // bgColor: '#fff2e6',
                bgColor: '#ffffff',
            },
            '深': {
                color: '#136ef2',
                // bgColor: '#e6edff',
				bgColor: '#ffffff',
            },
            '沪': {
                color: '#FD242A',
                // bgColor: '#fff4f4',
				bgColor: '#ffffff',
            },
            'df': {
                color: '#ffffff',
                // bgColor: '#fd242a',
				bgColor: '#ffffff',
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
				isrepetpop: {
					type: Boolean,
					default: false
				}
			},
            
            template: html,

            data: function data() {
                return {
                    componentName: componentsName,
                    isShowSeachPop: false, // 打开搜索半弹层
                    isEmpty: false, // 是否无搜索结果
                    searchValue: '', // 输入的搜索值
					topSearchValue: '', // 顶部输入框的值
                    searchList: [],  // 搜索结果显示列表
					clickItemOver: false, // 是否点击了筛选项，点击了筛选项，用户重新打开弹出并点击蒙层或者关闭按钮，不进行搜索重置，正常用户搜索了没有点击筛选项，点击蒙层或者关闭按钮，进行搜索重置
					confrimPopUp: false, // 当出现重码，确认弹层
                };
            },
            mounted: function mounted() {
				var that = this
				this.$refs.searchSpanRef.addEventListener('click', function () {
					that.isShowSeachPop = true
					that.$nextTick(function () {
						var inputDom = that.$refs.searchRef.querySelector('input')
						inputDom.focus()
					})
				})
			},
            methods: {
				onFocus: function () {
					var h = document.documentElement.scrollTop || document.body.scrollTop
					var el = this.$refs.searchbox
					if (T.isIos()) {
						el.style.opacity = 0
						setTimeout(function () {
							window.scrollTo(0, Math.max(h - 1, 0))
							el.style.opacity = 1
						}, 100)
					}
				},
				initData: function () {
					this.searchValue = ''	
					this.topSearchValue = ''
					this.searchList = []
					this.isEmpty = false
					this.clickItemOver = false
				},

				clearhandle: function () {
					this.initData()
				},
                itemClick: function (item, noRepet, toUse) {
					console.log('aaaavalue', item, this.isrepetpop, noRepet)
					var that = this
					this.clickItemOver = true
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
						vm.topSearchValue = item.rawCode
						item.stockCode = '<span class="red">' + item.rawCode + '</span>'
						if (!toUse) {
							vm.searchList = [item]
						}
						vm.$emit('search', {code: item.rawCode, mkType: item.mkType});
					}
				},

                onCancel: function () {
                    this.isShowSeachPop = false
					if (!this.clickItemOver) {
						this.initData()
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
					var filteredValue = '';
					// 过滤非数字字母和汉字以及*以外的特殊字符
					for (var i = 0; i < sv.length; i++) {
						var char = sv[i];
						if (/^[0-9]$/.test(char) || /^[\u4e00-\u9fa5a-zA-Z]$/.test(char) || char === '*') {
							filteredValue += char;
						}
					}
					// 校验规则，数字只能输入六位，非数字可以输入20位
					sv = filteredValue;
					var beginSix = sv.substr(0, 6)
					if (sv.length > 20) {
						sv = sv.substr(0, 20)
					}
					if (/^[0-9]+$/.test(sv)) {
						sv = beginSix
					}
					this.searchValue = sv

					
					timer = setTimeout(function () {
						that.getSearchData(sv, function (result) {
							try {
								// 每次搜索，将滚动列表滚动到顶部
								that.$refs.searchPopRef.$el.scrollTop = 0
							} catch (error) {
							}

							that.searchList = result
							if (result.length > 0) {
								that.isEmpty = false
							}
							if (result.length == 0) {
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
					this.clickItemOver = false
					var that = this
					if (typeof stockCode == 'undefined' || stockCode == '') {
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
							// 特殊字符*需要处理，否则匹配不到
							var regExp = new RegExp(sl.replace(/\*/g, "\\*"))
							for (var i = 0; i < arr.length; i++) {
								if (i % 2 == 0) {
									item.rawCode = arr[i]
									item.stockCode = arr[i].replace(regExp,'<span class="red">' + sl + '</span>')
								} else {
									item.rawName = arr[i]
									item.stockName = arr[i].replace(regExp,'<span class="red">' + sl + '</span>')
									result.push(JSON.parse(JSON.stringify(item)))
								}
							}
							if (data.NEWMARKETNO) {
								var stockLabel = data.NEWMARKETNO.split('|')
								for (var i = 0; i < result.length; i++) {
									var temi = stockLabel[i]
									var laText = ''
									if (fun.jingMarket.indexOf(temi) !== -1) {
										laText = '京'
									} else if (fun.shenMarket.indexOf(temi) !== -1) {
										laText = '沪'
									} else if (fun.huMarket.indexOf(temi) !== -1) {
										laText = '深'
									}
									var v = badgeConfig[laText] || badgeConfig.df
									result[i].label = {
										value: laText,
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
					
					fun.action32(sl, dealSearchResult, dealSearchResult, that.type)
				},
                
				clearSeach: function () {
					this.searchValue = ''
					this.topSearchValue = ''
					this.$emit('search', {});
				},
            },
            computed: {
                
            },
            
        });
    }

    exports.init = init;
});