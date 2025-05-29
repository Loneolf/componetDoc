import {
    formateDateToString,
    addTimeZero,
    getDiffDate,
    getNearTime,
    formateStringToDate,
    dateCount,
    getMonthBeginEndDate,
} from '../es6sourse/date.js';

// formateDateToString
describe('formateDateToString', () => {
    // 基础功能测试
    test('使用默认分隔符格式化日期', () => {
        const date = new Date(2023, 0, 15); // 2023年1月15日
        expect(formateDateToString(date)).toBe('20230115');
    });

    test('使用自定义分隔符格式化日期', () => {
        const date = new Date(2023, 5, 20); // 2023年6月20日
        expect(formateDateToString(date, '-')).toBe('2023-06-20');
    });

    test('使用斜杠作为分隔符', () => {
        const date = new Date(2023, 11, 31); // 2023年12月31日
        expect(formateDateToString(date, '/')).toBe('2023/12/31');
    });

    // 月份和日期补零测试
    test('处理个位数月份', () => {
        const date = new Date(2023, 8, 5); // 2023年9月5日
        expect(formateDateToString(date, '-')).toBe('2023-09-05');
    });

    test('处理十位数月份', () => {
        const date = new Date(2023, 10, 11); // 2023年11月11日
        expect(formateDateToString(date, '-')).toBe('2023-11-11');
    });

    test('处理个位数日期', () => {
        const date = new Date(2023, 3, 3); // 2023年4月3日
        expect(formateDateToString(date, '-')).toBe('2023-04-03');
    });

    test('处理十位数日期', () => {
        const date = new Date(2023, 7, 17); // 2023年8月17日
        expect(formateDateToString(date, '-')).toBe('2023-08-17');
    });

    // 特殊日期测试
    test('处理闰年2月29日', () => {
        const date = new Date(2024, 1, 29); // 2024年2月29日（闰年）
        expect(formateDateToString(date, '-')).toBe('2024-02-29');
    });
});

// formateStringToDate
describe('formateStringToDate', () => {
    // 基本功能测试
    test('转换标准格式字符串', () => {
        const date = formateStringToDate('20230115');
        expect(date.getFullYear()).toBe(2023);
        expect(date.getMonth()).toBe(0); // 月份从0开始计数
        expect(date.getDate()).toBe(15);
    });

    test('转换闰年日期', () => {
        const date = formateStringToDate('20240229');
        expect(date.getFullYear()).toBe(2024);
        expect(date.getMonth()).toBe(1);
        expect(date.getDate()).toBe(29);
    });

    // 边界条件测试
    test('转换年初日期', () => {
        const date = formateStringToDate('20230101');
        expect(date.getFullYear()).toBe(2023);
        expect(date.getMonth()).toBe(0);
        expect(date.getDate()).toBe(1);
    });

    test('转换年末日期', () => {
        const date = formateStringToDate('20231231');
        expect(date.getFullYear()).toBe(2023);
        expect(date.getMonth()).toBe(11);
        expect(date.getDate()).toBe(31);
    });

    test('转换月份第一天', () => {
        const date = formateStringToDate('20230401');
        expect(date.getFullYear()).toBe(2023);
        expect(date.getMonth()).toBe(3);
        expect(date.getDate()).toBe(1);
    });

    test('转换月份最后一天', () => {
        const date = formateStringToDate('20230430');
        expect(date.getFullYear()).toBe(2023);
        expect(date.getMonth()).toBe(3);
        expect(date.getDate()).toBe(30);
    });

    test('转换无效日期（月份超过12）', () => {
        const date = formateStringToDate('20231301');
        expect(date.toString()).toBe('Invalid Date');
    });

    test('转换无效日期（日期超过31）', () => {
        const date = formateStringToDate('20230132');
        expect(date.toString()).toBe('Invalid Date');
    });

    test('转换无效日期（月份为0）', () => {
        const date = formateStringToDate('20230001');
        expect(date.toString()).toBe('Invalid Date');
    });

    // 特殊输入测试
    test('转换包含前导零的日期', () => {
        const date = formateStringToDate('20230505');
        expect(date.getFullYear()).toBe(2023);
        expect(date.getMonth()).toBe(4);
        expect(date.getDate()).toBe(5);
    });

    test('转换四位数年份', () => {
        const date = formateStringToDate('99991231');
        expect(date.getFullYear()).toBe(9999);
        expect(date.getMonth()).toBe(11);
        expect(date.getDate()).toBe(31);
    });
});

