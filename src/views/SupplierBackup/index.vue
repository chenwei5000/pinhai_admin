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

  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'
  import {checkPermission} from "../../utils/permission";

  export default {

    data() {
      return {
        regions: [],
        title: '供货商管理',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('SupplierResource_create'),
          hasEdit: checkPermission('SupplierResource_update'),
          hasDelete: checkPermission('SupplierResource_remove'),
          // hasView: checkPermission('SupplierResource_get'),
          hasExportTpl: checkPermission('SupplierResource_export'),
          hasExport: checkPermission('SupplierResource_export'),
          hasImport: checkPermission('SupplierResource_import'),

          url: '/suppliers',
          relations: ["dataDicItem.type"],
          tableAttrs: {
            "row-class-name": this.statusClassName,
          },

          // 表格列定义
          columns: [
            {type: 'selection'},
            {prop: 'name', label: '简称', sortable: 'custom', 'min-width': 150, fixed: 'left'},
            phColumns.id,
            {prop: 'code', label: '编码', width: 100},
            {prop: 'companyName', label: '公司名称', 'min-width': 250},
            {prop: 'city', label: '所在城市', 'min-width': 100},
            {prop: 'region', label: '区域', sortable: 'custom', width: 100},
            {prop: 'address', label: '地址', 'min-width': 250},
            {prop: 'linkman', label: '联系人', width: 100},
            {prop: 'tel', label: '联系电话', width: 125},
            {prop: 'collectionAccount', label: '收款账户', width: 125},

            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.code,
            phSearchItems.name

          ],
          //  弹窗表单, 用于新增与修改
          form: [
            phFromItems.code,
            {
              $type: 'input',
              $id: 'name',
              label: '简称',
              $el: {
                placeholder: '请输入简称'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'companyName',
              label: '公司名称',
              $el: {
                placeholder: '请输入公司名称'
              },
            },
            {
              $type: 'input',
              $id: 'city',
              label: '所在城市',
              $el: {
                placeholder: '请输入所在城市'
              },
            },
            phFromItems.datadic("region", '管理区域', '', 'region'),
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
            },
            {
              $type: 'input',
              $id: 'collectionAccount',
              label: '收款账户',
              $el: {
                placeholder: '请输入收款账户'
              },
            },
            phFromItems.status()
          ]
        }
      }
    },

    computed: {},
    methods: {
      statusClassName({row}) {
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
