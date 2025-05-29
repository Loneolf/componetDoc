import {
    accAdd,
    accSub, 
    accMul, 
    accDiv
} from '../es6sourse/calculate.js';
// 测试加法函数 accAdd
describe('accAdd', () => {
    test('两个整数相加', () => {
        expect(accAdd(5, 3)).toBe(8);
    });

    test('一个整数和一个小数相加', () => {
        expect(accAdd(5, 0.3)).toBe(5.3);
    });

    test('两个小数相加（无精度丢失）', () => {
        expect(accAdd(0.1, 0.2)).toBe(0.3);
    });

    test('两个小数相加（不同小数位数）', () => {
        expect(accAdd(0.123, 0.45)).toBe(0.573);
    });

    test('两个多位小数相加', () => {
        expect(accAdd(0.123456789, 0.987654321)).toBe(1.11111111);
    });

    test('负数相加', () => {
        expect(accAdd(-3, -2)).toBe(-5);
    });

    test('正数和负数相加', () => {
        expect(accAdd(5, -3)).toBe(2);
    });
});

// 测试减法函数 accSub
describe('accSub', () => {
    test('两个整数相减', () => {
        expect(accSub(5, 3)).toBe(2);
    });

    test('一个整数和一个小数相减', () => {
        expect(accSub(5, 0.3)).toBe(4.7);
    });

    test('两个小数相减（无精度丢失）', () => {
        expect(accSub(0.3, 0.1)).toBe(0.2);
    });

    test('两个小数相减（不同小数位数）', () => {
        expect(accSub(0.45, 0.123)).toBe(0.327);
    });

    test('两个多位小数相减', () => {
        expect(accSub(0.987654321, 0.123456789)).toBe(0.864197532);
    });

    test('负数相减', () => {
        expect(accSub(-3, -2)).toBe(-1);
    });

    test('正数和负数相减', () => {
        expect(accSub(5, -3)).toBe(8);
    });
});

// 测试乘法函数 accMul
describe('accMul', () => {
    test('两个整数相乘', () => {
        expect(accMul(5, 3)).toBe(15);
    });

    test('一个整数和一个小数相乘', () => {
        expect(accMul(5, 0.3)).toBe(1.5);
    });

    test('两个小数相乘（无精度丢失）', () => {
        expect(accMul(0.2, 0.3)).toBe(0.06);
    });

    test('两个小数相乘（不同小数位数）', () => {
        expect(accMul(0.12, 0.456)).toBe(0.05472);
    });

    test('两个多位小数相乘', () => {
        expect(accMul(0.123456789, 0.987654321)).toBe(0.121932631112635269);
    });

    test('负数相乘', () => {
        expect(accMul(-3, -2)).toBe(6);
    });

    test('正数和负数相乘', () => {
        expect(accMul(5, -3)).toBe(-15);
    });
});

// 测试除法函数 accDiv
describe('accDiv', () => {
    test('两个整数相除', () => {
        expect(accDiv(6, 3)).toBe(2);
    });

    test('一个整数和一个小数相除', () => {
        expect(accDiv(6, 0.3)).toBe(20);
    });

    test('两个小数相除（无精度丢失）', () => {
        expect(accDiv(0.6, 0.3)).toBe(2);
    });

    test('两个小数相除（不同小数位数）', () => {
        expect(accDiv(0.12, 0.4)).toBe(0.3);
    });

    test('两个多位小数相除', () => {
        expect(accDiv(0.123456789, 0.987654321)).toBeCloseTo(0.125, 3);
    });

    test('负数相除', () => {
        expect(accDiv(-6, -3)).toBe(2);
    });

    test('正数和负数相除', () => {
        expect(accDiv(6, -3)).toBe(-2);
    });

    test('除以零应该抛出错误', () => {
        expect(() => accDiv(5, 0)).toThrow();
    });
});