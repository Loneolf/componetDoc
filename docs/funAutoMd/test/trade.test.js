import {
    checkIsA5,
    isTradeDate,
    getLastTradingDay
} from '../es6sourse/trade.js';

// 固定当前时间，确保测试结果可预测
jest.useFakeTimers();

// 测试 checkIsA5 函数
describe('checkIsA5', () => {
    test('当 data 为 null 时返回 false', () => {
        expect(checkIsA5(null)).toBe(false);
    });

    test('当 data 中无 APEX_A5_SPECFLAG 属性时返回 false', () => {
        const data = { otherProp: 'value' };
        expect(checkIsA5(data)).toBe(false);
    });

    test('当 APEX_A5_SPECFLAG 不为 "1" 时返回 false', () => {
        const data = { APEX_A5_SPECFLAG: '0' };
        expect(checkIsA5(data)).toBe(false);
    });

    test('当 APEX_A5_SPECFLAG 为 "1" 时返回 true', () => {
        const data = { APEX_A5_SPECFLAG: '1' };
        expect(checkIsA5(data)).toBe(true);
    });
});

// 测试 isTradeDate 函数
describe('isTradeDate', () => {
    // 模拟 formateDateToString 函数
    beforeEach(() => {
        global.formateDateToString = jest.fn(date => {
            // 简单模拟，实际应根据函数实现
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        });
    });

    test('周末不是交易日', () => {
        // 2023-05-28 是周日
        const sunday = new Date(2023, 4, 28);
        expect(isTradeDate(sunday, [])).toBe(false);

        // 2023-05-27 是周六
        const saturday = new Date(2023, 4, 27);
        expect(isTradeDate(saturday, [])).toBe(false);
    });

    test('工作日是交易日', () => {
        // 2023-05-29 是周一
        const monday = new Date(2023, 4, 29);
        expect(isTradeDate(monday, [])).toBe(true);
    });

    test('非交易日列表中的日期不是交易日', () => {
        const date = new Date(2023, 4, 29); // 周一
        const nonTradingDays = ['2023-05-29'];

        global.formateDateToString.mockReturnValueOnce('2023-05-29');
        expect(isTradeDate(date, nonTradingDays)).toBe(false);
    });
});

// 测试 getLastTradingDay 函数
describe('getLastTradingDay', () => {
    // 模拟 formateDateToString 和 formateStringToDate 函数
    beforeEach(() => {
        global.formateDateToString = jest.fn(date => {
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        });

        global.formateStringToDate = jest.fn(str => {
            const [year, month, day] = str.split('-').map(Number);
            return new Date(year, month - 1, day);
        });
    });

    test('如果今天是周一，返回上周五', () => {
        // 设置当前时间为 2023-05-29 (周一)
        jest.setSystemTime(new Date(2023, 4, 29));

        const nonTradingDays = [];
        const result = getLastTradingDay(nonTradingDays, []);

        // 上周五是 2023-05-26
        const expected = new Date(2023, 4, 26);
        expect(result).toEqual(expected);
    });

    test('如果今天是周二且周一是非交易日，返回上周五', () => {
        // 设置当前时间为 2023-05-30 (周二)
        jest.setSystemTime(new Date(2023, 4, 30));

        const nonTradingDays = ['2023-05-29']; // 周一是非交易日
        const result = getLastTradingDay(nonTradingDays, []);

        // 上周五是 2023-05-26
        const expected = new Date(2023, 4, 26);
        expect(result).toEqual(expected);
    });

    test('使用 serverTime 参数指定当前时间', () => {
        const serverTime = ['2023-05-30']; // 周二
        const nonTradingDays = ['2023-05-29']; // 周一是非交易日

        const result = getLastTradingDay(nonTradingDays, serverTime);

        // 上周五是 2023-05-26
        const expected = new Date(2023, 4, 26);
        expect(result).toEqual(expected);
    });

    test('处理连续多个非交易日', () => {
        // 设置当前时间为 2023-06-01 (周四)
        jest.setSystemTime(new Date(2023, 5, 1));

        // 周三、周二、周一是非交易日
        const nonTradingDays = ['2023-05-29', '2023-05-30', '2023-05-31'];

        const result = getLastTradingDay(nonTradingDays, []);

        // 最后一个交易日是上周五 2023-05-26
        const expected = new Date(2023, 4, 26);
        expect(result).toEqual(expected);
    });
});