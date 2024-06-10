<template>
    <UDashboardToolbar>
        <template #left>
            <USelectMenu searchable v-model="selectedDevice" :options="devices" option-attribute="deviceId"
                placeholder="select device">
                <template #label>
                    <span :class="[
                        selectedDevice.online ? 'bg-green-400' : 'bg-gray-200',
                        'inline-block h-2 w-2 flex-shrink-0 rounded-full'
                    ]" aria-hidden="true" />
                    <span class="truncate">{{ selectedDevice.deviceName }}</span>
                </template>

                <template #option="{ option: device }">
                    <span :class="[
                        device.online ? 'bg-green-400' : 'bg-gray-200',
                        'inline-block h-2 w-2 flex-shrink-0 rounded-full'
                    ]" aria-hidden="true" />
                    <span class="truncate">{{ device.deviceName }}</span>
                </template>
            </USelectMenu>
            <el-button type="primary" class="back-to-main-btn" @click="backToMain">返回主页</el-button>
        </template>
    </UDashboardToolbar>

    <UDashboardCard class="overflow-y-auto">
        <div id="main" style="height: 400px;" class="rounded-lg border border-gray-300"></div>
        <div id="main2" style="height: 400px;" class="rounded-lg border border-gray-300"></div>
    </UDashboardCard>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { useRouter } from "vue-router";

const router = useRouter();
const backToMain = () => {
  router.push("/");
};


const devices = ref();
const selectedDevice = ref({
    deviceId: 'A77C5238',
    deviceName: 'A楼01',
    disabled: true,
    online: false,
});

//获取设备信息
interface Device {
    deviceName: string;
    deviceId: string;
    offset: number | string; // 这里我假设 offset 是一个数字，如果是字符串请保留您原来的类型
    lowerOuliter: number | string;
    higherOuliter: number | string;
}

// 使用初始空数组并指定类型
let deviceList = ref<Device[]>([]);

const fetchDeviceList = async () => {
    try {
        const response = await useFetch('/api/device/all');
        deviceList.value = response.data.value as unknown as Device[];
        console.log(deviceList.value);
    } catch (error) {
        console.error('Error getting device list:', error);
    }
};

onMounted(() => {
    fetchDeviceList();
    console.log(deviceList.value);
})

let timeChart: any;
let amplitudeChart: any;

let timeCurveData: any;
let AmplitudeCurveData: any;

type EChartsOption = echarts.EChartsOption;


//初始化echarts
onMounted(() => {
    timeChart = echarts.init(document.getElementById('main'));
    amplitudeChart = echarts.init(document.getElementById('main2'));
});

//随窗口响应式变化
window.addEventListener('resize', function () {
    timeChart.resize();
    amplitudeChart.resize();
});

//绘制时程曲线
const drawTimeChart = (chartData: any) => {
    const deviceInfo = deviceList.value.find((d) => d.deviceId === chartData.device);
    if (deviceInfo) {
        chartData.deviceName = deviceInfo.deviceName;
    }
    var option: EChartsOption;

    //计算x轴
    const x_axis = caculateTimeList(chartData.s_date, 16);

    interface YData {
        [key: string]: number[]; // 添加索引签名，允许任意字符串类型的属性访问
    }

    const yData: YData = {
        x: chartData.x,
        y: chartData.y,
        z: chartData.z
    };

    let series: any[] = [];
    for (let name in yData) {
        var yline: any;
        var line_label: any;
        var label_position: any;
        if (name == 'x') {
            yline = chartData.rmsx;
            line_label = `X均值：${chartData.rmsx}`;
            label_position = 'insideStartTop';
        }
        else if (name == 'y') {
            yline = chartData.rmsy;
            line_label = `Y均值：${chartData.rmsy}`;
            label_position = 'insideMiddleTop';

        }
        else if (name == 'z') {
            yline = chartData.rmsz;
            line_label = `Z均值：${chartData.rmsz}`;
            label_position = 'insideEndTop';

        }
        series.push({
            name: name,
            type: 'line',
            data: yData[name],
            smooth: false,
            symbol: 'none', // 设置数据点的样式为 'none'
            markLine: {
                data: [
                    { name: 'Average', yAxis: yline },
                ],
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#ff0000',
                        }
                    }
                },
                label: {
                    position: label_position,
                    formatter: line_label,
                    color: '#ff0000',
                }
            }
        })
    }
    option = {
        title: {
            text: `时程曲线：${chartData.deviceName}（设备${chartData.device}）`,
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {   //选择
            data: ['x', 'y', 'z']
        },
        grid: {
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            show: true, // 是否显示工具栏
            feature: {
                saveAsImage: {}  //保存图片
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: x_axis
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} gal'
            }
        },
        series: series
    };

    option && timeChart.setOption(option);
}


