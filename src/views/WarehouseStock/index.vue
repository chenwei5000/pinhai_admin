<template>
  <div class="app-container">
    <div class="ph-card">
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
  import phSearchItems from '../../components/phSearchItems'
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        title: '仓库库存', // 页面标题
        tableConfig: {
          //权限控制
          hasNew: checkPermission('WarehouseStockResource_create'),
          hasEdit: checkPermission('WarehouseStockResource_update'),
          hasDelete: checkPermission('WarehouseStockResource_remove'),
          // hasView: checkPermission('WarehouseStockResource_get'),
          hasExport: checkPermission('WarehouseStockResource_export'),
          hasImport: checkPermission('WarehouseStockResource_import'),

          url: '/warehouseStocks/stocks', // 资源URL
          relations: ["warehouse"],//关联数据字典
          hasView: false,
          hasOperation: false,

          //表格定义 具体可参考https://element.eleme.cn/#/zh-CN/component/table#table-attributes
          // https://femessage.github.io/el-data-table/
          tableAttrs: {},

          // 表格列定义, 具体可参考 https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes
          columns: [
            {prop: 'warehouseName', label: '仓库', 'min-width': 150},
            {prop: 'skuCode', label: 'SKU编码', 'min-width': 200, fixed: 'left'},
            {prop: 'productName', label: '产品名', 'min-width': 250},
            {prop: 'cartonSpecCode', label: '箱规', 'min-width': 150},
            {prop: 'numberOfCarton', label: '装箱数', width: 100},
            {prop: 'qty', label: '库存件数', width: 100},
            {prop: 'cartonQty', label: '库存箱数', fixed: 'right', width: 100}
          ],

          // 搜索区块定义, 具体可参考 https://github.com/FEMessage/el-form-renderer/blob/master/README.md
          searchForm: [
            phSearchItems.warehouseId(),
            phSearchItems.skuCode
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
    methods: {},

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>

</style>
