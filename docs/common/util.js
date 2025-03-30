
import { ElMessage } from 'element-plus'

export function copyString(params) {
  if (!params) {
    ElMessage({
        message: '复制内容不能为空',
        type:'warning',
        duration:1000
    })
    return;
  }
    navigator.clipboard.writeText(params).then(() => {
      ElMessage({
          message:`已复制内容:${params}`,
          type:'success',
          duration:1000
      })
    }).catch(() => {
      ElMessage({
          message:`已复制内容:${params}`,
          type:'error',
          duration:1000
      })
    })
}

export function serveDataToObj(data, isCap){
  const lines = data.split('\n');
  // console.log('aaa2333lines', lines)
  // 提取表头行
  const headerLine = lines.find(line => line.startsWith('GRID0='));
  const headerLine2 = lines.find(line => line.startsWith('GRID2='));
  // 用于存储各字段对应索引的对象
  const indexMap = {GRID0: [ headerLine?.replace(/GRID0=/, '') ]};
  let GRID2 = [ headerLine2?.replace(/GRID2=/, '') ];
  // console.log('aaaaaindexMap', JSON.parse(JSON.stringify(indexMap)))
  var beginPush = false
  var beginPush2 = false
  lines.forEach(line => {
      // console.log('aaaaline')
      if (beginPush && line.includes('|') && !line.includes('=')) {
          // console.log(indexMap.GRID0)
          indexMap.GRID0.push(line)
      } else {
          beginPush = false
      }
      if (beginPush2 && line.includes('|') && !line.includes('=')) {
          // console.log(indexMap.GRID0)
          GRID2.push(line)
      } else {
          beginPush2 = false
      }
      if (line.includes('GRID0=')) {
          beginPush = true
      }
      if (line.includes('GRID2=')) {
          beginPush2 = true
      }
      if (line.includes('=') && !line.includes('GRID0=') && !line.includes('GRID2=')) {
          let [key, value] = line.split('=');
          indexMap[isCap ? key.toUpperCase() : key] = value;
      }
  });
  if (headerLine2) {
      indexMap.GRID2 = GRID2;
  }
  return indexMap;
}


export function strToJson(str, isCap = true) {
  if (str.includes("GRID0=") || str.includes("Grid=")) {
      str = str.replace(/Grid=/g, 'GRID0=');
      return serveDataToObj(str, isCap)
  }
  return JSON.parse(str)
}

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












