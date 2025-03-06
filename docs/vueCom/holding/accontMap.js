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