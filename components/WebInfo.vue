<script setup lang="ts">
const CurtainWeb = [{
  label: '幕墙脉动',
  avatar: {
    src: '/assets/images/curtain-wall.png'
  },
  description: '玻璃幕墙振动数据可视化监管平台',
  click: () => {
    team.value = CurtainWeb[0]
  }
}]

const team = ref(CurtainWeb[0])
</script>

<template>
  <div class="flex flex-row items-center">
    <img class="m-2 w-8 h-8" :src="team.avatar.src" />
    <span class="truncate text-gray-900 dark:text-white font-semibold text-lg">{{ team.label }}</span>
  </div>
  <!--
    <UAvatar :src="team.avatar.src" size="md" />
    
    -->
  </template>