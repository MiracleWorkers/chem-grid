# chem-grid

## features

- Generate table by Schema
- Use slot customize table column
- Column permissions
- Rich interactive operation

## install

```bash
npm install chem-grid --save
```

## how use

```javascript
import chemGrid from 'chem-grid';
import Axios from './axios';

Vue.use(chemGrid, {
  tagName: 'chemGrid',
  httpInstance: Axios,
  sortProperty: 'query_order_by'
});
```

### install config

```js
{
  // 组件名字
  tagName: "chem-grid", // default
  // ...
  httpInstance: null,
  // 请求中排序字段
  sortProperty: "query_order_by", // default
  // 接口返回Schema
  resSchema: {
    list: 'customPageList',  // 接口用于显示数据的字段
    total: 'customTotal',    // 接口用于显示合计信息字段
    page: 'page',            // 接口用于显示分页信息的字段
    count: 'totalItem'       // 分页信息中总计多少条的字段
  },
  // 存储localStorage中表格的前缀 - 防止命名冲突
  salt: 'chem_grid'
}
```

### props

| Prop      | 描述           | 值                                 |
| --------- | -------------- | ---------------------------------- |
| config    | schema 配置    | 下面有 config 详细介绍             |
| params    | 请求参数       | \{\}                               |
| auth      | 权限信息       | \{ columns: \[\], buttons; \[\] \} |
| totalInfo | 自定义统计信息 | \{\}                               |

### event

| Name        | 描述               | 参数    |
| ----------- | ------------------ | ------- |
| row\-select | row 被双击或者回车 | rowData |

### methods

| Name    | 描述         | 参数                                    |
| ------- | ------------ | --------------------------------------- |
| refresh | 刷新表格数据 | isReset:boolean \- 是否重置分页和选择项 |
| setData | 设置表格数据 | source:Record<string, any>\[\]          |
| getData | 获取表格数据 |                                         |

#### config

| Name          | 描述                                                         | 值                      |
| ------------- | ------------------------------------------------------------ | ----------------------- |
| id            | 【必填】表格唯一标识，主要用户存储在 localStorage 表格的名字 | null                    |
| rowKey        | 行的唯一标识                                                 | id                      |
| hasPage       | 是否显示分页                                                 | true                    |
| isInitialData | 初始化时是否自动加载表格数据                                 | true                    |
| sortable      | 是否开启排序功能                                             | true                    |
| multiple      | 是否开启 checkbox 选择                                       | false                   |
| showIndex     | 是否显示行序号                                               | true                    |
| url           | 表格数据源 \- 详情看下面介绍                                 | null                    |
| pipe          | 接口请求成功后对数据进行再处理                               | Function\(data\)        |
| sortConfig    | 排序功能传递的参数                                           | \['desc', 'asc', null\] |
| pageCount     | 分页器显示按钮的个数                                         | 7                       |
| items         | 【必填】每个列的配置                                         | null                    |

##### items

| Name      | 描述                                                 | 值                        |
| --------- | ---------------------------------------------------- | ------------------------- |
| column    | 列对应的后端字段                                     | string                    |
| label     | 列显示的名字                                         | string                    |
| width     | 列的默认宽度                                         | 200                       |
| sortable  | 列是否能排序                                         | true                      |
| slot      | 列自定义显示 \- 使用作用域插槽，值为 model 和\$index | string                    |
| formatter | 列的值格式化                                         | Function\(value,rowData\) |
| pin       | 列的固定                                             | left, right, null         |
| hide      | 列的隐藏                                             | false                     |
| buttons   | 最后一列显示的按钮配置                               | null                      |

##### buttons

| Name  | 描述         | 值                         |
| ----- | ------------ | -------------------------- |
| label | 按钮文字     | string                     |
| auth  | 按钮权限字段 | string                     |
| show  | 按钮是否显示 | boolean                    |
| click | 按钮点击函数 | Function\(rowData, index\) |

---

### url 介绍

chem-grid 默认要求使用 axios 来请求数据，在进行组件全局安装时需要将 axios 封装后的实例配置上去

```js
import axiosInstance from './http';

Vue.use({
  httpInstance: axiosInstance
});
```

如何才能配置 url 让表格获取值？ 参照现在常用的 http 管理方式，这里提供了三种场景，尽量满足大家使用

1. axios 简单封装 - （基础路径、拦截器等...）
2. 自己封装的函数进行请求
3. 对接口统一 Schema 配置，对 axios 实现 get,post 等请求封装

#### 1. axios 的简单封装

```js
// 1. 定义axios实例
import axios from 'axios';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  withCredentials: true
});

instance.interceptors.request.use(config => {
  // ... 请求拦截
});

instance.interceptors.response.use(response => {
  // ... 响应拦截
});

// 2. 在url中使用
const tableConfig = {
  url: '/getUserList'
  // ...
};
```

#### 2. 自己封装函数

该方式不必在全局安装时配置 httpInstance 选项

```js
import axios from './axiosInstance';
// 1. 自定义请求函数
const getUserList = params => {
  return axios.get('/getUserList', params);
};

// 2. 使用
import { getUserList } from '@/http/UserApi';
const tableConfig = {
  url: getUserList
};
```

#### 3. 对接口统一 Schema 配置，对 axios 实现 get,post 等请求封装 - 推荐

该方式能更好的管理后端接口，并通过接口 schema 配置来实现更多的功能， 如接口白名单、黑名单等自定义操作

```js
// 1. 接口统一管理 - user.js
export default {
  getUserList: {
    url: '/getUserList',
    type: 'get',
    title: '获取用户列表'
    // ... other set
  }
  // .. other api
};

// 2. axios根据配置 - axiosInstance.js
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

// 3. 使用
const tableConfig = {
  url: 'getUserList'
};
```
