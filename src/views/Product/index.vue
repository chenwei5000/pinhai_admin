<template>
  <div class="app-container">

    <div class="ph-card">

      <!-- title -->
      <ph-card-header :title = "title" type="table">

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
  import cartonspecModel from '@/api/cartonspec'
  import categoryModel from '@/api/category'

  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'

  export default {

    data() {
      return {
        categoryNames : [],
        specs: [],

        title: '产品管理', // 页面标题
        tableConfig: {
          url: '/products', // 资源URL
          relations: ["supplier","cartonSpec", "category"],

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
            {prop: 'imgUrl', label: '图片'},
            {prop: 'skuCode', label: 'SKU','min-width': 200},
            {prop: 'categoryId', label: '分类ID', sortable: 'custom', hidden: true},
            {prop: 'category.name', label: '分类名称',width:80},
            {prop: 'groupName', label: '款式', sortable: 'custom',width:80},
            {prop: 'name', label: '产品名称',  'min-width': 250},
            {prop: 'fnSku', label: 'FN-SKU', hidden: true},
            {prop: 'model', label: '型号', hidden: true},
            {prop: 'color', label: '颜色', hidden: true},
            {prop: 'size', label: '尺码', hidden: true},
            {prop: 'grossWeight', label: '净重(Kg)',width:80},
            {prop: 'sizeInfo', label: '体积', hidden: true},
            {prop: 'length', label: '长(Cm)', hidden: true},
            {prop: 'width', label: '宽(Cm)', hidden: true},
            {prop: 'height', label: '高(Cm)', hidden: true},
            {prop: 'supplierId', label: '供货商', hidden: true},
            {prop: 'supplier.name', label: '供货商名称',  'min-width': 100, 'label-class-name': 'ph-header-small'},
            {prop: 'currencyId', label: '结算货币', hidden: true},
            {prop: 'currencyName', label: '结算货币', hidden: true},
            {prop: 'price', label: '采购价', hidden: true},
            {prop: 'leadDay', label: '交期(天)', hidden: true},
            {prop: 'cartonSpecId', label: '箱规', hidden: true},
            {prop: 'cartonSpec.code', label: '箱规', 'min-width': 150},
            {prop: 'numberOfCarton', label: '装箱数量', width: 80, 'label-class-name': 'ph-header-small'},
            {prop: 'vipLevel', label: 'Vip级别', hidden: true},
            {prop: 'oversize', label: '超大', hidden: true},
            {prop: 'parentSku', label: 'Parent Asin', hidden: true},
            {prop: 'comment', label: '备注', hidden: true},
            phColumns.status

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
              $options: function () {
                var _categoryNames = [];
                const loaddata = async function () {
                  categoryModel.getCategories().then(categorys => {
                    categorys.forEach(category => {
                      _categoryNames.push({
                        label: category.name,
                        value: category.id
                      });
                    });
                    return _categoryNames;
                  });
                };
                loaddata();
                return _categoryNames;
              },

            },
            {
              $type: 'input',
              $id: 'groupName',
              label: '款式',
              $el: {
                op: 'bw',
                placeholder: '请输入款式'
              }
            },
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
              $options: function () {
                var _categoryNames = [];
                const loaddata = async function () {
                  categoryModel.getCategories().then(categorys => {
                    categorys.forEach(category => {
                      _categoryNames.push({
                        label: category.name,
                        value: category.id
                      });
                    });
                    return _categoryNames;
                  });
                };
                loaddata();
                return _categoryNames;
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'groupName',
              label: '款式',
              $el: {
                placeholder: '请输入款式'
              },
            },
            phFromItems.name,
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
              $options: supplierModel.getSuppilerOptions,

            },
            {
              $type: 'select',
              $id: 'cartonSpecId',
              label: '箱规',
              $el: {
                placeholder: '请选择箱规'
              },
              $options: function () {
                var _specs = []
                const loadData = async function () {
                  cartonspecModel.getCartonspecs().then(cartonSpecs => {
                    cartonSpecs.forEach(cartonSpec => {
                      _specs.push({
                        label: cartonSpec.code,
                        value: cartonSpec.id
                      });
                    });
                    return _specs;
                  });
                };

                loadData();
                return _specs;
              }
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
