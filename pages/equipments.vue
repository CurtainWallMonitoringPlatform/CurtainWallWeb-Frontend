<script setup lang="ts">
import DeviceList from '~/components/DeviceList.vue';


</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="设备中心">
      </UDashboardNavbar>
      
      <DeviceList />
    </UDashboardPanel>
  </UDashboardPage>
</template>