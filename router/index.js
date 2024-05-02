import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        // {
        //     path: '/',
        //     // redirect: '/layout/index.vue'  // 重定向
        //     redirect: '/login'
        // },
        // {
        //     path: '/login',
        //     name: 'login',  // 登录界面
        //     component: () => import('@/views/login/index.vue'),
        // },
        // {
        //     path: '/layout/:choice',//choice为右侧功能区显示的内容（如dashboard、segmentation）
        //     name: 'layout',  // 布局界面（包括菜单栏与功能区）
        //     component: () => import('@/views/layout/index.vue'),
        // },
    ]
})

export default router
