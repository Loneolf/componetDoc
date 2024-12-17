<template>
    <div className="readExcelBox">
        <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            :multiple="false"
            accept=".xls,.xlsx"
            :on-change="handleFileChange"
            :on-remove="handleRemove"
            :limit="1"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传.xls,.xlsx文件</div>
        </el-upload>
        <!-- <input ref="fileInput" type="file" id="fileInput" accept=".xls,.xlsx" @change="handleFileChange" > -->
        <div v-if="result" class="oprate">
            <el-button @click="$copyString(JSON.stringify(result, null, 2))" type="primary">复制</el-button>
            <el-button @click="downloadJSON" type="primary">下载</el-button>
        </div>
        <div class="resultBox">{{ result }}</div>
    </div>
</template>
  
<script setup>
    import { ref } from "vue";
    import * as XLSX from "xlsx";
    const result = ref('')
    function handleFileChange(event) {
        console.log('aaaevent', event)
        const file = event.raw;
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            result.value = parseData(jsonData)
        };
        reader.readAsArrayBuffer(file);
    }
    
    function parseData(data) {
        let baseMap = {
            key: "value",
            key_1: "value_1",
            key_2: "value_2",
            key_3: "value_3",
            key_4: "value_4",
            key_5: "value_5",
            key_6: "value_6",
            key_7: "value_7",
            key_8: "value_8",
            key_9: "value_9",
            key_10: "value_10",
            key_11: "value_11",
            key_12: "value_12",
        };
        let res = {};
        data.forEach((item) => {
            let str = "{";
            res[item.act_name] = {}
            for (const key in baseMap) {
                if (item[key]) {
                    if (item[key] === 'resource_name' && item[baseMap[key]].startsWith('【')) {
                        str += ` '${item[key]}': '[name]',`;
                        res[item.act_name][`change___${item[key]}`] = `${item[baseMap[key]]}--->[name]`
                    } else if (item[key] === 'resource_module' && item[baseMap[key]].startsWith('【')) {
                        str += ` '${item[key]}': '[nameF]',`;
                        res[item.act_name][`change___${item[key]}`] = `${item[baseMap[key]]}--->[nameF]`
                    } else {
                        str += ` '${item[key]}': '${item[baseMap[key]]}',`;
                    }
                }
            }
            str = str.substring(0, str.length - 1) + " }";
            res[item.act_name] = {
                ...res[item.act_name],
                desc: item['描述'],
                name: item['埋点中文名称'],
                resStr: `maidian.reportEvent('${item.act_name}', ${str})`
            }
        });
        return res;
    }

    function handleRemove() {
        console.log('aaaremove')
        result.value = ''
    }

    function downloadJSON() {
        const jsonContent = JSON.stringify(result.value, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.json";
        a.click();
        URL.revokeObjectURL(url);
    }

</script>
  
  
<style lang="less">

</style>