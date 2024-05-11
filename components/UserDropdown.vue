<script setup lang="ts">
const { isHelpSlideoverOpen } = useDashboard()
const { isDashboardSearchModalOpen } = useUIState()
const { metaSymbol } = useShortcuts()
import { useRouter } from 'vue-router';

const loginUser = ref(localStorage.getItem("email"));
const router = useRouter();
const state = reactive({
  name: 'Curtain Wall Admin',
  email: 'admin@tongji.edu.cn',
  username: 'Admin',
  avatar: '',
  bio: '',
  password_current: '',
  password_new: ''
})

const items = computed(() => [
  [{
    slot: 'account',
    label: '',
    disabled: true
  }], [{
    label: '设置',
    icon: 'i-heroicons-cog-8-tooth',
    to: '/settings'
  }, {
    label: '命令菜单',
    icon: 'i-heroicons-command-line',
    shortcuts: [metaSymbol.value, 'K'],
    click: () => {
      isDashboardSearchModalOpen.value = true
    }
  }, {
    label: '帮助与支持',
    icon: 'i-heroicons-question-mark-circle',
    shortcuts: ['?'],
    click: () => isHelpSlideoverOpen.value = true
  }], [{
    label: '用户管理',
    icon: 'i-heroicons-book-open',
    to: '/userManage',
    // target: '_blank'
  }, {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/CurtainWallMonitoringPlatform',
    target: '_blank'
  }], [{
    label: '退出登录',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: () => {
      localStorage.clear();
      router.push('/login');
    }
  }]
])
</script>

<template>
  <UDropdown mode="hover" :items="items" :ui="{ width: 'w-full', item: { disabled: 'cursor-text select-text' } }" :popper="{ strategy: 'absolute', placement: 'top' }" class="w-full">
    <template #default="{ open }">
      <UButton color="gray" variant="ghost" class="w-full" :class="[open && 'bg-gray-50 dark:bg-gray-800']">
        <template #leading>
          <UAvatar :src="state.avatar" :alt="state.name" size="2xs" />
        </template>
            {{ state.name }}
        <template #trailing>
          <UIcon name="i-heroicons-ellipsis-vertical" class="w-5 h-5 ml-auto" />
        </template>
      </UButton>
    </template>

    <template #account>
      <div class="text-left">
        <p>
            已登录为 {{ loginUser }}
        </p>
        <!-- <p class="truncate font-medium text-gray-900 dark:text-white">
            
        </p> -->
      </div>
    </template>
  </UDropdown>
</template>