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
  import {getSourceHarbours, getDestinationHarbours} from '@/api/harbour'
  import {getShippingMethods} from '@/api/shippingMethod'
  import validrules from '@/api/validrules'
  export default {
    data() {
      return {
        title: '分类列表', 
        tableConfig: {
          url: '/freightTimes', 
          relations: ["sourceHarbour", "shippingMethod", "destinationHarbour"],
          tableAttrs: {
            stripe: true,
            border: true,
            "highlight-current-row": true
          },
          //列表
          columns: [
            {type: 'selection'}, 
            {prop: 'id', label: 'ID', sortable: 'true', hidden: false}, 
            {
              prop: 'status',
              label: '状态',
              hidden: true,
              formatter: row => (row.status === 1 ? '启用' : '禁用')
            },
            {prop: 'sourceHarbour.name', label: '发货港口'},
            {prop: 'shippingMethod.name', label: '物流方式'},
            {prop: 'destinationHarbour.name', label: '收货港口'},
            {prop: 'spendDays', label: '物流时间(天)'},
            {
              prop: 'lastModified',
              label: '最后修改时间',
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
              $options: getSourceHarbours(),
              $el: {
                op: 'eq',
                placeholder: '请输入发货港口'
              }
            },
            {
              $type: 'select',
              $id: 'shippingMethodId',
              label: '物流方式',
              $options: getShippingMethods(),
              $el: {
                op: 'eq',
                placeholder: '请输入物流方式'
              }
            },
            {
              $type: 'select',
              $id: 'destinationHarbourId',
              label: '收货港口',
              $options: getDestinationHarbours(),
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
              $options: getSourceHarbours(),
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
              $options: getShippingMethods(),
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
              $options: getDestinationHarbours(),
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
