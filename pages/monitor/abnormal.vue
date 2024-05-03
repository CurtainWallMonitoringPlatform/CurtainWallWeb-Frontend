<template>
  <UDashboardToolbar>
    <template #left>
      <!-- 设备选择 -->
      <DeviceSelectMenu @selectDevice="handleSelectDevice" style="width: 150px"/>
      <!-- 方向选择 -->
      <USelectMenu v-model="direction" :options="directions" placeholder="选择方向" style="width: 100px"/>
      <!-- 时间选择 -->
      <DateRangePicker @selectRange="handleSelectRange"></DateRangePicker>
    </template>
  </UDashboardToolbar>

  <LargeDataChart :chartData="response" :direction="direction" v-if="response != null"></LargeDataChart>
  <div class="flex items-center justify-center h-screen" v-if="response == null">
    <USkeleton class="w-4/5 h-4/5" />
  </div>

</template>



<script setup lang="ts">
    import { sub } from 'date-fns';
    import { GetAbnormalData } from '~/api/data';

    const directions = ['X', 'Y', 'Z']
    const direction = ref(directions[0])

    //请求参数
    const requestParams = ref({
        deviceId: 'A77C5238',
        startTime: 0,
        endTime: 0
    });

    //响应参数
    let response = ref(null);

    //获取历史数据
    const getAbnormalData = () =>{
      console.log(requestParams.value)
      response.value = null;
      GetAbnormalData(requestParams.value)
        .then(function(result: any){
          response.value = result.data;
          console.log(response.value)
        })
        .catch(function (error) {
          console.log(error);
        })
    }


    
    onMounted(()=>{
      // 获取当前日期
      const initialTime = ref({ start: sub(new Date(), { days: 7 }), end: new Date() })
      // 获取时间戳
      requestParams.value.startTime = initialTime.value.start.getTime();
      requestParams.value.endTime = initialTime.value.end.getTime();
      //获取默认设备的时间戳
      getAbnormalData();
    })

    //选择时间范围
    const handleSelectRange = (val: any) => {
        requestParams.value.startTime = val.start_time;
        requestParams.value.endTime = val.end_time;
        console.log(requestParams.value.startTime);
        console.log(requestParams.value.endTime);
        // todo：调用后端请求接口
        getAbnormalData();
    }

    //选择设备
    const handleSelectDevice = (val: any) => {
      requestParams.value.deviceId = val.deviceId;
      console.log(requestParams.value.deviceId);
      //todo: 调用后端请求接口
      getAbnormalData();
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