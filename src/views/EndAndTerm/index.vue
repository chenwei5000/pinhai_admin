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
  import warehouseModel from '../../api/warehouse'
  import {checkPermission} from "../../utils/permission";
  import currencyModel from "../../api/currency";
  import cartonspecModel from "../../api/cartonspec";
  import validRules from "../../components/validRules";
  import moment from 'moment';

  export default {
    data() {
      return {
        title: '出入库记录',
        tableConfig: {
          exportFileName: '出入库记录',
          noExportProps: ['结算状态', 'ID'],
          paginationSize: 50,
          //权限控制
          hasNew: false,
          hasEdit: false,
          hasDelete: false,
          hasView: false,
          hasExport: true,

          url: '/report/findBeginEndOfPeriodList',
          countUrl: null,
          relations: [],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          hasOperation: false,
          hasNew: false,
          hasDelete: false,
          'default-sort': "{prop: 'createTime', order: 'descending'}",
          //列表
          columns: [
            {prop: 'formatCreateTime', label: '创建时间', 'min-width': 140, fixed: 'left'},
            {prop: 'warehouse.name', label: '收货仓库', 'min-width': 90},
            {prop: 'code', label: '批次码', 'min-width': 130},
            {prop: 'allocationCode', label: '调拨单', 'min-width': 130},
            {prop: 'typeName', label: '类型', 'min-width': 100},
            /*{prop: 'storageLocation.code', label: '存放货位', 'min-width': 100},*/
            {prop: 'procurementOrder.company.abbreviation', label: '购买方', 'min-width': 100},
            {prop: 'supplier.name', label: '供货商', 'min-width': 100},
            {prop: 'product.skuCode', label: 'SKU编码', 'min-width': 150},
            {prop: 'product.name', label: '产品名', 'min-width': 150},
            {prop: 'numberOfCarton', label: '装箱数', 'min-width': 90},

            {prop: 'currency.name', label: '结算货币', 'min-width': 100, hidden: !checkPermission('PurchasePriceVisible')},
            phColumns.price,
            phColumns.amount,
            phColumns.jobStatus,
            phColumns.id,

            {prop: 'cartonQty', label: '箱数', 'min-width': 90, fixed: 'right'},
            {prop: 'qty', label: '件数', 'min-width': 90, fixed: 'right'},
            {prop: 'usedQty', label: '消耗件数', 'min-width': 90, fixed: 'right'},


          ],
          // 搜索
          searchForm: [
            {
              $type: 'select',
              $id: 'warehouseId',
              label: '仓库',
              $options: warehouseModel.getSelectDomesticAndMaterialOptions(),
              $el: {
                op: 'eq',
                style: 'width:160px',
                filterable: true,
                size: "mini",
                placeholder: '请选择仓库'
              }
            },
            {
              $type: 'date-picker',
              $id: 'reportDate',
              label: '日期',
              $default: `${moment(new Date()).startOf('month').format("YYYY-MM-DD")}|${moment(new Date()).endOf('month').format("YYYY-MM-DD")}`,
              $el: {
                style: 'width:220px',
                op: 'timeRange',
                size: "mini",
                format: 'yyyy-MM-dd',
                'value-format': 'yyyy-MM-dd',
                type: 'daterange',
                'range-separator': '|',
                'start-placeholder': '开始日期',
                'end-placeholder': '结束日期'
              }
            },
            {
              $type: 'input',
              $id: 'skuCode',
              label: 'SKU编码',
              $el: {
                style: 'width:160px',
                op: 'eq',
                size: "mini",
                placeholder: '请输入产品SKU编码'
              }
            },
            {
              $type: 'input',
              $id: 'productName',
              label: '产品名',
              $el: {
                style: 'width:160px',
                op: 'eq',
                size: "mini",
                placeholder: '请输入产品名'
              }
            },
          ],
          //修改或新增
          form: [
            {
              $type: 'select',
              $id: 'currencyId',
              label: '货币',
              $el: {
                filterable: true,
                placeholder: '请选择货币,可筛选',
                size: 'mini'
              },
              $options: currencyModel.getSelectOptions(),
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'price',
              label: '采购价',
              $el: {
                placeholder: '请输入采购价'
              },
              rules: [
                validRules.required,
                validRules.number
              ]
            },
            {
              $type: 'select',
              $id: 'cartonSpecId',
              label: '箱规',
              $el: {
                filterable: true,
                placeholder: '请选择箱规,可筛选',
                size: 'mini'
              },
              $options: cartonspecModel.getSelectOptions(),
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'numberOfCarton',
              label: '装箱数',
              $el: {
                placeholder: '请输入装箱数'
              },
              rules: [
                validRules.required,
                validRules.integer
              ]
            },
            {
              $type: 'input',
              $id: 'qty',
              label: '件数',
              $el: {
                placeholder: '请输入装箱数'
              },
              rules: [
                validRules.required,
                validRules.integer
              ]
            },
            {
              $type: 'input',
              $id: 'usedQty',
              label: '冲销数量',
              $el: {
                placeholder: '请输入冲销数量'
              },
              rules: [
                validRules.required,
                validRules.integer
              ]
            },
          ]
        }
      }
    },
    computed: {},
    methods: {
      statusClassName({row}) {
        return '';
      },
    },
    watch: {}
  }
</script>

<style scoped>


</style>
