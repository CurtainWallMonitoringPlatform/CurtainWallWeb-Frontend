import axios from 'axios';
import { defineEventHandler } from 'h3';

const BASE_URL = 'http://111.231.168.12:8180/api/device';

interface Device {
    deviceName: string;
    lowerOuliter: string;
    higherOuliter: string;
    offset: string;
    deviceId: string;
}

// 假设的设备列表响应类型
interface DeviceListResponse {
    data: {
        devices: Device[];
    };
}

export default defineEventHandler(async (event) => {
    try {
        const response = await axios.get<DeviceListResponse>(`${BASE_URL}/all`);
        if (response.data && response.data.data && response.data.data.devices) {
            console.log('response.data.data.devices', response.data.data.devices);
            console.log('response', response);
            // console.log('response.data.devices', response.data.devices);
            return response.data;
        } else {
            throw new Error('Invalid API response structure for device list');
        }
    } catch (error: any) {
        // 这里可以记录错误或者抛出具体的HTTP错误
        event.res.statusCode = 500; // 设置HTTP状态码
        return { error: error.message };
    }
});