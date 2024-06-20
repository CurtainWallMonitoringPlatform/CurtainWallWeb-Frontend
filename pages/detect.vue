<template>
  <div class="upload-container">
    <el-upload class="upload-demo" drag action="http://localhost:8080/upload" multiple @success="handleUploadSuccess">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖动文件至区域内或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 50MB
        </div>
      </template>
    </el-upload>
  </div>
  <el-row :gutter="10">
    <el-col :span="3">
      <div class="center-button">
        <el-button type="primary" @click="fetchData">
          开始检测
          <el-icon class="el-icon--right">
            <Upload />
          </el-icon>
        </el-button>
      </div>
      <div class="grid-content ep-bg-purple" />
    </el-col>
    <el-col :span="21">
      <el-progress :percentage="progressPercentage" status="success" />
      <div class="grid-content ep-bg-purple" />
    </el-col>
  </el-row>
  <div class="demo-image">
    <div v-if="showTable">
      <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="图片编号" width="180" />
        <el-table-column label="原图">
          <template #default="scope">
            <el-image style="width: 100%; height: 100%" :src="scope.row.name" :fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="标注图">
          <template #default="scope">
            <el-image style="width: 100%; height: 100%" :src="scope.row.mark_photo" :fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="num_photo" label="幕墙块编号" />
        <el-table-column label="幕墙块原图">
          <template #default="scope">
            <el-image style="width: 100%; height: 100%" :src="scope.row.pre_photo" :fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="幕墙块识别图">
          <template #default="scope">
            <el-image style="width: 100%; height: 100%" :src="scope.row.result_photo" :fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="area" label="污渍总面积" />
      </el-table>
    </div>
  </div>
</template>

<style>
.center-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.upload-container {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100vh;
  /* 使容器高度占满视口高度 */
}

.upload-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d9d9d9;
  padding: 20px;
  border-radius: 8px;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>

<script lang="ts" setup>
import type { TableColumnCtx } from "element-plus";
import { ref } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { Upload } from "@element-plus/icons-vue";
import axios from "axios";

const tableData = ref([]);
const showTable = ref(false); // 控制是否显示表格的标志

const imageUrl = ref(""); // 用于存储上传后的图片路径
const progressPercentage = ref(0); //进度条响应变量

const fetchData = async () => {
  try {
    const response = await axios.get("http://localhost:8080/tabledata");
    // console.log(response.data);
    tableData.value = response.data;
    showTable.value = true; // 显示表格
    // 如果当前进度已经为 100%，则不再执行
    if (progressPercentage.value === 100) {
      return;
    }

    // 模拟进度增长
    const intervalId = setInterval(() => {
      // 增加进度值
      progressPercentage.value += 1;
      // 当进度达到 100% 时清除计时器
      if (progressPercentage.value === 100) {
        clearInterval(intervalId);
      }
    }, 50); // 每 100 毫秒增加一次进度值
  } catch (error) {
    console.error("Error fetching data from backend:", error);
  }
};

const handleUploadSuccess = (response, file, fileList) => {
  // 上传成功后，从响应数据中获取图片路径
  imageUrl.value = response.url; // 假设响应数据中的图片路径字段为"url"，根据实际情况修改
};

interface Photo {
  id: string;
  name: string;
  mark_photo: string;
  num_photo: string;
  pre_photo: string;
  result_photo: string;
  area: string;
}

interface SpanMethodProps {
  row: Photo;
  column: TableColumnCtx<Photo>;
  rowIndex: number;
  columnIndex: number;
}

const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
    if (rowIndex === 0) {
      return {
        rowspan: 5,
        colspan: 1,
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
};

// const tableData: Photo[] = [
//   {
//     id: "12987122",
//     name: "Tom",
//     mark_photo: "234",
//     num_photo: "3.2",
//     pre_photo: 10
//   },
//   {
//     id: "12987123",
//     name: "Tom",
//     mark_photo: "165",
//     num_photo: "4.43",
//     pre_photo: 12
//   },
//   {
//     id: "12987124",
//     name: "Tom",
//     mark_photo: "324",
//     num_photo: "1.9",
//     pre_photo: 9
//   },
//   {
//     id: "12987125",
//     name: "Tom",
//     mark_photo: "621",
//     num_photo: "2.2",
//     pre_photo: 17
//   },
//   {
//     id: "12987126",
//     name: "Tom",
//     mark_photo: "539",
//     num_photo: "4.1",
//     pre_photo: 15
//   },
// ];
</script>
