import axios from 'axios'

const baseURL = 'http://47.120.50.113:8090';

const Request = axios.create({  // 创建axios实例
    baseURL: baseURL,
    timeout: 50000
})

Request.interceptors.request.use(config => {
   return config 
}, err => {
  Promise.reject(err)
})

Request.interceptors.response.use(
  (res) => {
    // console.log(res);
    return Promise.resolve(res);
  },
  (err) => {
    const errorResponse = err.response;
    console.log(errorResponse.data.message)
    if (errorResponse) {
      console.error('Error response:', errorResponse);
      return Promise.reject(errorResponse.data);
    } else {
      console.error('Request error:', err.message);
      return Promise.reject({
        error: true,
        message: err.message,
      });
    }
  }
);

export default Request;