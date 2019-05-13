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
  import validrules from '@/components/validrules'

  export default {
    data() {
      return {
        title: '系统更新日志列表',
        tableConfig: {
          url: '/releaseLogs',
          relations: ["creator"],
          tableAttrs: {
            stripe: true,
            border: true,
            "row-class-name": this.statusClassName,
            "highlight-current-row": true
          },
          columns: [
            {type: 'selection'},
            {prop: 'id', label: 'ID', sortable: 'custom', hidden: true},
            {
              prop: 'releaseTime',
              label: '发版日期',
              width: 140,
              fixed: 'left',
              formatter: row => {
                return parseTime(row.releaseTime, '{y}-{m}-{d} {h}:{i}');
              }
            },
            {prop: 'version', label: '系统版本', sortable: 'custom', 'min-width': 60},
            {prop: 'caption', label: '更新说明', sortable: 'custom' ,'min-width': 400},
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
              $id: 'version',
              label: '版本',
              $el: {
                op: 'bw',
                placeholder: '请输入版本'
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
                type: 'textarea'
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
