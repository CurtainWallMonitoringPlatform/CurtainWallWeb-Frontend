<script setup lang="ts">
const links = [[{
        id: 'general',
        label: '常规',
        icon: 'i-heroicons-cog-8-tooth',
        to: '/settings',
        exact: true
    }, {
        id: 'notifications',
        label: '通知',
        icon: 'i-heroicons-bell',
        to: '/settings/notifications'
    }]]
</script>

<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar title="设置">
            </UDashboardNavbar>

            <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
                <UHorizontalNavigation :links="links" />
            </UDashboardToolbar>

            <NuxtPage />
        </UDashboardPanel>
    </UDashboardPage>
</template>