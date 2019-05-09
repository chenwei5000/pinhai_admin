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
  import validRules from '@/api/validrules'

  export default {
    data() {
      return {
        title: '语言列表',
        tableConfig: {
          url: '/languages',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName,
          },
          columns: [
            {type: 'selection'},
            {prop: 'id', label: 'ID', sortable: 'custom', hidden: true},
            {prop: 'name', label: '名称', 'min-width': 150, fixed: 'left', sortable: 'custom'},
            {prop: 'code', label: '代码', sortable: 'custom', 'min-width': 150},
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

          // 搜索区块定义
          searchForm: [
            {
              $type: 'input',
              $id: 'name',
              label: '名称',
              $el: {
                op: 'bw',
                placeholder: '请输入语言名称'
              }
            },
            {
              $type: 'select',
              $id: 'status',
              label: '状态',
              $el: {
                op: 'eq',
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
          //  弹窗表单, 用于新增与修改
          form: [
            {
              $type: 'input',
              $id: 'code',
              label: '代码',
              $el: {
                placeholder: '请输入代码'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'name',
              label: '名称',
              $el: {
                placeholder: '请输入名称'
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
