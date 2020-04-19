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
  import warehouseModel from "../../api/warehouse";
  import {currency} from "../../utils";

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
          relations: ["warehouse", "cartonSpec"],//关联数据字典
          hasView: false,
          hasOperation: false,

          tableAttrs: {
            "show-summary" : true,
            "summary-method" : this.getSummaries
          },
          columns: [
            {prop: 'skuCode', label: 'SKU编码', 'min-width': 200, fixed: 'left'},
            {prop: 'fnSku', label: 'FN-SKU', 'min-width': 100},
            {prop: 'warehouseName', label: '仓库', 'min-width': 150},
            {prop: 'productName', label: '产品名', 'min-width': 220},
            {prop: 'cartonSpecCode', label: '箱规', 'min-width': 150},
            {prop: 'numberOfCarton', label: '装箱数', width: 90},
            {prop: 'volume', label: '体积(m³)', 'min-width': 100, align: "center"},
            {prop: 'qty', label: '库存件数', width: 90},
            {prop: 'cartonQty', label: '库存箱数', fixed: 'right', width: 90}
          ],

          searchForm: [
            {
              $type: 'select',
              $id: 'warehouseId',
              label: '仓库',
              $el: {
                op: 'eq',
                size: "mini",
                filterable: true,
                placeholder: '请选择仓库'
              },
              $options: warehouseModel.getSelectDomesticAndMaterialOptions(),
            },
            {
              $type: 'input',
              $id: 'skuCode',
              label: 'SKU编码',
              $el: {
                op: 'eq',
                size: "mini",
                placeholder: '请输入SKU编码'
              }
            },
            {
              $type: 'input',
              $id: 'fnSku',
              label: 'FNSKU',
              $el: {
                op: 'eq',
                size: "mini",
                style: "width:120px;",
                placeholder: '请输入FNSKU编码'
              }
            },
            {
              $type: 'input',
              $id: 'productName',
              label: '产品名',
              $el: {
                op: 'bw',
                size: "mini",
                placeholder: '请输入产品名'
              }
            }
          ]
        }
      }
    },

    computed: {},

    filters: {
      currency: currency
    },

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

          if (column.property == 'volume') {
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
              sums[index] = currency(sums[index]) + ' m³';
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
