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

          url: '/warehouseStocks/stocks', // 资源URL
          countUrl: '/count',
          relations: ["warehouse"],//关联数据字典
          hasView: false,
          hasOperation: false,

          tableAttrs: {},
          columns: [
            {prop: 'warehouseName', label: '仓库', 'min-width': 150},
            {prop: 'skuCode', label: 'SKU编码', 'min-width': 200, fixed: 'left'},
            {prop: 'productName', label: '产品名', 'min-width': 250},
            {prop: 'cartonSpecCode', label: '箱规', 'min-width': 150},
            {prop: 'numberOfCarton', label: '装箱数', width: 100},
            {prop: 'qty', label: '库存件数', width: 100},
            {prop: 'cartonQty', label: '库存箱数', fixed: 'right', width: 100}
          ],

          searchForm: [
            phSearchItems.warehouseId(),
            phSearchItems.skuCode
          ]
        }
      }
    },

    computed: {},

    methods: {},

    watch: {}
  }
</script>

<style scoped>

</style>
