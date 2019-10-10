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
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        title: '费用管理',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('CostManagementResource_create'),
          hasEdit: checkPermission('CostManagementResource_update'),
          hasDelete: checkPermission('CostManagementResource_remove'),
          // hasView: checkPermission('CostManagementResource_get'),
          hasExportTpl: checkPermission('CostManagementResource_export'),
          hasExport: checkPermission('CostManagementResource_export'),
          hasImport: checkPermission('CostManagementResource_import'),

          url: '/costManagements',
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          columns: [
            {type: 'selection'},
            {prop: 'costType', label: '费用类型', fixed: 'left',"min-width": 100},
            {prop: 'costName', label: '费用名称', hidden: 'false', "min-width": 100},
            phColumns.status,
            phColumns.id,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            {
              $type: 'input',
              $id: 'costType',
              label: '费用类型',
              $el: {
                op: 'bw',
                placeholder: '请输入费用',
                size:"mini",
                clearable: true,
                maxlength: "40",
                "show-word-limit": true,
              }
            },
            phSearchItems.status()
          ],
          //  弹窗表单, 用于新增与修改
          form: [
            {
              $type: 'input',
              $id: 'costType',
              label: '费用类型',
              $el: {
                placeholder: '请输入费用类型'
              },
              rules: [
                validRules.required,
              ]
            },
            phFromItems.status()
          ],
          //提交后执行
          afterConfirm: () => {
          }
        }
      }
    },
    computed: {},

    methods: {
      // 状态样式
      statusClassName({row}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      },
    },

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>

</style>
