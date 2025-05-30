<template>
    <div className="testBox">
        <div v-bind="containerProps" style="height: 300px">
            <div v-bind="wrapperProps">
                <div v-for="item in list" :key="item.index" style="height: 22px">
                    Row: {{ item.data }}
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
  import { useVirtualList } from '@vueuse/core'
    const allItems = Array.from(Array.from({ length: 99999 }).keys())

    const { list, containerProps, wrapperProps } = useVirtualList(
        allItems,
        {
            itemHeight: 22,
        },
    )
  
</script>
  
  
<style lang="less" scoped>
    .testBox{
        height: 100%;
    }
</style>