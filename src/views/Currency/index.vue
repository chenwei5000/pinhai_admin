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

  export default {
    data() {
      return {
        title: '货币管理',

        tableConfig: {
          url: '/currencies',
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          columns: [
            {type: 'selection'},
            {prop: 'id', label: 'ID', sortable: 'custom', hidden: true},
            {prop: 'name', label: '名称', sortable: 'custom', 'min-width': 100, fixed: 'left'},
            {prop: 'code', label: '代码', sortable: 'custom', width: 80},
            {prop: 'symbolLeft', label: '左侧符', width: 80},
            {prop: 'symbolRight', label: '右侧符', width: 80},
            {prop: 'decimalPoint', label: '小数符', width: 80},
            {prop: 'thousandsPoint', label: '千分位符', width: 80},
            {prop: 'decimalPlaces', label: '小数位数', width: 80},
            {prop: 'value', label: '汇率值', sortable: 'custom', width: 100},
            {
              prop: 'status',
              label: '状态',
              width: 80,
              formatter: row => (row.status === 1 ? '启用' : '禁用')
            },
            {
              prop: 'lastModified',
              label: '最后修改时间',
              'width': 140,
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
                placeholder: '请输入名称'
              }
            },
            {
              $type: 'input',
              $id: 'code',
              label: '代码',
              $el: {
                op: 'bw',
                placeholder: '请输入代码'
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
              $id: 'name',
              label: '名称',
              $el: {
                placeholder: '请输入名称'
              },
              rules: [
                {
                  required: true,
                  message: '请输入名称',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'code',
              label: '代码',
              $el: {
                placeholder: '请输入代码'
              },
              rules: [
                {
                  required: true,
                  message: '请输入代码',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'symbolLeft',
              label: '左侧符',
              $el: {
                placeholder: '请输入左侧符'
              },
              rules: [
                {
                  required: true,
                  message: '请输入左侧符',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'symbolRight',
              label: '右侧符',
              $el: {
                placeholder: '请输入右侧符'
              },
              rules: [
                {
                  required: true,
                  message: '请输入右侧符',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'decimalPoint',
              label: '小数符',
              $default: '.',
              $el: {
                placeholder: '请输入小数符'
              },
              rules: [
                {
                  max: 1,
                  message: '长度不能超过1位',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'thousandsPoint',
              label: '千分位符',
              $default: ',',
              $el: {
                placeholder: '请输入千分位符'
              },
              rules: [
                {
                  max: 1,
                  message: '长度不能超过1位',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'decimalPlaces',
              label: '小数位数',
              $default: 2,
              $el: {
                placeholder: '请输入小数位数',
              },
              rules: [
                {
                  whitespace: true,
                  type: 'integer',
                  transform(value) {
                    if (value) {
                      return Number(value);
                    }
                  },
                  message: '小数位数必须为正整数',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'value',
              label: '汇率值',
              $default: '1',
              $el: {
                placeholder: '请输入汇率值'
              },
              rules: [
                {
                  whitespace: true,
                  type: 'number',
                  transform(value) {
                    if (value) {
                      return Number(value);
                    }
                  },
                  message: '汇率值必须为数字类型',
                  trigger: 'blur'
                }
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
