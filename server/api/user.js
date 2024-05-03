// 管理用户数据
import Request from "@/server/request.ts"; 
import Message from "@/server/Message.js"  // 在每个 api 文件里都要引入这两个文件

const userService = {
    async login(email, password) {
        try {
            const response = await Request.post('/account/login', { "username": email, "password": password });
            if (response.status === 200) {
                // 存储Token和email到localStorage
                localStorage.setItem('authToken', response.data.token);
                console.log(localStorage.getItem('authToken'));
                localStorage.setItem('email', email);
                // userInfo.value = response.data;
                return response.data.authentication;
            } else {
                console.error(response);
            }
        } catch (error) {
            Message.error(error.message)
        }
    },

    async sendVerificationCode (email) {
        try {
            const response = await Request.post('/api/account/sendCode', { "email": email });
            if (response.status === 200) {
                Message.success(response.data.message);
                return true;
            } else {
                console.error(response);
                return false;
            }
        } catch (error) {
            Message.error(error.message);
            return false;
        }
    },

    async register (email, code, password) {
        try {
            const response = await Request.post('/api/account/validate', { "email": email, "code": code, "password": password });
            if (response.status === 200) {
                Message.success(response.data.message);
                return true;
            } else {
                console.error(response);
                return false;
            }
        } catch (error) {
            Message.error(error.message);
            return false;
        }
    },

    async getCurrentInfo (user) {
        try {
            const headers = { 'Authorization': `Token ${user}` };
            const response = await Request.get('/get-info', { headers });
            if (response.status === 200) {
                // Message.success(response.data.message);
                return response.data.data;
            } else {
                console.error(response);
                return response.data;
            }
        } catch (error) {
            Message.error(error.message);
            return response.data;
        }
    },
}

export default userService;
    // 退出时清除用户信息
//     const clearUserInfo = () => {
//         userInfo.value = {};
//         store.dispatch('doLogout');
//     };

//     return {
//         userInfo,
//         sendVerificationCode,
//         login,
//         register,
//         clearUserInfo,
//         getCurrentInfo
//     };
// }, {
//     persist: true,
// });
