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

  export default {
    data() {
      return {
        title: '物流计划历史',
        tableConfig: {
          url: '/procurementPlanItems/histories',
          relations: ["cartonSpec", "procurementPlan", "product"],
          hasNew: false,
          hasDelete: false,
          hasOperation: false,
          hasEdit: false,
          hasExport: true,
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //列表
          columns: [
            {prop: 'product.skuCode', label: 'SKU编码', 'min-width': 150, fixed: 'left'},
            {
              prop: 'procurementPlan.code',
              label: '计划编号',
              'min-width': 120
            },
            {prop: 'procurementPlan.statusName', label: '计划状态', 'min-width': 100},
            {
              prop: 'procurementPlan.name',
              label: '采购计划名称',
              'min-width': 200
            },
            {
              prop: 'product.name',
              label: '产品名称',
              'min-width': 200
            },
            {prop: 'product.groupName', label: '款式', 'min-width': 120},
            {prop: 'cartonSpecCode', label: '箱规', 'min-width': 100},
            {prop: 'numberOfCarton', label: '装箱数', 'min-width': 100},

            {prop: 'qty', label: '计划件数', 'min-width': 100, fixed: 'right'},
            {prop: 'cartonQty', label: '计划箱数', 'min-width': 100, fixed: 'right'},
            phColumns.id,
          ],
          //搜索
          // 搜索
          searchForm: [
            {
              $type: 'select',
              $id: 'procurementPlan_status',
              label: '计划状态',
              $options: phEnumModel.getSelectOptions("ProcurementPlanStatus"),
              $el: {
                op: 'eq',
                size: "mini",
                filterable: true,
                style: 'width:120px',
                placeholder: '请选择状态'
              }
            },
            {
              $type: 'input',
              $id: 'product_skuCode',
              label: 'SKU',
              $el: {
                op: 'bw',
                size: "mini",
                style: 'width:200px',
                placeholder: '请输入产品SKU',
                clearable: true,
                maxlength: "100",
                size: "mini",
                "show-word-limit": true,
              }
            },
            {
              $type: 'input',
              $id: 'product_name',
              label: '产品名称',
              $el: {
                op: 'bw',
                size: "mini",
                style: 'width:200px',
                placeholder: '请输入产品名称',
                clearable: true,
                maxlength: "100",
                size: "mini",
                "show-word-limit": true,
              }
            }
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
