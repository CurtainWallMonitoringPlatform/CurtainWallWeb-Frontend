<script setup lang="ts">
const links = [[{
  id: 'deviceList',
  label: '设备列表',
  icon: 'i-heroicons-queue-list',
  to: '/equipments',
  exact: true
}, {
  id: 'deviceAdd',
  label: '新增设备',
  icon: 'i-heroicons-plus-circle',
  to: '/equipments/add'
}]]
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="设备中心">
      </UDashboardNavbar>

      <UDashboardToolbar class="overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>
      
      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>