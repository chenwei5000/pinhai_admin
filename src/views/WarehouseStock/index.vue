<template>
  <div class="app-container">
    <div class="ph-card">
      <div class="ph-card-body">
        <ph-table
          v-bind="tableConfig"
        >
        </ph-table>
      </div>
    </div>


  </div>
</template>

<script>
  import phSearchItems from '../../components/phSearchItems'
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        title: '仓库库存',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('WarehouseStockResource_create'),
          hasEdit: checkPermission('WarehouseStockResource_update'),
          hasDelete: checkPermission('WarehouseStockResource_remove'),
          // hasView: checkPermission('WarehouseStockResource_get'),
          hasExport: checkPermission('WarehouseStockResource_export'),
          hasImport: false,
          hasExportTpl: false,

          exportFileName: '库存明细',

          url: '/warehouseStocks/stocks', // 资源URL
          countUrl: '/count',
          relations: ["warehouse"],//关联数据字典
          hasView: false,
          hasOperation: false,

          tableAttrs: {
            "show-summary" : true,
            "summary-method" : this.getSummaries
          },
          columns: [
            {prop: 'skuCode', label: 'SKU编码', 'min-width': 200, fixed: 'left'},
            {prop: 'warehouseName', label: '仓库', 'min-width': 150},
            {prop: 'productName', label: '产品名', 'min-width': 220},
            {prop: 'cartonSpecCode', label: '箱规', 'min-width': 150},
            {prop: 'numberOfCarton', label: '装箱数', width: 90},
            {prop: 'qty', label: '库存件数', width: 90},
            {prop: 'cartonQty', label: '库存箱数', fixed: 'right', width: 90}
          ],

          searchForm: [
            phSearchItems.warehouseDomesticId(),
            phSearchItems.skuCode
          ]
        }
      }
    },

    computed: {},

    methods: {
      /*汇总数据*/
      getSummaries(param) {

        const {columns, data} = param;
        const sums = [];

        columns.forEach((column, index) => {
          if (column.property == 'skuCode') {
            const values = data.map(item => item[column.property]);
            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);
            sums[index] = '合计: ' + sums[index] + ' 行';
          }

          if (column.property == 'cartonQty') {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 箱';
            } else {
              sums[index] = 'N/A';
            }
          }

          if (column.property == 'qty') {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 件';
            } else {
              sums[index] = 'N/A';
            }
          }

        });

        return sums;
      },

    },

    watch: {}
  }
</script>

<style scoped>

</style>
