/**
 * 取出Url中的参数
 * @param {string} name 需要取url地址中的名字
 * @returns {string| null}  
 */
export function getParameter(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * url参数转换对象
 * @returns {object} json 格式url参数
 */
export function toQueryParams() {
    var search = window.location.search.replace(/^\s+/, '').replace(/\s+$/, '').match(/([^?#]*)(#.*)?$/); //提取location.search中'?'后面的部分
    if (!search) {
        return {};
    }
    var searchStr = search[1];
    var searchHash = searchStr.split('&');

    var ret = {};
    for (var i = 0, len = searchHash.length; i < len; i++) {
        //这里可以调用each方法
        var pair = searchHash[i];
        if ((pair = pair.split('='))[0]) {
            var key = decodeURIComponent(pair.shift());
            var value = pair.length > 1 ? pair.join('=') : pair[0];

            if (value != undefined) {
                value = decodeURIComponent(value);
            }
            if (key in ret) {
                if (ret[key].constructor != Array) {
                    ret[key] = [ret[key]];
                }
                ret[key].push(value);
            } else {
                ret[key] = value;
            }
        }
    }
    return ret;
}

/**
 * 对象转换url参数
 * @param {object} name 需要取url地址中的名字
 * @returns {string} url格式参数
 */
export function toQueryString(obj) {
    var ret = [];
    for (var key in obj) {
        key = encodeURIComponent(key);
        var values = obj[key];
        if (values && values.constructor == Array) {
            //数组
            var queryValues = [];
            for (var i = 0, len = values.length, value; i < len; i++) {
                value = values[i];
                queryValues.push(toQueryPair(key, value));
            }
            ret = ret.concat(queryValues);
        } else {
            //字符串
            ret.push(toQueryPair(key, values));
        }
    }
    return ret.join('&');
}

/**
 * 转换encodeURI
 * @param {string} key url地址中的名字
 * @param {string} value url地址中的值
 * @returns {string} url格式参数
 */
export function toQueryPair(key, value) {
    if (typeof value == 'undefined') {
        return key;
    }
    return key + '=' + encodeURIComponent(value === null ? '' : String(value));
}