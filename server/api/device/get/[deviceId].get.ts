import axios from 'axios';
import { defineEventHandler } from 'h3';

const BASE_URL = 'http://111.231.168.12:8180/api/device';

export default defineEventHandler(async (event) => {
    try {
        // 从URL中提取deviceId参数
        // const deviceId = event.context.params.deviceId;
        const deviceId = getRouterParam(event, 'deviceId')

        // 发起请求到原始设备API
        const response = await axios.get(`${BASE_URL}/get/${deviceId}`);

        // 检查响应中的数据结构
        if (response.data && response.data.data && Array.isArray(response.data.data.devices)) {
            const deviceInfo = response.data.data.devices[0]; // 假设每个 deviceId 响应中只有一个设备信息
            if (deviceInfo) {
                return deviceInfo; // 直接返回设备信息
            }
        }
        // 如果结构不正确或没有设备信息，抛出错误
        throw new Error('Invalid API response structure for device info');
    } catch (error: any) {
        // 设置状态码并返回错误信息
        event.res.statusCode = error.response?.status || 500;
        return { error: error.message };
    }
});