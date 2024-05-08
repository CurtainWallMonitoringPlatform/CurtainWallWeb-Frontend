<!-- DeviceSelectMenu.vue -->
<template>
    <USelectMenu
        searchable
        v-model="selectedDevice"
        :options="deviceList"
        option-attribute="deviceId"
        placeholder="select device"
    >
        <template #label>
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
    import { onMounted, defineEmits } from 'vue'

    onMounted(()=>{
        //后端调用获取devices
    })
  
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

    const fetchDeviceList = async () => {
    try {
        const response = await useFetch('/api/device/all');
        deviceList.value = response.data.value as unknown as Device[];
        console.log(deviceList.value);
    } catch (error) {
        console.error('Error getting device list:', error);
    }
    };

    //选中的设备
    const selectedDevice = ref({
        deviceName: 'A楼01',
        deviceId: 'A77C5238',
        online: true,
    });

    onMounted(() =>{
        fetchDeviceList();
    })



    watch(selectedDevice, (newValue) => {
        emit('selectDevice', newValue);
    });

</script>