import axios from 'axios';
import { defineEventHandler } from 'h3';

const BASE_URL = 'https://mock.apifox.com/m1/2979997-2544395-default/api/warn';

export default defineEventHandler(async (event: any) => {
  try {
    // 提取请求参数
    const query = await getQuery(event)
    console.log('query: ', query)


    // 发起GET请求
    const response = await axios.get(`${BASE_URL}/records`, { params: query });
    console.log('server',response);

    // 检查响应状态码
    if (response.status === 200) {
      // 历史数据获取成功
      console.log('api: response', response);
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