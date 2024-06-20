<template>
    <div style="position: fixed; right: 10px; top: 15px; z-index: 1000;">
        <el-button type="primary" class="back-to-main-btn" @click="backToMain"
            style="position: absolute; right: 0; top: 0;">返回主页</el-button>
    </div>
    <DeviceList />
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const backToMain = () => {
    router.push("/");
};
</script>