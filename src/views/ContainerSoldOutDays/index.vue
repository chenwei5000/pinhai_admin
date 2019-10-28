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

  import phSearchItems from '../../components/phSearchItems'
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        title: '途断货情况',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('CountryResource_create'),
          hasEdit: checkPermission('CountryResource_update'),
          hasDelete: checkPermission('CountryResource_remove'),
          // hasView: checkPermission('CountryResource_get'),
          hasExportTpl: checkPermission('CountryResource_export'),
          hasExport: checkPermission('CountryResource_export'),
          hasImport: checkPermission('CountryResource_import'),

          url: '/amazonStocks/containerSoldOutDays',
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //表格内容显示
          columns: [
            {type: checkPermission('CountryResource_remove') ? 'selection' : '', hidden: !checkPermission('CountryResource_remove')},
            {prop: 'skuCode', label: 'SKU编码', sortable: 'custom', "min-width": 120, fixed: 'left'},
            {prop: 'productName', label: '产品名', "min-width": 120},
            {prop: 'categoryName', label: '分类', "min-width": 120},
            {prop: 'fnSku', label: 'FNSKU', "min-width": 120 , hidden: 'false'},
            {prop: 'groupName', label: '产品款式', "min-width": 120, hidden: 'false'},
            {prop: 'model', label: '型号', "min-width": 120, hidden: 'false'},
            {prop: 'color', label: '颜色', "min-width": 120, hidden: 'false'},
            {prop: 'size', label: '尺码', "min-width": 120, hidden: 'false'},
            {prop: 'vipLevel', label: 'Vip级别', "min-width": 120},
            {prop: 'sevenAmendQty', label: '7日销量修正', "min-width": 120},
            {prop: 'inStockQty', label: '库存', "min-width": 120},
            {prop: 'onPassageQty', label: '待入库', "min-width": 120},
            {prop: 'stockSoldOutTime', label: '库售罄时间', "min-width": 120},
            {prop: 'allSoldOutTime', label: '途售罄时间', "min-width": 120},
            {prop: 'containerSoldOutTime', label: '途断货日期', "min-width": 120},
            {prop: 'containerSoldOutDay', label: '途断货天数', "min-width": 120},
            {prop: 'containerSoldOutCartonQty', label: '途缺口箱数', "min-width": 120},
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.name,
            phSearchItems.status()
          ],
          //提交后执行
          afterConfirm: () => {
          }
        }
      }
    },
    computed: {},
    methods: {
      statusClassName({row}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      }
    },
    watch: {}
  }
</script>

<style scoped>


</style>
