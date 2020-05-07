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
  import harbourModel from '../../api/harbour'
  import shippingMethodModel from '../../api/shippingMethod'
  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'
  import {checkPermission} from "../../utils/permission";

  export default {
    name: 'FreightTimeResource_menu',
    data() {
      return {
        title: '货运时间配置',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('FreightTimeResource_create'),
          hasEdit: checkPermission('FreightTimeResource_update'),
          hasDelete: checkPermission('FreightTimeResource_remove'),
          // hasView: checkPermission('FreightTimeResource_get'),
          hasExportTpl: checkPermission('FreightTimeResource_export'),
          hasExport: checkPermission('FreightTimeResource_export'),
          hasImport: checkPermission('FreightTimeResource_import'),

          url: '/freightTimes',
          relations: ["sourceHarbour", "shippingMethod", "destinationHarbour"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //列表
          columns: [
            {
              width: 30,
              type: checkPermission('FreightTimeResource_remove') ? 'selection' : '',
              hidden: !checkPermission('FreightTimeResource_remove')
            },
            {prop: 'sourceHarbour.name', label: '发货港口', 'min-width': 120},
            {prop: 'shippingMethod.name', label: '物流方式', 'min-width': 120},
            {prop: 'destinationHarbour.name', label: '收货港口', 'min-width': 120},
            {prop: 'spendDays', label: '物流时间(天)', 'min-width': 100},
            phColumns.status,
            phColumns.id,
            phColumns.lastModified
          ],
          //搜索
          searchForm: [
            {
              $type: 'select',
              $id: 'sourceHarbourId',
              label: '发货港口',
              $options: harbourModel.getSelectOptions(),
              $el: {
                op: 'eq',
                size: "mini",
                style: "width:130px",
                placeholder: '请选择发货港口'
              }
            },
            {
              $type: 'select',
              $id: 'shippingMethodId',
              label: '物流方式',
              $options: shippingMethodModel.getSelectOptions(),
              $el: {
                op: 'eq',
                size: "mini",
                style: "width:130px",
                placeholder: '请选择物流方式'
              }
            },
            {
              $type: 'select',
              $id: 'destinationHarbourId',
              label: '收货港口',
              $options: harbourModel.getSelectOptions(),
              $el: {
                op: 'eq',
                size: "mini",
                style: "width:130px",
                placeholder: '请输入收货港口'
              }
            },
            phSearchItems.status()
          ],
          //修改或新增
          form: [
            {
              $type: 'select',
              $id: 'sourceHarbourId',
              label: '发货港口',
              $el: {
                placeholder: '请选择'
              },
              $options: harbourModel.getSelectOptions(),
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'select',
              $id: 'shippingMethodId',
              label: '物流方式',
              $el: {
                placeholder: '请选择'
              },
              $options: shippingMethodModel.getSelectOptions(),
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'select',
              $id: 'destinationHarbourId',
              label: '收货港口',
              $el: {
                placeholder: '请选择'
              },
              $options: harbourModel.getSelectOptions(),
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'spendDays',
              label: '物流时间',
              $el: {
                placeholder: '请输入物流天数'
              },
              rules: [
                validRules.required,
                validRules.number
              ]
            },
            phFromItems.status()
          ]
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
