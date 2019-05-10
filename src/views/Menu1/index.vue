<template>
  <div class="app-container">
    <div class="ph-card">
      <ph-card-header :title="title" type="table">
      </ph-card-header>
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
  import validRules from '@/components/validrules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'

  export default {
    data() {
      return {
        title: '菜单列表',
        tableConfig: {
          url: '/menus',
          relations: ["creator"],
          tableAttrs: {
            stripe: true,
            border: true,
            "row-class-name": this.statusClassName,
            "highlight-current-row": true
          },
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'level', label: '菜单级别', sortable: 'custom', 'min-width': 50, fixed: 'left'},
            {prop: 'title', label: '名称', sortable: 'custom' ,'min-width': 80},
            {prop: 'actionId', label: '操作标识', sortable: 'custom' ,'min-width': 100},
            {prop: 'icon', label: '图标', sortable: 'custom' ,'min-width': 100},
            {prop: 'parentId', label: '父级菜单ID', sortable: 'custom' ,'min-width': 60},
            {prop: 'url', label: '菜单URL', sortable: 'custom' ,'min-width': 100},
            {prop: 'sortNum', label: '排序值', sortable: 'custom' ,'min-width': 50},
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
            phSearchItems.name,
             {
              $type: 'input',
              $id: 'actionId',
              label: '操作标识',
              $el: {
                op: 'bw',
                placeholder: '请输入操作标识'
              }
            },
            phSearchItems.status
          ],
          //添加或修改弹出栏
          form: [
             {
              $type: 'select',
              $id: 'level',
              label: '菜单级别',
              $default: 1,
              $el: {
              },
              $options: [
                {
                  label: '一级',
                  value: 1
                },
                {
                  label: '二级',
                  value: 2
                }
              ]
            },
            phFromItems.name,
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
              $el: {
              }
            },
            {
              $type: 'input',
              $id: 'parentId',
              label: '父级菜单ID',
              $el: {
              }
            },
            {
              $type: 'input',
              $id: 'url',
              label: '菜单URL',
              $el: {
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'sortNum',
              label: '排序值',
              $el: {
              },
              rules: [
                validRules.required
              ]
            },
            phFromItems.status
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
