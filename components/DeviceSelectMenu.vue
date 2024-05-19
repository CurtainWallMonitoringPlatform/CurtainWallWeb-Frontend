<!-- DeviceSelectMenu.vue -->
<template>
    <USelectMenu
        v-model="selectedDevice"
        :options="deviceList"
        option-attribute="deviceId"
        placeholder="选择设备"
        icon="i-heroicons-presentation-chart-line-20-solid"
    >
        <template #label v-if="selectedDevice.deviceName!=''">
        <span
            :class="[
            true ? 'bg-green-400' : 'bg-gray-200',
            'inline-block h-2 w-2 flex-shrink-0 rounded-full'
            ]"
            aria-hidden="true"
        />
        <span class="truncate">{{ selectedDevice.deviceName }}</span>
        </template>

        <template #option="{ option: device }">
        <span
            :class="[
            true ? 'bg-green-400' : 'bg-gray-200',
            'inline-block h-2 w-2 flex-shrink-0 rounded-full'
            ]"
            aria-hidden="true"
        />
        <span class="truncate">{{ device.deviceName }}</span>
        </template>
    </USelectMenu>
  </template>
  
<script setup lang="ts">
    import { defineEmits } from 'vue'

    const emit = defineEmits(['selectDevice']);

    interface Device {
        deviceName: string;
        deviceId: string;
        offset: number | string; // 这里我假设 offset 是一个数字，如果是字符串请保留您原来的类型
        lowerOuliter: number | string;
        higherOuliter: number | string;
    }

    // 使用初始空数组并指定类型
    let deviceList = ref<Device[]>([]);

    //选中的设备
    const selectedDevice = ref({
        deviceName: '',
        deviceId: '',
        online: true,
    });

    useFetch('/api/device/all', {
        key: 'device-list', // 用于缓存和重新获取数据的键
        immediate: true, // 立即执行数据获取
    }).then((response) => {
        deviceList.value = response.data.value as Device[]
    })

    watch(selectedDevice, (newValue) => {
        emit('selectDevice', newValue)
    })

</script>