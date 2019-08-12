<template>
  <div class="app-container">

    <div class="ph-card">

      <!-- title -->
      <ph-card-header :title="title" type="table">

      </ph-card-header>

      <!-- 表格 -->
      <div class="ph-card-body">
        <!-- 说明  https://femessage.github.io/el-data-table/-->
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
  import validRules from '@/components/validRules'
  import supplierModel from '@/api/supplier'
  import categoryModel from '@/api/category'
  import currencyModel from '@/api/currency'

  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'

  export default {

    data() {
      return {
        categoryNames: [],
        currencyNames: [],

        title: '原材料管理', // 页面标题
        tableConfig: {
          url: '/materials', // 资源URL
          relations: ["supplier", "currency", "category"],

          //表格定义 具体可参考https://element.eleme.cn/#/zh-CN/component/table#table-attributes
          // https://femessage.github.io/el-data-table/
          tableAttrs: {
            stripe: true,
            border: true,
            "row-class-categoryId": this.statusClasscategoryId,
            "highlight-current-row": true
          },

          // 表格列定义, 具体可参考 https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes
          columns: [
            {type: 'selection'}, //多选
            phColumns.id,
            {prop: 'skuCode', label: 'SKU', 'min-width': 200},
            {prop: 'categoryId', label: '分类ID', sortable: 'custom', hidden: true},
            {prop: 'category.name', label: '分类名称', width: 80},
            {prop: 'name', label: '原材料名称', 'min-width': 250},
            {prop: 'model', label: '型号'},
            {prop: 'color', label: '颜色'},
            {prop: 'size', label: '尺码'},
            {prop: 'unit', label: '单位'},
            {prop: 'grossWeight', label: '毛重(Kg)', width: 80, hidden: true},
            {prop: 'supplierId', label: '供货商', hidden: true},
            {prop: 'supplier.name', label: '供货商名称', 'min-width': 100, 'label-class-name': 'ph-header-small'},
            {prop: 'currencyId', label: '结算货币', hidden: true},
            {prop: 'currency.name', label: '结算货币', hidden: true},
            {prop: 'price', label: '采购价', hidden: true},
            {prop: 'leadDay', label: '交期(天)', hidden: true},
            {prop: 'comment', label: '备注', hidden: true},
            phColumns.status,

          ],

          // 搜索区块定义, 具体可参考 https://github.com/FEMessage/el-form-renderer/blob/master/README.md
          searchForm: [
            phSearchItems.skuCode,
            {
              $type: 'select',
              $id: 'categoryId',
              label: '分类',
              $el: {
                op: 'eq',
                placeholder: '请选择分类'
              },
              $options: categoryModel.getMineSelectMaterialOptions(),
            },
            phSearchItems.name

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
              $id: 'groupCode',
              label: '分类',
              $el: {
                op: 'eq',
                placeholder: '请输入分类'
              },
              $options: categoryModel.getMineSelectMaterialOptions(),
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'select',
              $id: 'currencyId',
              label: '结算货币',
              $el: {
                placeholder: '请选择结算货币'
              },
              $options: function () {
                var _currencyNames = [];
                const loadData = async function () {
                  currencyModel.getCurrencies().then(currencies => {
                    currencies.forEach(currency => {
                      _currencyNames.push({
                        label: currency.name,
                        value: currency.id
                      });
                    });
                    return _currencyNames;
                  });
                };
                loadData();
                return _currencyNames;
              },
            },
            phFromItems.name,
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
              label: '毛重(Kg)',
              $el: {
                placeholder: '请输入毛重(Kg)'
              },
              rules: [
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'leadDay',
              label: '交期(天)',
              $el: {
                placeholder: '请输入交期(天)'
              },
              rules: [
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'comment',
              label: '备注',
              $el: {
                placeholder: '请输入备注'
              },
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

    // 计算属性，用于跟模版进行数据交互。
    // computed属性，属于持续变化跟踪。在computed属性定义的时候，这个computed属性就与给它赋值的变量绑定了。
    // 改变这个赋值变量，computed属性值会随之改变。
    // 主要用于用过其它第三变量，间接跟页面进行数据交互时使用。
    computed: {},

    // 各种相关方法定义
    methods: {
      // 状态样式
      statusClasscategoryId({row, rowIndex}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      },
    },

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>


</style>
