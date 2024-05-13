import axios from "axios";
import { defineEventHandler, readBody } from "h3";

const BASE_URL = "http://127.0.0.1:8000/account";

export default defineEventHandler(async (event: any) => {
  try {
    console.log("login");
    // 提取请求参数
    const body = await readBody(event);
    console.log("Received:", body);

    // 发起请求
    const response = await axios.post(`${BASE_URL}/login`, {
      username: body.email,
      password: body.password,
    });

    if (response.status === 200) {
      // 登陆成功，返回认证信息给客户端
      console.log("Login successful, token:", response.data.token);
      return {
        authToken: response.data.token,
        email: body.email,
      };
    } else {
      console.error("Login failed:", response);
      return {
        error: "Login failed with status: " + response.status,
      };
    }
  } catch (error: any) {
    // 设置状态码并返回错误信息
    event.res.statusCode = error.response?.status || 500;
    return { error: error.message };
  }
});
