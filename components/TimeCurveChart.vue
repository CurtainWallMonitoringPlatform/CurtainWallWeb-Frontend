<template>
    <div class="flex flex-col justify-center items-center overflow-scroll">
      <div id="main"></div>
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
            // var yline: any;
            // var line_label: any;
            // var label_position: any;
            // if(name == 'x'){
            //     yline = chartData.rmsx;
            //     line_label = `X均值：${chartData.rmsx}`;
            //     label_position = 'insideStartTop';
            // }
            // else if(name == 'y'){
            //     yline = chartData.rmsy;
            //     line_label = `Y均值：${chartData.rmsy}`;
            //     label_position = 'insideMiddleTop';

            // }
            // else if(name == 'z'){
            //     yline = chartData.rmsz;
            //     line_label = `Z均值：${chartData.rmsz}`;
            //     label_position = 'insideEndTop';

            // }
            series.push({
                name: name,
                type: 'line',
                data: yData[name],
                smooth: false,
                symbol: 'none', // 设置数据点的样式为 'none'
                // markLine: {
                //     data: [
                //         { name: 'Average', yAxis: yline},
                //     ],
                //     itemStyle: {
                //         normal: {
                //             lineStyle: {
                //                 color: '#ff0000',
                //             }
                //         }
                //     },
                //     label: {
                //         position: label_position,
                //         formatter: line_label,
                //         color: '#ff0000',
                //     }
                // }
            })
        }
        option = {
            title: {
                text: `时程曲线：设备${chartData.deviceInfo.deviceName}`,
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

    watch(() => props.chartData, (newData) => {
        console.log('chartData 发生变化:', newData);
        drawTimeChart(newData);
    });



</script>


<style scoped>
    #main{
        margin: 20px;
        width: 90%;
        height: 150vh;
        padding: 30px;
    }
</style>