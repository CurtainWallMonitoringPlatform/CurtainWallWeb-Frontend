import axios from 'axios'

const baseURL = 'http://111.231.168.12:8080'
// const baseURL = 'http://43.142.78.122:8000';
// const baseURL = 'http://124.220.110.93:5045/api'
// const baseURL = '/';

const request = axios.create({  // 创建axios实例
    baseURL: baseURL,
    timeout: 50000
})

export default request;