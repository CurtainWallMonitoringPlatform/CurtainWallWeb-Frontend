<!-- 图像分割页面 -->
<template>

    <!-- <el-button @click="GoToDash">进入仪表盘</el-button> -->
    <div class="container">
        <ImgUploader ref="ImgUploadRef" @uploadPicture ="upload" @onCancel="cancel"/>
    </div>
    <div class="progress-wrap" v-if="showProgress">
        <el-progress :text-inside="false" :stroke-width="18" :percentage="per" striped></el-progress>
    </div>
    <!-- <div class="result-container" v-if="ImgResult">
        <ImgList :data="ImgResult"/>
    </div> -->
    <div class="carousel-container" v-if="ImgResult.length > 0">
        <el-carousel class="carousel" :interval="0" arrow="always" indicator-position="outside" style="flex: 1;">
            <el-carousel-item v-for="(item,index) in ImgResult" :key="index">
                <ImgList :data="item" :isGlass="isGlassWall"/>
            </el-carousel-item>
        </el-carousel>
    </div>

    <div class="switch-container">
        <div class="rounded-box">
            <!-- 提示文字 -->
            <span class="left-text">其他幕墙</span>
            <!-- 组件内容 -->
            <div class="fixed-component">
                <UToggle v-model="isGlassWall" @change="handleSwitchChange" />
            </div>
            <!-- 提示文字 -->
            <span class="right-text">玻璃幕墙</span>
        </div>
    </div>
    
</template>

<script setup>
// import { ref }from 'vue'
import ImgList from "@/components/segment/ResultContainer.vue"
import ImgUploader from '@/components/segment/ImgUploader_batch.vue'
import { UploadBatchImg, SegSingleImg, GetSegResult, GetImgByDate } from '@/api/segment/segmentation.js'

const MIN_WIDTH = 400; // 图像分割的建议最小宽度

var ImgUploadRef = ref(null); // 上传的图片
var ImgResult = ref([]); // 分割后获得的图片
var fileList = ref(null);
const thumbnailUrl = ref(null);

var per = ref(0); // 进度条当前百分比
var showProgress = ref(false); // 控制是否展示进度条
var isGlassWall = ref(true); // 是否为玻璃幕墙

const imageWidth = ref(0);
const imageHeight = ref(0);

// 跳转仪表盘页面
const GoToDash = () => {
    router.push({ 
        name: 'layout', 
        params:{ 
            choice:'dashboard' 
        } 
    })
}

// 批量上传图片
const upload = (val) => {
    fileList = val.fileList;
    console.log("num of uploaded images : ", fileList.length);
    let formData = new FormData();
    console.log("fileList : ", fileList);
    for (let i = 0; i < fileList.length; i++) {
        formData.append('image', fileList[i].raw);
        const img = new Image();
        img.onload = () => {
            imageWidth.value = img.width;
            imageHeight.value = img.height;
            // console.log('Width:', img.width, 'Height:', img.height);
        };
        img.src = fileList[i].url;
        if (img.width < MIN_WIDTH) {
            Message.warning("图片宽度小于建议宽度，分割效果可能较差！");
        }
    }
    
    UploadBatchImg(formData)
        .then(function (result) {
            console.log("upload Done", result);
            after_upload(result);
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 改变图片尺寸，用于生成缩略图
function resizeImage(imageSrc, width, height) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
};

// 完成上传后，对图片进行分割和分类并展示结果
const after_upload = async (result) => {
    // 展示进度条
    showProgress.value = true;

    const ImgNum = result.data['images'].length;
    // 处理图片的异步函数
    const processImage = async (index) => {
        let formData = new FormData();
        formData.append('image_id', result.data['images'][index]);
        try {
            var segmentationResponse = await SegSingleImg(formData);
            const labels = segmentationResponse.data['label_list'];
            console.log("Seg Done", segmentationResponse);
            var segmentationResult = await GetSegResult(formData);
            // console.log("fileList[index].url ", fileList[index].url);
            resizeImage(fileList[index].url, 200, 200)
                .then(resizedUrl => {
                    thumbnailUrl.value = resizedUrl;
                    ImgResult.value.push({ 
                        // 被分割图片的路径
                        thumbnail: thumbnailUrl.value, 
                        // 分割得到的标签列表
                        labelList: [...new Set(labels)],
                        // 分割得到的各个图片局部及其标签
                        pictures: labels.map((label, index) => ({ 
                            label: isGlassWall.value ? label : "",
                            image: segmentationResult.data['segmented_image_paths'][index]
                        }))
                    });
                    // console.log(ImgResult.value, 'ImgResult')
                })
                .catch(error => {
                    console.error("Error resizing image:", error);
                });
        } catch (error) {
            console.error("Error in SegSingleImg:", error);
        }

        // 更新进度条
        per.value = parseFloat(((index + 1) * 100.0 / ImgNum).toFixed(1));
        if (index == ImgNum - 1) {
            showProgress.value = false;
        }
        // console.log("per", per);
    };

    // 逐张处理上传的图片
    for (let i = 0; i < ImgNum; i++) {
        await processImage(i);
    }
};

// 取消上传
const cancel = () => {
    ImgResult.value = [];
    showProgress.value = false;
}

const handleSwitchChange = (newValue) => {
  isGlassWall.value = newValue;

  // 调用 ImgUploader 的 onCancel 方法
  ImgUploadRef.value.onCancel();
};

</script>

<style scoped>
    .upload-container{
        position:absolute;
        top:30%;
        left:5%;
    }

    .container {
        /* display: flex; */
        flex-direction: column;
        /* justify-content: space-between; */
        height: 40vh; 
        margin-top: 60px;
    }

    .progress-wrap {
        max-width: 600px;
        margin: 20px auto 0; /* 上面的元素距离 .progress-wrap 的固定距离 */
        flex-direction: column;
        justify-content: space-between;
        object-fit: cover;
        display: flex;
        position: relative;
        top: 0; 
    }


    .result-img-table {
        margin-top: 2%;
    }

    .carousel-container {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        /* height: 100%; */
    }

    .carousel {
        min-height: 600px;
        flex: 1;
    }

    .switch-container {
        position: fixed; /* 设置定位为固定定位 */
        top: 5%; /* 距离页面顶部距离为0 */
        right: 5%; /* 距离页面右侧距离为0 */
        /* 可以添加其他样式，如背景颜色、边框等 */
    }

    /* .switch-container { */
        /* display: flex; */
        /* justify-content: center; */
        /* align-items: center; */
        /* height: 100vh; 或适当的高度 */
    /* } */

    .rounded-box {
        position: relative;
        background-color: #f0f0f0; /* 框的背景颜色 */
        border-radius: 10px; /* 圆角半径 */
        padding: 20px; /* 可根据需要调整内边距 */
        width: 170px;
        height: 80%;
    }

    .left-text,
    .right-text {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px; /* 可根据需要调整文字大小 */
        color: darkgray;
    }

    .left-text {
        left: 10px; /* 左侧提示文字的位置 */
    }

    .right-text {
        right: 10px; /* 右侧提示文字的位置 */
    }
</style>