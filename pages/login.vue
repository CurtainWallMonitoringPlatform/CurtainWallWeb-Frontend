<!-- 登录页面 -->
<template>
  <div class="page">
    <!-- 登录表单 -->
    <div v-if="showLoginForm">
      <form @submit.prevent="login">
        <el-form class="form1">
          <h2>欢迎！请登录您的账户</h2>
          <el-form-item>
            <el-input
              v-model="loginForm.email"
              placeholder="邮箱"
              required
              @keydown.enter="focusNextInput"
              ref="inputEmail"
            />
          </el-form-item>

          <el-form-item>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              required
              @keydown.enter="login"
              ref="inputPassword"
            />
          </el-form-item>

          <el-form-item @click="login">
            <el-button>登录</el-button>
          </el-form-item>

          <el-form-item style="position: absolute; top: 80%">
            <p
              @click="toggleForm"
              style="color: rgb(193, 193, 193); cursor: pointer"
            >
              没有账户？点击注册
            </p>
          </el-form-item>
        </el-form>
      </form>
    </div>

    <!-- 注册表单 -->
    <div v-else>
      <form @submit.prevent="register">
        <el-form class="form2">
          <h2>欢迎！请输入注册信息</h2>
          <el-form-item>
            <el-input
              v-model="registerForm.email"
              placeholder="邮箱"
              required
              ref="inputEmail"
            />
          </el-form-item>

          <el-form-item>
            <el-input v-model="registerForm.code" placeholder="验证码" required>
              <template #suffix>
                <button
                  @click.prevent="sendVerificationCode"
                  :disabled="disableButton"
                  style="color: white; background-color: lightgrey"
                >
                  {{ buttonText }}
                </button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="输入密码"
              required
              ref="inputPassword"
            />
          </el-form-item>

          <el-form-item>
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="确认密码"
              required
              ref="inputPassword"
            />
          </el-form-item>

          <el-form-item>
            <el-button @click="register">注册</el-button>
          </el-form-item>

          <el-form-item style="position: absolute; top: 85%">
            <p
              @click="toggleForm"
              style="color: rgb(193, 193, 193); cursor: pointer"
            >
              已有账户？点此登录
            </p>
          </el-form-item>
        </el-form>
      </form>
    </div>
    <!-- <el-button @click="GoToLayout">点击跳转排版页面</el-button> -->
  </div>
</template>

<script setup>
import userService from "@/server/api/user.js";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElLoading } from "element-plus";
// import store from '@/store/index.js'

// const GoToLayout = () => {
//   router.push({
//     name: 'layout',
//     params: {
//       choice: 'dashboard'
//     }
//   })
// }

const router = useRouter();
const showLoginForm = ref(true);
const userStore = userService;
const inputEmail = ref(null);
const inputPassword = ref(null);

const loginForm = ref({
  email: "",
  password: "",
});

const registerForm = ref({
  email: "",
  code: "",
  password: "",
});

const focusNextInput = () => {
  inputPassword.value.focus();
};

//todo: 暂时不发请求，需要统一api，先直接写死
const login = async () => {
  let loadingInstance = null;
  try {
    loadingInstance = ElLoading.service({
      lock: true,
      text: "正在登录...",
      background: "rgba(0, 0, 0, 0.7)",
    });
    const response = await $fetch("/api/account/login", {
      method: "POST",
      body: {
        username: loginForm.value.email,
        password: loginForm.value.password,
      },
    });
    if (loadingInstance) loadingInstance.close();
    if (response.authentication) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("email", loginForm.value.email);
      console.log("authToken stored:", localStorage.getItem("authToken"));
      router.push({ path: "/" });
    } else {
      console.log("登陆失败");
      ElMessage.error("登录失败，请检查您的用户名和密码。");
    }
  } catch (error) {
    console.error(error);
    ElMessage.error(error.message || "登录过程中发生错误");
  }
};

const disableButton = ref(false);
const buttonText = ref("发送验证码");
const countdown = ref(60);

const sendVerificationCode = async () => {
  if (disableButton.value) {
    return;
  }
  try {
    const response = await $fetch("/api/account/sendCode", {
      method: "POST",
      body: { email: registerForm.value.email },
    });
    if (response) {
      disableButton.value = true;
      startCountdown();
    }
  } catch (error) {
    console.error(error);
    ElMessage.error(error.message || "验证码发送错误");
  }
};

const startCountdown = () => {
  const countdownInterval = setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      clearInterval(countdownInterval);
      resetCountdown();
    } else {
      buttonText.value = `${countdown.value} 秒后重试`;
    }
  }, 1000);
};

const resetCountdown = () => {
  countdown.value = 60;
  disableButton.value = false;
  buttonText.value = "发送验证码";
};

const register = async () => {
  try {
    const response = await $fetch("/api/account/validate", {
      method: "POST",
      body: {
        email: registerForm.value.email,
        code: registerForm.value.code,
        password: registerForm.value.password,
      },
    });
    if (response) {
      toggleForm;
    }
  } catch (error) {
    console.error(error);
    ElMessage.error(error.message || "注册错误");
  }

  // 实现注册逻辑
  // const success = await userStore.register(
  //   registerForm.value.email,
  //   registerForm.value.code,
  //   registerForm.value.password
  // );

  // if (success) {
  //   toggleForm;
  // }
};

const logout = () => {
  // 实现退出登录逻辑
  userStore.clearUserInfo();
};

const toggleForm = () => {
  showLoginForm.value = !showLoginForm.value;
};

onMounted(() => {
  // userStore.clearUserInfo()
});

definePageMeta({
  layout: false,
});
</script>

<style scoped>
.page {
  background-image: url("/assets/images/background.png");
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}

.form1 {
  position: absolute;
  color: white;
  top: 35%;
  left: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-form-item + .el-form-item {
  margin-top: 20px;
  /* 设置间距大小 */
}

.el-input {
  height: 28px;
  width: 250px;
}

/*搜索组件最外层div */
.input_box {
  margin-right: 15px;
}

/*搜索input框 */
:deep(.el-input__wrapper) {
  background-color: white;
  /*覆盖原背景颜色，设置成透明 */
  border-radius: 5px;
  width: 550px;
  height: 40px;
  border-color: black;
}

.el-button {
  height: 37px;
  width: 198px;
  background-color: rgb(4, 4, 80);
  color: white;
  border-color: transparent;
}

.el-button:hover {
  background-color: rgb(6, 6, 117);
  color: white;
  border-color: transparent;
}

.form2 {
  position: absolute;
  color: white;
  top: 25%;
  left: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
