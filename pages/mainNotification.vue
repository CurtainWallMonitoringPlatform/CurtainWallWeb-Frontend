<script setup lang="ts">
const state = reactive<{ [key: string]: boolean }>({
  email: true,
  text_message: false,
})

const sections = [{
  title: '通知渠道',
  description: '我们可以通过何种渠道给予您异常数据的通知？',
  fields: [{
    name: 'email',
    label: '电子邮件',
    description: '接收异常数据的电子邮件预警。'
  }, {
    name: 'text_message',
    label: '短信',
    description: '接收异常数据的短信预警。'
  }]
}]

async function onChange () {
  // Do something with data
  console.log(state)
}
</script>

<template>
  <UDashboardPanelContent class="p-0 pb-24 divide-y divide-gray-200 dark:divide-gray-800">
    <UDashboardSection
      v-for="(section, index) in sections"
      :key="index"
      :title="section.title"
      :description="section.description"
      orientation="horizontal"
      class="px-4 py-6"
    >
      <UCard :ui="{ body: { base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col' } }">
        <UFormGroup
          v-for="field in section.fields"
          :key="field.name"
          :name="field.name"
          :label="field.label"
          :description="field.description"
          class="flex items-center justify-between pt-4 first:pt-0 gap-2"
          :ui="{ container: 'flex' }"
        >
          <UToggle v-model="state[field.name]" size="md" @update:model-value="onChange" />
        </UFormGroup>
      </UCard>
    </UDashboardSection>
  </udashboardpanelcontent>
</template>