<template>
  <UDashboardToolbar>
    <template #left>
      <!-- 设备选择 -->
      <DeviceSelectMenu @selectDevice="handleSelectDevice" />
      <!-- 时间选择 -->
      <DateRangePicker @selectRange="handleSelectRange"></DateRangePicker>
      <el-button type="primary" class="back-to-main-btn" @click="backToMain">返回主页</el-button>
    </template>
  </UDashboardToolbar>

  <MonitorTimeCurveChart :chartData="response" v-if="response != null"></MonitorTimeCurveChart>
  <div class="flex items-center justify-center h-screen" v-if="response == null">
    <USkeleton class="w-4/5 h-4/5" />
  </div>

</template>



<script setup lang="ts">
import { sub } from 'date-fns';
import { useRouter } from "vue-router";

const router = useRouter();
const backToMain = () => {
  router.push("/");
};

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
let response = ref(null);

const getHistoricalData = async (requestParams: RequestParam) => {
  response.value = null;
  try {
    const result = await useFetch(`/api/monitor/historical-data/`, {
      method: 'GET',
      query: requestParams,
    });
    response.value = result.data.value.data;
  } catch (error) {
    console.error('Error get historical-data:', error);
  }
};


onMounted(() => {
  // 获取当前日期
  const initialTime = ref({ start: sub(new Date(), { days: 7 }), end: new Date() })
  console.log(initialTime.value.end)
  // 获取时间戳
  requestParams.startTime = initialTime.value.start.getTime();
  requestParams.endTime = initialTime.value.end.getTime();
  //调用默认设备和当前日期：发送后端请求
  getHistoricalData(requestParams);
})

//选择时间范围
const handleSelectRange = (val: any) => {
  requestParams.startTime = val.start_time;
  requestParams.endTime = val.end_time;
  console.log(requestParams.startTime);
  console.log(requestParams.endTime);
  // 调用后端请求接口
  getHistoricalData(requestParams);

}

//选择设备
const handleSelectDevice = (val: any) => {
  requestParams.deviceId = val.deviceId;
  console.log(requestParams.deviceId);
  //调用后端请求接口
  getHistoricalData(requestParams);

}


</script>


<style scoped>
#main {
  margin: 20px;
  width: 90%;
  height: 150vh;
  padding: 30px;
}

.back-to-main-btn {
  margin: 0px;
  align-self: flex-start; /* 对齐到容器的左侧 */
}
</style>
