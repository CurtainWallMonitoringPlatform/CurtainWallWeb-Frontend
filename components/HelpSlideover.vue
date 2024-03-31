<script setup lang="ts">
const { isHelpSlideoverOpen } = useDashboard()
const { metaSymbol } = useShortcuts()

const shortcuts = ref(false)
const query = ref('')

const links = [{
  label: '快捷键',
  icon: 'i-heroicons-key',
  trailingIcon: 'i-heroicons-arrow-right-20-solid',
  color: 'gray',
  onClick: () => {
    shortcuts.value = true
  }
}, {
  label: '文档',
  icon: 'i-heroicons-book-open',
  to: 'https://ui.nuxt.com/pro/getting-started',
  target: '_blank'
}, {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  to: 'https://github.com/CurtainWallMonitoringPlatform',
  target: '_blank'
}]

const categories = computed(() => [{
  title: '常规',
  items: [
    { shortcuts: [metaSymbol.value, 'K'], name: '命令菜单' },
    { shortcuts: ['N'], name: '通知' },
    { shortcuts: ['?'], name: '帮助与支持' },
    { shortcuts: ['/'], name: '搜索' }
  ]
}, {
  title: '导航',
  items: [
    { shortcuts: ['G', 'H'], name: '首页' },
    { shortcuts: ['G', 'M'], name: '监测中心' },
    { shortcuts: ['G', 'E'], name: '设备中心' },
    { shortcuts: ['G', 'S'], name: '管理中心' }
  ]
}])

const filteredCategories = computed(() => {
  return categories.value.map(category => ({
    title: category.title,
    items: category.items.filter(item => {
      return item.name.search(new RegExp(query.value, 'i')) !== -1
    })
  })).filter(category => !!category.items.length)
})
</script>

<template>
  <UDashboardSlideover v-model="isHelpSlideoverOpen">
    <template #title>
      <UButton
        v-if="shortcuts"
        color="gray"
        variant="ghost"
        size="sm"
        icon="i-heroicons-arrow-left-20-solid"
        @click="shortcuts = false"
      />

      {{ shortcuts ? 'Shortcuts' : '帮助与支持' }}
    </template>

    <div v-if="shortcuts" class="space-y-6">
      <UInput v-model="query" icon="i-heroicons-magnifying-glass" placeholder="Search..." autofocus color="gray" />

      <div v-for="(category, index) in filteredCategories" :key="index">
        <p class="mb-3 text-sm text-gray-900 dark:text-white font-semibold">
          {{ category.title }}
        </p>

        <div class="space-y-2">
          <div v-for="(item, i) in category.items" :key="i" class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ item.name }}</span>

            <div class="flex items-center justify-end flex-shrink-0 gap-0.5">
              <UKbd v-for="(shortcut, j) in item.shortcuts" :key="j">
                {{ shortcut }}
              </UKbd>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col gap-y-3">
      <UButton v-for="(link, index) in links" :key="index" color="white" v-bind="link" />
    </div>
  </UDashboardSlideover>
</template>