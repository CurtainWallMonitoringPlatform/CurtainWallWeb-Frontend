<template>
    <USelectMenu
        v-model="selectedLevel"
        icon="i-heroicons-check-circle-20-solid"
        :options="levelList"
        placeholder="报警等级"
    >
    </USelectMenu>
  </template>
  
<script setup lang="ts">
    import { defineEmits } from 'vue'

    const emit = defineEmits(['selectLevel']);

    // 使用初始空数组并指定类型
    let levelList = ref(['全部','高','中','低']);

    //选中的等级
    const selectedLevel = ref('');

    watch(selectedLevel, (newValue) => {
        emit('selectLevel', newValue);
    });

</script>