// addTimeZero
describe('addTimeZero', () => {
    // 基本功能测试
    test('为个位数日期添加前导零（默认分隔符）', () => {
        expect(addTimeZero('2023-5-3')).toBe('2023-05-03');
    });

    test('为个位数月份添加前导零（默认分隔符）', () => {
        expect(addTimeZero('2023-4-15')).toBe('2023-04-15');
    });

    test('为年份、月份、日期都添加前导零（默认分隔符）', () => {
        expect(addTimeZero('9-9-9')).toBe('09-09-09');
    });

    // 自定义分隔符测试
    test('使用斜杠作为分隔符', () => {
        expect(addTimeZero('2023/5/3', '/')).toBe('2023/05/03');
    });

    test('使用点号作为分隔符', () => {
        expect(addTimeZero('2023.5.3', '.')).toBe('2023.05.03');
    });

    // 多位数不需要添加前导零
    test('十位数不需要添加前导零', () => {
        expect(addTimeZero('2023-10-20')).toBe('2023-10-20');
    });

    test('四位数年份不需要添加前导零', () => {
        expect(addTimeZero('2023-5-3')).toBe('2023-05-03');
    });

    // 边界条件测试
    test('零值需要添加前导零', () => {
        expect(addTimeZero('2023-0-0', '-')).toBe('2023-00-00');
    });

    test('单数字添加前导零', () => {
        expect(addTimeZero('5', '-')).toBe('05');
    });
});

// getNearTime
describe('getNearTime', () => {
    // 固定测试时间，避免因执行时间不同导致测试失败
    const mockDate = new Date('2023-05-15T12:00:00');
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // 包含今天的测试
    test('包含今天的时间范围', () => {
        const result = getNearTime(mockDate, true);

        // 验证 today
        expect(result.today).toBe('2023-05-15');

        // 验证 weekly
        expect(result.weekly.beginDate).toBe('2023-05-08');
        expect(result.weekly.endDate).toBe('2023-05-15');

        // 验证 month (上月相同日期+1天)
        const lastMonthSameDay = new Date(2023, 3, 16); // 2023-04-16
        const expectedMonthBegin = getDiffDate(lastMonthSameDay, false).timeText;
        expect(result.month.beginDate).toBe(expectedMonthBegin);
        expect(result.month.endDate).toBe('2023-05-15');

        // 验证 threeMonth
        const threeMonthsAgo = new Date(2023, 1, 16); // 2023-02-16
        const expectedThreeMonthBegin = getDiffDate(threeMonthsAgo, 0).timeText;
        expect(result.threeMonth.beginDate).toBe(expectedThreeMonthBegin);
        expect(result.threeMonth.endDate).toBe('2023-05-15');

        // 验证 oneYear
        const oneYearAgo = new Date(2022, 4, 16); // 2022-05-16
        const expectedOneYearBegin = getDiffDate(oneYearAgo, 0).timeText;
        expect(result.oneYear.beginDate).toBe(expectedOneYearBegin);
        expect(result.oneYear.endDate).toBe('2023-05-15');
    });

    // 不包含今天的测试
    test('不包含今天的时间范围', () => {
        const result = getNearTime(mockDate, false);

        // 验证 today
        expect(result.today).toBe('2023-05-15');

        // 验证 weekly (endDate 应为昨天)
        expect(result.weekly.beginDate).toBe('2023-05-07');
        expect(result.weekly.endDate).toBe('2023-05-13');

        // 验证 month (上月相同日期+1天)
        const lastMonthSameDay = new Date(2023, 3, 16); // 2023-04-16
        const expectedMonthBegin = getDiffDate(lastMonthSameDay, 0).timeText;
        expect(result.month.beginDate).toBe(expectedMonthBegin);
        expect(result.month.endDate).toBe('2023-05-14');

        // 验证 threeMonth
        const threeMonthsAgo = new Date(2023, 1, 16); // 2023-02-16
        const expectedThreeMonthBegin = getDiffDate(threeMonthsAgo, 0).timeText;
        expect(result.threeMonth.beginDate).toBe(expectedThreeMonthBegin);
        expect(result.threeMonth.endDate).toBe('2023-05-14');

        // 验证 oneYear
        const oneYearAgo = new Date(2022, 4, 16); // 2022-05-16
        const expectedOneYearBegin = getDiffDate(oneYearAgo, 0).timeText;
        expect(result.oneYear.beginDate).toBe(expectedOneYearBegin);
        expect(result.oneYear.endDate).toBe('2023-05-14');
    });

    // 默认参数测试
    test('默认使用当前时间', () => {
        const result = getNearTime(undefined, true);
        expect(result.today).toBe('2023-05-15');
    });

    // 边界条件测试
    test('月初日期的上月计算', () => {
        const firstDayOfMonth = new Date('2023-05-01');
        const result = getNearTime(firstDayOfMonth, true);

        // 上月日期应为 2023-04-02
        const lastMonthBegin = new Date(2023, 3, 2); // 2023-04-02
        const expectedMonthBegin = getDiffDate(lastMonthBegin, 0).timeText;
        expect(result.month.beginDate).toBe(expectedMonthBegin);
    });

    test('年末日期的去年计算', () => {
        const lastDayOfYear = new Date('2023-12-31');
        const result = getNearTime(lastDayOfYear, true);

        // 去年日期应为 2022-12-31 + 1 天 = 2023-01-01
        const oneYearAgo = new Date(2023, 0, 1); // 2023-01-01
        const expectedOneYearBegin = getDiffDate(oneYearAgo, 0).timeText;
        expect(result.oneYear.beginDate).toBe(expectedOneYearBegin);
    });

    test('闰年2月29日的处理', () => {
        const leapDay = new Date('2024-02-29');
        const result = getNearTime(leapDay, true);

        // 上月日期应为 2024-01-30 (2024-01-29 + 1天)
        const lastMonthBegin = new Date(2024, 0, 30); // 2024-01-30
        const expectedMonthBegin = getDiffDate(lastMonthBegin, 0).timeText;
        expect(result.month.beginDate).toBe(expectedMonthBegin);

        // 三个月前应为 2023-11-30 (2023-11-29 + 1天)
        const threeMonthsAgo = new Date(2023, 10, 30); // 2023-11-30
        const expectedThreeMonthBegin = getDiffDate(threeMonthsAgo, 0).timeText;
        expect(result.threeMonth.beginDate).toBe(expectedThreeMonthBegin);
    });

    // 用户自定义范围测试
    test('userDefined 与 month 范围相同', () => {
        const result = getNearTime(mockDate, true);
        expect(result.userDefined.beginDate).toBe(result.month.beginDate);
        expect(result.userDefined.endDate).toBe(result.month.endDate);
    });
});

