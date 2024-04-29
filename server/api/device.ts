// ~/api/device.ts

import axios from 'axios';
import { AxiosResponse } from 'axios';

const BASE_URL = 'http://47.120.50.113:8090/api/device';

interface Device {
    deviceName: string;
    deviceId: string;
    offset: string;
    lowerOuliter: string;
    higherOutlier: string;
}

// 假设的设备列表响应类型
interface DeviceListResponse {
    data: {
        devices: Device[];
    };
}

// 假设的单个设备信息响应类型
interface DeviceInfoResponse {
    data: {
        devices: Device;
    };
}

export const GetDeviceList = async (): Promise<Device[]> => {
    const response: AxiosResponse<DeviceListResponse> = await axios.get(`${BASE_URL}/all`);
    if (response.data && response.data.data && response.data.data.devices) {
        return response.data.data.devices;
    }
    throw new Error('Invalid API response structure for device list');
};

export const GetDeviceInfo = async (deviceId: string): Promise<Device> => {
    const response = await axios.get(`${BASE_URL}/get/${deviceId}`);
    // 检查响应中的数据结构并提取设备信息
    if (response.data && response.data.data && Array.isArray(response.data.data.devices)) {
        const deviceInfo = response.data.data.devices[0]; // 获取数组中的第一个元素
        if (deviceInfo) {
            return deviceInfo;
        }
    }
    throw new Error('Invalid API response structure for device info');
};
