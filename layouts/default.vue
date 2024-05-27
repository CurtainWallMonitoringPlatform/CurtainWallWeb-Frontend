<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const appConfig = useAppConfig();
const { isHelpSlideoverOpen } = useDashboard();

// definePageMeta({
//   middleware: "slidebar-renew",
// });

const userPermissions = ref({
  is_superuser: false,
  access_system_a: false,
  access_system_b: false,
  access_system_c: false,
  access_system_d: false,
  access_system_e: false,
  access_system_f: false,
  access_system_g: false,
});

const checkPressmission = async () => {
  const dataToSend = {
    ["admin"]: {
      // 使用动态键名设置邮箱地址
      ["is_superuser"]: true, // 设置对应权限的新值
    },
  };
  try {
    const response = (await $fetch("/api/account/super/updatePermission", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: dataToSend,
    })) as any;
    if (response.status == 403 || response.status == 401) {
      ElMessage.error("您没有管理员权限");
    } else {
      router.push("/userManage");
    }
  } catch (error) {
    ElMessage.error("权限获取错误");
  }
};

const goto3DModel = () => {
  // router.push("http://localhost:5173")
  // window.open("http://localhost:5173", "_blank");
  window.location.href = "http://localhost:5173";
};

const links = reactive([
  {
    id: "home",
    label: "首页",
    icon: "i-heroicons-home",
    to: "/",
    tooltip: {
      text: "首页",
      shortcuts: ["G", "H"],
    },
  },
  {
    id: "3DBuildingModel",
    label: "3D建筑模型",
    // to: "/userManage",
    icon: "i-simple-icons-googlehome",
    tooltip: {
      text: "3D建筑模型",
    },
    click: goto3DModel,
  },
  {
    id: "wind",
    label: "风振数据检测",
    icon: "i-simple-icons-tailwindcss",
    to: "/monitor",
    defaultOpen: false,
    children: [
      {
        id: "monitor",
        label: "监测中心",
        icon: "i-heroicons-chart-bar-square",
        to: "/monitor",
        defaultOpen: false,
        tooltip: {
          text: "监测中心",
          shortcuts: ["G", "M"],
        },
        children: [
          {
            label: "实时监测",
            to: "/monitor",
          },
          {
            label: "历史趋势",
            to: "/monitor/historical",
          },
          {
            label: "异常数据",
            to: "/monitor/abnormal",
          },
        ],
      },
      {
        id: "equipments",
        label: "设备中心",
        icon: "i-heroicons-cpu-chip",
        to: "/equipments",
        tooltip: {
          text: "设备中心",
          shortcuts: ["G", "E"],
        },
      },
      {
        id: "settings",
        label: "设置",
        to: "/settings",
        icon: "i-heroicons-cog-8-tooth",
        defaultOpen: false,
        children: [
          {
            label: "常规",
            to: "/settings",
          },
          {
            label: "通知",
            to: "/settings/notifications",
          },
        ],
        tooltip: {
          text: "Settings",
          shortcuts: ["G", "S"],
        },
      },
    ],
    tooltip: {
      text: "风振数据检测",
      // shortcuts: ["G", "H"],
    },
  },
  {
    id: "segment",
    label: "幕墙材质分割",
    icon: "i-heroicons-building-office",
    to: "/segment",
    defaultOpen: false,
    children: [
      {
        label: "幕墙分割识别",
        to: "/segment",
        exact: true,
      },
      {
        label: "查看历史记录",
        to: "/segment/history",
      }
    ]
  },
  {
    id: "explosion",
    label: "玻璃内爆检测",
    to: "/explosion",
    icon: "i-heroicons-fire",
    tooltip: {
      text: "玻璃内爆检测",
    },
  },
  {
    id: "userInfo",
    label: "个人信息",
    to: "/userInfo",
    icon: "i-heroicons-user-circle",
    tooltip: {
      text: "个人信息",
    },
  },
  {
    id: "notification",
    label: "通知",
    icon: "i-heroicons-bell-alert",
    to: "/mainNotification",
    tooltip: {
      text: "通知",
    },
  },
  {
    id: "userManage",
    label: "用户管理",
    // to: "/userManage",
    icon: "i-heroicons-book-open",
    tooltip: {
      text: "用户管理",
    },
    click: checkPressmission,
  },
]);

const userAuth = ref({
  is_superuser: false,
  access_system_a: false,
  access_system_b: false,
  access_system_c: false,
  access_system_d: false,
  access_system_e: false,
  access_system_f: false,
  access_system_g: false,
});

function removeLinkById(linkId: any) {
  console.log("removeLink");
  const index = links.findIndex((link) => link.id === linkId);
  if (index !== -1) {
    links.splice(index, 1); // 使用 splice 确保响应性保持
  }
}

const getUserAuth = async () => {
  try {
    const authToken = localStorage.getItem("authToken");
    const response = await axios.get("/api/account/custom/getPermissions", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    userAuth.value = response.data.data;
    if (userAuth.value.is_superuser) {
      return;
    }
    if (!userAuth.value.access_system_a) {
      removeLinkById("3DBuildingModel");
    }
    if (!userAuth.value.access_system_e) {
      removeLinkById("wind");
    }
    if (!userAuth.value.access_system_f) {
      removeLinkById("segment");
    }
    if (!userAuth.value.is_superuser) {
      removeLinkById("userManage");
    }
  } catch (error) {
    console.error("Failed to fetch permissions");
    ElMessage.error("获取用户权限失败");
  }
};
getUserAuth();

onMounted(() => {
  getUserAuth();
})

const footerLinks = [
  {
    label: "帮助与支持",
    icon: "i-heroicons-question-mark-circle",
    click: () => (isHelpSlideoverOpen.value = true),
  },
];

const groups = [
  {
    key: "links",
    label: "Go to",
    commands: links.map((link) => ({
      ...link,
      shortcuts: link.tooltip?.shortcuts,
    })),
  },
  {
    key: "code",
    label: "Code",
    commands: [
      {
        id: "source",
        label: "GitHub",
        icon: "i-simple-icons-github",
        click: () => {
          window.open(
            `https://github.com/CurtainWallMonitoringPlatform`,
            "_blank"
          );
        },
      },
    ],
  },
];

const defaultColors = ref(
  ["green", "teal", "cyan", "sky", "blue", "indigo", "violet"].map((color) => ({
    label: color,
    chip: color,
    click: () => (appConfig.ui.primary = color),
  }))
);
const colors = computed(() =>
  defaultColors.value.map((color) => ({
    ...color,
    active: appConfig.ui.primary === color.label,
  }))
);
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <WebInfo />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton />
        </template>

        <UDashboardSidebarLinks :links="links" />

        <UDivider />

        <!--
        <UDashboardSidebarLinks :links="[{ label: 'Colors', draggable: true, children: colors }]" @update:links="(colors: any) => defaultColors = colors" />
        -->
        <div class="flex-1" />

        <UDashboardSidebarLinks :links="footerLinks" />

        <UDivider class="sticky bottom-0" />

        <template #footer>
          <!-- ~/components/UserDropdown.vue -->
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />

    <!-- ~/components/HelpSlideover.vue -->
    <HelpSlideover />
    <!-- ~/components/NotificationsSlideover.vue -->
    <!-- <NotificationsSlideover /> -->

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>
</template>

<style></style>
