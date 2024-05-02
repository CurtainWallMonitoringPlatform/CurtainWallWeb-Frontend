<template>
    <div class="datepicker-wrap">
        <div class="block">
            <el-date-picker
                v-model="pickedDate"
                type="date"
                placeholder="请选择日期"
            />
        </div>
    </div>
    <div class="result-wrap">
        <el-row :gutter="20">
            <el-col class="col-wrap" :span="6" v-for="(item, index) in placeholders" :key="index">
                <el-card class="card-wrap">
                    <div v-if="!item.loaded" class="loading-placeholder">
                        <img src="@/public/assets/images/Wedges-3s-200px.gif"/>
                    </div>
                    <img v-else :src="item.image_url" alt="Thumbnail" @click="showImageDetails(item)">
                </el-card>
            </el-col>
        </el-row>
        <!-- 弹窗显示图片详情 -->
        <el-dialog v-model="dialogVisible" width="50%">
            <img :src="selectedImage.image_url" alt="Selected Image" style="width: 100%">
            <el-divider></el-divider>
            <el-row :gutter="20">
                <el-col :span="6" v-for="(segment, index) in selectedImage.segments" :key="index">
                    <el-card class="small-card-wrap">
                        <img :src="segment" alt="Segment Image" style="width: 100%">
                        <!-- <p>{{ label_list[index] }}</p> -->
                    </el-card>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, watch }from 'vue'
import { GetResultByDate } from '@/api/segment/segmentation.js'

const pickedDate = ref('')
var selectedImage = ref(null)
var dialogVisible = ref(false)
const placeholders = ref([])

function showImageDetails(image) {
    selectedImage.value = image;
    dialogVisible.value = true;
}

// 改变图片尺寸，用于生成缩略图
function resizeImage(imageSrc, width, height) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';  // 尝试解决跨域问题，但需要远程服务器的支持
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL());
        };
        img.onerror = () => {
            reject(new Error('无法加载图片'));
        };
        img.src = imageSrc;
    });
}

watch(pickedDate, async (newDate) => {
    const formattedDate = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}-${newDate.getDate().toString().padStart(2, '0')}`;
    let formData = new FormData();
    formData.append('date', formattedDate);
    try {
        const response = await GetResultByDate(formData);
        placeholders.value = response.data['images'].map(() => ({ loaded: false }));
        const labels = response.data['label_list'];
        response.data['images'].forEach(async (image, index) => {
            const resizedUrl = await resizeImage(image.image_url, 300, 225);
            placeholders.value[index] = { ...image, image_url: resizedUrl, loaded: true };
            // placeholders.value[index] = { 
            //     ...image,image_url: resizedUrl, loaded: true,
            //     pictures: labels.map((label, index) => ({ 
            //         label: label,
            //         image: response.data['images'][index]
            //     }))
            // };
            // console.log("image resized");
        });
    } catch (error) {
        console.error("Error fetching image list:", error);
    }
});

</script>

<style>
.card-wrap {
    margin: 5px 5px 20px;
    background-color: rgba(240, 240, 240, 0.3);
    /* width: 340px;
    height: 250px; */
}
.small-card-wrap {
    margin: 5px 5px 20px;
}
.loading-placeholder {
    height: 225px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.datepicker-wrap {
    margin-top: 60px;
    margin-bottom: 20px;
}
</style>