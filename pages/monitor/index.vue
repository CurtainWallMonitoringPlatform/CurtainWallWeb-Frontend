<template>
    <div class="flex flex-col justify-center items-center overflow-scroll ">
        <div id="main" class="object-center"></div>
        <div id="main2" class="object-center"></div>
    </div>

</template>

<script setup lang="ts">
    import { onMounted } from 'vue';
    import * as echarts from 'echarts';

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
    

    // 辅助函数，用于将单个数字转换为两位数的字符串
    const padZero = (num: number): string => {
        return String(num).padStart(2, '0');
    }


    //计算时间戳list：间隔interval
    const caculateTimeList = (start: number, interval: number): string[] => {
        const time_list: string[] = [];
        let i = 0;
        for(;i < 1000; i++){
            const date = new Date(start + i * interval);
            const year = date.getUTCFullYear(); // 获取年份
            const month = date.getUTCMonth() + 1; // 获取月份（注意月份从 0 开始，需要加 1）
            const day = date.getUTCDate(); // 获取日期
            const hour = date.getUTCHours() + 8; // 获取小时（加 8 是为了转换为北京时间）
            const minute = date.getUTCMinutes(); // 获取分钟
            const second = date.getUTCSeconds(); // 获取秒钟

            // const beijingTimeString = `${year}-${padZero(month)}-${padZero(day)} ${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
            const beijingTimeString = `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
            time_list.push(beijingTimeString);
        }
        return time_list;
 
    }


    //绘制时程曲线
    const drawTimeChart = (chartData: any) =>{
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
            if(name == 'x'){
                yline = chartData.rmsx;
                line_label = `X均值：${chartData.rmsx}`;
                label_position = 'insideStartTop';
            }
            else if(name == 'y'){
                yline = chartData.rmsy;
                line_label = `Y均值：${chartData.rmsy}`;
                label_position = 'insideMiddleTop';

            }
            else if(name == 'z'){
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
                        { name: 'Average', yAxis: yline},
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
                text: `时程曲线：设备${chartData.device}`,
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
                feature:{
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
    const drawAmplitudeChart = (data: any) =>{
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
                text: `频幅曲线：设备${data.device}`,
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
                feature:{
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
    const socket = new WebSocket(websocketUrl);

    //socket连接成功
    socket.onopen = () => {
        console.log('WebSocket connection opened');
        // WebSocket连接成功后发送请求1——获取设备实时状态
        const request1 = {
            code: 2,
            data: [
            'F001', '4787BE3A', '8850A7D7', '8361D7CD', '612B04ED', 'E884C99D',
            'E43AC643', '29FA1867', '87C3D4E4', '9A0D1958', 'F853ED49', 'A77C5238'
            ],
            key: 'qiushangzhou852'
        };
        socket.send(JSON.stringify(request1));

        const request2 = {
            code: 1,
            data: 'E43AC643',
            channel: '0',
            pam: 1,
            key: 'qiushangzhou852'
        };
        socket.send(JSON.stringify(request2));
    };
    

    //接收到socket消息
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if(message.code = 20001){
            console.log(message.data);
            timeCurveData = message.data[0];
            AmplitudeCurveData = message.data[1];
            drawTimeChart(message.data[0]);
            drawAmplitudeChart(message.data[1]);
        }
    };

    //socket错误
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };


    //socket关闭
    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };



</script>

<style scoped>

    #main,
    #main2{
        margin: 20px;
        width: 70%;
        height: 150vh;
        padding: 30px;
    }
</style>