//绘制幅频曲线
const drawAmplitudeChart = (data: any) => {
    const deviceInfo = deviceList.value.find((d) => d.deviceId === data.device);
    if (deviceInfo) {
        data.deviceName = deviceInfo.deviceName;
    }
    var option2: EChartsOption;

    //计算x轴
    interface YData {
        [key: string]: number[]; // 添加索引签名，允许任意字符串类型的属性访问
    }

    const yData: YData = {
        x: data.x,
        y: data.y,
        z: data.z
    };


    let series: any[] = [];
    for (let name in yData) {
        if (Object.prototype.hasOwnProperty.call(yData, name)) {
            series.push({
                name: name,
                type: 'line',
                data: yData[name],
                smooth: false,
                symbol: 'none', // 设置数据点的样式为 'none'
            });
        }
    }

    option2 = {
        title: {
            text: `频幅曲线：${data.deviceName}（设备${data.device}）`,
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {   //选择
            data: ['x', 'y', 'z']
        },
        grid: {
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            show: true, // 是否显示工具栏
            feature: {
                saveAsImage: {}  //保存图片
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.interval
        },
        yAxis: {
            type: 'value',
        },
        series: series
    };
    option2 && amplitudeChart.setOption(option2);
}


//WebSocket
const websocketUrl = 'wss://digetech.cn:8771/websocket/user_58';
let socket1 = new WebSocket(websocketUrl);
let first_flag = true;

//socket请求参数1：获取设备实时状态
const request1 = {
    code: 2,
    data: [
        'A77C5238', 'F853ED49', '9A0D1958', '87C3D4E4', '29FA1867', 'E43AC643'
    ],
    key: 'qiushangzhou852'
};
//socket请求参数2：获取设备详细数据
let request2 = {
    code: 1,
    data: selectedDevice.value.deviceId,
    channel: '0',
    pam: 1,
    key: 'qiushangzhou852'
};


//socket连接成功
socket1.onopen = () => {
    console.log('WebSocket connection1 opened');
    // WebSocket连接成功后发送请求1——获取设备实时状态
    socket1.send(JSON.stringify(request1));
    socket1.send(JSON.stringify(request2));
};

//接收到socket消息
socket1.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.code = 20001) {
        if (message.message == '基础数据') {
            // console.log(message.data);
            timeCurveData = message.data[0];
            AmplitudeCurveData = message.data[1];
            drawTimeChart(message.data[0]);
            drawAmplitudeChart(message.data[1]);
        }
        else if (message.message == '设备状态') {
            // console.log(message.data);
            devices.value = Object.entries(message.data).map(([key, value]) => ({
                deviceId: key,
                disabled: value === 1 ? false : true,
                online: value === 1 ? true : false
            }))
            devices.value.forEach((device: { deviceId: string; deviceName: string; }) => {
                // 假设 deviceList 已经填充了设备名
                const deviceInfo = deviceList.value.find((d) => d.deviceId === device.deviceId);
                if (deviceInfo) {
                    device.deviceName = deviceInfo.deviceName;
                }
            });
            const onlineDevice = devices.value.find((device: { online: boolean; }) => device.online === true);
            if (first_flag) {
                selectedDevice.value.deviceId = onlineDevice.deviceId;
                selectedDevice.value.deviceName = onlineDevice.deviceName;
                selectedDevice.value.disabled = false;
                selectedDevice.value.online = true;
            }
            first_flag = false;

        }

    }
};

//socket错误
socket1.onerror = (error) => {
    console.error('WebSocket error:', error);
};

//socket关闭
socket1.onclose = () => {
    console.log('WebSocket connection closed');
};


watch(selectedDevice, (newValue) => {
    request2.data = newValue.deviceId;
    socket1.close();
    socket1 = new WebSocket(websocketUrl);
    socket1.onopen = () => {
        console.log('WebSocket connection1 reopened');
        // WebSocket连接成功后发送请求1——获取设备实时状态
        socket1.send(JSON.stringify(request1));
        socket1.send(JSON.stringify(request2));
    };

    //接收到socket消息
    socket1.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.code = 20001) {
            if (message.message == '基础数据') {
                // console.log(message.data);
                timeCurveData = message.data[0];
                AmplitudeCurveData = message.data[1];
                drawTimeChart(message.data[0]);
                drawAmplitudeChart(message.data[1]);
            }
            else if (message.message == '设备状态') {
                // console.log(message.data);
                devices.value = Object.entries(message.data).map(([key, value]) => ({
                    deviceId: key,
                    disabled: value === 1 ? false : true,
                    online: value === 1 ? true : false
                }))
                devices.value.forEach((device: { deviceId: string; deviceName: string; }) => {
                    // 假设 deviceList 已经填充了设备名
                    const deviceInfo = deviceList.value.find((d) => d.deviceId === device.deviceId);
                    if (deviceInfo) {
                        device.deviceName = deviceInfo.deviceName;
                    }
                });
                const onlineDevice = devices.value.find((device: { online: boolean; }) => device.online === true);
                if (selectedDevice.value.disabled) {
                    selectedDevice.value.deviceId = onlineDevice.deviceId;
                    selectedDevice.value.deviceName = onlineDevice.deviceName;
                }
            }

        }
    };

    //socket错误
    socket1.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    //socket关闭
    socket1.onclose = () => {
        console.log('WebSocket connection closed');
    };
});

</script>

<style scoped>
#main,
#main2 {
    margin: 20px;
    width: 90%;
    padding: 30px;
}

.back-to-main-btn {
    margin: 0px;
    align-self: flex-start;
    /* 对齐到容器的左侧 */
}
</style>