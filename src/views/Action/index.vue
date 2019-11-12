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
  import {parseTime} from '@/utils'
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        title: '操作列表',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('ActionResource_create'),
          hasEdit: checkPermission('ActionResource_update'),
          hasDelete: checkPermission('ActionResource_remove'),
          // hasView: checkPermission('ActionResource_get'),
          hasExportTpl: checkPermission('ActionResource_export'),
          hasExport: checkPermission('ActionResource_export'),
          hasImport: checkPermission('ActionResource_import'),

          url: '/actions',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName,
          },

          //工具按钮
          maxUploadCount: 20, //提交数量
          exportFileName: '操作列表',


          columns: [
            {width: 30,type: checkPermission('ActionResource_remove') ? 'selection' : '', hidden: !checkPermission('ActionResource_remove')},
            {prop: 'id', label: 'ID', sortable: 'custom', hidden: false, 'min-width': '300', fixed: 'left'},
            {prop: 'resource', label: '资源标识', sortable: 'custom', 'min-width': 120},
            {prop: 'method', label: '行为动作', 'min-width': 100},
            {prop: 'title', label: '行为说明', 'min-width': 200},
            phColumns.status,
            {
              prop: 'formatLastModified',
              label: '修改时间',
              width: 140
            }
          ],
          //搜索栏
          searchForm: [
            {
              $type: 'input',
              $id: 'id',
              label: 'ID',
              $el: {
                op: 'eq',
                placeholder: '请输入ID',
                size:"mini",
                maxlength: "100",
                size: "mini",
                "show-word-limit": true,
                clearable: true
              }
            },
            {
              $type: 'input',
              $id: 'resource',
              label: '资源标识',
              $el: {
                op: 'bw',
                size:"mini",
                placeholder: '请输入资源标识',
                maxlength: "20",
                size: "mini",
                "show-word-limit": true,
                clearable: true
              }
            },
            phSearchItems.status()
          ],
          //添加或修改弹出栏
          form: [
            {
              $type: 'input',
              $id: 'id',
              label: 'ID',
              $el: {
                placeholder: '请输入操作ID'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'resource',
              label: '资源标识',
              $el: {
                placeholder: '请输入资源标识'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'method',
              label: '行为动作',
              $el: {
                placeholder: '请输入行为动作'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'title',
              label: '操作标题',
              $el: {
                placeholder: '请输入操作标题'
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
