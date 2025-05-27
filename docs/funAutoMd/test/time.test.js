import {
    toQueryString,
    toQueryParams,
    zhangHongDieLv,
    getNearTime,
    getDiffDate,
    addTimeZero,
    getMonthBeginEndDate
} from '../es6sourse/other';

// 模拟 location 对象
global.location = {
    search: '?param1=value1&param2=value2'
};

describe('toQueryString', () => {
    test('should convert object to query string', () => {
        const obj = { param1: 'value1', param2: 'value2' };
        const result = toQueryString(obj);
        expect(result).toBe('param1=value1&param2=value2');
    });

    test('should handle array values', () => {
        const obj = { param1: ['value1', 'value2'] };
        const result = toQueryString(obj);
        expect(result).toBe('param1=value1&param1=value2');
    });
});

describe('toQueryParams', () => {
    test('should convert query string to object', () => {
        const result = toQueryParams();
        expect(result).toEqual({ param1: 'value1', param2: 'value2' });
    });

    test('should handle duplicate keys as array', () => {
        global.location.search = '?param1=value1&param1=value2';
        const result = toQueryParams();
        expect(result).toEqual({ param1: ['value1', 'value2'] });
    });
});

describe('zhangHongDieLv', () => {
    test('should return f-red for positive number', () => {
        const result = zhangHongDieLv(10);
        expect(result).toBe('f-red');
    });

    test('should return f-green for negative number', () => {
        const result = zhangHongDieLv(-10);
        expect(result).toBe('f-green');
    });

    test('should return empty string for zero', () => {
        const result = zhangHongDieLv(0);
        expect(result).toBe('');
    });

    test('should return empty string for NaN', () => {
        const result = zhangHongDieLv('abc');
        expect(result).toBe('');
    });
});

describe('getNearTime', () => {
    test('should return correct time ranges', () => {
        const time = new Date('2023-10-01');
        const result = getNearTime(time);
        expect(result).toHaveProperty('today');
        expect(result).toHaveProperty('weekly');
        expect(result).toHaveProperty('userDefined');
        expect(result).toHaveProperty('month');
        expect(result).toHaveProperty('threeMonth');
        expect(result).toHaveProperty('oneYear');
    });
});

describe('getDiffDate', () => {
    test('should return correct date information', () => {
        const time = new Date('2023-10-01');
        const result = getDiffDate(time, 1);
        expect(result).toHaveProperty('timestamp');
        expect(result).toHaveProperty('timeText');
        expect(result).toHaveProperty('time');
    });
});

describe('addTimeZero', () => {
    test('should add leading zeros to time string', () => {
        const timeText = '2023-5-9';
        const result = addTimeZero(timeText);
        expect(result).toBe('2023-05-09');
    });
});

describe('getMonthBeginEndDate', () => {
    test('should return correct month begin and end dates', () => {
        const date = new Date('2023-10-01');
        const result = getMonthBeginEndDate(date);
        expect(result).toHaveProperty('beginDate');
        expect(result).toHaveProperty('endDate');
    });
});