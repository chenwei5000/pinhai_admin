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
  import harbourModel from '@/api/harbour'
  import shippingMethodModel from '@/api/shippingMethod'
  import validrules from '@/api/validrules'
  export default {
    data() {
      return {
        title: '分类列表',
        tableConfig: {
          url: '/freightTimes',
          relations: ["sourceHarbour", "shippingMethod", "destinationHarbour"],
          tableAttrs: {
          },
          //列表
          columns: [
            {type: 'selection'},
            {prop: 'id', label: 'ID', sortable: 'true', hidden: true},
            {prop: 'sourceHarbour.name', label: '发货港口', 'min-width': 200},
            {prop: 'shippingMethod.name', label: '物流方式', 'min-width': 200},
            {prop: 'destinationHarbour.name', label: '收货港口', 'min-width': 200},
            {prop: 'spendDays', label: '物流时间(天)', 'min-width': 100},
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
          // 搜索
          searchForm: [
            {
              $type: 'select',
              $id: 'sourceHarbourId',
              label: '发货港口',
              $options: harbourModel.getSourceHarbourOptions,
              $el: {
                op: 'eq',
                placeholder: '请选择发货港口'
              }
            },
            {
              $type: 'select',
              $id: 'shippingMethodId',
              label: '物流方式',
              $options: shippingMethodModel.getShippingMethodOptions,
              $el: {
                op: 'eq',
                placeholder: '请选择物流方式'
              }
            },
            {
              $type: 'select',
              $id: 'destinationHarbourId',
              label: '收货港口',
              $options: harbourModel.getDestinationHarbourOptions,
              $el: {
                op: 'eq',
                placeholder: '请输入收货港口'
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
          //修改或新增
          form: [
            {
              $type: 'select',
              $id: 'sourceHarbourId',
              label: '发货港口',
              $el: {
                placeholder: '请选择'
              },
              $options: harbourModel.getSourceHarbourOptions,
              rules: [
                validrules.required
              ]
            },
            {
              $type: 'select',
              $id: 'shippingMethodId',
              label: '物流方式',
              $el: {
                placeholder: '请选择'
              },
              $options: shippingMethodModel.getShippingMethodOptions,
              rules: [
                validrules.required
              ]
            },
            {
              $type: 'select',
              $id: 'destinationHarbourId',
              label: '收货港口',
              $el: {
                placeholder: '请选择'
              },
              $options: harbourModel.getDestinationHarbourOptions,
              rules: [
                validrules.required
              ]
            },
            {
              $type: 'input',
              $id: 'spendDays',
              label: '物流时间',
              $el:{
                placeholder:'请输入物流天数'
              },
              rules: [
                validrules.required,
                validrules.number
              ]
            },
            {
              $type: 'radio-group',
              $id: 'status',
              label: '状态',
              $el: {
              },
              $default: 1 ,
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
