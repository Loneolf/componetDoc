<template>
    <div class="getFieldIndexBox">
        <div class="leftBox">
            <textarea v-model="taValue" class="textarea" @input="changeHandle($event)" />
        </div>
        <div class="rightBox">
            <template v-if="showData.length > 0">
                <p v-for="(item, index) in showData" :key="index" class="item">
                    {{item[0]}} ---- <span :class="item[1].includes('需补充下标') ? 'needIndex' : ''">{{item[1]}}</span>
                    <span @click="$copyString(item[1])" class="iconfont">复制</span>
                </p>
            </template>
            <p v-else :class="tipText === '请粘贴正确的请求数据' ? 'tip errorTip' : 'tip'">{{tipText}}</p>
        </div>
    </div>
</template>
  
<script setup>
    import { ref } from "vue";
    import { ElMessage } from 'element-plus'
    const taValue = ref('')
    const showData = ref([])
    const tipText = ref('请粘贴要解析的数据')
  
    // 解析正常的接口返回数据
    function getFieldIndex(data) {
        const grid0 = data.GRID0[0].split('|');
        let res = []
        grid0.forEach((item, index) => {
            if (!item) return
            // console.log(item, index)
            let tem = []
            for (const key in data) {
                if (!tem.length) {
                    tem.push(index)
                }
                if (Number(data[key]) === index) {
                    // 如果已经有了一个下标，后面还有下标则累加
                    if (tem[1]) {
                        tem[1] += `---${key}`
                    } else {
                        tem.push(`${item}---${key}`)
                    }
                }
            }
            if (tem.length === 1) tem.push(`${item}:需补充下标`)
            res.push(tem)
        });
        return res.sort((a, b) => {
            return a[0] - b[0]
        });
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
            }

        } catch (error) {
            tipText.value = '请粘贴正确的请求数据'
            showData.value = []
            console.log('error', error)
        }
    }
  
</script>
  
  
<style lang="less" scoped>
  .getFieldIndexBox{
      display: flex;
      .leftBox {
          width: 40%;
          min-width: 40%;
          padding: 20px;
          border-right: 2px solid #cccccc;
          textarea {
              min-height: 600px;
              height: 100%;
              width: calc(100% - 20px);
              border: none;
              resize: none;
              padding: 10px;
              border-radius: 10px;
              background-color: aliceblue;
          }
      }
      .rightBox{
          flex: 1;
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