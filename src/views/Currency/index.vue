<template>
  <div class="app-container">
    <div class="ph-card">
      <ph-card-header :title="title" type="table">
      </ph-card-header>
      <div class="ph-card-body">
        <ph-table
          :url="url"
          :columns="columns"
          :searchForm="searchForm"
          :form="form"
          :tableAttrs="tableAttrs"
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
        url: '/currencies', 
        tableAttrs: {
          stripe: true,
          border: true,
          "row-class-name": this.statusClassName,
          "highlight-current-row": true
        },
        columns: [
          {type: 'selection'}, 
          {prop: 'id', label: 'ID', sortable: 'custom', hidden: true},
          {prop: 'name', label: '名称', sortable: 'custom'},
          {prop: 'code', label: '代码'},
          {prop: 'symbolLeft', label: '左侧符'},
          {prop: 'symbolRight', label: '右侧符'},
          {prop: 'decimalPoint', label: '小数符'},
          {prop: 'thousandsPoint', label: '千分位符'},
          {prop: 'decimalPlaces', label: '小数位数'},
          {prop: 'value', label: '汇率值', sortable: 'custom'},
          {
            prop: 'status',
            label: '状态',
            formatter: row => (row.status === 1 ? '启用' : '禁用')
          },
          {
            prop: 'lastModified',
            label: '最后修改时间',
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
                trigger: 'change'
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
                max: 3,
                required: true,
                message: '请输入三位代码',
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
                message: '请输入小数符',
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
                message: '请输入千分位符',
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
                type: 'number',
                transform(value) {
                  if (value) {
                    return Number(value);
                  }
                },
                message: '小数位数必须为正整数',
              }
            ]
          },
          {
            $type: 'input',
            $id: 'value',
            label: '汇率值',
            $default:'1' ,
            $el: {
              placeholder: '请输入汇率值'
            },

          },
          {
            $type: 'radio-group',
            $id: 'status',
            label: '状态',
            $default: 1 ,
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
