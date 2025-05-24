import {
    formateDateToString,
    formateStringToDate,
    dateCount,
    accAdd,
    accSub,
    accMul,
    accDiv,
    thousandFormat,
    isTradeDate,
    abbreviation,
    compare,
    getIosVersion,
    isIOS,
    getDiffDays,
    getLastTradingDay
} from '../es6sourse/common.js';

describe('Date and Time Functions', () => {
    test('formateDateToString should format date correctly', () => {
        const date = new Date(2023, 11, 25);
        expect(formateDateToString(date, '-')).toBe('2023-12-25');
        expect(formateDateToString(date)).toBe('20231225');
    });

    test('formateStringToDate should convert string to date correctly', () => {
        const dateString = '20231225';
        const date = formateStringToDate(dateString);
        expect(date.getFullYear()).toBe(2023);
        expect(date.getMonth()).toBe(11);
        expect(date.getDate()).toBe(25);
    });

    test('dateCount should calculate countdown correctly', () => {
        // 正确的日期差值计算
        const expireNum = new Date(2023, 11, 31).getTime(); // 2023-12-31
        const nowNum = new Date(2023, 11, 25).getTime();   // 2023-12-25
        expect(dateCount(expireNum, nowNum)).toBe('6天0时0分');
    });

    test('getDiffDays should calculate the difference between two dates correctly', () => {
        const date1Str = '20231225';
        const date2Str = '20240101';
        expect(getDiffDays(date1Str, date2Str)).toBe(7);
    });

    test('getLastTradingDay should return the last trading day', () => {
        const nonTradingDays = ['20231225'];
        const serverTime = ['20231226'];
        const lastTradingDay = getLastTradingDay(nonTradingDays, serverTime);
        expect(lastTradingDay.getDay()).not.toBe(6);
        expect(lastTradingDay.getDay()).not.toBe(0);
        expect(nonTradingDays.indexOf(formateDateToString(lastTradingDay))).toBe(-1);
    });
});

describe('Math Functions', () => {
    test('accAdd should add two numbers accurately', () => {
        expect(accAdd(0.1, 0.2)).toBe(0.3);
    });

    test('accSub should subtract two numbers accurately', () => {
        expect(accSub(0.3, 0.1)).toBe(0.2);
    });

    test('accMul should multiply two numbers accurately', () => {
        expect(accMul(0.1, 0.2)).toBe(0.02);
    });

    test('accDiv should divide two numbers accurately', () => {
        expect(accDiv(0.2, 0.1)).toBe(2);
    });
});

describe('Formatting Functions', () => {
    test('thousandFormat should format number with commas', () => {
        expect(thousandFormat(1234567)).toBe('1,234,567');
    });

    test('abbreviation should abbreviate long strings', () => {
        const longString = 'This is a very long string that needs to be abbreviated.';
        expect(abbreviation(longString)).toBe('This is a very long s...');
    });
});

describe('Utility Functions', () => {
    test('isTradeDate should determine if a date is a trading date', () => {
        const nonTradingDate = ['20231225'];
        const date = new Date(2023, 11, 26);
        expect(isTradeDate(date, nonTradingDate)).toBe(false);
        const tradingDate = new Date(2023, 11, 27);
        expect(isTradeDate(tradingDate, nonTradingDate)).toBe(true);
    });

    test('compare should compare objects based on a property', () => {
        const obj1 = { value: 1 };
        const obj2 = { value: 2 };
        const compareFunc = compare('value');
        expect(compareFunc(obj1, obj2)).toBe(1);
    });

    test('getIosVersion should return iOS version or -1', () => {
        // 模拟环境
        global.navigator = { userAgent: '' };
        expect(getIosVersion()).toBe(-1);
    });

    test('isIOS should determine if the client is iOS', () => {
        global.navigator = { userAgent: '' };
        expect(isIOS()).toBe(false);
    });
});