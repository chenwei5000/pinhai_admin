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
  import {parseTime} from '@/utils'
  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFormItems from '../../components/phFromItems'
  import {checkPermission} from "../../utils/permission";

  export default {
    name: 'ReleaseLogResource_menu',
    data() {
      return {
        title: '系统更新日志列表',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('ReleaseLogResource_create'),
          hasEdit: checkPermission('ReleaseLogResource_update'),
          hasDelete: checkPermission('ReleaseLogResource_remove'),
          // hasView: checkPermission('ReleaseLogResource_get'),
          hasExportTpl: checkPermission('ReleaseLogResource_export'),
          hasExport: checkPermission('ReleaseLogResource_export'),
          hasImport: checkPermission('ReleaseLogResource_import'),

          url: '/releaseLogs',
          relations: ["creator"],
          tableAttrs: {
            "default-sort": {prop: 'releaseTime', order: 'descending'}, //设置默认排序
          },
          columns: [
            {width: 30,type: checkPermission('ReleaseLogResource_remove') ? 'selection' : '', hidden: !checkPermission('ReleaseLogResource_remove')},
            {
              prop: 'releaseTime',
              label: '发版日期',
              sortable: 'custom',
              width: 120,
              fixed: 'left',
              formatter: row => {
                return parseTime(row.releaseTime, '{y}-{m}-{d}');
              }
            },
            {prop: 'version', label: '系统版本', sortable: 'custom', 'min-width': 120},
            {prop: 'caption', label: '更新说明', sortable: 'custom', 'min-width': 400},
            phColumns.status,
            phColumns.id,
            phColumns.lastModified
          ],
          //搜索栏
          searchForm: [
            {
              $type: 'input',
              $id: 'version',
              label: '版本',
              $el: {
                op: 'bw',
                size:"mini",
                placeholder: '请输入版本'
              }
            },
            phSearchItems.status()
          ],
          //添加或修改弹出栏
          form: [
            {
              $type: 'date-picker',
              $id: 'releaseTime',
              label: '发版日期',
              $el: {
                valueFormat: 'timestamp',
                placeholder: '请选择日期'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'version',
              label: '系统版本',
              $el: {
                placeholder: '请输入版本，like v1.2.1'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'caption',
              label: '更新说明',
              $el: {
                type: 'textarea',
                autosize: {minRows: 6, maxRows: 10}
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
    methods: {},
    watch: {}
  }
</script>

<style scoped>

</style>
