<template>
  <div class="app-container">
    <div class="ph-card">
      <ph-card-header :title = "title" type="table">
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
        title: '数据字典',
        tableConfig: {
          url: '/dataDicItems',
          tableAttrs: {
            stripe: true,
            border: true,
            "row-class-name": this.statusClassName,
            "highlight-current-row": true
          },
          columns: [
            {type: 'selection'},
            {prop: 'id', label: 'ID', sortable: 'custom', hidden: true},
            {prop: 'type', label: '字典类型', sortable: 'custom', fixed: 'left','min-width': 100},
            {prop: 'name', label: '字典类型名称', sortable: 'custom','min-width': 100},
            {prop: 'valueId', label: '字典值ID','min-width': 100},
            {prop: 'valueName', label: '字典值名称','min-width': 100},
            {
              prop: 'status',
              label: '状态',
              width: 80,
              filters: [{text: '启用', value: 1}, {text: '禁用', value: 0}],
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
              $id: 'type',
              label: '字典类型',
              $el: {
                op: 'bw',
                placeholder: '请输入字典类型'
              }
            },
            {
              $type: 'input',
              $id: 'name',
              label: '字典类型名称',
              $el: {
                op: 'bw',
                placeholder: '请输入字典类型名称'
              }
            },
            {
              $type: 'input',
              $id: 'valueId',
              label: '字典值ID',
              $el: {
                op: 'bw',
                placeholder: '请输入字典值ID'
              }
            },
            {
              $type: 'input',
              $id: 'valueName',
              label: '字典值名称',
              $el: {
                op: 'bw',
                placeholder: '请输入字典值名称'
              }
            }

          ],
          //  弹窗表单, 用于新增与修改
          form: [
            {
              $type: 'input',
              $id: 'type',
              label: '字典类型',
              $el: {
                placeholder: '请输入字典类型'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'name',
              label: '字典类型名称',
              $el: {
                placeholder: '请输入字典类型名称'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'valueId',
              label: '字典值ID',
              $el: {
                placeholder: '请输入字典值ID'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'valueName',
              label: '字典值名称',
              $el: {
                placeholder: '请输入字典值名称'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'radio-group',
              $id: 'status',
              label: '状态',
              $default: 1,
              $el: {},
              $options: [
                {
                  label: '开启',
                  value: 1
                },
                {
                  label: '禁用',
                  value: 0
                }
              ],
            }
          ]
        }
      }
    },

    computed: {},
    // 各种相关方法定义
    methods: {
      // 状态样式
      statusClassName({row, rowIndex}) {
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
