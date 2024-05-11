import axios from 'axios';
import { defineEventHandler } from 'h3';

const BASE_URL = 'http://47.120.50.113:8090/api/device';

export default defineEventHandler(async (event) => {
    try {
        // 从URL中提取deviceId参数
        // const deviceId = event.context.params.deviceId;
        const deviceId = getRouterParam(event, 'deviceId')

        // 发起请求到原始设备API
        const response = await axios.delete(`${BASE_URL}/delete/${deviceId}`);

        // 返回成功消息
        return { success: true };
    } catch (error: any) {
        // 设置状态码并返回错误信息
        event.res.statusCode = error.response?.status || 500;
        return { error: error.message };
    }
});