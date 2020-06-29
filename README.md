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
}
```

### props

| Prop   | 描述        |
| ------ | ----------- |
| config | schema 配置 |
| params | 请求参数    |
| auth   | 权限信息    |

### event

| Name        | 描述               | 参数    |
| ----------- | ------------------ | ------- |
| row\-select | row 被双击或者回车 | rowData |

### methods

| Name    | 描述         | 参数                                    |
| ------- | ------------ | --------------------------------------- |
| refresh | 刷新表格数据 | isReset:boolean \- 是否重置分页和选择项 |
| setData | 设置表格数据 | source:Record<string, any>\[\]          |
