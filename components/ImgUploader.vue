<!-- 单张图片上传逻辑 -->
<!-- 具体需要调用的api在方法uploadPicture里使用 -->
<template>
    <!-- 图片选择框 -->
    <el-row class="upload-container" >
      
      <el-upload 
        ref="uploadRef"
        :class="uploadClass"
        action="''"  
        list-type="picture-card"
        :auto-upload="false"
        :on-remove="handleRemove"
        :on-preview="handlePreview"
        :on-change="handleChange"
        :show-file-list="isSelectedShow"
      >

        <el-icon><Plus />
        </el-icon>

        <template #tip v-if="uploadClass === 'showUpload'">
          <div class="el-upload__tip">
            请上传png/jpg文件
          </div>
        </template>

      </el-upload>

      <!-- 插槽可见 -->
      <el-dialog v-model="dialogVisible" height="705px">
          <div class="picture-container">
            <img w-full :src="dialogImageUrl" alt="Preview Image" class="picture" />
          </div>
      </el-dialog>

    </el-row>

    <!-- 保存修改 -->
    <el-row class="upload-container" style="margin:20px 0 0 0">
        <el-button type="primary" @click="uploadPicture" class="btn">上传图片</el-button>
        <el-button type="info" @click="onCancel" class="btn">取消选择</el-button>
    </el-row>
</template>
  
<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElUpload, ElIcon, ElButton,ElDialog, ElRow  } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const emit = defineEmits(['uploadPicture','onCancel']);//定义传值给父组件的方法

const dialogImageUrl = ref('')  //上传图片的url

const dialogVisible = ref(false) //缩略图是否可见

const uploadRef = ref(null) //对el-upload的引用

const fileList = reactive([]) //选择的图片列表

const isSelectedShow = ref(true) //是否显示上传的图片列表

//el-upload类，根据fileList的大小选择是否显示上传框
const uploadClass = computed(()=>{
  return fileList.length >=1 ? 'hideUpload':'showUpload';
})

// 选择图片后操作：
const handleChange = (File) =>{
  const isPNG = File.raw.type === 'image/png';  //文件类型png
  const isJPG = File.raw.type === 'image/jpeg';  //文件类型png
  // const isLt = File.raw.size / 1024 / 1024 < 2;// 文件大小转换为MB单位,判断是否小于2MB

  // 文件格式错误
  if(!isPNG && !isJPG) 
  {
    ElMessage.error('上传图片只能是PNG/JPG格式!');
    uploadRef.value.clearFiles();//调用el-upload的clearFiles()函数清空已经选择的文件列表
    isSelectedShow.value = false;  //不显示上传的文件列表
    return false;
  }
  // 文件过大
  // else if(!isLt){
  //   ElMessage.error('上传图片大小不能超过5MB!');
  //   uploadRef.value.clearFiles();  //调用el-upload的clearFiles()函数清空已经选择的文件列表
  //   isSelectedShow.value = false;  //不显示上传的文件列表
  //   return false;
  // }
  else
  {
    fileList.push(File);     //将新选择的文件File加入fileList中
    isSelectedShow.value = true;   //显示上传的文件列表
    return true;
  }
}

// 图片预览
const handlePreview = (uploadFile) =>{
  dialogImageUrl.value = uploadFile.url;//图片链接
  dialogVisible.value = true;//el-dialog插槽可见
}

// 取消选择
const handleRemove = () =>{
  fileList.splice(0, 1);//删除fileList的第一个元素
}

// 上传图片到后端数据库
const uploadPicture = () =>{
  // 获取文件列表
  if(fileList.length < 1){
    ElMessage('请选择一张图片！');
    return;
  }

  //传给父组件的数据
  let param ={
      fileList: fileList,
  }
  //传递给父组件
  emit('uploadPicture',param);
}

// 取消选择
const onCancel = () =>{
  fileList.splice(0, 1);//删除fileList的第一个元素
  uploadRef.value.clearFiles();//调用el-upload的clearFiles()函数清空已经选择的文件列表
  emit('onCancel');
};

</script>



<style>
  .hideUpload .el-upload--picture-card {
    display: none;   
  }


  .hideUpload .el-upload-list--picture-card .el-upload-list__item-thumbnail{
    width:100%;
    height:100%;
    object-fit: cover;
    object-position: center;
  }

  .upload-container .showUpload .el-upload__tip{
    /* color:white; */
    text-align: center;
  }

  .uploadClass,
  .el-upload-list--picture-card .el-upload-list__item {
    width: 15vw;
    height: 15vw;
  }
</style>
  
<style scoped>
  .picture-container {
    margin:0 auto; 
    width:30vw;
    height:30vw;
    overflow: hidden; /* 隐藏超出容器的部分 */
  }

   .picture-container .picture {
    /* display: block; */
    width:100%;
    height:100%;
    object-fit:contain;
    object-position: center;
  }

  .upload-container{
    display: flex;
    object-fit:contain;
    justify-content: center;
    align-items: center;
  }

  .btn{
    color:rgb(255, 255, 255);
  }
</style>
  