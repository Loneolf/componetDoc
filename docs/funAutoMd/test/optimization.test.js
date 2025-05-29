import {
    throttle, debounce
} from '../es6sourse/optimization.js';

jest.useFakeTimers();

// 测试 throttle 函数
describe('throttle', () => {
    test('首次调用立即执行', () => {
        const mockFn = jest.fn();
        const throttled = throttle(mockFn, 100);

        throttled();
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('在间隔时间内调用不会执行', () => {
        const mockFn = jest.fn();
        const throttled = throttle(mockFn, 100);

        throttled(); // 立即执行
        jest.advanceTimersByTime(50);
        throttled(); // 不会执行

        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('间隔时间后调用会再次执行', () => {
        const mockFn = jest.fn();
        const throttled = throttle(mockFn, 100);

        throttled(); // 立即执行
        jest.advanceTimersByTime(100);
        throttled(); // 再次执行

        expect(mockFn).toHaveBeenCalledTimes(2);
    });

    test('在间隔时间内多次调用，只会在间隔时间结束后执行最后一次', () => {
        const mockFn = jest.fn();
        const throttled = throttle(mockFn, 100);

        throttled(); // 立即执行
        jest.advanceTimersByTime(50);
        throttled(); // 不会立即执行
        jest.advanceTimersByTime(50); // 到达间隔时间

        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('函数上下文和参数正确传递', () => {
        const mockFn = jest.fn();
        const throttled = throttle(mockFn, 100);
        const context = { value: 'test' };

        throttled.call(context, 'arg1', 'arg2');

        expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
        expect(mockFn.mock.instances[0]).toBe(context);
    });

    test('使用默认间隔时间', () => {
        const mockFn = jest.fn();
        const throttled = throttle(mockFn);

        throttled(); // 立即执行
        jest.advanceTimersByTime(499);
        throttled(); // 不会执行
        jest.advanceTimersByTime(1); // 到达 500ms

        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});

// 测试 debounce 函数
describe('debounce', () => {
    test('调用后不会立即执行', () => {
        const mockFn = jest.fn();
        const debounced = debounce(mockFn, 100);

        debounced();
        expect(mockFn).toHaveBeenCalledTimes(0);
    });

    test('在延迟时间内多次调用，只会执行最后一次', () => {
        const mockFn = jest.fn();
        const debounced = debounce(mockFn, 100);

        debounced(); // 第一次调用
        jest.advanceTimersByTime(50);
        debounced(); // 第二次调用
        jest.advanceTimersByTime(50); // 到达 100ms，但第二次调用重置了计时器
        debounced(); // 第三次调用
        jest.advanceTimersByTime(100); // 第三次调用后 100ms

        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('延迟时间结束后执行', () => {
        const mockFn = jest.fn();
        const debounced = debounce(mockFn, 100);

        debounced();
        jest.advanceTimersByTime(100);

        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('函数上下文和参数正确传递', () => {
        const mockFn = jest.fn();
        const debounced = debounce(mockFn, 100);
        const context = { value: 'test' };

        debounced.call(context, 'arg1', 'arg2');
        jest.advanceTimersByTime(100);

        expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
        expect(mockFn.mock.instances[0]).toBe(context);
    });

    test('使用默认延迟时间', () => {
        const mockFn = jest.fn();
        const debounced = debounce(mockFn);

        debounced();
        jest.advanceTimersByTime(499);
        expect(mockFn).toHaveBeenCalledTimes(0);

        jest.advanceTimersByTime(1); // 到达 500ms
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});