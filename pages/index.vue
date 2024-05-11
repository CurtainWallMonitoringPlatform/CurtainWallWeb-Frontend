<script setup>
import axios from "axios";
import { ref, reactive } from "vue";
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const userAuth = ref({})

definePageMeta({
  middleware: 'auth'
});

const getUserAuth = async () => {
  try {
    const authToken = localStorage.getItem("authToken");
    const response = await axios.get("/api/account/custom/getPermissions", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    userAuth.value = response.data;
  } catch (error) {
    console.error("Failed to fetch permissions");
    ElMessage.error("获取用户权限失败");
  }
}
getUserAuth();

const modules = reactive([
  {
    title: "3D建筑模型",
    description:
      "用于查看3D建筑模型，可视化反映建筑问题",
    to: "https://github.com/nuxt-modules/tailwindcss",
    icon:"i-simple-icons-googlehome",
    permissionKey: "access_system_a"
  },
  // {
  //   title: "石材污渍识别",
  //   description:
  //     "用于识别建筑石材表面污渍",
  //   to: "https://github.com/nuxt-modules/tailwindcss",
  //   // icon: "material-symbols:dirty-lens-rounded",
  //   icon:"i-simple-icons-devexpress",
  // },
  {
    title: "石材污渍裂缝识别",
    description:
      "用于识别建筑石材幕墙表面裂缝和污渍",
    to: "https://github.com/nuxt-modules/tailwindcss",
    permissionKey: "access_system_b",
    icon:"i-simple-icons-affinitypublisher",
  },
  {
    title: "玻璃自爆检测",
    description: "通过图片检测玻璃内爆风险",
    to: "https://github.com/nuxt-community/eslint-module",
    permissionKey: "access_system_c",
    icon: "i-simple-icons-affinitydesigner",
  },
  {
    title: "玻璃幕墙分割",
    description:
      "给定一张建筑玻璃幕墙图片，分割出其中各块玻璃幕墙图片部分",
    to: "https://github.com/vueuse/vueuse",
    permissionKey: "access_system_d",
    icon: "i-simple-icons-homeassistantcommunitystore",
  },
  {
    title: "风振数据检测",
    description:
      "检测建筑风振数据，及时报告异常风振情况",
    to: "https://github.com/nuxt-modules/tailwindcss",
    permissionKey: "access_system_e",
    icon: "i-simple-icons-tailwindcss",
  },
]);

const checkPermissionAndRedirect = (module) => {
  if (userAuth.value.is_superuser || userAuth.value[module.permissionKey]) {
    router.push({ path: module.to })
  } else {
    ElMessage.error('您没有权限访问此模块');
  }
};

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="首页"> </UDashboardNavbar>
      <UPageGrid class="custom-margin">
        <UPageCard
          v-for="(module, index) in modules"
          :key="index"
          v-bind="module"
          target="_blank"
          @click="checkPermissionAndRedirect(module)"
        >
          <template #description>
            <span class="line-clamp-2">{{ module.description }}</span>
          </template>
        </UPageCard>
      </UPageGrid>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped>
.custom-margin {
  margin: 20px;
}
</style>

