<script setup lang="ts">
import { ref, onMounted } from 'vue'

    //所有记录数
    const total = ref(0);

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
        pageSize: 20,
    });


    //响应参数
    let records = ref(null);

    let isloading: any;

    onMounted(()=>{
        getAlarmRecords(requestParams);
    })

    const getAlarmRecords = async (requestParams: RequestParam ) => {
        console.log(requestParams);
        records.value = null; // 重置响应数据
        try {
            
            const {data: result, isloading} = await useFetch('https://mock.apifox.com/m1/2979997-2544395-default/api/warn/records/', {
            method: 'GET',
            query: requestParams,
            });
            console.log(result.value);

            if(result.value && result.value.data){
                records.value = result.value.data.records;
                total.value = result.value.total;

                console.log(records.value);
            }
            else{
                console.log('erorrrrrrrrrr')
            }


        } catch (error) {
            console.error('Error fetching alarm records:', error);
        }
    };



    //选择设备
    const handleSelectDevice = (val: any) => {
      requestParams.deviceId = val.deviceId;
      getAlarmRecords(requestParams);
    }
    
    //选择时间范围
    const handleSelectRange = (val: any) => {
        requestParams.startTime = val.start_time;
        requestParams.endTime = val.end_time;
        getAlarmRecords(requestParams);
    }

    //选择报警等级
    const handleSelectLevel = (val: any) => {
        requestParams.level = val;
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
                <DeviceSelectMenu @selectDevice="handleSelectDevice"/>
                <!-- 时间选择 -->
                <DateRangePicker @selectRange="handleSelectRange"></DateRangePicker>
                <!-- 报警等级选择 -->
                <AlarmLevelSelectMenu @selectLevel="handleSelectLevel"></AlarmLevelSelectMenu>
            </template>
        </UDashboardToolbar>

        <AlarmRecordsTable :records="records" v-if="records!=null"></AlarmRecordsTable>
        
        <UPagination class="flex justify-center border" v-if="records!=null"
            v-model="requestParams.pageNo" 
            :page-count="requestParams.pageSize" 
            :total="total" 
            @click="handleSelectPage"
            show-last show-first/>
        
        <UContainer v-if="records == null">
            暂无结果
        </UContainer>
                
    </UDashboardPanel>
  </UDashboardPage>
</template>