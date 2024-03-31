<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
    <UModals />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'light' ? 'light' : '#111827')

useHead({
  title: 'Curtain Wall Monitor Platform',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color},
    { hid: 'author', name: 'author', content: 'Curtain Wall'},
    { hid: 'description', name: 'description', content: 'Curtain Wall' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'zh-CN',
  }
})

const title = 'Curtain Wall Monitor Platform'
const description = 'Curtain Wall Monitor Platform'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  twitterImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  twitterCard: 'summary_large_image'
})

</script>