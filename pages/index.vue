<script setup lang="ts">
import { Icon } from '@iconify/vue';
const modules = [
  {
    title: "玻璃幕墙分割",
    description:
      "给定一张建筑玻璃幕墙图片，分割出其中各块玻璃幕墙图片部分",
    to: "https://github.com/vueuse/vueuse",
    icon: "i-simple-icons-homeassistantcommunitystore",
  },
  {
    title: "玻璃自爆检测",
    description: "通过图片检测玻璃内爆风险",
    to: "https://github.com/nuxt-community/eslint-module",
    icon: "i-simple-icons-affinitydesigner",
  },
  {
    title: "风振数据检测",
    description:
      "检测建筑风振数据，及时报告异常风振情况",
    to: "https://github.com/nuxt-modules/tailwindcss",
    icon: "i-simple-icons-tailwindcss",
  },
  {
    title: "石材污渍识别",
    description:
      "用于识别建筑石材表面污渍",
    to: "https://github.com/nuxt-modules/tailwindcss",
    // icon: "material-symbols:dirty-lens-rounded",
    icon:"i-simple-icons-devexpress",
  },
  {
    title: "石材裂缝识别",
    description:
      "用于识别建筑石材幕墙表面裂缝",
    to: "https://github.com/nuxt-modules/tailwindcss",
    // icon: "material-symbols:sound-detection-glass-break",
    icon:"i-simple-icons-affinitypublisher",
  },
  {
    title: "3D建筑模型",
    description:
      "用于查看3D建筑模型，可视化反映建筑问题",
    to: "https://github.com/nuxt-modules/tailwindcss",
    // icon: "material-symbols:home-work-outline-rounded",
    icon:"i-simple-icons-googlehome",
  },
];
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="首页"> </UDashboardNavbar>
      <UPageGrid>
        <UPageCard
          v-for="(module, index) in modules"
          :key="index"
          v-bind="module"
          target="_blank"
        >
          <template #description>
            <span class="line-clamp-2">{{ module.description }}</span>
          </template>
        </UPageCard>
      </UPageGrid>
    </UDashboardPanel>
  </UDashboardPage>
</template>

