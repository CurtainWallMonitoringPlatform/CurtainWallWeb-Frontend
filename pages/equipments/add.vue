<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const deviceInfo = reactive({
  deviceId: '',
  deviceName: '',
  offset: '',
  lowerOuliter: '',
  higherOutlier: '',
})

const toast = useToast()

function validate (deviceInfo: any): FormError[] {
  const errors = []
  if (!deviceInfo.deviceId) errors.push({ path: 'deviceId', message: '请输入设备ID! ' })
  if (!deviceInfo.deviceName) errors.push({ path: 'deviceName', message: '请输入设备名称！' })
  if (!deviceInfo.offset) errors.push({ path: 'offset', message: '请输入设备偏移量! ' })
  if (!deviceInfo.lowerOuliter) errors.push({ path: 'lowerOuliter', message: '请输入设备阈值下限！' })
  if (!deviceInfo.higherOutlier) errors.push({ path: 'higherOutlier', message: '请输入设备阈值上限！' })
  return errors
}

async function onSubmit (event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data)

  toast.add({ title: 'Device Added', icon: 'i-heroicons-check-circle' })
}
</script>

<template>
  <UDashboardPanelContent class="pb-24">
    <UForm :state="deviceInfo" :validate="validate" :validate-on="['submit']" @submit="onSubmit">
      <UDashboardSection title="设备信息" description="请填写新增设备的基本信息。">
        <template #links>
          <UButton type="submit" label="提交" class="bg-sky-500 hover:bg-sky-700" />
        </template>

        <UFormGroup
          name="deviceId"
          label="设备ID"
          description="用于标识和区分设备"
          required
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput v-model="deviceInfo.deviceId" type="deviceId" autocomplete="off" icon="i-heroicons-identification" size="md" />
        </UFormGroup>

        <UFormGroup
          name="deviceName"
          label="设备名称"
          description="标识设备特性"
          required
          class="grid grid-cols-2 gap-2 items-center"
          :ui="{ container: '' }"
        >
          <UInput v-model="deviceInfo.deviceName" type="deviceName" autocomplete="off" icon="i-heroicons-user" size="md" />
        </UFormGroup>

        <UFormGroup
          name="offset"
          label="设备偏移量"
          description="简介"
          required
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput v-model="deviceInfo.offset" type="offset" autocomplete="off" icon="i-heroicons-arrow-trending-down" size="md" />
        </UFormGroup>

        <UFormGroup
          name="lowerOuliter"
          label="设备阈值下限"
          description="简介"
          required
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput v-model="deviceInfo.lowerOuliter" type="lowerOuliter" autocomplete="off" icon="i-heroicons-arrow-down" size="md">
          </UInput>
        </UFormGroup>

        <UFormGroup
          name="higherOutlier"
          label="设备阈值上限"
          description="简介"
          required
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput v-model="deviceInfo.higherOutlier" type="higherOutlier" autocomplete="off" icon="i-heroicons-arrow-up" size="md">
          </UInput>
        </UFormGroup>
      </UDashboardSection>
    </UForm>

    <UDivider class="mb-4" />

  </UDashboardPanelContent>
</template>