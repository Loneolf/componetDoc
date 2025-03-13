// 解析正常的接口返回数据
export function getFieldIndex(data) {
    const grid0 = data.GRID0.shift().split('|').filter(item => item.trim());
    // console.log('grid0', grid0)
    let temTa = [], showData = [], titleArr = [], fixedArr = []
    grid0.forEach((ti, index) => {
        // console.log(ti, index)
        let tem = []
        for (const key in data) {
            if (!tem.length) {
                tem.push(index)
            }
            if (Number(data[key]) === index) {
                // 如果已经有了一个下标，后面还有下标则累加
                if (tem[1]) {
                    tem[1] += `<br />${key}`
                } else {
                    tem.push(`---${ti}<br />${key}`)
                }
            }
        }
        if (tem.length === 1) tem.push(`${ti}:需补充下标`)
        // showData.push(obj)
        temTa.push(tem.join(''))
        fixedArr.push({text: tem.join(''), fixed: null})
    });
    titleArr = temTa
    // console.log('temTa', JSON.parse(JSON.stringify(temTa)))
    // console.log('showData', JSON.parse(JSON.stringify(showData)))
    data.GRID0.forEach((item, i) => {
        let temArr = item.replace(/\|$/, '').split('|')
        let obj = {title: temTa[i]}
        showData.push(obj)
        // console.log('temArr', i, temArr)
        temArr.forEach((item, index) => {
            showData[i][temTa[index]] = item
        })
    })
    // console.log('showData', showData)
    return {titleArr, showData, fixedArr};
}

// 解析服务端数据
export function getServerDataIndex(rawData) {
    const lines = rawData.split('\n');
    console.log('aaa2333lines', lines)
    // 提取表头行
    const headerLine = lines.find(line => line.startsWith('GRID0=') || line.startsWith('Grid='));
    // 用于存储各字段对应索引的对象
    const indexMap = {GRID0: [ headerLine.replace(/GRID0=|Grid=/, '') ]};
    console.log('aaaaaindexMap', JSON.parse(JSON.stringify(indexMap)))
    var beginPush = false
    lines.forEach(line => {
        // console.log('aaaaline')
        if (beginPush && line.includes('|') && !line.includes('=')) {
            console.log(indexMap.GRID0)
            indexMap.GRID0.push(line)
        } else {
            beginPush = false
        }
        if (line.includes('GRID0=') || line.includes('Grid=')) {
            beginPush = true
        }
        if (line.includes('=') && !line.includes('GRID0=') && !line.includes('Grid=')) {
            const [key, value] = line.split('=');
            indexMap[key] = value;
        }
    });
    return getFieldIndex(indexMap);
}

// 解析恒生返回数据
export function getHSDataindex(rawData) {
    const lines = rawData.split('\n');
    // 提取表头行
    const headerLine = lines.find(line => line.includes('HsAns=')).replace(/HsAns=/, '').split('|');
    const valueLine = lines.find(line => line.includes('ReturnGrid=')).replace(/ReturnGrid=/, '').split('|');
    if (!headerLine || !valueLine) return ''
    let res = []
    headerLine.forEach((item, index) => {
        if (!item) return
        res.push([index, `${item}:${valueLine[index]}`])
    })
    return res
}