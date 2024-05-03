<template>
  <div class="page">
    <!-- 搜索栏 -->
    <div class="search-container">
      <el-input
        v-model="filterKeyword"
        placeholder="请输入关键字搜索"
        class="input-with-select"
      >
        <template #append>
          <el-button @click="searchAction">
            搜索
          </el-button>
        </template>
      </el-input>
    </div>

    <div class="table_container">
      <el-table border :data="itemList" style="width: 100%" :table-layout="auto">
        <!-- <el-table-column prop="id" label="ID"></el-table-column> -->
        <!-- <el-table-column prop="username" label="Name"></el-table-column> -->
        <el-table-column prop="email" label="Email"></el-table-column>
        <el-table-column label="是否为管理员">
          <template #default="{ row }">
            <el-switch
              v-model="row.is_superuser"
              @change="() => handleSwitchChange(row, 'is_superuser')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="3D模型权限" prop="access_system_a">
          <template #default="{ row }">
            <el-switch
              v-model="row.access_system_a"
              @change="() => handleSwitchChange(row, 'access_system_a')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="污渍裂缝识别权限" prop="access_system_b">
          <template #default="{ row }">
            <el-switch
              v-model="row.access_system_b"
              @change="() => handleSwitchChange(row, 'access_system_b')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="玻璃自爆权限" prop="access_system_c">
          <template #default="{ row }">
            <el-switch
              v-model="row.access_system_c"
              @change="() => handleSwitchChange(row, 'access_system_c')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="玻璃幕墙分割权限" prop="access_system_d">
          <template #default="{ row }">
            <el-switch
              v-model="row.access_system_d"
              @change="() => handleSwitchChange(row, 'access_system_d')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="异常风振数据权限" prop="access_system_e">
          <template #default="{ row }">
            <el-switch
              v-model="row.access_system_e"
              @change="() => handleSwitchChange(row, 'access_system_e')"
            ></el-switch>
          </template> 
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { GetAuth, updateUserPermissions } from "@/server/api/public.js";


const filterKeyword = ref("");

const selected_item = ref("1");

const handleSelect = (key, keyPath) => {
  console.log(key, keyPath);
};

const itemList = ref([]);

const handleSwitchChange = (item, key) => {
  const dataToSend = {
    [item.email]: { // 使用动态键名设置邮箱地址
      [key]: item[key] // 设置对应权限的新值
    }
  };
  updateUserPermissions(dataToSend)
    .then(function (result) {
      console.log(result.data);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {});
};

const formData = reactive({
  // 用 reactive，而不用 ref
  keyword: "",
});

onMounted(() => {
  // 绑定监听事件
  nextTick(() => {
    window.addEventListener("keydown", enterDown);
  });
});

const enterDown = async () => {
  if (!formData.keyword) {
    Message.error("请输入用户关键词！");
    return;
  }
  //进行搜索操作
};

//发送请求
GetAuth()
  .then(function (result) {
    // itemList.value = result.data.users;
    itemList.value = Object.entries(result.data).map(([email, permissions]) => ({
        email, 
        ...permissions // 把所有权限展开成为单独的属性
      }));
    console.log(itemList.value);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(() => {
    // loading.value = false;
  });
</script>

<style scoped>
.input-with-select {
  width: 500px; /* 调整输入框宽度 */
}

.page {
  background-size: cover;
  height: 100%;
  width: 100%;
}

.table_container {
  display: flex;
  justify-content: center;
  margin: 2em;
}

.search-container {
  display: flex;
  justify-content: center;
  margin: 1em;
}

/*搜索组件最外层div */
.input_box {
  margin-right: 15px;
  border-radius: 50%;
}

/*搜索input框 */
:deep(.el-input__wrapper) {
  border-radius: 95px;
  height: 40px;
  border-color: black;
  margin-right: 1em;
}

/*搜索button按钮 */
:deep(.el-input-group__append) {
  background: #2a3f75;
  border-radius: 15%;
  border: 0;
  color: white;
}

</style>
