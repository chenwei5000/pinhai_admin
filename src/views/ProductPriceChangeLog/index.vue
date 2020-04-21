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

  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import {checkPermission} from "../../utils/permission";

  export default {
    name: '产品价格历史',
    data() {
      return {
        title: '产品价格历史',

        tableConfig: {
          //权限控制
          hasNew: checkPermission('ProdcutPriceChangeLogResource_create'),
          hasEdit: checkPermission('ProdcutPriceChangeLogResource_update'),
          hasDelete: checkPermission('ProdcutPriceChangeLogResource_remove'),
          // hasView: checkPermission('ProdcutPriceChangeLogResource_get'),
          hasExportTpl: checkPermission('ProdcutPriceChangeLogResource_export'),
          hasExport: checkPermission('ProdcutPriceChangeLogResource_export'),
          hasImport: checkPermission('ProdcutPriceChangeLogResource_import'),

          url: '/productPriceChangeLogs',
          relations: ["operator", "product","action","procurementOrder","oldCurrency","newCurrency"],
          hasNew: false,
          hasEdit: false,
          hasView: false,
          hasDelete: false,
          hasOperation: true,
          tableAttrs: {},
          //paginationSize: 50,

          columns: [
            phColumns.id,
            {prop: 'actionId', label: '操作ID', hidden: true, "min-width": 150},
            {prop: 'productId', label: '产品ID', hidden: true, "min-width": 120},
            {prop: 'procurementOrderId', label: '采购单ID', hidden: 'false', "min-width": 120},
            {prop: 'operatorId', label: '操作者ID', hidden: 'false', "min-width": 120},
            {prop: 'newCurrencyId', label: '新的货币', hidden: 'false', "min-width": 120},
            {prop: 'oldCurrencyId', label: '旧的货币', hidden: 'false', "min-width": 120},
            {prop: 'actionName', label: '操作', "min-width": 60},
            {prop: 'product.skuCode', label: 'SKU编码', "min-width": 100},
            {prop: 'product.name', label: '产品名', "min-width": 120},
            {prop: 'procurementOrder.code', label: '采购单编码', sortable: 'custom', "min-width": 120},
            {prop: 'priceChange', label: '价格变化', "min-width": 80},
            {prop: 'operator.name', label: '操作者', "min-width": 40},
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            {
                $type: 'input',
                $id: 'product__skuCode',
                label: 'SKU编码',
                $el: {
                  op: 'bw',
                  size:"mini",
                    placeholder: '请输入SKU编码'
                }
            },
            phSearchItems.status()
          ],
        }
      }
    },
    methods: {},
    watch: {},
    computed: {}
  }

</script>

<style scoped>


</style>
