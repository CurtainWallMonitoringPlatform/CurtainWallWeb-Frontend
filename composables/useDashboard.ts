import { createSharedComposable } from '@vueuse/core'

const _useDashboard = () => {
  const route = useRoute()
  const router = useRouter()
  const isHelpSlideoverOpen = ref(false)
  const isDeviceSlideoverOpen = ref(false)
  const isNotificationsSlideoverOpen = ref(false)

  defineShortcuts({
    'g-h': () => router.push('/'),
    'g-m': () => router.push('/monitor'),
    'g-e': () => router.push('/equipments'),
    'g-s': () => router.push('/settings'),
    'g-w': () => router.push('/alarm'),
    '?': () => isHelpSlideoverOpen.value = true,
    n: () => isNotificationsSlideoverOpen.value = true
  })

  watch(() => route.fullPath, () => {
    isHelpSlideoverOpen.value = false
    isDeviceSlideoverOpen.value = false
    isNotificationsSlideoverOpen.value = false
  })

  return {
    isHelpSlideoverOpen,
    isDeviceSlideoverOpen,
    isNotificationsSlideoverOpen
  }
}

export const useDashboard = createSharedComposable(_useDashboard)