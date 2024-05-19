<template>
    <UTable
        :rows="records"
        :columns="columns"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      >

        <template #level-data="{ row }">
          <UBadge
            :label="row.level"
            :color="row.level === '低' ? 'green' : row.level === '中' ? 'orange' : 'red'"
            variant="subtle"
            class="capitalize"
          />
        </template>
    </UTable>

</template>


<script setup lang="ts">

    const props = defineProps({
      records: Array
    })

    const columns = [
    {
    key: 'recordId',
    label: '记录编号',
    }, 
    {
    key: 'pushTime',
    label: '报警时间'
    },
    {
    key: 'level',
    label: '报警等级',
    },
    {
    key: 'deviceName',
    label: '设备名称',
    }, {
    key: 'deviceId',
    label: '设备编号',
    }, {
    key: 'lowerOutlier',
    label: '设备阈值下限'
    }, 
    {
    key: 'upperOutlier',
    label: '设备阈值上限'
    }, 
    {
    key: 'offset',
    label: '设备偏移量'
    }, 
    ]


</script>