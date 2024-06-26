<template>
  <div class="page">
    <!-- 搜索栏 -->
    <div class="search-container">
      <el-input
        v-model="filterKeyword"
        placeholder="请输入邮箱"
        class="input-with-select"
      >
      </el-input>
      <el-select v-model="selectedPermission" placeholder="请选择权限" class="input-with-option">
        <el-option
          v-for="item in permissions"
          :key="item"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button @click="handlePermissionChange(true)" class="input-with-button"> 开启权限 </el-button>
      <el-button @click="handlePermissionChange(false)" class="input-with-button"> 关闭权限 </el-button>
    </div>

    <div class="table_container">
      <el-table
        border
        :data="itemList"
        style="width: 100%"
        :table-layout="auto"
      >
        <!-- <el-table-column prop="id" label="ID"></el-table-column> -->
        <!-- <el-table-column prop="username" label="Name"></el-table-column> -->
        <el-table-column prop="email" label="Email"></el-table-column>
        <el-table-column label="是否为管理员">
          <template #default="{ row }">
            <el-switch
              v-model="row.is_superuser"
              @change="() => handleSwitchChange(row, 'is_superuser','table')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="3D模型权限" prop="access_system_a">
          <template #default="{ row }">
            <el-switch
              v-model="row.access_system_a"
              @change="() => handleSwitchChange(row, 'access_system_a','table')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="石材污渍权限" prop="access_system_b">
          <template #default="{ row }">
            <el-switch
              v-model="row.access_system_b"
              @change="() => handleSwitchChange(row, 'access_system_b','table')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="石材裂缝权限" prop="access_system_c">
          <template #default="{ row }">
            <el-switch
              v-model="row.access_system_c"
              @change="() => handleSwitchChange(row, 'access_system_c','table')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="玻璃自爆检测权限" prop="access_system_d">
          <template #default="{ row }">
            <el-switch
              v-model="row.access_system_d"
              @change="() => handleSwitchChange(row, 'access_system_d','table')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="风振数据权限" prop="access_system_e">
          <template #default="{ row }">
            <el-switch
              v-model="row.access_system_e"
              @change="() => handleSwitchChange(row, 'access_system_e','table')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="幕墙材质分割权限" prop="access_system_f">
          <template #default="{ row }">
            <el-switch
              v-model="row.access_system_f"
              @change="() => handleSwitchChange(row, 'access_system_f','table')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="玻璃平整度权限" prop="access_system_g">
          <template #default="{ row }">
            <el-switch
              v-model="row.access_system_g"
              @change="() => handleSwitchChange(row, 'access_system_g','table')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="幕墙韧性评估权限" prop="access_system_g">
          <template #default="{ row }">
            <el-switch
              v-model="row.access_system_h"
              @change="() => handleSwitchChange(row, 'access_system_h','table')"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import axios from "axios";

const filterKeyword = ref("");

const selected_item = ref("1");

const selectedPermission = ref("");

const permissions = [
  {
    value: 'is_superuser',
    label: '是否为管理员',
  },
  {
    value: 'access_system_a',
    label: '3D模型权限',
  },
  {
    value: 'access_system_b',
    label: '石材污渍权限',
  },
  {
    value: 'access_system_c',
    label: '石材裂缝权限',
  },
  {
    value: 'access_system_d',
    label: '玻璃内爆检测权限',
  },
  {
    value: 'access_system_e',
    label: '风振数据权限',
  },
  {
    value: 'access_system_f',
    label: '幕墙材质分割权限',
  },
  {
    value: 'access_system_g',
    label: '玻璃平整度权限',
  },
  {
    value: 'access_system_h',
    label: '幕墙韧性评估权限',
  },
]

const handlePermissionChange = async (isEnabled) => {
  const item = { email: filterKeyword.value, [selectedPermission.value]: isEnabled };
  await handleSwitchChange(item, selectedPermission.value,"email");
};

const handleSelect = (key, keyPath) => {
  console.log(key, keyPath);
};

const itemList = ref([]);

const handleSwitchChange = async (item, key, updatemethod) => {
  // 判断是否为管理员并且管理员权限不可更改，仅可更改管理员权限
  if (item.is_superuser && key !== 'is_superuser') {
    ElMessage.warning("管理员固定获得全部权限，不可修改");
    await nextTick(); 
    item[key] = !item[key];
    return; // 提前返回，不执行更多操作
  }
  const dataToSend = {
    [item.email]: {
      // 使用动态键名设置邮箱地址
      [key]: item[key], // 设置对应权限的新值
      method: updatemethod,
    },
  };
  try {
    const response = await $fetch("/api/account/super/updatePermission", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: dataToSend,
    });
    ElMessage.success("权限修改成功");
    setTimeout(() => {
        location.reload();
      }, 1000);
  } catch (error) {
    console.error(error);
    if(updatemethod == "email"){
      ElMessage.error("邮箱不存在，或权限已满足要求，无需修改");
    }
    else{
      ElMessage.error("权限修改出错");
    }
  }
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

const getAllPermission = async () => {
  try {
    const authToken = localStorage.getItem("authToken");
    const response = await axios.get("/api/account/super/getAllPermissions", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (response.status === 200) {
      console.log("Permissions:", response);
      itemList.value = Object.entries(response.data.data).map(
        ([email, permissions]) => ({
          email,
          ...permissions, // 把所有权限展开成为单独的属性
        })
      );
      // console.log(itemList.value)
    } else {
      console.error("Failed to fetch permissions:", response);
      ElMessage.error("获取权限失败");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error("Error:", message);
      ElMessage.error(message);
    } else {
      console.error("Unexpected error:", error);
      ElMessage.error("未预料到的错误");
    }
  }
};
getAllPermission();
</script>

<style scoped>
.input-with-select {
  width: 400px; /* 调整输入框宽度 */
}
.input-with-option {
  width: 200px; /* 调整选择框宽度 */
}
.input-with-button {
  background-color: RGB(64,158,255); /* 设置按钮背景色为蓝色 */
  color: white; /* 设置按钮文字颜色为白色 */
  margin-left: 10px; /* 设置按钮与左侧元素的距离为10px */
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
  overflow: auto;
  height: 85vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
