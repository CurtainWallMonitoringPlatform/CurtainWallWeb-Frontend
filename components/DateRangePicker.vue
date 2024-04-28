<script setup lang="ts">
import { sub, format, isSameDay, type Duration, formatDuration } from 'date-fns'
import { defineEmits } from 'vue'

const emit = defineEmits(['selectRange'])//触发的方法名

const ranges = [
  { label: '昨天', duration: { days: 1 } },
  { label: '过去7天', duration: { days: 7 } },
  { label: '过去30天', duration: { days: 30 } },
  { label: '过去3个月', duration: { months: 3 } },
  { label: '去年', duration: { years: 1 } }
]
const selected = ref({ start: sub(new Date(), { days: 7 }), end: new Date() })

function isRangeSelected (duration: Duration) {
  return isSameDay(selected.value.start, sub(new Date(), duration)) && isSameDay(selected.value.end, new Date())
}

function selectRange (duration: Duration) {
    selected.value = { start: sub(new Date(), duration), end: new Date() }
    // 设置为指定日期的时间
    selected.value.start.setHours(0, 0, 0, 0);
    selected.value.end.setHours(0, 0, 0, 0);

    // 获取时间戳
    const start_time = selected.value.start.getTime();
    const end_time = selected.value.end.getTime();

    // 传递值给父组件
    emit('selectRange', { start_time: start_time, end_time: end_time });
}
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <UButton color="white" icon="i-heroicons-calendar-days-20-solid">
      {{ format(selected.start, 'd MMM, yyy') }} - {{ format(selected.end, 'd MMM, yyy') }}
    </UButton>
    <!-- <template #default="{ open }">
      <UButton color="gray" 
              variant="ghost" 
              :class="[open && 'bg-gray-50 dark:bg-gray-800']" 
              trailing-icon="i-heroicons-chevron-down-20-solid">
        {{ format(selected.start, 'd MMM, yyy') }} - {{ format(selected.end, 'd MMM, yyy') }}
      </UButton>
    </template> -->

    <template #panel="{ close }">
      <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
        <div class="hidden sm:flex flex-col py-4">
          <UButton
            v-for="(range, index) in ranges"
            :key="index"
            :label="range.label"
            color="gray"
            variant="ghost"
            class="rounded-none px-6"
            :class="[isRangeSelected(range.duration) ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50']"
            truncate
            @click="selectRange(range.duration)"
          />
        </div>
        <!-- <DatePicker v-model="selected" @close="close" /> -->
      </div>
    </template>
  </UPopover>
</template>





