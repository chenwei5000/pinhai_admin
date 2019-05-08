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

  import {parseTime} from '@/utils';


  export default {

    data() {
      return {
        names: [],
        title: '仓库库存', // 页面标题

        tableConfig: {
          url: '/warehouseStocks/stocks', // 资源URL
          relations: ["warehouse"],//关联数据字典

          hasNew:  false,
          hasEdit: false,
          hasView: false,
          hasDelete: false,
          hasOperation: false,

          //表格定义 具体可参考https://element.eleme.cn/#/zh-CN/component/table#table-attributes
          // https://femessage.github.io/el-data-table/
          tableAttrs: {
            stripe: true,
            border: true,
            "highlight-current-row": true
          },

          // 表格列定义, 具体可参考 https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes
          columns: [
            {prop: 'id', label: 'ID', sortable: 'custom', hidden: true},
            {prop: 'skuCode', label: 'SKU编码', width: 150, fixed: 'left'},
            {prop: 'warehouseName', label: '收货仓库', width: 130},
            {prop: 'productName', label: '产品名', sortable: 'custom'},
            {prop: 'productModel', label: '型号', hidden: true},
            {prop: 'productColor', label: '颜色', hidden: true},
            {prop: 'productSize', label: '尺码', hidden: true},
            {prop: 'cartonSpecCode', label: '箱规', width: 130},
            {prop: 'numberOfCarton', label: '装箱数', width: 100},
            {prop: 'qty', label: '件数', width: 80},
            {prop: 'cartonQty', label: '箱数', fixed: 'right', width: 80}
          ],

          // 搜索区块定义, 具体可参考 https://github.com/FEMessage/el-form-renderer/blob/master/README.md
          searchForm: [
            {
              $type: 'select',
              $id: 'warehouseId',
              label: '收货仓库',
              $el: {
                op: 'bw',
                placeholder: '请输入收货仓库'
              }
            },
            {
              $type: 'input',
              $id: 'skuCode',
              label: 'SKU编码',
              $el: {
                op: 'bw',
                placeholder: '请输入SKU编码'
              }
            }

          ],
          //  弹窗表单, 用于新增与修改, 详情配置参考el-form-renderer
          // https://github.com/FEMessage/el-form-renderer/blob/master/README.md
          form: [
            {
              $type: 'input',
              $id: 'warehouseName',
              label: '收货仓库',
              $el: {
                placeholder: '请输入收货仓库'
              },
              rules: [
                {
                  required: true,
                  message: '请输入收货仓库',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'skuCode',
              label: 'SKU编码',
              $el: {
                placeholder: '请输入SKU编码'
              },
              rules: [
                {
                  message: '请输入SKU编码',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'productName',
              label: '产品名',
              $el: {
                placeholder: '请输入产品名'
              },
              rules: [
                {
                  message: '请输入产品名',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'select',
              $id: 'productModel',
              label: '型号',
              $el: {
                placeholder: '请输入型号'
              },
              rules: [
                {
                  message: '请输入型号',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'productColor',
              label: '颜色',
              $el: {
                placeholder: '请输入颜色'
              },
              rules: [
                {
                  message: '请输入颜色',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'productSize',
              label: '尺码',
              $el: {
                placeholder: '请输入尺码'
              },
              rules: [
                {
                  message: '请输入尺码',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'productSize',
              label: '箱规',
              $el: {
                placeholder: '请输入箱规'
              },
              rules: [
                {
                  message: '请输入箱规',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'numberOfCarton',
              label: '装箱数',
              $el: {
                placeholder: '请输入装箱数'
              },
              rules: [
                {
                  message: '请输入装箱数',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'cartonQty',
              label: '库存箱数',
              $el: {
                placeholder: '请输入库存箱数'
              },
              rules: [
                {
                  message: '请输入库存箱数',
                  trigger: 'blur'
                }
              ]
            },
            {
              $type: 'input',
              $id: 'qty',
              label: '库存件数',
              $el: {
                placeholder: '请输入库存件数'
              },
              rules: [
                {
                  message: '请输入库存件数',
                  trigger: 'blur'
                }
              ]
            }
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
    },

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>


</style>
