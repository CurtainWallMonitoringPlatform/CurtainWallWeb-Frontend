<script setup>
import axios from "axios";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const userAuth = ref({});

definePageMeta({
  middleware: "auth",
});

const getUserAuth = async () => {
  try {
    const authToken = localStorage.getItem("authToken");
    const response = await axios.get("/api/account/custom/getPermissions", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    userAuth.value = response.data.data;
    console.log(userAuth.value);
  } catch (error) {
    console.error("Failed to fetch permissions");
    ElMessage.error("获取用户权限失败");
  }
};
getUserAuth();

const modules = reactive([
  {
    title: "3D建筑模型",
    description: "用于查看3D建筑模型，可视化反映建筑问题",
    // to: "http://localhost:5173",
    target_address: "http://localhost:5173",
    icon: "i-simple-icons-googlehome",
    permissionKey: "access_system_a",
  },
  {
    title: "石材污渍",
    description: "用于识别建筑石材幕墙表面污渍",
    to: "https://github.com/nuxt-modules/tailwindcss",
    icon: "i-simple-icons-anchor",
    permissionKey: "access_system_b",
  },
  {
    title: "石材裂缝",
    description: "用于识别建筑石材幕墙表面裂缝",
    to: "https://github.com/nuxt-modules/tailwindcss",
    permissionKey: "access_system_c",
    icon: "i-simple-icons-affinitypublisher",
  },
  {
    title: "玻璃自爆",
    description: "通过图片检测玻璃内爆风险",
    to: "https://github.com/nuxt-community/eslint-module",
    permissionKey: "access_system_d",
    icon: "i-simple-icons-affinitydesigner",
  },
  {
    title: "风振数据检测",
    description: "检测建筑风振数据，及时报告异常风振情况",
    // to: "",
    target_address: "/monitor",
    permissionKey: "access_system_e",
    icon: "i-simple-icons-tailwindcss",
  },
  {
    title: "幕墙材质分割",
    description: "给定一张建筑幕墙图片，分割出其中的各种材质",
    // to: "",
    target_address: "/segment",
    permissionKey: "access_system_f",
    icon: "i-simple-icons-homeassistantcommunitystore",
  },
  {
    title: "玻璃平整度",
    description: "给定一张建筑玻璃图片，输出其平整度",
    to: "https://github.com/vueuse/vueuse",
    permissionKey: "access_system_g",
    icon: "i-simple-icons-edgeimpulse",
  },
]);

const checkPermissionAndRedirect = (module) => {
  if (userAuth.value.is_superuser || userAuth.value[module.permissionKey]) {
    if (module.title === "3D建筑模型") {
      window.location.href = module.target_address; // 使用window.location.href进行跳转
    } else {
      router.push({ path: module.target_address }); // 使用router.push进行跳转
    }
  } else {
    ElMessage.error("您没有权限访问此模块");
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
          @click="checkPermissionAndRedirect(module)"
          class="hover-effect"
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
.hover-effect:hover {
  background-color: #f0f0f0;
  cursor: pointer;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
</style>
