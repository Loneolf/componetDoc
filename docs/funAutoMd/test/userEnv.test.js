import {
    isIOS, getIosVersion
} from '../es6sourse/userEnv.js';

// 存储原始的 navigator 对象，以便在测试后恢复
const originalNavigator = global.navigator;

// 在每个测试前重置 navigator
beforeEach(() => {
    global.navigator = { ...originalNavigator };
});

// 在所有测试后恢复 navigator
afterAll(() => {
    global.navigator = originalNavigator;
});

// 测试 isIOS 函数
describe('isIOS', () => {
    test('在 iOS 设备上返回 true', () => {
        // 模拟 iOS 设备的 userAgent
        global.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15';
        expect(isIOS()).toBe(true);
    });

    test('在非 iOS 设备上返回 false', () => {
        // 模拟 Android 设备的 userAgent
        global.navigator.userAgent = 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36';
        expect(isIOS()).toBe(false);

        // 模拟 Windows 设备的 userAgent
        global.navigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
        expect(isIOS()).toBe(false);
    });

    test('在 iPadOS 设备上返回 true', () => {
        // 模拟 iPadOS 14+ 的 userAgent
        global.navigator.userAgent = 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15';
        expect(isIOS()).toBe(true);
    });
});

// 测试 getIosVersion 函数
describe('getIosVersion', () => {
    test('在 iOS 设备上返回正确的主版本号', () => {
        // 模拟 iOS 14 的 userAgent
        global.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15';
        expect(getIosVersion()).toBe(14);

        // 模拟 iOS 15 的 userAgent
        global.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15';
        expect(getIosVersion()).toBe(15);
    });

    test('在非 iOS 设备上返回 -1', () => {
        // 模拟 Android 设备的 userAgent
        global.navigator.userAgent = 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36';
        expect(getIosVersion()).toBe(-1);

        // 模拟 Windows 设备的 userAgent
        global.navigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
        expect(getIosVersion()).toBe(-1);
    });

    test('处理不同格式的 iOS 版本字符串', () => {
        // 版本号中只有主版本
        global.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14 like Mac OS X) AppleWebKit/605.1.15';
        expect(getIosVersion()).toBe(14);

        // 版本号中有两个部分
        global.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15';
        expect(getIosVersion()).toBe(14);

        // 版本号中有三个部分
        global.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15';
        expect(getIosVersion()).toBe(14);
    });
});
