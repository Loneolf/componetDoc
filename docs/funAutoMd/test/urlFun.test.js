import {
    getParameter,
    toQueryParams,
    toQueryString,
    toQueryPair
} from '../es6sourse/urlFun.js';

// 保存原始 location 对象
const originalLocation = global.window; 

// 每次测试前创建一个可模拟的 window 对象
beforeEach(() => {
    global.window = {
        location: {
            search: '',
            assign: jest.fn(),
            reload: jest.fn(),
            replace: jest.fn()
        }
    };
});

// 所有测试完成后恢复原始的 window 对象
afterAll(() => {
    global.window = originalLocation;
});
// -------------------------
// 测试 getParameter 函数
// -------------------------
describe('getParameter', () => {
    test('从URL中获取单个参数', () => {
        window.location.search = '?name=John&age=30';
        expect(getParameter('name')).toBe('John');
        expect(getParameter('age')).toBe('30');
    });

    test('参数值包含特殊字符', () => {
        window.location.search = '?message=Hello%20World&email=john%40example.com';
        expect(getParameter('message')).toBe('Hello World');
        expect(getParameter('email')).toBe('john@example.com');
    });

    test('参数不存在时返回null', () => {
        window.location.search = '?name=John';
        expect(getParameter('age')).toBeNull();
    });

    test('参数名大小写不敏感', () => {
        window.location.search = '?NaMe=John';
        expect(getParameter('name')).toBe('John');
    });

    test('处理多个相同参数名（返回第一个）', () => {
        window.location.search = '?name=John&name=Alice';
        expect(getParameter('name')).toBe('John');
    });

    test('处理空参数值', () => {
        window.location.search = '?name=&age=30';
        expect(getParameter('name')).toBe('');
    });
});

// -------------------------
// 测试 toQueryParams 函数
// -------------------------
describe('toQueryParams', () => {
    test('解析简单URL参数', () => {
        window.location.search = '?name=John&age=30';
        expect(toQueryParams()).toEqual({ name: 'John', age: '30' });
    });

    test('解析带数组的参数', () => {
        window.location.search = '?hobby=reading&hobby=swimming';
        expect(toQueryParams()).toEqual({ hobby: ['reading', 'swimming'] });
    });

    test('解析带特殊字符的参数', () => {
        window.location.search = '?message=Hello%20World&email=john%40example.com';
        expect(toQueryParams()).toEqual({
            message: 'Hello World',
            email: 'john@example.com'
        });
    });

    test('处理空参数值', () => {
        window.location.search = '?name=&age=30';
        expect(toQueryParams()).toEqual({ name: '', age: '30' });
    });

    test('处理无参数的URL', () => {
        window.location.search = '';
        expect(toQueryParams()).toEqual({});
    });

    test('处理仅含问号的查询字符串', () => {
        window.location.search = '?';
        expect(toQueryParams()).toEqual({});
    });

    test('忽略哈希部分', () => {
        window.location.search = '?key=value#hash';
        expect(toQueryParams()).toEqual({key: 'value'});
    });

    test('处理URL中的哈希值', () => {
        window.location.search = '?name=John#section1';
        expect(toQueryParams()).toEqual({ name: 'John' });
    });

    test('处理参数值中的等号', () => {
        window.location.search = '?param=a=b';
        expect(toQueryParams()).toEqual({ param: 'a=b' });
    });
});

// -------------------------
// 测试 toQueryString 函数
// -------------------------
describe('toQueryString', () => {
    test('对象转为URL参数字符串', () => {
        const obj = { name: 'John', age: 30 };
        expect(toQueryString(obj)).toBe('name=John&age=30');
    });

    test('处理对象中的数组', () => {
        const obj = { hobby: ['reading', 'swimming'] };
        expect(toQueryString(obj)).toBe('hobby=reading&hobby=swimming');
    });

    test('处理特殊字符', () => {
        const obj = { message: 'Hello World', email: 'john@example.com' };
        expect(toQueryString(obj)).toBe('message=Hello%20World&email=john%40example.com');
    });

    test('处理嵌套对象（浅处理）', () => {
        const obj = { user: { name: 'John' } };
        // 注意：此处不会递归处理，直接转换为[object Object]
        expect(toQueryString(obj)).toBe('user=%5Bobject%20Object%5D');
    });

    test('空对象转为空字符串', () => {
        expect(toQueryString({})).toBe('');
    });
});

// -------------------------
// 测试 toQueryPair 函数
// -------------------------
describe('toQueryPair', () => {
    test('生成简单键值对', () => {
        expect(toQueryPair('name', 'John')).toBe('name=John');
        expect(toQueryPair('age', 30)).toBe('age=30');
    });

    test('处理特殊字符', () => {
        expect(toQueryPair('message', 'Hello World')).toBe('message=Hello%20World');
        expect(toQueryPair('email', 'john@example.com')).toBe('email=john%40example.com');
    });

    test('处理null值', () => {
        expect(toQueryPair('name', null)).toBe('name=');
    });

    test('处理undefined值', () => {
        expect(toQueryPair('age', undefined)).toBe('age');
    });

    test('处理布尔值', () => {
        expect(toQueryPair('active', true)).toBe('active=true');
        expect(toQueryPair('active', false)).toBe('active=false');
    });
});

// -------------------------
// 测试函数组合性
// -------------------------
describe('函数组合测试', () => {
    test('toQueryString和toQueryParams互逆', () => {
        const obj = { name: 'John', age: 30, hobby: ['reading', 'swimming'] };
        const queryString = toQueryString(obj);
        window.location.search = `?${queryString}`;
        const parsedObj = toQueryParams();

        // 注意：由于数组顺序问题，需特殊处理比较
        expect(parsedObj.name).toBe(obj.name);
        expect(parsedObj.age).toBe(String(obj.age));
        expect(parsedObj.hobby).toEqual(obj.hobby);
    });

    test('getParameter和toQueryParams一致性', () => {
        window.location.search = '?name=John&age=30';
        expect(getParameter('name')).toBe(toQueryParams().name);
        expect(getParameter('age')).toBe(toQueryParams().age);
    });
});