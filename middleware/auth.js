export default defineNuxtRouteMiddleware(() => {
    // 确保代码只在客户端执行
    if (process.client) {
        const isLoggedIn = localStorage.getItem('authToken');
        if (!isLoggedIn) {
            return navigateTo('/login');
        }
    }

});