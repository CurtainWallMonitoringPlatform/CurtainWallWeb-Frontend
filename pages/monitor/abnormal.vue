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
    // import { GetAbnormalData } from '~/api/data';

    interface RequestParam {
      deviceId: string;
      startTime: string | number;
      endTime: string | number;
    }

    //请求参数
    // const requestParams = ref({
    //     deviceId: 'A77C5238',
    //     startTime: 0,
    //     endTime: 0
    // });

    let requestParams: RequestParam = ({
        deviceId: 'A77C5238',
        startTime: '',
        endTime: ''
    });

    //响应参数
    let response = ref();

    //获取历史数据
    // const getAbnormalData = () =>{
    //   response.value = null;
    //   GetAbnormalData(requestParams.value)
    //     .then(function(result: any){
    //       response.value = result.data;
    //       console.log(response.value)
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     })
    // }

    //
    const getAbnormalData = async (requestParams : RequestParam ) => {
      try {
        response.value = await useFetch(`/api/monitor/hitorical-data/`, {
          method: 'GET',
          query: requestParams,
        });
        console.log('aaaaaaaaaaaaaaaaaaaa',response.value)

      } catch (error) {
        console.error('Error updating device info:', error);
      }
    };

    
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
</style>~/api/data