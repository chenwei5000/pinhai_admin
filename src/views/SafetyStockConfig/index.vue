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
        title: '安全库存配置列表',
        tableConfig: {
          url: '/safetyStockConfigs',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //表格内容显示
          columns: [
            {type: 'selection'},
            {prop: 'id', label: 'ID', sortable: 'custom', hidden: true, width: 80},
            {prop: 'name', label: '名称', sortable: 'custom', 'min-width': 80, fixed: 'left'},
            {prop: 'typeName', label: '类型', 'width': 100},
            {prop: 'vip0SafetyStockWeek', label: 'Vip0普通', 'width': 90},
            {prop: 'vip1SafetyStockWeek', label: 'Vip1热销', 'width': 90},
            {prop: 'vip2SafetyStockWeek', label: 'Vip2爆款', 'width': 90},
            {prop: 'sortNum', label: '排序值', sortable: true, 'width': 90},
            {
              prop: 'status',
              label: '状态',
              width: 80,
              formatter: row => (row.status === 1 ? '启用' : '禁用')
            },
            {
              prop: 'lastModified',
              label: '修改时间',
              'width': 140,
              formatter: row => {
                return parseTime(row.lastModified, '{y}-{m}-{d} {h}:{i}');
              }
            }
          ],
          //搜索栏
          searchForm: [
            {
              $type: 'input',
              $id: 'name',
              label: '名称',
              $el: {
                op: 'bw',
                placeholder: '请输入安全库存配置名称'
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
          //添加或修改弹窗
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
              //TODO: 替换成数据字典
              $type: 'select',
              $id: 'typeName',
              $default: '成品',
              label: '类型',
              $options: [
                {
                  label: '成品',
                  value: '成品'
                },
                {
                  label: '原料',
                  value: '原料'
                },
                {
                  label: '成品+原料',
                  value: '成品+原料'
                }

              ]
            },
            {
              $type: 'input',
              $id: 'vip0SafetyStockWeek',
              label: 'Vip0普通(周)',
              rules: [
                {
                  required: true,
                  message: '不能为空',
                  trigger: 'blur'
                },
                {
                  type: 'number',
                  transform(value) {
                    if (value) {
                      return Number(value);
                    }
                  },
                  message: '必须是数字',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'vip1SafetyStockWeek',
              label: 'Vip1热销(周)',
              rules: [
                {
                  required: true,
                  message: '不能为空',
                  trigger: 'blur'
                },
                {
                  type: 'number',
                  transform(value) {
                    if (value) {
                      return Number(value);
                    }
                  },
                  message: '必须是数字',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'vip2SafetyStockWeek',
              label: 'Vip2爆款(周)',
              rules: [
                {
                  required: true,
                  message: '不能为空',
                  trigger: 'blur'
                },
                {
                  type: 'number',
                  transform(value) {
                    if (value) {
                      return Number(value);
                    }
                  },
                  message: '必须是数字',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'sortNum',
              label: '排序值',
              rules: [
                {
                  required: true,
                  message: '不能为空',
                  trigger: 'blur'
                },
                {
                  type: 'number',
                  transform(value) {
                    if (value) {
                      return Number(value);
                    }
                  },
                  message: '必须是数字',
                  trigger: 'blur'
                }
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
