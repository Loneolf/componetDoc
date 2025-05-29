import {
    abbreviation
} from '../es6sourse/stringFun.js';

// 测试默认长度（17个字符）的情况
describe('默认长度（17个字符）', () => {
    test('短字符串保持不变', () => {
        const shortString = 'Hello World';
        expect(abbreviation(shortString)).toBe(shortString);
    });

    test('恰好17个字符的字符串保持不变', () => {
        const exactLengthString = '12345678901234567';
        expect(abbreviation(exactLengthString)).toBe(exactLengthString);
    });

    test('18个字符的字符串被缩写', () => {
        const longString = '123456789012345678';
        expect(abbreviation(longString)).toBe('12345678901234567...');
    });

    test('包含中文的字符串按字符长度缩写', () => {
        const chineseString = '这是一个超过十七个字符的测试字符串123';
        expect(abbreviation(chineseString)).toBe('这是一个超过十七个字符的测试字符串...');
    });
});

// 测试自定义长度的情况
describe('自定义长度', () => {
    test('指定长度为5时，短字符串保持不变', () => {
        const shortString = 'Hello';
        expect(abbreviation(shortString, 5)).toBe(shortString);
    });

    test('指定长度为5时，长字符串被缩写', () => {
        const longString = 'Hello World';
        expect(abbreviation(longString, 5)).toBe('Hello...');
    });

    test('指定长度为0时，所有字符串都被缩写为省略号', () => {
        expect(abbreviation('Hello', 0)).toBe('...');
        expect(abbreviation('Longer String', 0)).toBe('...');
    });
});

// 测试特殊字符和边界情况
describe('特殊字符和边界情况', () => {
    test('空字符串保持不变', () => {
        expect(abbreviation('')).toBe('');
    });

    test('仅包含空格的字符串按预期缩写', () => {
        const spaces = '                '; // 16个空格
        expect(abbreviation(spaces)).toBe(spaces);

        const moreSpaces = '                 '; // 17个空格
        expect(abbreviation(moreSpaces)).toBe(moreSpaces);

        const evenMoreSpaces = '                  '; // 18个空格
        expect(abbreviation(evenMoreSpaces)).toBe('                 ...');
    });

    test('包含特殊字符的字符串正确缩写', () => {
        const specialChars = '!@#$%^&*()_+=-[]{}|;:\'",.<>?/';
        expect(abbreviation(specialChars)).toBe('!@#$%^&*()_+=-[]{...');
    });
});