<template>

  <ph-table
    v-bind="tableConfig"
  >
  </ph-table>

</template>

<script>
  import supplierModel from '@/api/supplier'
  import cartonspecModel from '@/api/cartonspec'
  import categoryModel from '@/api/category'

  import validRules from '@/components/validRules'
  import phColumns from '@/components/phColumns'
  import phSearchItems from '@/components/phSearchItems'
  import phFromItems from '@/components/phFromItems'

  export default {
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    props: {
      type: {
        type: String,
        default: 'CN'
      }
    },
    data() {
      return {
        list: null,
        listQuery: {
          page: 1,
          limit: 5,
          type: this.type,
          sort: '+id'
        },
        loading: false,
        tableConfig: {
          url: '/products', // 资源URL
          relations: ["supplier", "cartonSpec", "category"],

          //表格定义 具体可参考https://element.eleme.cn/#/zh-CN/component/table#table-attributes
          // https://femessage.github.io/el-data-table/
          tableAttrs: {
            "row-class-categoryId": this.statusClasscategoryId
          },

          // 表格列定义, 具体可参考 https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes
          columns: [
            phColumns.id,
            {prop: 'skuCode', label: 'SKU', 'min-width': 250},
            {prop: 'imgUrl', phimg: true, label: '图片'},
            {prop: 'categoryId', label: '分类ID', sortable: 'custom', hidden: true},
            {prop: 'category.name', label: '分类', width: 80},
            {prop: 'groupName', label: '款式', width: 80},
            {prop: 'name', label: '产品名称', 'min-width': 250},
            {prop: 'fnSku', label: 'FN-SKU', 'min-width': 120},
            {prop: 'model', label: '型号', 'min-width': 120},
            {prop: 'color', label: '颜色', 'min-width': 120},
            {prop: 'grossWeight', label: '净重(Kg)', width: 100},
            {prop: 'sizeInfo', label: '体积', width: 100},
            {prop: 'length', label: '长(Cm)', width: 100},
            {prop: 'width', label: '宽(Cm)', width: 100},
            {prop: 'height', label: '高(Cm)', width: 100},
            {prop: 'supplier.name', label: '供货商', 'min-width': 100},
            {prop: 'currencyName', label: '结算货币', 'min-width': 100},
            {prop: 'price', label: '采购价', 'min-width': 100},
            {prop: 'cartonSpec.code', label: '箱规', 'min-width': 150},
            {prop: 'numberOfCarton', label: '装箱数量', width: 100},
            {prop: 'vipLevel', label: 'Vip级别', 'min-width': 100},
            {prop: 'oversize', label: '超大', 'min-width': 100},
            {prop: 'parentSku', label: 'Parent Asin', 'min-width': 120},
            {prop: 'comment', label: '备注', 'min-width': 120},
            phColumns.status
          ],

          // 搜索区块定义, 具体可参考 https://github.com/FEMessage/el-form-renderer/blob/master/README.md
          searchForm: [
            phSearchItems.productCategories,
            phSearchItems.skuCode,
            {
              $type: 'input',
              $id: 'name',
              label: '产品名称',
              $el: {
                op: 'bw',
                placeholder: '请输入产品名称'
              }
            }
          ],
          //  弹窗表单, 用于新增与修改, 详情配置参考el-form-renderer
          // https://github.com/FEMessage/el-form-renderer/blob/master/README.md
          form: [
            {
              $type: 'input',
              $id: 'skuCode',
              label: 'SKU',
              $el: {
                placeholder: '请输入SKU'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'select',
              $id: 'categoryId',
              label: '分类',
              $el: {
                op: 'eq',
                placeholder: '请选择分类'
              },
              $options: categoryModel.getMineSelectOptions()
            },
            phFromItems.name,
            {
              $type: 'input',
              $id: 'groupName',
              label: '款式',
              $el: {
                placeholder: '请输入款式'
              },
            },
            {
              $type: 'input',
              $id: 'fnSku',
              label: 'FN-SKU',
              $el: {
                placeholder: '请输入FN-SKU'
              },
            },
            {
              $type: 'input',
              $id: 'model',
              label: '型号',
              $el: {
                placeholder: '请输入型号'
              },
            },
            {
              $type: 'input',
              $id: 'color',
              label: '颜色',
              $el: {
                placeholder: '请输入颜色'
              },
            },
            {
              $type: 'input',
              $id: 'size',
              label: '尺码',
              $el: {
                placeholder: '请输入尺码'
              },
            },
            {
              $type: 'input',
              $id: 'grossWeight',
              label: '净重(Kg)',
              $el: {
                placeholder: '请输入净重(Kg)'
              },
              rules: [
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'sizeInfo',
              label: '体积',
              $el: {
                placeholder: '请输入体积'
              },
              rules: [
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'fnSku',
              label: 'FN-SKU',
              $el: {
                placeholder: '请输入FN-SKU'
              },
            },
            {
              $type: 'select',
              $id: 'supplierId',
              label: '供货商',
              $el: {
                placeholder: '请选择供货商'
              },
              $options: supplierModel.getSelectOptions(),

            },
            {
              $type: 'select',
              $id: 'cartonSpecId',
              label: '箱规',
              $el: {
                placeholder: '请选择箱规'
              },
              $options: cartonspecModel.getSelectOptions()
            },
          ]
        }
      }
    },
    created() {
    },
    methods: {
    }
  }
</script>

