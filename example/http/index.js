import axios from 'axios';
import Qs from 'qs';

const BASE_URL = 'https://qupap.cn:8082/mdss-web';

// 方式一: 原生axios，默认get
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

// 方式二: 将axios封装成函数
const fetch = params => {
  return instance('/pri/purchase_plan/get_purchase_plan_detail', {
    params: { ...params }
  });
};

// 方式三，通过配置文件，推荐
const userConfig = {
  getAllUser: {
    url: '/pri/purchase_plan/get_purchase_plan_detail',
    title: '获取全部用户信息',
    type: 'get'
  }
};

const http = (name, data) => {
  const targetApi = userConfig[name];
  const params = {
    url: targetApi.url,
    method: targetApi.type
  };
  if (targetApi.type === 'get') {
    params['params'] = data;
  }
  if (targetApi.type === 'post') {
    params['data'] = data;
  }
  return instance(params);
};

export { BASE_URL, instance, fetch, http };
