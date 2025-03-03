
var format = function (num, dig,index) {
    //数字转换成小数两位
    //return Math.round(num*Math.pow(10,Number(dig)))/Math.pow(10,Number(dig));
    var f = parseFloat(num);
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0 && dig > 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + Number(dig)) {
        s += '0';
    }
    if (rs >= 1 && (f.toString().length - rs > dig)) {

        if (Number(dig) > 0) {
            var l = (num.toString().indexOf('.')) + 1;
            s = num.toString().slice(0, l + Number(dig));
        } else {
            //s = Math.round(num*Math.pow(10,Number(dig)))/Math.pow(10,Number(dig));
            var wz = num.toString().indexOf('.');
            if (wz > 0) {
                s = num.toString().substr(0, wz);
            } else {
                s = num;
            }
        }

    }
    // 持仓/可用数据 小数为00保留整数截断处理
    if(index == '1' || index == '2'){
        if(Number(s).toFixed(0) == 'NaN') {
            var tm = s.split('.')[1];
            var t = tm.slice(0,2)
            var m = tm.slice(2)
            s =  t == '00' ? s.split('.')[0] + m :s;
        }else {
            s =  Number(s).toFixed(2).split('.')[1] == '00' ? s.split('.')[0] :Number(s).toFixed(2);
        }
    }
    return s;
}
var unit = function (num, digit,index) {
    var dig = digit || 0;
    // var dig = 2; //德邦要求保留3位
    if (num == '' || typeof num == void 0) {
        return '';
    }
    if (isNaN(num)) {
        return num;
    }
    var arrNum = num.split('.');
    var arrln = arrNum[0].length;
    if (!digit) {
        return num;
    }
    if (arrln >= 6 && arrln < 9) {
        return (format(num / 10000, dig,index) + '万');
    } else if (arrln >= 9) {
        return (format(num / 100000000, dig,index) + '亿');
    } else {
        return (format(num, dig,index));
    }
}
var zzpindex = function (str, index, ZZPINDEX) {
    if (!ZZPINDEX) {
        return str;
    }
    var arrIndex = ZZPINDEX.split(','), arrNum = [], arrSuo = [];
    for (var i = 0; i < arrIndex.length; i++) {
        arrNum[i] = arrIndex[i].split('|')[0];
        arrSuo[i] = arrIndex[i].split('|')[1];
    }
    if (index) {
        var suoindex = arrNum.indexOf(index);
        if (suoindex >= 0) {
            return unit(str, arrSuo[suoindex],index);
        } else {
            return str;
        }
    }
}
//时间日期转换
var dateform = function (str, index, DATEFORMINDEX) {
    if (!DATEFORMINDEX || !index) {
        return str;
    }
    var arrIndex = DATEFORMINDEX.split(','), arrNum = [], arrSuo = [];
    for (var i = 0; i < arrIndex.length; i++) {
        arrNum[i] = arrIndex[i].split('|')[0];
        arrSuo[i] = arrIndex[i].split('|')[1];
    }
    var suoindex = arrNum.indexOf(index);
    if (suoindex >= 0) {
        if (arrSuo[suoindex] && arrSuo[suoindex].indexOf('yyyy') == '0') {
            var s = arrSuo[suoindex].replace(/yyyy/g, '$1').replace(/mm/g, '$2').replace(/dd/g, '$3');
            return str.replace(/\-/g, '').replace(/^(\d{4})(\d{2})(\d{2})$/i, s);
        } else if (arrSuo[suoindex] && arrSuo[suoindex].indexOf('hh') == '0') {
            if (str.length == 5 || str.length == 7) {
                str = '0' + str;
            }
            var s = arrSuo[suoindex].replace(/hh/g, '$1').replace(/mm/g, '$2').replace(/ss/g, '$3');
            return str.replace(/\:/g, '').substr(0, 6).replace(/^(\d{2})(\d{2})(\d{2})$/i, s);
        } else {
            return str;
        }
    } else {
        return str;
    }
}

//检查金额索引和日期索索引变动
var formatZZDate = function (str, index, ZZPINDEX, DATEFORMINDEX, noUnit) {
    if ((!ZZPINDEX && !DATEFORMINDEX) || typeof index == void 0 || typeof index == 'null') return str;
    if ((!ZZPINDEX || ZZPINDEX.indexOf(index + '|') < 0) && (!DATEFORMINDEX || DATEFORMINDEX.indexOf(index + '|') < 0)) return str;
    var aZzIndex = [], zzArrNum = [], zzArrSuo = [],
        aDateIndex = [], dateArrNum = [], dateArrSuo = [];
    if (!!ZZPINDEX) {
        aZzIndex = ZZPINDEX.split(',');
        for (var i = 0; i < aZzIndex.length; i++) {
            zzArrNum[i] = aZzIndex[i].split('|')[0];
            zzArrSuo[i] = aZzIndex[i].split('|')[1];
        }
    }
    if (!!DATEFORMINDEX) {
        aDateIndex = DATEFORMINDEX.split(',');
        for (var i = 0; i < aDateIndex.length; i++) {
            dateArrNum[i] = aDateIndex[i].split('|')[0];
            dateArrSuo[i] = aDateIndex[i].split('|')[1];
        }
    }

    if (zzArrNum.indexOf(index) >= 0) { //金额格式化
        if(noUnit){
            return format(str, zzArrSuo[zzArrNum.indexOf(index)],index);
        }
        return unit(str, zzArrSuo[zzArrNum.indexOf(index)],index);
    } else if (dateArrNum.indexOf(index) >= 0) { //日期时间
        var suoindex = dateArrNum.indexOf(index);
        if (suoindex >= 0) {
            if (arrSuo[suoindex] && arrSuo[suoindex].indexOf('yyyy') == '0') {
                var s = arrSuo[suoindex].replace(/yyyy/g, '$1').replace(/mm/g, '$2').replace(/dd/g, '$3');
                return str.replace(/\-/g, '').replace(/^(\d{4})(\d{2})(\d{2})$/i, s);
            } else if (arrSuo[suoindex] && arrSuo[suoindex].indexOf('hh') == '0') {
                if (str.length == 5 || str.length == 7) {
                    str = '0' + str;
                }
                var s = arrSuo[suoindex].replace(/hh/g, '$1').replace(/mm/g, '$2').replace(/ss/g, '$3');
                return str.replace(/\:/g, '').substr(0, 6).replace(/^(\d{2})(\d{2})(\d{2})$/i, s);
            } else {
                return str;
            }
        } else {
            return str;
        }
    } else {
        return str;
    }
}

export function toPercentage(num) {
    return `${num * 100}%`;
}


export default {
    format,
    unit,
    zzpindex,
    dateform,
    formatZZDate
}
