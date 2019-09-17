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

  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'

  export default {

    data() {
      return {
        title: '货位库存', // 页面标题

        tableConfig: {
          url: '/warehouseStocks/locationStocks', // 资源URL
          hasNew: false,
          hasEdit: false,
          hasView: false,
          hasDelete: false,
          hasOperation: false,

          //表格定义 具体可参考https://element.eleme.cn/#/zh-CN/component/table#table-attributes
          // https://femessage.github.io/el-data-table/
          tableAttrs: {},

          // 表格列定义, 具体可参考 https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes
          columns: [
            phColumns.id,
            {prop: 'warehouseName', label: '仓库', 'min-width': 150},
            {prop: 'skuCode', label: 'SKU编码', 'min-width': 200, fixed: 'left'},
            {prop: 'locationCode', label: '货位', hidden: 'false'},
            {prop: 'productName', label: '产品名', fixed: 'left', 'min-width': 250},
            {prop: 'numberOfCarton', label: '装箱数', width: 100},
            {prop: 'qty', label: '库存件数', width: 100},
            {prop: 'cartonQty', label: '库存箱数', fixed: 'right', width: 100}
          ],

          // 搜索区块定义, 具体可参考 https://github.com/FEMessage/el-form-renderer/blob/master/README.md
          searchForm: [
            phSearchItems.skuCode,
            phSearchItems.warehouseId()
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
