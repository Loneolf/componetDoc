<template>
    <div class="getFieldIndexBox">
        <div class="topBox">
            <textarea v-model="taValue" class="textarea" @input="changeHandle($event)" />
        </div>
        <div class="bottomBox">
            <template v-if="showData2.length > 0">
                <div class="tableBox">
                    <vxe-table 
                        height="500" 
                        :data="showData2" 
                    >
                        <vxe-column type="seq" width="100" fixed="left"></vxe-column>
                        <vxe-column 
                            v-for="(item, index) in titleArr2"
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
            <template v-if="showData.length > 0">
                <div class="tableBox">
                    <vxe-table 
                        height="800" 
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
            
            <p v-if="!showData.length" :class="tipText === '请粘贴正确的请求数据' ? 'tip errorTip' : 'tip'">{{tipText}}</p>
        </div>
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from "vue";
    import * as tUtil from './comUtil/tabelUtil'
    import * as mockData from './holding/holdMock'
    // import { mockdata1, mockdata2, mockHsData1, mockHsData2 } from './mockdata.js'
    const taValue = ref()

    const showData = ref([])
    const titleArr = ref([])

    const showData2 = ref([])
    const titleArr2 = ref([])
    const tipText = ref('请粘贴要解析的数据')
  
    onMounted(() => {
        // const TD = JSON.stringify(mockData.mockdata117)
        // taValue.value = TD
        // changeHandle({ target: { value: TD } })
    });

    function changeHandle(e) {
        console.log(e.target.value)
        var text = e.target.value.trim();
        try {
            if (!text) {
                tipText.value = '请粘贴要解析的数据'
                showData.value = []
                showData2.value = []
                return
            }

            let isHSData = text.includes('HsAns=') && text.includes('ReturnGrid=')
            let isServerData = text.includes('GRID0=') || text.includes('Grid=')
            // console.log('aaaajudgeText', isHSData, isServerData)
            if (isHSData) {
                let res = tUtil.getHSDataindex(text)
                console.log('aaaaisHSData', res)
                if (!res || !res.length) throw new Error('数据异常')
                showData.value = res
                console.log('aaaaisHSData', tUtil.getHSDataindex(text))
            } else if (isServerData) {
                console.log('aaaaaserve')
                // getServerDataIndex(text)
                // return
                let res = tUtil.getServerDataIndex(text)
                showData.value = res.showData
                titleArr.value = res.titleArr
            } else {
                // let data1 = eval(text)
                let data = JSON.parse(text)
                let res = tUtil.getFieldIndex(data)

                if (data.GRID2) {
                    var data2 = JSON.parse(JSON.stringify(data))
                    data2.GRID0 = data.GRID2
                    let res2 = tUtil.getFieldIndex(data2)
                    showData2.value = res2.showData
                    titleArr2.value = res2.titleArr
                }

                console.log('aaadata1', res)

                showData.value = res.showData
                titleArr.value = res.titleArr
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
          margin-top: 20px;
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