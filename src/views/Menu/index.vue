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
    name: 'MenuResource_menu',
    data() {
      return {
        title: '菜单列表',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('MenuResource_create'),
          hasEdit: checkPermission('MenuResource_update'),
          hasDelete: checkPermission('MenuResource_remove'),
          // hasView: checkPermission('MenuResource_get'),
          hasExportTpl: checkPermission('MenuResource_export'),
          hasExport: checkPermission('MenuResource_export'),
          hasImport: checkPermission('MenuResource_import'),

          url: '/menus',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //工具按钮
          maxUploadCount: 20, //提交数量
          exportFileName: '菜单列表',
          hasExportTpl: true,
          hasExport: true,
          hasImport: true,

          columns: [
            {type: checkPermission('MenuResource_remove') ? 'selection' : '', hidden: !checkPermission('MenuResource_remove') , width: 30},

            {prop: 'id', label: 'ID', sortable: 'true', hidden: false, width: 100},
            {
              prop: 'level', label: '菜单级别', sortable: 'custom', 'min-width': 120,
              formatter: row => (row.level === 1 ? '一级' : '二级')
            },
            {prop: 'title', label: '名称', sortable: 'custom', 'min-width': 120},
            {prop: 'actionId', label: '操作标识', sortable: 'custom', 'min-width': 300},
            {prop: 'icon', label: '图标', sortable: 'custom', 'min-width': 100},
            {
              prop: 'parentId',
              label: '父级菜单ID',
              sortable: 'custom',
              'min-width': 120,
              'label-class-name': 'ph-header-small'
            },
            {prop: 'url', label: '菜单URL', sortable: 'custom', 'min-width': 300},
            {prop: 'sortNum', label: '排序值', sortable: 'custom', 'min-width': 100},
            phColumns.status,
            phColumns.lastModified
          ],
          //搜索栏
          searchForm: [
            {
              $type: 'select',
              $id: 'level',
              label: '菜单级别',
              $el: {
                op: 'eq',
                size: 'mini',
                style: 'width:120px',
                placeholder: '请选择菜单级别'
              },
              $options: [
                {
                  label: '全部',
                  value: ''
                },
                {
                  label: '一级',
                  value: '1'
                },
                {
                  label: '二级',
                  value: '2'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'title',
              label: '名称',
              $el: {
                op: 'bw',
                size: 'mini',
                style: 'width:120px',
                placeholder: '请输入名称'
              }
            },
            {
              $type: 'input',
              $id: 'actionId',
              label: '操作标识',
              $el: {
                op: 'bw',
                size: 'mini',
                style: 'width:120px',
                placeholder: '请输入操作标识'
              }
            },
            phSearchItems.status()
          ],
          //添加或修改弹出栏
          form: [
            {
              $type: 'select',
              $id: 'level',
              label: '菜单级别',
              $default: '1',
              $el: {},
              $options: [
                {
                  label: '一级',
                  value: '1'
                },
                {
                  label: '二级',
                  value: '2'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'title',
              label: '名称',
              $el: {
                placeholder: '请输入名称'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'actionId',
              label: '操作标识',
              $el: {
                placeholder: '请输入操作标识'
              }
            },
            {
              $type: 'input',
              $id: 'icon',
              label: '图标',
              $el: {}
            },
            {
              $type: 'input',
              $id: 'parentId',
              label: '父级菜单ID',
              $el: {}
            },
            {
              $type: 'input',
              $id: 'url',
              label: '菜单URL',
              $el: {},
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'sortNum',
              label: '排序值',
              $el: {},
              rules: [
                validRules.required
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
