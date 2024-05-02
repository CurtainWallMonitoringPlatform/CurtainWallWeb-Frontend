<template>
  <el-container class="result-container">
    <el-col :gutter="20" justify="start">
      <div class="carousel-item">
        <!-- <el-row :span="24" class="first-card-col"> -->

          <div class="thumbnail-wrap">
            <img :src="data.thumbnail" alt="缩略图加载失败">
            <div class="label-wrap">
              <UCheckbox v-for="(label, index) in data.labelList" :key="index" :label="label" border size="mini" checked="true"/>
              <!-- </UCheckbox> -->
              <el-checkbox-group v-if="isGlass" v-model="selectedLabels" class="label-group">
              <el-checkbox v-for="(label, index) in data.labelList" :key="index" :label="label" border size="mini" checked="true">
                {{ label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          </div>
        <!-- </el-row> -->
        <!-- <el-row :span="24" class="result-gallery-col" style="" v-loading="isload"> -->
          
          <div class="image-wrap">
            <el-card v-for="imageInfo in filteredImages" :key="imageInfo" :span="calculateSpan()" class="image-card">
              <img :src="imageInfo.image" class="image" alt="图片加载失败" />
              <div class="label">{{ imageInfo.label }}</div>
            </el-card>
          </div>
          <!-- <el-col class="resultrow" :gutter="20" justify="start"> -->
          <!-- </el-col> -->
        <!-- </el-row> -->
      </div>
      
      
    </el-col>
  </el-container>
</template>
  
  <script setup>
  import { ref, defineProps, computed, onMounted, watch } from 'vue';
  import { ElCheckbox, ElRow, ElCard, ElCheckboxGroup } from 'element-plus';
import { UCheckbox } from '#build/components';

  const isload = ref(false);
  
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
    isGlass: {
      type: Boolean,
      required: true,
    }
  });
  
  // const images = computed(() => props.data.pictures);
  // const labels = computed(() => props.data.labels);
  // const thumbnail = computed(() => props.data.thumbnail);
  // console.log("THUMBNAIL: ", thumbnail);
  
  // const uniqueLabels = computed(() => [...new Set(labels.value)]);
  const selectedLabels = ref([]); // Initially select all labels
  
  const calculateSpan = () => {
    // Adjust the span based on the available space and image size
    const screenWidth = window.innerWidth;
    const cardWidthPercentage = 0.7; // Adjust this based on the desired width percentage
    const cardWidth = screenWidth * cardWidthPercentage;
    const minSpan = 1;
    const maxSpan = Math.floor(screenWidth / cardWidth);
    return Math.max(minSpan, Math.min(maxSpan, maxSpan));
  };
  
  const filteredImages = ref(props.data.pictures.filter(imageInfo => selectedLabels.value.includes(imageInfo.label)));

  watch([() => selectedLabels.value, () => props.data.pictures], () => {
    filteredImages.value = props.data.pictures.filter(imageInfo => selectedLabels.value.includes(imageInfo.label));
  });

  // const isVisible = (imageInfo) => {
  //   // Check if the image should be visible based on the selected labels
  //   return (
  //     selectedLabels.value.includes(imageInfo.label)
  //   );
  // };
  
  // const filteredImages = computed(() => {
  //   // Generate unique identifiers for each image and filter based on selected labels
  //   return images.value.map((src, index) => ({
  //     id: `image_${index}`,
  //     src,
  //     label: labels[index],
  //   })).filter(isVisible);
  // });
  
  onMounted(() => {
    // Trigger a refresh when the component is mounted to ensure correct initial visibility
    // selectedLabels.value = [...uniqueLabels.value];
    filteredImages.value = props.data.pictures;
  });


  </script>
  
  <style scoped>
  /* Add your styling here */
  .result-gallery {
    margin-left: 12%; /* Adjust the left margin to shift the result to the right */
  }
  
  .label-group {
    margin-bottom: 10px;
  }
  
  .resultrow {
    margin: 20px 0; /* Add spacing between images and the page edges */
  }
  
  .image-card {
    margin-bottom: 20px; /* Add spacing between images */
    margin-right: 20px; /* Add a right offset */
    max-width: 16%;
    max-height: 65%;
  }
  
  .image {
    width: 100%;
    height: auto;
  }
  
  .label {
    text-align: center;
  }
  
  /* Button style modification */
  .el-checkbox__inner {
    background-color: white !important;
  }

  .result-container {
    overflow: hidden;
    height:100%;

  }
  .carousel-item {
    display: flex;
    height: 100%;
    overflow: hidden;
    .thumbnail-wrap {
      margin-left: 100px;
      margin-right: 20px;
    }
    .label-wrap {
      /* max-width: 60px; */
      margin: 0 20px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 20px;
      .el-checkbox {
        margin-bottom: 20px;
        margin-right: 5px;
      }
    }
    .image-wrap {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      height: 100%;
      overflow-y: auto;
    }

  }

  </style>
  