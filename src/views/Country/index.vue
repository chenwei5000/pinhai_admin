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
        title: '国家列表',
        tableConfig: {
          url: '/countries',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //表格内容显示
          columns: [
            {type: 'selection'},
            {prop: 'id', label: 'ID', sortable: 'custom', hidden: true},
            {prop: 'name', label: '名称', sortable: 'custom', "min-width": 120, fixed: 'left'},
            {prop: 'enName', label: '英文名', sortable: 'custom', "min-width": 120},
            {prop: 'isoCode2', label: '2位iso编码', "min-width": 120},
            {prop: 'isoCode3', label: '3位iso编码', "min-width": 120},
            {prop: 'creator.name', label: '创建人', width: 100},
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
              $id: 'name',
              label: '国家名称',
              $el: {
                op: 'bw',
                placeholder: '请输入国家名称'
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
          //  弹窗表单
          form: [
            {
              $type: 'input',
              $id: 'name',
              label: '国家名称',
              $el: {
                placeholder: '请输入国家名称'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'enName',
              label: '国家英文名',
              $el: {
                placeholder: '请输入国家英文名'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'isoCode2',
              label: '2位iso编码',
              $el: {
                placeholder: '请输入国家2位iso编码'
              },
              rules: [
                validRules.required,
                validRules.strMax(2)
              ]
            },
            {
              $type: 'input',
              $id: 'isoCode3',
              label: '3位iso编码',
              $el: {
                placeholder: '请输入国家3位iso编码'
              },
              rules: [
                validRules.required,
                validRules.strMax(3)
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
    methods: {
      statusClassName({row, rowIndex}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      }
    },
    watch: {}
  }
</script>

<style scoped>


</style>
