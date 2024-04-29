<template>
  <UDashboardToolbar>
    <template #left>
      <!-- 设备选择 -->
      <DeviceSelectMenu @selectDevice="handleSelectDevice"/>
      <!-- 时间选择 -->
      <DateRangePicker @selectRange="handleSelectRange"></DateRangePicker>
    </template>
  </UDashboardToolbar>
  
  <TimeCurveChart :chartData="response" v-if="response != null"></TimeCurveChart>
  <div class="flex items-center justify-center h-screen" v-if="response == null">
    <USkeleton class="w-4/5 h-4/5" />
  </div>

</template>



<script setup lang="ts">
    import { sub } from 'date-fns';
    import { GetHistoricalData } from '~/api/data';

    //请求参数
    const requestParams = ref({
        deviceId: 'A77C5238',
        startTime: 0,
        endTime: 0
    });

    //响应参数
    let response = ref(null);

    //获取历史数据
    const getHistoricalData = () =>{
      response.value = null;
      GetHistoricalData(requestParams.value)
        .then(function(result: any){
          response.value = result.data;
          console.log(response.value)
        })
        .catch(function (error) {
          console.log(error);
        }
    )}


    
    onMounted(()=>{
      // 获取当前日期
      // 获取当天0点的时间戳
      // requestParams.value.endTime = Math.floor(Date.now());
      // requestParams.value.startTime = requestParams.value.endTime - 24 * 60 * 60 * 7
      // console.log(requestParams.value)
      const initialTime = ref({ start: sub(new Date(), { days: 7 }), end: new Date() })
      // 设置为指定日期的时间
      initialTime.value.start.setHours(0, 0, 0, 0);
      initialTime.value.end.setHours(0, 0, 0, 0);
      // 获取时间戳
      requestParams.value.startTime = initialTime.value.start.getTime();
      requestParams.value.endTime = initialTime.value.end.getTime();
      getHistoricalData();

      //调用默认设备和当前日期：发送后端请求

    })

    //选择时间范围
    const handleSelectRange = (val: any) => {
        requestParams.value.startTime = val.start_time;
        requestParams.value.endTime = val.end_time;
        console.log(requestParams.value.startTime);
        console.log(requestParams.value.endTime);
        // todo：调用后端请求接口
        getHistoricalData();
    }

    //选择设备
    const handleSelectDevice = (val: any) => {
      requestParams.value.deviceId = val.deviceId;
      console.log(requestParams.value.deviceId);
      //todo: 调用后端请求接口
      getHistoricalData();
    }


</script>


<style scoped>
  #main{
      margin: 20px;
      width: 90%;
      height: 150vh;
      padding: 30px;
  }
</style>~/api/data
