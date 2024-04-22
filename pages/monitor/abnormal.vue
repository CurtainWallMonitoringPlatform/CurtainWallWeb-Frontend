<template>
    <UDashboardToolbar>
      <template #left>
        <!-- 设备选择 -->
        <DeviceSelectMenu @selectDevice="handleSelectDevice"/>
        <!-- 时间选择 -->
        <DateRangePicker @selectRange="handleSelectRange"></DateRangePicker>
      </template>
    </UDashboardToolbar>
  
    <TimeCurveChart :chartData="response"></TimeCurveChart>
  
  </template>
  
  
  
  <script setup lang="ts">
      import { sub } from 'date-fns';
      import * as echarts from 'echarts';
  
      //请求参数
      const requestParams = ref({
          deviceId: '',
          startTime: 0,
          endTime: 0
      });
  
      //响应参数
      const response = ref({
        deviceInfo:{
          deviceId: 'DFEidfe',
          deviceName: 'A楼01',
        },
        xData: [0.10055089, -0.019449234, 0.16055083, 0.29055095, 0.18055081, 0.040550947, -0.059449196, -0.059449196, 0.07055092, 0.010550737, -0.009449244],
        yData: [-0.038269043, -0.17828369, -0.1482544, -0.10827637, -0.0982666, -0.038269043, -0.05822754, -0.21826172, -0.24822998, -0.0982666, -0.068237305],
        zData: [-0.07610512, 0.08389664, 0.2138958, 0.04389572, -0.26610374, -0.26610374, -0.20610428, -0.08610344, 0.16389656, 0.30389595, 0.09389496, -0.07610512],
        time: [1713542400000,1713542400001,1713542400002,1713542400003,1713542400004,1713542400005,1713542400006,1713542400007,1713542400008,1713542400009,1713542400010,1713542400011],
      });
  
  
      const initialTime = ref({ start: sub(new Date(), { days: 14 }), end: new Date() })
      // 设置为指定日期的时间
      initialTime.value.start.setHours(0, 0, 0, 0);
      initialTime.value.end.setHours(0, 0, 0, 0);
      // 获取时间戳
      requestParams.value.startTime = initialTime.value.start.getTime();
      requestParams.value.endTime = initialTime.value.end.getTime();
  
  
      
      onMounted(()=>{
        //调用默认设备和当前日期：发送后端请求
      })
  
      //选择时间范围
      const handleSelectRange = (val: any) => {
          requestParams.value.startTime = val.start_time;
          requestParams.value.endTime = val.end_time;
          console.log(requestParams.value.startTime);
          console.log(requestParams.value.endTime);
          // todo：调用后端请求接口
  
      }
  
      //选择设备
      const handleSelectDevice = (val: any) => {
        requestParams.value.deviceId = val;
        console.log(requestParams.value.deviceId);
        //todo: 调用后端请求接口
      }
  
  
  </script>
  
  
  <style scoped>
    #main{
        margin: 20px;
        width: 90%;
        height: 150vh;
        padding: 30px;
    }
  </style>