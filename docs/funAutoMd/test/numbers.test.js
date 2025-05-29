import {
    thousandFormat
} from '../es6sourse/numbers.js';

// thousandFormat.test.js
describe('thousandFormat', () => {
    // 基本功能测试
    test('格式化四位数', () => {
        expect(thousandFormat(1234)).toBe('1,234');
    });

    test('格式化十位数', () => {
        expect(thousandFormat(1234567890)).toBe('1,234,567,890');
    });

    // 负数处理测试
    test('格式化负数', () => {
        expect(thousandFormat(-987654)).toBe('-987,654');
    });

    // 边界条件测试
    test('处理零', () => {
        expect(thousandFormat(0)).toBe('0');
    });

    test('处理个位数', () => {
        expect(thousandFormat(5)).toBe('5');
    });

    test('处理不足三位的数', () => {
        expect(thousandFormat(99)).toBe('99');
    });

    // 特殊场景测试
    test('处理多个连续零', () => {
        expect(thousandFormat(1000000)).toBe('1,000,000');
    });

    test('处理非常大的数', () => {
        expect(thousandFormat(1234567890123)).toBe('1,234,567,890,123');
    });

    // 科学计数法输入测试
    test('处理科学计数法数字', () => {
        expect(thousandFormat(1e6)).toBe('1,000,000');
    });
});