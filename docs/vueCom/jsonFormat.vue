<template>
    <div className="jsonFormatBox">
			<div className="topOprateBox">
                <el-button class="marginBtn" type="primary" @click="$copyString(showData)">复制结果</el-button>
			</div>
			<div className="stringChangeContent">
				<div className="leftBox">
					<textarea v-model="taValue" className="textarea" @input="changeHandle" />
				</div>
				<div className="rightBox">
                    <pre v-if="showData && showPre" className="showBox preShowBox">{{ showData }}</pre>
                    <div v-if="showData && !showPre" className="showBox">{{ showData }}</div>
					<p v-else :class="tipText === '请粘贴正确的请求数据'? 'tip errorTip' : 'tip'">{{tipText}}</p>
				</div>
			</div>
		</div>
</template>
  
<script setup>
  import { ref } from "vue";
  const taValue = ref('')
  const showData = ref()
  const tipText = ref('请在左侧输入框粘贴要解析的数据')
  const showPre = ref(false)
  
  function changeHandle(e) {
		try {
			let va = e.target.value
			if (!va) {
                tipText.value = '请粘贴要解析的数据'
                showData.value = ''
                return
            }
			let back = va.includes('\\n') && (va.includes('\\n\\t') || va.includes('\\n    '))
			console.log('aaaaback', back, va)
			if (!back) {
				let tem1 = JSON.stringify(va)
                showData.value = tem1
                showPre.value = false
			} else {
                showData.value = JSON.parse(`{"string":${va}}`).string
				showPre.value = true
			}
		} catch (error) {
            tipText.value = '请粘贴正确的请求数据'
            showData.value = ''
			console.log('error', error)
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
    .showBox{
        background-color: #eeeeee;
        padding: 20px;
        border-radius: 8px;
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
}
</style>