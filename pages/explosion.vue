<!-- 玻璃内爆识别页面 -->
<template>
    <el-button type="primary" class="back-to-main-btn" @click="backToMain">返回主页</el-button>
    <UDashboardPage>
        <UDashboardPanel grow>
            <!-- 上传图片begin -->
            <div class="upload-container">
                <el-divider content-position="center">
                    本地上传
                </el-divider>
                <ImgUploader ref="ImgUploadRef" @uploadPicture="upload" />
                <el-divider style="margin-top:60px" content-position="center">
                    用户数据
                </el-divider>
                <div class="el-upload__tip">
                    点击查看用户图片
                </div>
                <el-image :src="images[0]" :preview-src-list="images"
                    style="width: 100%; margin-top:5%; object-fit:contain; display: flex;">
                </el-image>
            </div>

            <!-- 上传图片end -->
            <div class="result-wrap">
                <el-divider style="margin-top:60px;width: 68%; left: 28% " content-position="center">
                    识别结果
                </el-divider>

                <el-scrollbar class="scrollbar-container">
                    <div class="progress-wrap" v-if="showProgress">
                        <UProgress animation="carousel"></UProgress>
                    </div>
                    <img v-if="imageUrl" :src="imageUrl" alt="Annotated Image"
                        :style="{ 'margin-left': '20%', 'width': '60%', 'max-height': '100%' }" />
                    <el-button v-if="imageUrl" type="primary" @click="saveImage"
                        style="margin-left: 20%; width: 60%; margin-top: 2%">
                        保存图片
                    </el-button>
                </el-scrollbar>
            </div>
        </UDashboardPanel>
    </UDashboardPage>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import Message from "@/server/segment/Message.js";
import ImgUploader from '@/components/ImgUploader.vue'
import { UploadImg } from '@/api/segment/public.js'
import { useStore } from 'vuex'
import { useRouter } from "vue-router";

const router = useRouter();
const backToMain = () => {
  router.push("/");
};

//上传的图片
const ImgUploadRef = ref(null);

//分割后获得的图片
const imageUrl = ref(null);

const store = useStore()

const serverURL = 'http://111.231.168.12:8021'

const showProgress = ref(false);

const fetchImage = async () => {
    try {
        const response = await axios.get('http://111.231.168.12:8021/images', {
            responseType: 'arraybuffer',
        });
        const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
        imageUrl.value = URL.createObjectURL(imageBlob);
        showProgress.value = false;
        console.log("display数据");
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

const errorCallBack = async () => {
};

const saveImage = async () => {
    try {
        const response = await axios.get('http://111.231.168.12:8021/save')
        // 处理后端返回的数据
        console.log(response.data);
        Message.success("保存成功");
    } catch (error) {
        console.error(error);
        Message.success("保存失败");
    }
};

// 创建一个空数组来存储图片
const images = ref([]);

// 获取后端返回的结果图片
fetch('http://111.231.168.12:8021/api/images/display5')
    .then(response => response.json())
    .then(imageBase64List => {
        images.value = imageBase64List.map(base64Image => 'data:image/jpeg;base64,' + base64Image);
    })
    .catch(error => console.error('Error fetching images:', error));

const upload = (val) => {
    console.log(val.fileList[0].raw) // 图片raw文件

    let formData = new FormData();
    formData.append('photo', val.fileList[0].raw);

    showProgress.value = true;

    UploadImg(formData, fetchImage, errorCallBack)

    // watch(() => store.state.process_status, (newStatus, oldStatus) => {
    //     fetchImage();
    // });
}

const after_upload = (result) => {
    ImgResult.value = result; // 后期需要修改，先这么写
}
</script>

<style scoped>
.back-to-main-btn {
  margin: 5px;
  align-self: flex-start; /* 对齐到容器的左侧 */
}

.page {
    display: flex;
    flex-direction: column;
    margin-left: auto;
    margin-right: auto;
}

.upload-container {
    position: absolute;
    top: 15%;
    left: 5%;
}

.scrollbar-container {
    position: absolute;
    top: 13%;
    left: 28%;
    max-height: 80%;
    width: 68%;
    text-align: left;
    border: 1px solid black;
    border-radius: 1%;
    display: flex;
    flex-direction: column;
}

.progress-wrap {
    width: 100%;
}
</style>