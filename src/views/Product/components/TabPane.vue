<template>

  <productTable :type="type" :defaultFilters="filters"></productTable>

</template>

<script>
  import productTable from './table'

  export default {
    components: {
      productTable
    },
    props: {
      type: {
        type: String,
        default: 'valid'
      }
    },
    // data() {
    //   return {
    //     tableConfig: {
    //
    //
    //       // 搜索区块定义, 具体可参考 https://github.com/FEMessage/el-form-renderer/blob/master/README.md
    //       searchForm: [
    //         phSearchItems.productCategories,
    //         phSearchItems.skuCode,
    //         phSearchItems.name,
    //       ],
    //       //  弹窗表单, 用于新增与修改, 详情配置参考el-form-renderer
    //       // https://github.com/FEMessage/el-form-renderer/blob/master/README.md
    //       form: [
    //         {
    //           $type: 'input',
    //           $id: 'skuCode',
    //           label: 'SKU',
    //           $el: {
    //             placeholder: '请输入SKU'
    //           },
    //           rules: [
    //             validRules.required
    //           ]
    //         },
    //         {
    //           $type: 'select',
    //           $id: 'categoryId',
    //           label: '分类',
    //           $el: {
    //             op: 'eq',
    //             placeholder: '请选择分类'
    //           },
    //           $options: categoryModel.getMineSelectOptions()
    //         },
    //         phFromItems.name,
    //         {
    //           $type: 'input',
    //           $id: 'groupName',
    //           label: '款式',
    //           $el: {
    //             placeholder: '请输入款式'
    //           },
    //         },
    //         {
    //           $type: 'input',
    //           $id: 'fnSku',
    //           label: 'FN-SKU',
    //           $el: {
    //             placeholder: '请输入FN-SKU'
    //           },
    //         },
    //         {
    //           $type: 'input',
    //           $id: 'model',
    //           label: '型号',
    //           $el: {
    //             placeholder: '请输入型号'
    //           },
    //         },
    //         {
    //           $type: 'input',
    //           $id: 'color',
    //           label: '颜色',
    //           $el: {
    //             placeholder: '请输入颜色'
    //           },
    //         },
    //         {
    //           $type: 'input',
    //           $id: 'size',
    //           label: '尺码',
    //           $el: {
    //             placeholder: '请输入尺码'
    //           },
    //         },
    //         {
    //           $type: 'input',
    //           $id: 'grossWeight',
    //           label: '净重(Kg)',
    //           $el: {
    //             placeholder: '请输入净重(Kg)'
    //           },
    //           rules: [
    //             validRules.number
    //           ]
    //         },
    //         {
    //           $type: 'input',
    //           $id: 'sizeInfo',
    //           label: '体积',
    //           $el: {
    //             placeholder: '请输入体积'
    //           },
    //           rules: [
    //             validRules.number
    //           ]
    //         },
    //         {
    //           $type: 'input',
    //           $id: 'fnSku',
    //           label: 'FN-SKU',
    //           $el: {
    //             placeholder: '请输入FN-SKU'
    //           },
    //         },
    //         {
    //           $type: 'select',
    //           $id: 'supplierId',
    //           label: '供货商',
    //           $el: {
    //             placeholder: '请选择供货商'
    //           },
    //           $options: supplierModel.getSelectOptions(),
    //
    //         },
    //         {
    //           $type: 'select',
    //           $id: 'cartonSpecId',
    //           label: '箱规',
    //           $el: {
    //             placeholder: '请选择箱规'
    //           },
    //           $options: cartonspecModel.getSelectOptions()
    //         },
    //       ]
    //     }
    //   }
    // },
    computed: {
      filters() {
        if (this.type === 'invalid') {
          return {
            'field': 'status',
            op: 'in',
            data: 0
          }
        }
        else {
          return {
            'field': 'status',
            op: 'in',
            data: 1
          }
        }
      }
    },
    methods: {}
  }
</script>

