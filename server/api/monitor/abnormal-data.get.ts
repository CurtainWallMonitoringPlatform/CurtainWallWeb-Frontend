import axios from 'axios';
import { defineEventHandler } from 'h3';

const BASE_URL = 'http://111.231.168.12:8180/api/monitor';

export default defineEventHandler(async (event: any) => {
  try {
    // 提取请求参数
    const query = await getQuery(event)
    console.log('query: ', query)

    // 进行数据验证 ...
    // 可以添加一些验证逻辑，确保接收到的数据是有效的

    // 发起GET请求
    const response = await axios.get(`${BASE_URL}/abnormal-data`, { params: query });

    // 检查响应状态码
    if (response.status === 200) {
      // 历史数据获取成功
      return response.data;
    } else {
      // 获取历史数据失败
      throw new Error('Failed to get abnormal-data');
    }
  } catch (error: any) {
    // 设置状态码并返回错误信息
    event.res.statusCode = error.response?.status || 500;
    return { error: error.message };
  }
});