// 固定当前时间，确保测试结果可预测
jest.useFakeTimers();
jest.setSystemTime(new Date('2023-01-01T00:00:00'));
describe('dateCount', () => {
    // 测试未来日期的情况
    test('计算未来日期的正确差值', () => {
        const now = new Date('2023-01-01T00:00:00').getTime();
        const expire = new Date('2023-01-02T12:30:00').getTime();

        const result = dateCount(expire, now);
        expect(result).toBe('1天12时30分');
    });

    // 测试省略第二个参数时使用当前时间
    test('省略第二个参数时使用当前时间', () => {
        const expire = new Date('2023-01-02T12:30:00').getTime();

        const result = dateCount(expire);
        expect(result).toBe('');
    });

    // 测试时间差不足一天的情况
    test('不足一天的时间差', () => {
        const now = new Date('2023-01-01T10:00:00').getTime();
        const expire = new Date('2023-01-01T15:30:45').getTime();

        const result = dateCount(expire, now);
        expect(result).toBe('0天5时30分');
    });

    // 测试过期日期的情况
    test('过期日期返回空字符串', () => {
        const now = new Date('2023-01-02T00:00:00').getTime();
        const expire = new Date('2023-01-01T00:00:00').getTime();

        const result = dateCount(expire, now);
        expect(result).toBe('');
    });

    // 测试小时部分为0的情况
    test('小时部分为0', () => {
        const now = new Date('2023-01-01T00:00:00').getTime();
        const expire = new Date('2023-01-02T00:30:00').getTime();

        const result = dateCount(expire, now);
        expect(result).toBe('1天0时30分');
    });

    // 测试分钟部分为0的情况
    test('分钟部分为0', () => {
        const now = new Date('2023-01-01T00:00:00').getTime();
        const expire = new Date('2023-01-02T12:00:00').getTime();

        const result = dateCount(expire, now);
        expect(result).toBe('1天12时0分');
    });

    // 测试秒数被正确截断的情况
    test('秒数被正确截断', () => {
        const now = new Date('2023-01-01T00:00:00').getTime();
        const expire = new Date('2023-01-01T00:30:45').getTime();

        const result = dateCount(expire, now);
        expect(result).toBe('0天0时30分');
    });
});

describe('getMonthBeginEndDate', () => {
    // 测试月初和月末日期的计算
    test('returns correct begin and end dates for a month', () => {
        const date = new Date('2023-05-15');
        const result = getMonthBeginEndDate(date);

        // 验证月初日期是否正确（2023-05-01）
        expect(result.beginDate.timeText).toBe('2023-05-01');
        // 验证月末日期是否正确（2023-05-31）
        expect(result.endDate.timeText).toBe('2023-05-31');
    });
    // 测试跨月的情况，确保计算逻辑正确
    test('handles month boundaries correctly', () => {
        const date = new Date('2023-02-15'); // 2023年2月有28天
        const result = getMonthBeginEndDate(date);

        expect(result.beginDate.timeText).toBe('2023-02-01');
        expect(result.endDate.timeText).toBe('2023-02-28');
    });

    // 测试闰年的2月情况
    test('handles leap year correctly', () => {
        const date = new Date('2024-02-15'); // 2024年是闰年，2月有29天
        const result = getMonthBeginEndDate(date);

        expect(result.beginDate.timeText).toBe('2024-02-01');
        expect(result.endDate.timeText).toBe('2024-02-29');
    });

    // 测试12月的情况，确保年份不会错误
    test('handles December correctly', () => {
        const date = new Date('2023-12-15');
        const result = getMonthBeginEndDate(date);

        expect(result.beginDate.timeText).toBe('2023-12-01');
        expect(result.endDate.timeText).toBe('2023-12-31');
    });
});
