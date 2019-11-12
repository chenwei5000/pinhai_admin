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
  import phFormItems from '../../components/phFromItems'
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        title: '物流方式列表',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('ShippingMethodResource_create'),
          hasEdit: checkPermission('ShippingMethodResource_update'),
          hasDelete: checkPermission('ShippingMethodResource_remove'),
          // hasView: checkPermission('ShippingMethodResource_get'),
          hasExportTpl: checkPermission('ShippingMethodResource_export'),
          hasExport: checkPermission('ShippingMethodResource_export'),
          hasImport: checkPermission('ShippingMethodResource_import'),

          url: '/shippingMethods',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          columns: [
            {width: 30, type: checkPermission('ShippingMethodResource_remove') ? 'selection' : '', hidden: !checkPermission('ShippingMethodResource_remove')},
            {prop: 'name', label: '名称', sortable: 'custom', 'min-width': 100, fixed: 'left'},
            {prop: 'code', label: '编码', sortable: 'custom', 'min-width': 100},
            phColumns.creator,
            phColumns.status,
            phColumns.id,
            phColumns.lastModified
          ],
          //搜索栏
          searchForm: [
            phSearchItems.name,
            phSearchItems.code,
            phSearchItems.status()
          ],
          //修改或添加弹窗栏
          form: [
            {
              $type: 'input',
              $id: 'name',
              label: '物流方式',
              $el: {
                placeholder: '请输入物流方式名称'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'code',
              label: '编码',
              $el: {
                placeholder: '请输入编码'
              },
              rules: [
                validRules.required
              ]
            },
            phFormItems.status()
          ]
        }
      }
    },
    computed: {},
    methods: {
      statusClassName({row, rowIndex}) {
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
