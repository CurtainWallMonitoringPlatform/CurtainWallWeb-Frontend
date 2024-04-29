<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()
const { isHelpSlideoverOpen } = useDashboard()

const links = [{
  id: 'home',
  label: '首页',
  icon: 'i-heroicons-home',
  to: '/',
  tooltip: {
    text: '首页',
    shortcuts: ['G', 'H']
  }
}, {
  id: 'monitor',
  label: '监测中心',
  icon: 'i-heroicons-chart-bar-square',
  to: '/monitor',
  children: [{
    label: '实时监测',
    to: '/monitor',
    exact: true
  }, {
    label: '历史趋势',
    to: '/monitor/historical'
  },{
    label: '异常数据',
    to: '/monitor/abnormal'
  }],
  tooltip: {
    text: '监测中心',
    shortcuts: ['G', 'M']
  }
}, {
  id: 'equipments',
  label: '设备中心',
  icon: 'i-heroicons-cpu-chip',
  to: '/equipments',
  tooltip: {
    text: '设备中心',
    shortcuts: ['G', 'E']
  }
}, {
  id: 'settings',
  label: '设置',
  to: '/settings',
  icon: 'i-heroicons-cog-8-tooth',
  children: [{
    label: '常规',
    to: '/settings',
    exact: true
  }, {
    label: '通知',
    to: '/settings/notifications'
  }],
  tooltip: {
    text: 'Settings',
    shortcuts: ['G', 'S']
  }
}]

const footerLinks = [ {
  label: '帮助与支持',
  icon: 'i-heroicons-question-mark-circle',
  click: () => isHelpSlideoverOpen.value = true
}]

const groups = [{
  key: 'links',
  label: 'Go to',
  commands: links.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts }))
}, {
  key: 'code',
  label: 'Code',
  commands: [{
    id: 'source',
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    click: () => {
      window.open(`https://github.com/CurtainWallMonitoringPlatform`, '_blank')
    }
  }]
}]

const defaultColors = ref(['green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet'].map(color => ({ label: color, chip: color, click: () => appConfig.ui.primary = color })))
const colors = computed(() => defaultColors.value.map(color => ({ ...color, active: appConfig.ui.primary === color.label })))
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
    <NotificationsSlideover />

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>
</template>