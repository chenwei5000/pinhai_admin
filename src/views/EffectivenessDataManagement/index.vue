<template>
  <div class="app-container">
    <div class="ph-card">
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
  import categoryModel from '../../api/category'
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        title: '产品效能管理',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('EffectivenessDataManagementResource_create'),
          hasEdit: checkPermission('EffectivenessDataManagementResource_update'),
          hasDelete: checkPermission('EffectivenessDataManagementResource_remove'),
          // hasView: checkPermission('EffectivenessDataManagementResource_get'),
          hasExportTpl: checkPermission('EffectivenessDataManagementResource_export'),
          hasExport: checkPermission('EffectivenessDataManagementResource_export'),
          hasImport: checkPermission('EffectivenessDataManagementResource_import'),

          url: '/effectivenessDataManagements',
          relations: ["category"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          hasOperation: false,
          hasDelete: false,
          hasNew: false,
          //表格内容显示
          columns: [
            {width: 30, type: checkPermission('EffectivenessDataManagementResource_remove') ? 'selection' : '', hidden: !checkPermission('EffectivenessDataManagementResource_remove')},
            {prop: 'statDateFormat', label: 'Stat Date', sortable: 'custom', "min-width": 120, fixed: 'left'},
            {prop: 'category.name', label: '分类', sortable: 'custom', "min-width": 120},
            {prop: 'session', label: 'Sessions', "min-width": 120},
            {prop: 'buyBoxPercentage', label: 'Buy Box Percentage', "min-width": 120},
            {prop: 'unitsOrdered', label: 'Units Ordered', "min-width": 120},
            {prop: 'unitSessionPercentage', label: 'Unit Session Percentage', "min-width": 120},
            {prop: 'orderedProductSale', label: 'Ordered product Sales', "min-width": 120},
            phColumns.id,
          ],

          // 搜索区块定义
          searchForm: [
                 {
              $type: 'select',
              $id: 'categoryId',
              label: '分类',
              $options: categoryModel.getMineSelectProdcutOptions(),
              $el: {
                op: 'eq',
                size:"mini",
                placeholder: '请输入分类名称'
              }
                },
            phSearchItems.status()
          ],
          //  弹窗表单
          form: [

          ],
          //提交后执行
          afterConfirm: () => {
          }
        }
      }
    },
    methods: {
      statusClassName({row}) {
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
