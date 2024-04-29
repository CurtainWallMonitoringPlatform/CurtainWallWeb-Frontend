<template>
    <div class="flex flex-col justify-center items-center overflow-y-auto">
      <div id="main" class="rounded-lg border border-gray-300"></div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, defineProps } from 'vue';

    import * as echarts from 'echarts';

    let timeChart: any;

    type EChartsOption = echarts.EChartsOption;

    
    const props = defineProps({
        chartData: {
            type:Object, //数据类型
            required:true
        },
        direction: String //方向
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
        var x_axis;
        var y_data;
        if(props.direction == 'X'){
            x_axis = chartData.xTime;
            y_data = chartData.xData;
        }
        else if(props.direction == 'Y'){
            x_axis = chartData.yTime;
            y_data = chartData.yData;
        }
        else{
            x_axis = chartData.zTime;
            y_data = chartData.zData;
        }
        
        option = {
            title: {
                left: 'center',
                text: `异常值数据：设备${chartData.deviceInfo.deviceName}`,
            },
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            grid: {
                left: '2%',
                right: '2%',
                bottom: '15%',
                containLabel: true
            },
            toolbox: {
                show: true, // 是否显示工具栏
                feature:{
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    saveAsImage: {}  //保存图片
                }
            },
            xAxis: {
                type: 'category',
                data: x_axis
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} gal'
                }
            },
            //数据缩放组件
            dataZoom: [
                {  //内部数据缩放
                    type: 'inside',
                },
                {  //外部数据缩放
                    type: 'slider'
                }
            ],
            series: [
                {
                    name: props.direction,
                    data: y_data,
                    type: 'scatter',
                    symbolSize: 8,
                    large: true,
                    markLine: 
                    {
                        data: [
                            { type: 'none', name: 'Max', yAxis: chartData.deviceInfo.upperOutlier },
                            { type: 'none', name: 'Min', yAxis: chartData.deviceInfo.lowerOutlier }
                        ],
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: '#ff0000',
                                }
                            }
                        },
                        label: {
                            position: 'insideMiddleTop',
                            formatter: function (params) {
                                if (params.name === 'Max') {
                                    return `异常上限：${chartData.deviceInfo.upperOutlier}gal`;
                                } else if (params.name === 'Min') {
                                    return `异常下限：${chartData.deviceInfo.lowerOutlier}gal`;
                                }
                            },
                            color: '#ff0000'
                        }
                    }
                }
            ]
        };

        option && timeChart.setOption(option);
    }

    watch(() => props.chartData, (newData) => {
        console.log('chartData 发生变化:', newData);
        drawTimeChart(newData);
    });

    watch(() => props.direction, (newData) => {
        console.log('direction 发生变化:', newData);
        drawTimeChart(props.chartData);
    });


</script>


<style scoped>
    #main{
        margin: 30px;
        width: 90%;
        height: 100vh;
        padding: 30px;
    }
</style>