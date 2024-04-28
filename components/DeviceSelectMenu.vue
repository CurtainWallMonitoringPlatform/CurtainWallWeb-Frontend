<!-- DeviceSelectMenu.vue -->
<template>
    <USelectMenu
        searchable
        v-model="selectedDevice"
        :options="devices"
        option-attribute="deviceId"
        placeholder="select device"
    >
        <template #label>
        <span
            :class="[
            selectedDevice.online ? 'bg-green-400' : 'bg-gray-200',
            'inline-block h-2 w-2 flex-shrink-0 rounded-full'
            ]"
            aria-hidden="true"
        />
        <span class="truncate">{{ selectedDevice.deviceName }}</span>
        </template>

        <template #option="{ option: device }">
        <span
            :class="[
            device.online ? 'bg-green-400' : 'bg-gray-200',
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

    const devices = ref([
        {
            deviceName: 'A楼01',
            deviceId: 'A77C5238',
            online: true,
        },
        {
            deviceName: 'A楼02',
            deviceId: 'F853ED49',
            online: true,
        },
        {
            deviceName: 'A楼03',
            deviceId: '9A0D1958',
            online: true,
        },
        {
            deviceName: 'A楼04',
            deviceId: '87C3D4E4',
            online: true,
        },
        {
            deviceName: 'A楼05',
            deviceId: '29FA1867',
            online: true,
        },
        {
            deviceName: 'A楼06',
            deviceId: 'E43AC643',
            online: true,
        },
    ])

    //选中的设备
    const selectedDevice = ref({
        deviceName: 'A楼01',
        deviceId: 'A77C5238',
        online: true,
    });

    watch(selectedDevice, (newValue) => {
        emit('selectDevice', newValue);
    });

</script>