import Request from "~/api/request"

//获取历史数据
export function GetHistoricalData(data: any) {
    return Request({  // 发送请求
        method: 'GET',
        url: '/api/monitor/historical-data/',
        params: { 
            deviceId: data.deviceId,
            startTime: data.startTime,
            endTime: data.endTime,
        }
    }).then(function (response) {
        return response.data;
    }).catch(function (error) {  // catch 表示接收到错误响应后的操作
        console.log(error);
    }).finally(function(){});
};


//获取异常数据
export function GetAbnormalData(data: any) {
    return Request({  // 发送请求
        method: 'GET',
        url: '/api/monitor/abnormal-data/',
        params: { 
            deviceId: data.deviceId,
            startTime: data.startTime,
            endTime: data.endTime,
        }
    }).then(function (response) {
        return response.data;
    }).catch(function (error) {  // catch 表示接收到错误响应后的操作
        console.log(error);
    }).finally(function(){});
};

export function GetDeviceList() {
    return Request({  // 发送请求
        method: 'GET',
        url: '/api/device/all',
    }).then(function (response) {
        console.log(response)
        return response.data;
    }).catch(function (error) {  // catch 表示接收到错误响应后的操作
        console.log(error);
    }).finally(function(){});
};