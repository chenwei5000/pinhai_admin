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

  export default {
    data() {
      return {
        title: '操作列表',
        tableConfig: {
          url: '/actions',
          relations: ["creator"],
          hasNew: false,
          hasDelete: false,
          hasEdit: false,
          hasOperation: false,
          tableAttrs: {
            stripe: true,
            border: true,
            "row-class-name": this.statusClassName,
            "highlight-current-row": true,
          },
          columns: [
            {prop: 'id', label: 'ID', sortable: 'custom', hidden: false, 'min-width': '180', fixed: 'left'},
            {prop: 'resource', label: '资源标识', sortable: 'custom', 'min-width': 100},
            {prop: 'method', label: '行为动作', sortable: 'custom' ,'min-width': 80},
            {prop: 'title', label: '行为说明', 'min-width': 200},
            {
              prop: 'status',
              label: '状态',
              width: 80,
              formatter: row => (row.status === 1 ? '启用' : '禁用')
            },
            {
              prop: 'lastModified',
              label: '修改时间',
              width: 140,
              formatter: row => {
                return parseTime(row.lastModified, '{y}-{m}-{d} {h}:{i}');
              }
            }
          ],
          //搜索栏
          searchForm: [
            {
              $type: 'input',
              $id: 'id',
              label: 'ID',
              $el: {
                op: 'bw',
                placeholder: '请输入ID'
              }
            },
            {
              $type: 'input',
              $id: 'resource',
              label: '资源标识',
              $el: {
                op: 'bw',
                placeholder: '请输入资源标识'
              }
            },
            {
              $type: 'select',
              $id: 'status',
              label: '状态',
              $el: {
                op: 'bw',
                placeholder: '请选择状态'
              },
              $options: [
                {
                  label: '全部',
                  value: ''
                },
                {
                  label: '开启',
                  value: '1'
                },
                {
                  label: '禁用',
                  value: '0'
                }
              ]
            }
          ],
          //添加或修改弹出栏
          form: [
            {
              $type: 'input',
              $id: 'name',
              label: '港口名称',
              $el: {
                placeholder: '请输入港口名称'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'location',
              label: '港口地址',
              $el: {
                placeholder: '请输入港口地址'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'radio-group',
              $id: 'status',
              label: '状态',
              $el: {},
              $default: 1,
              $options: [
                {
                  label: '开启',
                  value: 1
                },
                {
                  label: '禁用',
                  value: 0
                }
              ]
            }
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
