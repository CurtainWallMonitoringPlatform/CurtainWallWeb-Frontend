<script setup lang="ts">
const links = [[{
        id: 'reatime',
        label: '实时监测',
        icon: 'i-heroicons-chart-bar',
        to: '/monitor',
        exact: true
    }, {
        id: 'historical',
        label: '历史趋势',
        icon: 'i-heroicons-arrow-trending-up',
        to: '/monitor/historical'
    },{
        id: 'abnormal',
        label: '异常数据',
        icon: 'i-heroicons-exclaimation-triangle',
        to: '/monitor/abnormal'
    }]]
</script>


<template>
  <UDashboardPage>
      <UDashboardPanel grow>
          <UDashboardNavbar title="监测中心">
          </UDashboardNavbar>

          <UDashboardToolbar class="overflow-x-auto">
              <UHorizontalNavigation :links="links" />
          </UDashboardToolbar>

          <NuxtPage />
      </UDashboardPanel>
  </UDashboardPage>
</template>