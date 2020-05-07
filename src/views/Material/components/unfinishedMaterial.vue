<template>
  <ph-table
    v-bind="tableConfig"
  >
  </ph-table>
</template>

<script>
  import {parseTime} from '@/utils'
  import {checkPermission} from "../../../utils/permission";
  import validRules from "../../../components/validRules";
  import phFormItems from "../../../components/phFromItems";
  import phSearchItems from "../../../components/phSearchItems";

  export default {
    data() {
      return {
        title: '未设置原料的产品',
        tableConfig: {
          //权限控制
          hasNew: false,
          hasEdit: false,
          hasDelete: false,
          // hasView: checkPermission('ProductToMaterialResource_get'),
          hasExportTpl: false,
          hasExport: checkPermission('ProductToMaterialResource_export'),
          hasImport: false,

          defalutSort: "&sort=skuCode&dir=asc",
          url: '/products/unfinishedMaterials',
          countUrl: '#/products/countUnfinishedMaterials',
          relations: ["category"],
          tableAttrs: {
            stripe: true,
            border: true,
            "default-sort": {prop: 'skuCode', order: 'ascending'}, //设置默认排序
            "row-class-name": this.statusClassName,
            "highlight-current-row": true,
          },

          subHeight: 50,
          //工具按钮
          maxUploadCount: 20, //提交数量
          exportFileName: '未设置原料的产品',

          columns: [
            {prop: 'skuCode', label: '产品SKU', 'min-width': 200, fixed: 'left'},
            {prop: 'name', label: '产品名', 'min-width': 200},
            {prop: 'category.name', label: '分类', 'min-width': 80},
            {prop: 'material.skuCode', label: '原料SKU', 'width': 80},
            {prop: 'material.name', label: '原料名', 'min-width': 50},
            {prop: 'qty', label: '数量', 'min-width': 50},
            {prop: 'attritionRate', label: '损耗率', 'min-width': 50}
          ],
          //搜索栏
          searchForm: [
            {
              $type: 'input',
              $id: 'skuCode',
              label: '产品Sku',
              $el: {
                op: 'eq',
                placeholder: '请输入产品SKU',
                maxlength: "100",
                size: "mini",
                "show-word-limit": true,
                clearable: true
              }
            },
            phSearchItems.productCategories(),
          ],
          //添加或修改弹出栏
          form: [
            {
              $type: 'input',
              $id: 'productSkuCode',
              label: '产品SKU',
              $el: {
                placeholder: '请输入产品SKU'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'materialSkuCode',
              label: '原料SKU',
              $el: {
                placeholder: '请输入原料SKU'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'qty',
              label: '数量',
              $el: {
                placeholder: '请输入数量'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'attritionRate',
              label: '损耗率',
              $el: {
                placeholder: '请输入损耗率'
              },
              rules: [
                validRules.required
              ]
            },
            phFormItems.status()
          ]
        }
      }
    },
    computed: {},
    methods: {},
    watch: {}
  }
</script>

<style type="text/less" lang="scss" scoped>
  .ph-table {
    padding: 0 !important;
  }
</style>
