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
  import phFormItems from '../../components/phFromItems'
  import {parseTime} from '@/utils'
  import {checkPermission} from "../../utils/permission";

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

          url: '/productToMaterials',
          relations: ["creator", "product", "product.category", "material"],
          tableAttrs: {
            "row-class-name": this.statusClassName,
          },

          //工具按钮
          maxUploadCount: 20, //提交数量
          exportFileName: '原料产品关系',


          columns: [
            {type: checkPermission('ProductToMaterialResource_remove') ? 'selection' : '', hidden: !checkPermission('ProductToMaterialResource_remove')},
            {prop: 'id', label: 'ID', sortable: 'custom', hidden: false, 'min-width': '80', fixed: 'left'},
            {prop: 'product.skuCode', label: '产品SKU', 'min-width': 250},
            {prop: 'product.name', label: '产品名', 'min-width': 250},
            {prop: 'product.category.name', label: '分类', 'min-width': 100},
            {prop: 'material.skuCode', label: '原料SKU', 'min-width': 200},
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
                size:"mini",
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
                size:"mini",
                "show-word-limit": true,
                clearable: true
              }
            },
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
    methods: {
      // statusClassName({row, rowIndex}) {
      //   if (row.status && row.status !== 0) {
      //     return '';
      //   }
      //   else {
      //     return 'warning-row';
      //   }
      // },
    },
    watch: {}
  }
</script>

<style scoped>


</style>
