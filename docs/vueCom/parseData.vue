<template>
    <div class="getFieldIndexBox">
        <div class="topBox">
            <textarea v-model="taValue" class="textarea" @input="changeHandle($event)" />
        </div>
        <div class="bottomBox">
            <template v-if="showData.length > 0">
                <div class="tableBox">
                    <vxe-table 
                        height="600" 
                        :data="showData" 
                    >
                        <vxe-column type="seq" width="100" fixed="left"></vxe-column>
                        <vxe-column 
                            v-for="(item, index) in titleArr"
                            :key="index"
                            :field="item"
                            width="auto"
                        >
                            <template #header>
                                <span v-html="item"></span>
                            </template>
                        </vxe-column>
                    </vxe-table>
                </div>
            </template>
            <p v-else :class="tipText === '请粘贴正确的请求数据' ? 'tip errorTip' : 'tip'">{{tipText}}</p>
        </div>
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from "vue";
    // import { mockdata1, mockdata2 } from './mockdata.js'
    const taValue = ref('')
    const showData = ref([])
    const titleArr = ref([])
    const tipText = ref('请粘贴要解析的数据')
  
    onMounted(() => {
        // changeHandle({ target: { value: JSON.stringify(mockdata1, null, 2) } })
    });
    // 解析正常的接口返回数据
    function getFieldIndex(data) {
        const grid0 = data.GRID0.shift().split('|').filter(item => item.trim());
        // console.log('grid0', grid0)
        let temTa = [], res = []
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
            let obj = {}
            obj.title = tem.join('')
            // obj.title = grid0[index]
            // res.push(obj)
            temTa.push(tem.join(''))
        });
        titleArr.value = temTa
        // console.log('temTa', JSON.parse(JSON.stringify(temTa)))
        // console.log('res', JSON.parse(JSON.stringify(res)))
        data.GRID0.forEach((item, i) => {
            let temArr = item.replace(/\|$/, '').split('|')
            let obj = {title: temTa[i]}
            res.push(obj)
            // console.log('temArr', i, temArr)
            temArr.forEach((item, index) => {
                res[i][temTa[index]] = item
            })
        })
        // console.log('res', res)
        return res;
    }

    // 解析服务端数据
    function getServerDataIndex(rawData) {
        const lines = rawData.split('\n');
        // 提取表头行
        const headerLine = lines.find(line => line.startsWith('GRID0=') || line.startsWith('Grid='));
        // 用于存储各字段对应索引的对象
        const indexMap = {};
        lines.forEach(line => {
            if (line.includes('=')) {
                const [key, value] = line.split('=');
                indexMap[key] = value;
            }
        });
        indexMap['GRID0'] = [headerLine.replace(/GRID0=|Grid=/, '')]
        return getFieldIndex(indexMap);
    }

    // 解析恒生返回数据
    function getHSDataindex(rawData) {
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

    // changeHandle({ target: { value: `` }})

    function changeHandle(e) {
        // console.log(e.target.value)
        var text = e.target.value.trim();
        try {
            if (!text) {
                tipText.value = '请粘贴要解析的数据'
                showData.value = []
                return
            }

            let isHSData = text.includes('HsAns=') && text.includes('ReturnGrid=')
            let isServerData = text.includes('GRID0=') || text.includes('Grid=')
            // console.log('aaaajudgeText', isHSData, isServerData)
            if (isHSData) {
                let res = getHSDataindex(text)
                console.log('aaaaisHSData', res)
                if (!res || !res.length) throw new Error('数据异常')
                showData.value = res
                console.log('aaaaisHSData', getHSDataindex(text))
            } else if (isServerData) {
                showData.value = getServerDataIndex(text)
            } else {
                let data = JSON.parse(text)
                showData.value = getFieldIndex(data)
                console.log('showData', showData)
            }

        } catch (error) {
            tipText.value = '请粘贴正确的请求数据'
            showData.value = []
            console.log('error', error)
        }
    }
  
</script>
  
  
<style lang="less" >
  .vxe-table--header{
    margin: 0!important;
  }
  .vxe-header--gutter.col--gutter {
    display: none;
  }
  .getFieldIndexBox{
      .topBox {
          height: 400px;
          padding: 20px;
          border-right: 2px solid #cccccc;
          textarea {
              min-height: 400px;
              height: 100%;
              width: calc(100% - 20px);
              border: none;
              resize: none;
              padding: 10px;
              border-radius: 10px;
              background-color: aliceblue;
          }
      }
      .bottomBox{
          overflow: auto;
          padding: 20px;
          .item{
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              .iconfont{
                  margin-left: 10px;
                  cursor: pointer;
                  display: none;
              }
          }
          .item:hover{
             .iconfont{
                  display: block;
              }
          }
          .tip{
              text-align: center;
          }
          .errorTip, .needIndex{
              color: #ff4d4f;
          }
      }
  }
</style>