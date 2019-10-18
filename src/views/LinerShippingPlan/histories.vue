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
  import {checkPermission} from "../../utils/permission";
  import phEnumModel from '@/api/phEnum'
  import harbourModel from '@/api/harbour'

  export default {
    data() {
      return {
        title: '出口计划历史',
        tableConfig: {
          url: '/linerShippingPlanItems/histories',
          relations: ["cartonSpec", "linerShippingPlan", "product", "linerShippingPlan.fromWarehouse"],
          hasNew: false,
          hasDelete: false,
          hasOperation: false,
          hasEdit: false,
          hasExport: checkPermission('LinerShippingPlanResource_listShipmentItems'),
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //列表
          columns: [
            phColumns.id,
            {
              prop: 'linerShippingPlan.formatEtdTime',
              label: '开船日',
              'min-width': 120,
              sortable: true,
              'sort-orders': ['descending', 'ascending',]
            },
            {prop: 'product.skuCode', label: 'SKU编码', 'min-width': 200},
            {prop: 'linerShippingPlan.statusName', label: '货柜状态', 'min-width': 120},
            {prop: 'linerShippingPlan.type', label: '物流方式', 'min-width': 100},
            {prop: 'linerShippingPlan.portOfLoading', label: '发货港', 'min-width': 100},
            {prop: 'linerShippingPlan.shipmentId', label: 'FBA ID', 'min-width': 120},
            {prop: 'linerShippingPlan.fromWarehouse.name', label: '收货仓库', 'min-width': 100},
            {prop: 'linerShippingPlan.destinationFulfillmentCenterId', label: '仓库标识', 'min-width': 100},
            {prop: 'numberOfCarton', label: '装箱数', 'min-width': 100},
            {prop: 'qty', label: '发货件数', 'min-width': 100},
            {prop: 'cartonQty', label: '发货箱数', 'min-width': 100},
            {prop: 'linerShippingPlan.referenceId', label: 'Reference ID', 'min-width': 100},
          ],
          //搜索
          // 搜索
          searchForm: [
            {
              $type: 'date-picker',
              $id: 'linerShippingPlan_etdTime',
              label: '开船日',
              $el: {
                style: 'width:200px',
                op: 'timeRange',
                size: "mini",
                placeholder: '开始日期',
                size: 'mini',
                format: 'yyyy-MM-dd',
                'value-format': 'yyyy-MM-dd',
                type: 'daterange',
                'range-separator': '-',
                'start-placeholder': '开始日期',
                'end-placeholder': '结束日期'
              }
            },
            {
              $type: 'select',
              $id: 'linerShippingPlan_status',
              label: '货柜状态',
              $options: phEnumModel.getSelectOptions("LinerShippingPlanStatus"),
              $el: {
                op: 'eq',
                size: "mini",
                filterable: true,
                style: 'width:120px',
                placeholder: '请选择货柜状态'
              }
            },
            {
              $type: 'select',
              $id: 'linerShippingPlan_portOfLoading',
              label: '发货港口',
              $options: harbourModel.getSelectOptions(),
              $el: {
                op: 'eq',
                size: "mini",
                filterable: true,
                style: 'width:120px',
                placeholder: '请选择发货港口'
              }
            },

            {
              $type: 'input',
              $id: 'product_skuCode',
              label: 'SKU',
              $el: {
                op: 'bw',
                size:"mini",
                style: 'width:200px',
                placeholder: '请输入产品SKU',
                clearable: true,
                maxlength: "40",
                size: "mini",
                "show-word-limit": true,
              }
            },
            {
              $type: 'input',
              $id: 'linerShippingPlan_shipmentId',
              label: 'FBA ID',
              $el: {
                op: 'bw',
                size:"mini",
                style: 'width:150px',
                placeholder: '请输入FBA ID',
                clearable: true,
                maxlength: "40",
                size: "mini",
                "show-word-limit": true,
              }
            },
            {
              $type: 'input',
              $id: 'linerShippingPlan_destinationFulfillmentCenterId',
              label: '仓库标识',
              $el: {
                op: 'bw',
                size:"mini",
                style: 'width:120px',
                placeholder: '请输入仓库标识',
                clearable: true,
                maxlength: "40",
                size: "mini",
                "show-word-limit": true,
              }
            },


          ],

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
