import axios from 'axios';
import Qs from 'qs';

const BASE_URL = 'https://qupap.cn:8082/mdss-web';
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  transformRequest: [data => Qs.stringify(data)],
  withCredentials: true
});

instance.interceptors.request.use(config => {
  return config;
});

instance.interceptors.response.use(response => {
  if (response.status !== 200) {
    console.error(`接口报错了 - ${response.status}`);
    return Promise.reject(`
      ------------- 接口报错 -------------
        ${response}
      ------------- ------- -------------
    `);
  }
  return Promise.resolve(response.data.data);
});
export { BASE_URL };

export default instance;
