<script setup lang="ts">
import { ref } from 'vue';
import type { FormError, FormSubmitEvent } from '#ui/types'
// import { GetDeviceInfo } from '~/server/api/device';
const { isDeviceSlideoverOpen } = useDashboard()

interface Device {
  deviceName: string;
  deviceId: string;
  offset: number | string; // 这里我假设 offset 是一个数字，如果是字符串请保留您原来的类型
  lowerOuliter: number | string;
  higherOuliter: number | string;
}

// 使用初始空数组并指定类型
let deviceList = ref<Device[]>([]);
let selectedDevice: Device = ({
  deviceName: '',
  deviceId: '',
  offset: '',
  lowerOuliter: '',
  higherOuliter: ''
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

const deleteConfirm = async (deviceId: string) => {
  const confirm = window.confirm('Are you sure you want to delete this device?');
  if (confirm) {
    deleteDevice(deviceId);
  }
};

const deleteDevice = async (deviceId: string) => {
  try {
    await useFetch(`/api/device/delete/${deviceId}`, { method: 'DELETE' });
    // await DeleteDevice(deviceId);
    fetchDeviceList();
    isDeviceSlideoverOpen.value = false;
  } catch (error) {
    console.error('Error deleting device:', error);
  }
};

const editDeviceInfo = async (deviceInfo: Device) => {
  try {
    await useFetch(`/api/device/modify/${deviceInfo.deviceId}`, {
      method: 'PUT',
      body: deviceInfo,
    });
    // await UpdateDeviceInfo(deviceInfo);
    fetchDeviceList();
    isDeviceSlideoverOpen.value = false;
  } catch (error) {
    console.error('Error updating device info:', error);
  }
};

function validate(deviceInfo: any): FormError[] {
  const errors = []
  if (!deviceInfo.deviceId) errors.push({ path: 'deviceId', message: '请输入设备ID! ' })
  if (!deviceInfo.deviceName) errors.push({ path: 'deviceName', message: '请输入设备名称！' })
  if (!deviceInfo.offset) errors.push({ path: 'offset', message: '请输入设备偏移量! ' })
  if (!deviceInfo.lowerOuliter) errors.push({ path: 'lowerOuliter', message: '请输入设备阈值下限！' })
  if (!deviceInfo.higherOuliter) errors.push({ path: 'higherOuliter', message: '请输入设备阈值上限！' })
  return errors
}

// 使用新的 API 函数
const openSlideover = (device: Device) => {
  selectedDevice.deviceId = device.deviceId;
  fetchDeviceInfo(device.deviceId);
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
          icon="i-heroicons-circle-stack" :links="[{
            label: '查看详情',
            color: 'sky',
            trailingIcon: 'i-heroicons-arrow-right-20-solid',
            click: () => openSlideover(device)
          }]">
          <p>设备偏移量：{{ device.offset }}</p>
          <p>设备阈值上限：{{ device.higherOuliter }}</p>
          <p>设备阈值下限：{{ device.lowerOuliter }}</p>
        </UDashboardCard>
      </div>
    </div>
    <div v-else>
      No devices found.
    </div>

    <UDashboardSlideover v-model="isDeviceSlideoverOpen" title="设备信息">
      <template v-if="selectedDevice.deviceId">
        <UForm :state="selectedDevice" :validate="validate" :validate-on="['submit']" @submit="editDeviceInfo">

          <UFormGroup name="deviceId" label="设备ID" required class="grid grid-cols-2 gap-2 my-2"
            :ui="{ container: '' }">
            <UInput v-model="selectedDevice.deviceId" type="deviceId" autocomplete="off"
              icon="i-heroicons-identification" size="md" readonly/>
          </UFormGroup>

          <UFormGroup name="deviceName" label="设备名称" required class="grid grid-cols-2 gap-2 my-2"
            :ui="{ container: '' }">
            <UInput v-model="selectedDevice.deviceName" type="deviceName" autocomplete="off" icon="i-heroicons-user"
              size="md" />
          </UFormGroup>

          <UFormGroup name="offset" label="设备偏移量" required class="grid grid-cols-2 gap-2 my-2"
            :ui="{ container: '' }">
            <UInput v-model="selectedDevice.offset" type="offset" autocomplete="off"
              icon="i-heroicons-arrow-trending-down" size="md" />
          </UFormGroup>

          <UFormGroup name="lowerOuliter" label="设备阈值下限" required class="grid grid-cols-2 gap-2 my-2"
            :ui="{ container: '' }">
            <UInput v-model="selectedDevice.lowerOuliter" type="lowerOuliter" autocomplete="off"
              icon="i-heroicons-arrow-down" size="md">
            </UInput>
          </UFormGroup>

          <UFormGroup name="higherOuliter" label="设备阈值上限" required class="grid grid-cols-2 gap-2 my-2"
            :ui="{ container: '' }">
            <UInput v-model="selectedDevice.higherOuliter" type="higherOuliter" autocomplete="off"
              icon="i-heroicons-arrow-up" size="md">
            </UInput>
          </UFormGroup>

          <UButton 
            class="my-4 mr-4"
            icon="i-heroicons-pencil-square"
            size="sm"
            color="sky"
            variant="solid"
            label="保存修改"
            :trailing="false" 
            type="submit"
            @click="() => editDeviceInfo(selectedDevice)"
          />

          <UButton
            class="my-4"
            icon="i-heroicons-trash"
            size="sm"
            color="red"
            variant="solid"
            label="删除设备"
            :trailing="false"
            @click="() => deleteConfirm(selectedDevice.deviceId)" 
          />
        </UForm>
      </template>
    </UDashboardSlideover>
  </div>
</template>
