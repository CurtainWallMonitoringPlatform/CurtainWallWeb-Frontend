<script setup lang="ts">
import { ref } from 'vue';
// import { GetDeviceInfo } from '~/server/api/device';
const { isDeviceSlideoverOpen } = useDashboard()

interface Device {
    deviceName: string;
    deviceId: string;
    offset: number | string; // 这里我假设 offset 是一个数字，如果是字符串请保留您原来的类型
    lowerOuliter: number | string; // 同上，根据实际情况修改类型
    higherOutlier: number | string; // 同上
}

// 使用初始空数组并指定类型
let deviceList = ref<Device[]>([]);
let selectedDevice: Device = ({
  deviceName: '',
  deviceId: '',
  offset: '',
  lowerOuliter: '',
  higherOutlier: ''
});

const fetchDeviceList = async () => {
  try {
    const response = await useFetch('/api/device/all');
    deviceList.value = response.data.value as unknown as Device[];
    console.log(deviceList.value);
  } catch (error) {
    console.error('Error getting device list:', error);
  }
};

const fetchDeviceInfo = async (deviceId: string) => {
  try {
    const { data: deviceInfo } = await useFetch(`/api/device/get/${deviceId}`)
    // const deviceInfo = await GetDeviceInfo(deviceId);
    selectedDevice = deviceInfo.value;

    console.log(selectedDevice);
    isDeviceSlideoverOpen.value = true;
  } catch (error) {
    console.error('Error getting device info:', error);
  }
};

// 使用新的 API 函数
const openSlideover = (device: Device) => {
  selectedDevice.deviceId = device.deviceId;
  fetchDeviceInfo(device.deviceId); // 调用 fetchDeviceInfo 替代原来的 getDeviceInfo
};

// 在组件挂载时获取设备列表
onMounted(() => {
  fetchDeviceList();
});

</script>

<template>
  <div class="overflow-y-auto">
    <div v-if="deviceList.length > 0" class="flex flex-col space-y-4 my-6 mx-20">
      <div v-for="device in deviceList" :key="device.deviceId" class="m-4">
        <UDashboardCard :title="device.deviceName" :description="`设备ID: ${device.deviceId}`"
          icon="i-heroicons-circle-stack" 
          :links="[{
            label: '查看详情',
            color: 'sky',
            trailingIcon: 'i-heroicons-arrow-right-20-solid',
            click: () => openSlideover(device)
          }]">
          <p>设备偏移量：{{ device.offset }}</p>
          <p>设备阈值上限：{{ device.higherOutlier }}</p>
          <p>设备阈值下限：{{ device.lowerOuliter }}</p>
        </UDashboardCard>
      </div>
    </div>
    <div v-else>
      No devices found.
    </div>

    <UDashboardSlideover v-model="isDeviceSlideoverOpen" title="设备信息">
      <template v-if="selectedDevice.deviceId">
        <p>设备ID：{{ selectedDevice.deviceId }}</p>
        <p>设备名称：{{ selectedDevice.deviceName }}</p>
        <p>设备偏移量：{{ selectedDevice.offset }}</p>
        <p>设备阈值上限：{{ selectedDevice.higherOutlier }}</p>
        <p>设备阈值下限：{{ selectedDevice.lowerOuliter }}</p>
      </template>
      <UButton
        class="my-4"
        icon="i-heroicons-pencil-square"
        size="sm"
        color="sky"
        variant="solid"
        label="修改信息"
        :trailing="false"

      />
    </UDashboardSlideover>
  </div>
</template>
