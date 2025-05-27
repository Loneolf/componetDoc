<template>
    <el-button class="docbutton" type="primary" style="margin-left: 16px" @click="drawer = true">
        查看测试报告
    </el-button>
    <el-drawer
        v-model="drawer"
        direction="rtl"
        size="60%"
        :with-header="false"
    >
        <iframe class="frameBox" :src="url"></iframe>
    </el-drawer>
</template>
  
<script setup>
    const props = defineProps({
        url: String,
    })
    import { ref } from "vue";
    const drawer = ref(false)

</script>
  
<style lang="less" scoped>
    .docbutton{
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 99;
    }
    .frameBox{
        width: 100%;
        height: 100%;
        border: none;
        background: #fff;
    }
</style>