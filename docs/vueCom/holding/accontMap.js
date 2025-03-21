// import * as mockData from './holdMock'
import * as mockData from './holdA5Mock'
const isMock = false;

export const accountTypeMap = {
    '0': ['SHACCOUNT', 'SZACCOUNT', 'SBACCOUNT'], // 人民币A股  沪深京
    '0_HK': ['HKACCOUNT', 'HKSZACCOUNT'],   //  人民币港股  
    '1': ['SHBACCOUNT', 'SBBACCOUNT'],   // 美股
    '2': ['SZBACCOUNT','R']             // 港股
}

export const moneyTypeMap = {
    '0': '人民币账户A股',
    '0_HK': '人民币账户港股',
    '1': '美元账户',
    '2': '港币账户'
}

export const bzTypeMap = {
    'SHACCOUNT': '0',
    'SZACCOUNT': '0',
    'SBACCOUNT': '0',
    'HKACCOUNT': '0_HK',
    'HKSZACCOUNT': '0_HK',
    'SHBACCOUNT': '1',
    'SBBACCOUNT': '1',
    'SZBACCOUNT': '2',
    'R': '2'
}

export const exchangeTypeMap = {
    '上海': 'SHACCOUNT',
    '深圳': 'SZACCOUNT',
    '特转A': 'SBACCOUNT',
    '特转B': 'SBBACCOUNT',
    '沪Ｂ': 'SHBACCOUNT',
    '深Ｂ': 'SZBACCOUNT',
    '沪HK': 'HKACCOUNT',
    '深HK': 'HKSZACCOUNT',
    'H股全流通': 'R'
}
export const hsExchangeTypeMap = {
    '1': 'SHACCOUNT',
    '2': 'SZACCOUNT',
    '9': 'SBACCOUNT',
    'A': 'SBBACCOUNT',
    'D': 'SHBACCOUNT',
    'H': 'SZBACCOUNT',
    'G': 'HKACCOUNT',
    'S': 'HKSZACCOUNT',
    'R': 'R'
}
export const hsExchangeTypeReverseMap = {
    'SHACCOUNT': '1',
    'SZACCOUNT': '2',
    'SBACCOUNT': '9',
    'SBBACCOUNT': 'A',
    'SHBACCOUNT': 'D',
    'SZBACCOUNT': 'H',
    'HKACCOUNT': 'G',
    'HKSZACCOUNT': 'S',
    'R': 'R'
}

export const opratedata = [
    {
        title: '117持仓接口',
        action: '117',
        data: "",
        showText: isMock ? JSON.stringify(mockData.mockdata117, null, 4) : "",
        dealData: {},
    },
    {
        title: '116资金账号',
        action: '116',
        data: "",
        showText: '',
        // showText: isMock ? JSON.stringify(mockData.mockdata116, null, 4) : "",
    },
    {
        title: '5106港股通持仓',
        action: '5106',
        data: "",
        showText: isMock ? JSON.stringify(mockData.mockdata5106, null, 4) : "",
    },
    {
        title: '5107获取港股通汇率',
        action: '5107',
        data: "",
        showText: isMock ? JSON.stringify(mockData.mockdata5107, null, 4) : "",
    },
    {
       title: '5696港币美元汇率',
       action: '5696',
       data: "",
       showText: isMock ? JSON.stringify(mockData.mockdata5696, null, 4) : "", 
    },
    {
       title: '5735-A5多金账号',
       action: '5735',
       data: "",
       showText: isMock ? JSON.stringify(mockData.mockdata5735, null, 4) : "",
    },

    {
        title: '5850客户费率',
        action: '5850',
        data: "",
        showText: isMock ? JSON.stringify(mockData.fare, null, 4) : "",
        isShowCode: true,
        code: `H5TZT.readLocalMesg(['jyloginflag', 'logintype=1', 'USERCODE'], function (oData) {
                var fileName = 'clientFare' + oData.USERCODE;
                H5TZT.readFileMesg(fileName, function(oFile){
                    if(oFile){
                        var data = JSON.parse(decodeURIComponent(oFile));
                        var fareMap = JSON.parse(JSON.stringify(data.clientFare));
                        console.log(fareMap);
                    } else {
                        console.log('获取费率失败, 未查询到')
                    }
                })
            })`
    },
    {
        title: '60刷新',
        action: '60',
        data: "",
        showText: isMock ? JSON.stringify(mockData.mockdata60, null, 4) : "",
        isUpBtn: true,
    },
]

