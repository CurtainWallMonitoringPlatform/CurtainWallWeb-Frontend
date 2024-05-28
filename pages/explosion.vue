<!-- 玻璃内爆识别页面 -->
<template>
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
                    style="width: 200px; height: 150px; margin-top:10px; object-fit:contain">
                </el-image>
            </div>

            <!-- 上传图片end -->
            <div>
                <el-divider style="margin-top:60px;width: 68%; left: 28% " content-position="center">
                    识别结果
                </el-divider>
                <el-scrollbar class="scrollbar-container">
                    <img v-if="imageUrl" :src="imageUrl" alt="Annotated Image"
                        :style="{ 'max-width': '100%', 'max-height': '100%' }" />
                    <el-button v-if="imageUrl" type="primary" @click="saveImage">
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
import { UploadImg } from '@/server/api/public.js'
import { useStore } from 'vuex'


//上传的图片
const ImgUploadRef = ref(null);

//分割后获得的图片
const imageUrl = ref(null);

const store = useStore()

const serverURL = 'http://111.231.168.12:8021'

const fetchImage = async () => {
    try {
        const response = await axios.get(serverURL + '/images', {
            responseType: 'arraybuffer',
        });
        const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
        imageUrl.value = URL.createObjectURL(imageBlob);
        console.log("display数据");
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

const saveImage = async () => {
    try {

        const response = await axios.get(serverURL + '/save')
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
fetch(serverURL + '/api/images/display5')
    .then(response => response.json())
    .then(imageBase64List => {
        images.value = imageBase64List.map(base64Image => 'data:image/jpeg;base64,' + base64Image);
    })
    .catch(error => console.error('Error fetching images:', error));

const upload = (val) => {
    console.log(val.fileList[0].raw) //图片raw文件

    let formData = new FormData();
    formData.append('photo', val.fileList[0].raw);

    UploadImg(formData)

    watch(() => store.state.process_status, (newStatus, oldStatus) => {
        fetchImage();
    });

}

const after_upload = (result) => {
    ImgResult.value = result; // 后期需要修改，先这么写
}
</script>

<style scoped>
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
}
</style>