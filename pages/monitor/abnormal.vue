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

    const directions = ['X', 'Y', 'Z']
    const direction = ref(directions[0])

    interface RequestParam {
      deviceId: string;
      startTime: string | number;
      endTime: string | number;
    }

    let requestParams: RequestParam = ({
        deviceId: 'A77C5238',
        startTime: '',
        endTime: ''
    });

    //响应参数
    let response = ref();

    //
    const getAbnormalData = async (requestParams : RequestParam ) => {
      try {
        const result = await useFetch(`/api/monitor/abnormal-data/`, {
          method: 'GET',
          query: requestParams,
        });
        response.value = result.data.value.data;
        if(response.value == null){
        //如果没有data数据会报错？？
        }

      } catch (error) {
        console.error('Error get abnormal-data:', error);
      }
    };

    
    onMounted(()=>{
      // 获取当前日期
      const initialTime = ref({ start: sub(new Date(), { days: 7 }), end: new Date() })
      // 获取时间戳
      requestParams.startTime = initialTime.value.start.getTime();
      requestParams.endTime = initialTime.value.end.getTime();
      //调用默认设备和当前日期：发送后端请求
      getAbnormalData(requestParams);

    })

    //选择时间范围
    const handleSelectRange = (val: any) => {
        requestParams.startTime = val.start_time;
        requestParams.endTime = val.end_time;
        console.log(requestParams.startTime);
        console.log(requestParams.endTime);
        //调用后端请求接口
        getAbnormalData(requestParams);

    }

    //选择设备
    const handleSelectDevice = (val: any) => {
      requestParams.deviceId = val.deviceId;
      console.log(requestParams.deviceId);
      //调用后端请求接口
      getAbnormalData(requestParams);

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