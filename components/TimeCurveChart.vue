<template>
    <div class="flex flex-col justify-center items-center overflow-y-auto">
      <div id="main" class="rounded-lg border border-gray-300"></div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, defineProps } from 'vue';

    import * as echarts from 'echarts';

    let timeChart: any;

    let timeCurveData: any;

    type EChartsOption = echarts.EChartsOption;

    
    const props = defineProps({
        chartData: {
            type:Object, //数据类型
            required:true
        },
    })

    //初始化echarts
    onMounted(() => {
        timeChart = echarts.init(document.getElementById('main'));
        drawTimeChart(props.chartData);
    });

    //随窗口响应式变化
    window.addEventListener('resize', function() {
        timeChart.resize();
    });
    
    //绘制时程曲线
    const drawTimeChart = (chartData: any) =>{
        console.log("draw",chartData);
        var option: EChartsOption;

        //计算x轴
        const x_axis = chartData.time;

        interface YData {
            [key: string]: number[]; // 添加索引签名，允许任意字符串类型的属性访问
        }
        
        const yData: YData = {
            x: chartData.xData,
            y: chartData.yData,
            z: chartData.zData
        };

        let series: any[] = [];
        for (let name in yData) {
            series.push({
                name: name,
                type: 'line',
                data: yData[name],
                smooth: false,
                symbol: 'none', // 设置数据点的样式为 'none'
            })
        }
        option = {
            title: {
                text: `时程曲线：${chartData.deviceInfo.deviceName}（设备${chartData.deviceInfo.deviceId}）`,
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {   //选择
                data: ['x', 'y', 'z']
            },
            grid: {
                left: '3%',
                right: '3%',
                bottom: '12%',
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
            series: series,
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                },
                {
                    start: 0,
                    end: 100
                }
            ],
        };

        option && timeChart.setOption(option);
    }

    watch(() => props.chartData, (newData) => {
        console.log('chartData 发生变化:', newData);
        drawTimeChart(newData);
    });



</script>


<style scoped>
    #main{
        margin: 30px;
        width: 90%;
        height: 90vh;
        padding: 30px;
    }
</style>