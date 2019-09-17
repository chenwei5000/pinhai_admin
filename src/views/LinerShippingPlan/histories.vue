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
  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'

  export default {
    data() {
      return {
        title: '出口计划历史',
        tableConfig: {
          url: '/linerShippingPlanItems/histories',
          relations: ["cartonSpec", "linerShippingPlan", "product"],
          hasNew: false,
          hasDelete: false,
          hasOperation: false,
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //列表
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'linerShippingPlan.formatEtdTime', label: '开船日', 'min-width': 120, sortable: true, 'sort-orders': ['descending', 'ascending', ]},
            {prop: 'linerShippingPlan.statusName', label: '货柜状态', 'min-width': 120},
            {prop: 'linerShippingPlan.type', label: '物流方式', 'min-width': 100},
            {prop: 'linerShippingPlan.portOfLoading', label: '发货港', 'min-width': 100},
            {prop: 'linerShippingPlan.shipmentId', label: 'FBA ID', 'min-width': 120},
            {prop: 'linerShippingPlan.referenceId', label: 'Reference ID', 'min-width': 100},
            {prop: 'linerShippingPlan.fromWarehouse.name', label: '收货仓库', 'min-width': 100},
            {prop: 'linerShippingPlan.destinationFulfillmentCenterId', label: '仓库标识', 'min-width': 100},
            {prop: 'product.skuCode', label: 'SKU编码', 'min-width': 200},
            {prop: 'numberOfCarton', label: '装箱数', 'min-width': 100},
            {prop: 'qty', label: '发货件数', 'min-width': 100},
            {prop: 'cartonQty', label: '发货箱数', 'min-width': 100},
          ],
          //搜索

          //修改或新增

        }
      }
    },
    computed: {},
    methods: {
      statusClassName({row}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      },
    },
    watch: {}
  }
</script>

<style scoped>


</style>
