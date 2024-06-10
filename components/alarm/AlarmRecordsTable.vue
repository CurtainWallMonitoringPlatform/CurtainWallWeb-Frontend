<template>
  <UTable
    :rows="records"
    :columns="columns"
    class="w-full"
    :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
  >
    <template #level-data="{ row, column }">
      <UBadge
        v-if="column.key === 'level'"
        :label="row.level"
        :color="row.level === '低风险' ? 'green' : row.level === '中风险' ? 'orange' : row.level === '高风险' ? 'red' : 'sky'"
        variant="subtle"
        class="capitalize"
      />
    </template>

    <template #emails-data="{ row }">
      <div class="whitespace-pre-line">{{ row.emails }}</div>
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
    label: 'ID',
    }, 
    {
    key: 'pushTime',
    label: '报警时间'
    },
    {
    key: 'level',
    label: '等级',
    },
    {
    key: 'deviceName',
    label: '设备名称',
    }, {
    key: 'deviceId',
    label: '设备编号',
    }, {
    key: 'lowerOutlier',
    label: '阈值下限'
    }, 
    {
    key: 'upperOutlier',
    label: '阈值上限'
    }, 
    {
    key: 'offset',
    label: '偏移量'
    }, 
    {
      key: 'emails',
      label: '接收邮箱',
    },
    ]

</script>

