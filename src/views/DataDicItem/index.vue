<template>
  <div class="app-container">
    <div class="ph-card">
      <ph-card-header :title = "title" type="table">
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
        title: '数据字典', 
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
          {prop: 'type', label: '字典类型', sortable: 'custom'},
          {prop: 'name', label: '字典类型名称', sortable: 'custom'},
          {prop: 'valueId', label: '字典值ID'},
          {prop: 'valueName', label: '字典值名称'},
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
              {
                required: true,
                message: '请输入字典类型',
                trigger: 'blur'
              }
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
              {
                required: true,
                message: '请输入字典类型名称',
                trigger: 'blur'
              }
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
              {
                required: true,
                message: '请输入字典值ID',
                trigger: 'blur'
              }
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
              {
                required: true,
                message: '请输入字典值名称',
                trigger: 'blur'
              }
            ]
          },
          {
            $type: 'radio-group',
            $id: 'status',
            label: '状态',
            $default: 1 ,
            $el: {
            },
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
            rules: [
              {
                trigger: 'blur'
              }
            ]
          }
        ]
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
