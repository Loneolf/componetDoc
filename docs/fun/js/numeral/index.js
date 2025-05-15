/**
 * Numeral 用于格式化和处理数字
 */
import { bytes } from "./formats/bytes";

// 数字原型对象
function Numeral(input, number) {
    this._input = input;
    this._value = number;
}

export function numeral(input) {
    var numeral,
        value,
        locales = {},
        defaults = {
            currentLocale: 'en',
            zeroFormat: null,
            nullFormat: null,
            defaultFormat: '0,0',
            scalePercentBy100: true
        },
        options = {
            currentLocale: defaults.currentLocale,
            zeroFormat: defaults.zeroFormat,
            nullFormat: defaults.nullFormat,
            defaultFormat: defaults.defaultFormat,
            scalePercentBy100: defaults.scalePercentBy100
        };
    numeral = function(input){
        if (numeral.isNumeral(input)) {
            value = input.value();
        }else{
            value = Number(input) || null;
        }
        return new Numeral(input, value);
    }

    // 校验是否可以转换为 数字
    numeral.validate = function (val, culture) {
        var localeData;

        // 如果输入的 val 不是字符串，强制转换为字符串！
        if (typeof val !== 'string') {
            val += '';
        }

        // 去掉前后空格
        val = val.trim();

        // 如果全部为数字字符则可以转化为整数数字，返回true
        if (!!val.match(/^\d+$/)) {
            return true;
        }

        // 如果val 为空字符串，返回false
        if (val === '') {
            return false;
        }

        // 从 numeric.localeData 中获取小数点和千位分隔符
        try {
            localeData = numeral.localeData(culture);
        } catch (e) {
            localeData = numeral.localeData(numeral.locale());
        }
    }

    numeral.bytes = function () {
        bytes();
    }

    numeral.isNumeral = function (obj) {
        return obj instanceof Numeral;
    }

    numeral.stringToNumber = function () {
        var stringOriginal = string,
            abbreviations = {
                thousand: 3,
                million: 6,
                billion: 9,
                trillion: 12
            },
            abbreviation,
            value,
            regexp;
    }

    numeral.locales = locales;


    numeral.localeData = function (key) {
        if (!key) {
            return locales[options.currentLocale];
        }

        key = key.toLowerCase();

        if (!locales[key]) {
            throw new Error('Unknown locale : ' + key);
        }

        return locales[key];
    };

    numeral.locale = function(key) {
        if (key) {
            options.currentLocale = key.toLowerCase();
        }

        return options.currentLocale;
    };
    
    return numeral;
}


