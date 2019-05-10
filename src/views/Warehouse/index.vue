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
  import datadicModel from '@/api/datadic'
  import supplierModel from '@/api/supplier'
  import validRules from '@/components/validrules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'

  export default {

    data() {
      return {

        title: '仓库管理',

        tableConfig: {

          url: '/warehouses',
          relations: ["dataDicItem.type", "supplier"],
          tableAttrs: {
            stripe: true,
            border: true,
            "row-class-name": this.statusClassName,
            "highlight-current-row": true
          },
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'code', label: '编码',  'min-width': 200},
            {prop: 'name', label: '名称', sortable: 'custom',  'min-width': 200, fixed: 'left'},
            {prop: 'address', label: '地址',  'min-width': 150},
            {prop: 'linkman', label: '联系人', width: 100},
            {prop: 'tel', label: '联系电话', width: 125},
            {prop: 'type', label: '类型'},
            {prop: 'supplierId', label: '供货商编号', hidden: true},
            {prop: 'supplier.name', label: '供货商名称', 'min-width': 150},
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.name,
            phSearchItems.code

          ],
          //  弹窗表单, 用于新增与修改
          form: [
            phFromItems.code,
            phFromItems.name,
            {
              $type: 'input',
              $id: 'address',
              label: '地址',
              $el: {
                placeholder: '请输入地址'
              },
            },
            {
              $type: 'input',
              $id: 'linkman',
              label: '联系人',
              $el: {
                placeholder: '请输入联系人'
              },
            },
            {
              $type: 'input',
              $id: 'tel',
              label: '联系电话',
              $el: {
                placeholder: '请输入联系电话'
              },
              rules: [
                validRules.number
              ]
            },
            {
              $type: 'select',
              $id: 'type',
              label: '类型',
              $el: {
                placeholder: '请输入类型'
              },
              $options: datadicModel.getDatadicOptions("warehouse"),
            },
            {
              $type: 'select',
              $id: 'supplierId',
              label: '供货商',
              $el: {
                placeholder: '请选择供货商'
              },
              $options: supplierModel.getSuppilerOptions,

            },
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
