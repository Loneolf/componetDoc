<template>
    <div className="jsonFormatBox">
        <div className="topOprateBox">
            <el-button class="marginBtn" type="primary" @click="$copyString(jsonData)">复制结果</el-button>
        </div>
        <div className="stringChangeContent">
            <div className="leftBox">
                <textarea v-model="taValue" className="textarea" @input="changeHandle" />
            </div>
            <div className="rightBox">
                <vue-json-pretty
                    v-if="jsonData"
                    :data="jsonData"
                    showLineNumber
                    showIcon
                    virtual
                    height="800"
                    selectableType="multiple"
                ></vue-json-pretty>
                <p v-else :class="tipText === '请粘贴正确的请求数据'? 'tip errorTip' : 'tip'">{{tipText}}</p>
            </div>
        </div>
    </div>
</template>
  
<script setup>
    import { ref } from "vue";
    import 'vue-json-pretty/lib/styles.css';
    import VueJsonPretty from 'vue-json-pretty';
    import { strToJson } from '@com/util.js';
    const taValue = ref('')
    const tipText = ref('请在左侧输入框粘贴要解析的数据')
    const jsonData = ref('');
    
    function changeHandle(e) {
        let va = e.target.value
        if (!va) {
            tipText.value = '请粘贴要解析的数据'
            jsonData.value = ''
            return
        }
        try {
            jsonData.value = strToJson(va)
        } catch (error) {
            console.error('直接strToJson解析失败', error)
            tipText.value = '请粘贴正确的请求数据'
            jsonData.value = ''
        }
    }
  
</script>
  
<style lang="less" scoped>
  .jsonFormatBox{
    height: 100%;
    .topOprateBox{
        text-align: center;
        .marginBtn{
            margin-left: 40px;
        }
    }
    .stringChangeContent {
        display: flex;
        height: 100%;
    }
    .leftBox {
        width: 40%;
        overflow: auto;
        padding: 20px;
        height: 100%;
        border-right: 2px solid #cccccc;
    }
    textarea {
        height: 80%;
        min-height: 600px;
        width: calc(100% - 20px);
        border: none;
        resize: none;
        padding: 10px;
        border-radius: 10px;
        background-color: aliceblue;
        word-break: break-all;
        white-space: wrap;
    }
    .rightBox{
        flex: 1;
        height: 100%;
        overflow: auto;
        padding: 20px;
        word-break: break-all;
        white-space: wrap;
        .tip{
            text-align: center;
        }
        .errorTip, .needIndex{
            color: #ff4d4f;
        }
    }
    .vjs-node-index {
        white-space: nowrap;
    }
}
</style>