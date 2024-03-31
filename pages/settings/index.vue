<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const fileRef = ref<HTMLInputElement>()
const isDeleteAccountModalOpen = ref(false)

const state = reactive({
  name: 'Curtain Wall Admin',
  email: 'admin@tongji.edu.cn',
  username: 'Admin',
  avatar: '',
  bio: '',
  password_current: '',
  password_new: ''
})

const toast = useToast()

function validate (state: any): FormError[] {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: '请输入您的姓名！' })
  if (!state.email) errors.push({ path: 'email', message: '请输入您的电子邮件！' })
  if ((state.password_current && !state.password_new) || (!state.password_current && state.password_new)) errors.push({ path: 'password', message: 'Please enter a valid password.' })
  return errors
}

function onFileChange (e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) {
    return
  }

  state.avatar = URL.createObjectURL(input.files[0])
}

function onFileClick () {
  fileRef.value?.click()
}

async function onSubmit (event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data)

  toast.add({ title: 'Profile updated', icon: 'i-heroicons-check-circle' })
}
</script>

<template>
  <UDashboardPanelContent class="pb-24">
    <UDashboardSection title="主题" description="自定义仪表盘的外观。">
      <template #links>
        <UColorModeSelect color="gray" />
      </template>
    </UDashboardSection>

    <UDivider class="mb-4" />

    <UForm :state="state" :validate="validate" :validate-on="['submit']" @submit="onSubmit">
      <UDashboardSection title="个人信息" description="这些信息将被公开显示，因此请谨慎填写。">
        <template #links>
          <UButton type="submit" label="保存更改" color="black" />
        </template>

        <UFormGroup
          name="name"
          label="姓名"
          description="将用于实名制认证。"
          required
          class="grid grid-cols-2 gap-2 items-center"
          :ui="{ container: '' }"
        >
          <UInput v-model="state.name" autocomplete="off" icon="i-heroicons-user" size="md" />
        </UFormGroup>

        <UFormGroup
          name="email"
          label="电子邮箱"
          description="用于登录、接收电子邮件和信息更新。"
          required
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput v-model="state.email" type="email" autocomplete="off" icon="i-heroicons-envelope" size="md" />
        </UFormGroup>

        <UFormGroup
          name="username"
          label="用户名"
          description="您用于登录的唯一用户名。"
          required
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput v-model="state.username" type="username" autocomplete="off" icon="i-heroicons-user-circle" size="md">
          </UInput>
        </UFormGroup>

        <UFormGroup name="avatar" label="头像" class="grid grid-cols-2 gap-2" help="JPG、GIF 或 PNG。最大 1MB。" :ui="{ container: 'flex flex-wrap items-center gap-3', help: 'mt-0' }">
          <UAvatar :src="state.avatar" :alt="state.name" size="lg" />

          <UButton label="选择" color="white" size="md" @click="onFileClick" />

          <input ref="fileRef" type="file" class="hidden" accept=".jpg, .jpeg, .png, .gif" @change="onFileChange">
        </UFormGroup>

        <UFormGroup
          name="bio"
          label="个人简介"
          description="个人资料的简要说明。"
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '这个人很懒，什么也没有留下...' }"
        >
          <UTextarea v-model="state.bio" :rows="5" autoresize size="md" />
        </UFormGroup>

        <UFormGroup
          name="password"
          label="密码"
          description="在设置新密码之前，请先确认当前密码。"
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput id="password" v-model="state.password_current" type="password" placeholder="当前密码" size="md" />
          <UInput
            id="password_new"
            v-model="state.password_new"
            type="password"
            placeholder="新密码"
            size="md"
            class="mt-2"
          />
        </UFormGroup>
      </UDashboardSection>
    </UForm>

    <UDivider class="mb-4" />

    <UDashboardSection title="账户" description="不想再使用我们的服务？您可以在此删除您的账户。此操作不可逆转。与此账户相关的所有信息将被永久删除。">
      <div>
        <UButton color="red" label="删除帐户" size="md" @click="isDeleteAccountModalOpen = true" />
      </div>
    </UDashboardSection>

    <!-- ~/components/settings/DeleteAccountModal.vue -->
    <SettingsDeleteAccountModal v-model="isDeleteAccountModalOpen" />
  </UDashboardPanelContent>
</template>