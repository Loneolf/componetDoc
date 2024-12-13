// 获取当前页面URL中的参数
export function getURLParams () {
    let res = {}
    let queryString = location.search;
    let queryParams = new URLSearchParams(queryString);
    for (let key of queryParams.keys()) {
        res[key] = queryParams.get(key)
    }
    return res
}