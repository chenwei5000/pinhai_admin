<template>

<el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="60%"
             top="10vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">
  <el-checkbox v-model="hasRECEIVING">显示RECEIVING</el-checkbox>
  <div class="ph-table">
    <el-table
      ref="table"
      style="width: 100%"
      stripe
      border
      highlight-current-row
      cell-class-name="ph-cell"
      header-cell-class-name="ph-cell-header"
      :data="listData"
      :max-height="tableMaxHeight"
      @selection-change="handleSelectionChange"
      @row-dblclick="handleDoubleClick"
      :default-sort="{prop: 'skuCode', order: 'ascending'}"
      show-summary
      :summary-method="getSummaries"
      id="table"
    >
      <el-table-column prop="shipmentId" label="ID" min-width="150" ></el-table-column>
      <el-table-column prop="etdFormatTime" label="发柜时间" min-width="90" ></el-table-column>
      <el-table-column prop="shipmentStatus" label="状态" min-width="110" ></el-table-column>
      <el-table-column prop="anticipateReceivingFormatTime" label="到货时间" min-width="110"></el-table-column>
      <el-table-column prop="shipmentType" label="类型" min-width="80" ></el-table-column>
      <el-table-column prop="portOfLoading" label="港口" min-width="110" ></el-table-column>
      <el-table-column prop="warehouseName" label="收货仓库" min-width="110"></el-table-column>
      <el-table-column prop="shippedQty" label="发货数" min-width="80"></el-table-column>
      <el-table-column prop="receivedQty" label="收货数" min-width="80"></el-table-column>
      <el-table-column prop="sevenAmendAvgQty" label="日均销量" min-width="80"></el-table-column>
      <el-table-column prop="reservedStockSoldOutTime" label="售罄日期" min-width="110"></el-table-column>
      <el-table-column prop="containerSoldOutDay" label="断货天数" width="110"></el-table-column>
    </el-table>
  </div>
</el-dialog>
</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'
  import phEnumModel from '@/api/phEnum'
  import {checkPermission} from "@/utils/permission";
  import { parse } from 'path'

  export default {
    components: {
    },
    props: {
    },
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),

      hasExport(){
        return true;
      },

      dialogTitle(){
      return  `产品 [ ${this.data.skuCode} / ${this.data.productName}  ${this.data.color?this.data.color: ""} ]销售情况`;
      },
       
      listData(){
        if ( this.hasRECEIVING) {
          return this.tableData;
        }
        return this.tableData.filter( item => item.shipmentStatus != 'RECEIVING');
      }
    },

    filters: {
      currency: currency
    },

    data() {
      return {
          tableData: [

          ],
          dialogVisible: false,
          data: {},
          // 表格最大高度
          tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,
          hasRECEIVING: false
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      })
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
      },

      /* 多选功能 */
      handleSelectionChange(val) {
        this.selected = val
      },

      handleDoubleClick(row){
      },

      closeDialog(){
        this.tableData = [];
        this.dialogVisible = false;
      },

      openDialog(row){
        let items = row.shipmentItems;
        if ( row != null && items != null){
          this.data = row;
          items.forEach((element,i) => {
            this.tableData[i] = items[i];
            this.tableData[i].sevenAmendAvgQty = row.sevenAmendAvgQty;
            this.tableData[i].reservedStockSoldOutTime = row.reservedStockSoldOutTime;
          });
        }
        if ( row.reservedQty > 0){
          this.tableData.unshift({
             shipmentStatus: "Reserved",
             reservedStockStartTime: row.reservedStockStartTime,
             shippedQty: row.reservedQty,
             receivedQty: 0,
             sevenAmendAvgQty: row.sevenAmendAvgQty,
             reservedStockSoldOutTime: row.stockSoldOutTime 
          });
        }

         this.tableData.unshift({
             shipmentStatus: "在库",
             receivedQty: row.inStockQty,
             sevenAmendAvgQty: row.sevenAmendAvgQty,
             reservedStockSoldOutTime: row.stockSoldOutTime 
          });
        this.dialogVisible = true;
      },

       /*汇总数据*/
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {  
          if (column.property == 'shipmentId') {
            const values = data.map(item => item[column.property]);
            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);
            sums[index] = '在途合计';
          }

          if (column.property == 'shippedQty') {
            const values = data.filter((item) => {
              return item.shipmentStatus != 'RECEIVING';
            })
            .map(item => {
                return Number(item[column.property])
            }
           );
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
            } else {
              sums[index] = 'N/A';
            }
          }
        });
        return sums;
      },
    
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .panel-heading {
    color: #444;
    border: 1px #cfd9db solid;
    width: 100%;
  }

  .panel-title {
    display: table-cell;
    vertical-align: middle;
    padding: 0 10px;
  }

</style>

