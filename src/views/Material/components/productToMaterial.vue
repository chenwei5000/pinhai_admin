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

  export default {
    data() {
      return {
        title: '原料产品关系',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('ProductToMaterialResource_create'),
          hasEdit: checkPermission('ProductToMaterialResource_update'),
          hasDelete: checkPermission('ProductToMaterialResource_remove'),
          // hasView: checkPermission('ProductToMaterialResource_get'),
          hasExportTpl: checkPermission('ProductToMaterialResource_export'),
          hasExport: checkPermission('ProductToMaterialResource_export'),
          hasImport: checkPermission('ProductToMaterialResource_import'),

          defalutSort: "&sort=product.skuCode&dir=asc",
          url: '/productToMaterials',
          relations: ["creator", "product", "product.category", "material"],
          tableAttrs: {
            stripe: true,
            border: true,
            "default-sort": {prop: 'product.skuCode', order: 'ascending'}, //设置默认排序
            "row-class-name": this.statusClassName,
            "highlight-current-row": true,
          },

          subHeight: 50,
          //工具按钮
          maxUploadCount: 20, //提交数量
          exportFileName: '原料产品关系',

          columns: [
            {
              width: 30,
              type: checkPermission('ProductToMaterialResource_remove') ? 'selection' : '',
              hidden: !checkPermission('ProductToMaterialResource_remove')
            },
            {prop: 'product.skuCode', sortable: 'custom', label: '产品SKU', 'min-width': 150, fixed: 'left'},
            {prop: 'product.name', label: '产品名', 'min-width': 200},
            {prop: 'product.category.name', label: '分类', 'min-width': 100},
            {prop: 'material.skuCode', label: '原料SKU', 'min-width': 150},
            {prop: 'material.name', label: '原料名', 'min-width': 200},
            {prop: 'qty', label: '数量', 'min-width': 80},
            {prop: 'attritionRate', label: '损耗率', 'min-width': 80},
            {
              prop: 'formatLastModified',
              label: '修改时间',
              width: 140
            }
          ],
          //搜索栏
          searchForm: [
            {
              $type: 'input',
              $id: 'productSkuCode',
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
            {
              $type: 'input',
              $id: 'materialSkuCode',
              label: '原料Sku',
              $el: {
                op: 'eq',
                placeholder: '请输入原料Sku',
                maxlength: "100",
                size: "mini",
                "show-word-limit": true,
                clearable: true
              }
            }
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
