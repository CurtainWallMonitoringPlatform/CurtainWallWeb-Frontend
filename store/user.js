// 管理用户数据

import { defineStore } from "pinia"
import { ref } from "vue"

// 登录功能
import request from '@/server/segment/Request';

export const loginAPI = ({ email, password }) => {
    return request.post('/account/login', {
        email,
        password
    });
}

// 注册功能
export const registerAPI = (email) => {
    return request.post('/register', {"email":email});
}

import { useRouter } from 'vue-router';

export const useUserStore = defineStore('user', () => {
    const router = useRouter();  // 获取 Vue Router 实例
    const userInfo = ref({});

    // 获取用户信息并存储
    const login = async (email, password) => {
        try {
            const response = await loginAPI({ email, password });
            console.log(response)
            if (response.status===200) {
                // 如果登录成功，存储用户信息
                userInfo.value = response.data;

                // 跳转到指定页面
                router.push({
                    name: 'layout',
                    params: {
                        choice: 'dashboard'
                    }
                });
            } else {
                // 如果登录失败，处理错误信息
                console.error(response.message);
                // 这里你可以选择展示错误信息给用户，例如使用弹窗、Toast 等
            }
        } catch (error) {
            console.error(error);
            // 处理其他错误，例如网络请求失败等
        }
    };

    const sendVerificationCode = async (email) => {
        try {
            const response = await registerAPI( email );
            console.log(response)
            if (response.status===200) {
                // 如果登录成功，存储用户信息
                userInfo.value = response.data;

                // 跳转到指定页面
                router.push({
                    name: 'layout',
                    params: {
                        choice: 'dashboard'
                    }
                });
            } else {
                // 如果登录失败，处理错误信息
                console.error(response.message);
                // 这里你可以选择展示错误信息给用户，例如使用弹窗、Toast 等
            }
        } catch (error) {
            console.error(error);
            // 处理其他错误，例如网络请求失败等
        }
    };

    // 退出时清除用户信息
    const clearUserInfo = () => {
        userInfo.value = {};
    };

    return {
        userInfo,
        sendVerificationCode,
        login,
        clearUserInfo
    };
}, {
    persist: true,
});