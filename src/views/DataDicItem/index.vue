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
        title: '数据字典',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('DataDicItemResource_create'),
          hasEdit: checkPermission('DataDicItemResource_update'),
          hasDelete: checkPermission('DataDicItemResource_remove'),
          // hasView: checkPermission('DataDicItemResource_get'),
          hasExportTpl: checkPermission('DataDicItemResource_export'),
          hasExport: checkPermission('DataDicItemResource_export'),
          hasImport: checkPermission('DataDicItemResource_import'),

          url: '/dataDicItems',
          tableAttrs: {
            "row-class-name": this.statusClassName
          },

          //工具按钮
          maxUploadCount: 1, //导出一次提交一个请求
          tplNoExportProps: ['操作', '修改时间', 'ID', '创建人', '状态'],
          exportFileName: '数据字典列表',
          hasExportTpl: true,
          hasExport: true,
          hasImport: true,

          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'type', label: '字典类型', sortable: 'custom', 'min-width': 100},
            {prop: 'name', label: '字典类型名称', sortable: 'custom', 'min-width': 100},
            {prop: 'valueId', label: '字典值ID', 'min-width': 100},
            {prop: 'valueName', label: '字典值名称', 'min-width': 100},
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            {
              $type: 'input',
              $id: 'name',
              label: '字典类型名称',
              $el: {
                op: 'bw',
                size:"mini",
                placeholder: '请输入字典类型名称',
                clearable: true,
                maxlength: "40",
                size: "mini",
                "show-word-limit": true,
              }
            },
            {
              $type: 'input',
              $id: 'valueName',
              label: '字典值名',
              $el: {
                op: 'bw',
                size:"mini",
                placeholder: '请输入字典值名称',
                clearable: true,
                size: "mini",
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
              $id: 'type',
              label: '字典类型',
              $el: {
                placeholder: '请输入字典类型',
                clearable: true,
                maxlength: "40",
                "show-word-limit": true,
              },
              rules: [
                validRules.required
              ]
            },
            phFormItems.name(40),
            {
              $type: 'input',
              $id: 'valueId',
              label: '字典值ID',
              $el: {
                placeholder: '请输入字典值ID',
                clearable: true,
                maxlength: "40",
                "show-word-limit": true,
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'valueName',
              label: '字典值',
              $el: {
                placeholder: '请输入字典值',
                clearable: true,
                maxlength: "40",
                "show-word-limit": true,
              },
              rules: [
                validRules.required
              ]
            },
            phFormItems.status()
          ],
          //提交后执行
          afterConfirm: () => {
            this.$store.commit('app/SET_DATADICS', null)
          }
        }
      }
    },

    computed: {},
    // 各种相关方法定义
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
