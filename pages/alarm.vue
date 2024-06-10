<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { sub } from 'date-fns';
import { useRouter } from "vue-router";

const router = useRouter();
const backToMain = () => {
  router.push("/");
};

//所有记录数
const total = ref(0);
const size = ref(10);

interface RequestParam {
    deviceId: string;
    startTime: string | null;
    endTime: string | null;
    level: string;
    pageNo: number;
    pageSize: number;
}


//请求参数
let requestParams: RequestParam = ({
    deviceId: '',
    startTime: '',
    endTime: '',
    level: '',
    pageNo: 1,
    pageSize: size.value,
});


//响应参数
let records = ref(null);

onMounted(() => {
    // 获取当前日期
    const initialTime = ref({ start: sub(new Date(), { days: 7 }), end: new Date() })
    // 获取时间戳
    requestParams.startTime = initialTime.value.start.getTime().toString();
    requestParams.endTime = initialTime.value.end.getTime().toString();
    getAlarmRecords(requestParams);
})

const getAlarmRecords = async (requestParams: RequestParam) => {
    console.log(requestParams);
    records.value = null; // 重置响应数据
    try {

        const { data: result } = await useFetch('/api/monitor/warning', {
            method: 'GET',
            query: requestParams,
        });
        if (result.value && result.value.data) {
            records.value = result.value.data.records;
            total.value = result.value.data.total;
            if (records.value != null) {
                for (let i = 0; i < records.value.length; i++) {
                    records.value[i].emails = records.value[i].emails.split(',').join('\n')
                }
            }

            console.log(result.value);
        }
        else {
            console.log('erorrrrrrrrrr')
        }
    } catch (error) {
        console.error('Error fetching alarm records:', error);
    }
};



//选择设备
const handleSelectDevice = (val: any) => {
    requestParams.deviceId = val.deviceId;
    requestParams.pageNo = 1;
    getAlarmRecords(requestParams);
}

//选择时间范围
const handleSelectRange = (val: any) => {
    requestParams.startTime = val.start_time;
    requestParams.endTime = val.end_time;
    requestParams.pageNo = 1;
    getAlarmRecords(requestParams);
}

//选择报警等级
const handleSelectLevel = (val: any) => {
    requestParams.level = val;
    requestParams.pageNo = 1;
    getAlarmRecords(requestParams);
}

//分页选择
const handleSelectPage = () => {
    getAlarmRecords(requestParams);
}

</script>

<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar title="报警记录" :badge="total">
            </UDashboardNavbar>

            <UDashboardToolbar>
                <template #left>
                    <!-- 设备选择 -->
                    <DeviceSelectMenu @selectDevice="handleSelectDevice" />
                    <!-- 时间选择 -->
                    <DateRangePicker @selectRange="handleSelectRange"></DateRangePicker>
                    <!-- 报警等级选择 -->
                    <AlarmLevelSelectMenu @selectLevel="handleSelectLevel"></AlarmLevelSelectMenu>
                    <el-button type="primary" class="back-to-main-btn" @click="backToMain">返回主页</el-button>
                </template>
            </UDashboardToolbar>

            <AlarmRecordsTable :records="records" v-if="records != null"></AlarmRecordsTable>

            <UPagination class="flex justify-center border" v-if="records != null" v-model="requestParams.pageNo"
                :page-count="requestParams.pageSize" :total="total" @click="handleSelectPage" show-last show-first>
            </UPagination>

            <UContainer v-if="records == null">
                暂无结果
            </UContainer>

        </UDashboardPanel>
    </UDashboardPage>
</template>

<style scoped>
.back-to-main-btn {
    margin: 0px;
    align-self: flex-start;
    /* 对齐到容器的左侧 */
}
</style>
