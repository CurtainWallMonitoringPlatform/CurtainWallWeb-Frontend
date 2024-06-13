<template>
    <div class="main-container">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 5px; margin-right: 5px">
            <el-button type="primary" @click="backToMain">返回主页</el-button>
        </div>
        <div class="demo-image">
            <el-table :data="tableData" :border="parentBorder" style="width: 100%">
                <el-table-column type="expand">
                    <template #default="props">
                        <div m="4">
                            <p m="t-0 b-2">所分块数: {{ props.row.num }}</p>
                            <p m="t-0 b-2">检测时间: {{ props.row.time }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="图片名称">
                    <template #default="scope">
                        <el-image style="width: 400px; height: 200px" :src="scope.row.name" :fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="图片展示">
                    <template #default="scope">
                        <el-image style="width: 400px; height: 200px" :src="scope.row.photo" :fit="cover"></el-image>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const backToMain = () => {
    router.push("/");
};

const parentBorder = ref(true);
const tableData = ref([]);

onMounted(() => {
    axios.get('http://111.231.168.12:8090/historydata')
        .then(response => {
            tableData.value = response.data;
        })
        .catch(error => {
            console.error('Error fetching tableData:', error);
        });
});
// const parentBorder = ref(true);
// const tableData = [
//     {
//         name: "1.jpg",
//         photo: "/src/assets/1.jpg", // 修改成图片的相对路径
//         num: "12",
//         result: "200平方厘米",
//         time: "2024-4-26",
//     },
//     {
//         name: "2.jpg",
//         photo: "/src/assets/1.jpg", // 修改成图片的相对路径
//         num: "12",
//         result: "200平方厘米",
//         time: "2024-4-29",
//     },
// ];
</script>

<style scoped>
.main-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 10px;
}

.demo-image {
    overflow: auto
}
</style>
