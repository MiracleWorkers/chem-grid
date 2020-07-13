<template>
  <div>
    <!-- <x-table
      ref="table"
      style="width:100%;height: 400px"
      :config="tableConfig"
      :params="tableParams"
      :auth="tableAuth"
      @row-select="handleRowSelect"
    ></x-table> -->
    <x-table ref="table" style="width:800px;height: 400px" :config="tableConfig2" :params="tableParams2">
      <template #commodity_num="{model, $index}">
        <div style="height: 60px">{{ model.commodity_num }} - {{ $index }}</div>
      </template>
    </x-table>
  </div>
</template>

<script>
import { fetch } from './http/index';
export default {
  data() {
    return {
      tableAuth: {
        columns: [
          { code: 'company_name', name: '门店名称11111' },
          { code: 'handle', name: '操作' }
        ],
        buttons: ['edit', 'look']
      },
      tableParams: {
        menu_id: '84112ae0cac0a44cb08e74ee8200eed6',
        pageSize: -2
      },
      tableConfig: {
        id: 'purch_dev',
        multiple: false,
        // infiniteScroll: true,
        url: '/pri/other_storage/get_goodseat_commodity_detail',
        items: [
          { column: 'company_name', label: '门店名称' },
          { column: 'commodity_no', label: '商品编号' },
          { column: 'approval_no', label: '国药准字' },
          { column: 'is_sale_able', label: '停售状态' },
          { column: 'locking_status', label: '可疑锁定状态' },
          { column: 'commodity_name', label: '商品名称' },
          { column: 'size', label: '国药准字' },
          { column: 'approval_no', label: '规格' },
          { column: 'drug_dosage', label: '剂型' },
          { column: 'package_piece', label: '件包装' },
          { column: 'package_medium', label: '中包装' },
          { column: 'package_number', label: '件数' },
          { column: 'customer_name', label: '供货单位' },
          { column: 'manufacturer_name', label: '生产厂家' },
          { column: 'bar_code', label: '商品条码' },
          { column: 'batch_no', label: '批号' },
          { column: 'manufacture_date', label: '生产日期' },
          { column: 'in_storage_date', label: '入库时间' },
          { column: 'repertory_name', label: '仓库' },
          { column: 'goodseat_no', label: '货位' },
          { column: 'total_num', label: '库存数量' },
          { column: 'memory_num', label: '可销库存' },
          { column: 'freeze_num', label: '冻结库存' },
          { column: 'unit', label: '单位' },
          { column: 'pur_price', label: '采购单价' },
          { column: 'kc_price_sum', label: '库存金额' },
          { column: 'sale_price', label: '销售单价' },
          { column: 'price_c', label: '会员价' },
          { column: 'price_a', label: '价格一' },
          { column: 'price_b', label: '价格二' },
          { column: 'storage_condition', label: '存储条件' },
          { column: 'is_split', label: '是否拆零' },
          { column: 'is_overdue', label: '库存状态' },
          { column: 'rec_user_name', label: '收货人' },
          { column: 'che_user_name', label: '验收人' },
          {
            column: 'handle',
            label: '操作',
            pin: 'right',
            width: 120,
            buttons: [
              {
                label: '查看',
                auth: 'look',
                click: () => {
                  this.FLAG_BUTTON = false;
                }
              },
              { label: '编辑', auth: 'edit', click: () => {} }
            ]
          }
        ]
      },
      tableParams2: {
        pageSize: 500
      },
      FLAG_BUTTON: true
    };
  },
  computed: {
    tableConfig2() {
      return {
        id: 'purch_pro',
        multiple: true,
        // url: '/pri/purchase_plan/get_purchase_plan_detail',
        url: fetch,
        items: [
          { column: 'contract_purchase_time', label: '日期' },
          { column: 'contract_purchase_no', label: '采购订单号' },
          { column: 'common_name', label: '商品名称' },
          { column: 'size', label: '规格' },
          { column: 'drug_dosage', label: '剂型' },
          { column: 'customer_name', label: '供货单位' },
          { column: 'manufacturer_name', label: '生产厂家' },
          { column: 'unit', label: '单位' },
          { column: 'commodity_num', label: '数量', slot: 'commodity_num' },
          { column: 'commodity_price', label: '采购单价' },
          { column: 'commodity_sum', label: '金额' },
          { column: 'tax_rate', label: '进项税率(%)' },
          { column: 'tax_price', label: '去税单价' },
          { column: 'tax_sum', label: '去税金额' },
          { column: 'tax_amount', label: '税额' },
          { column: 'price_retail', label: '建议零售价' },
          { column: 'package_piece', label: '件包装' },
          { column: 'purchasing_agent_name', label: '制单人' },
          { column: 'remark', label: '备注' },
          { column: 'num_of_income', label: '已收货数量' },
          { column: 'num_of_check', label: '已验收数量' },
          { column: 'commodity_possessor', label: '上市许可持有人' }
        ]
      };
    }
  },
  methods: {
    handleRowSelect(data) {
      console.log(data);
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    setInifinteTableData(params) {
      const updateData = data => {
        const dataSource = {
          rowCount: null,
          getRows: function(params) {
            setTimeout(function() {
              const rowsThisPage = data.slice(params.startRow, params.endRow);
              let lastRow = -1;
              if (data.length <= params.endRow) lastRow = data.length;
              params.successCallback(rowsThisPage, lastRow);
            }, 500);
          }
        };

        params.api.setDatasource(dataSource);
      };

      updateData(
        Array.from({ length: 50 }, (_, index) => ({
          athlete: index + 1,
          age: Math.round(Math.random() * 100),
          country: 'China'
        }))
      );
    }
  }
};
</script>
