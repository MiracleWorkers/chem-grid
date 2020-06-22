# chem-grid

## 安装

```bash
npm install chem-grid --save
```

## 使用

```javascript
import chemGrid from 'chem-grid';
import Axios from './axios'; // 数据请求的实例

Vue.use(chemGrid, {
  tagName: 'chemGrid',
  httpInstance: Axios,
  sortProperty: 'query_order_by'
});
```
