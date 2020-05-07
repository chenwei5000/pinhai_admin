<template>
  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="80%"
             top="10vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="chart-container">
      <StockChangeChart height="100%" width="100%" :searchParam="fromParent" :primary="primary" v-if="isExist"
                        ref="StockChangeChart"/>
    </div>
  </el-dialog>
</template>

<script>
  import StockChangeChart from '@/components/Charts/StockChangeChart'

  export default {
    name: 'MixChart',
    data() {
      return {
        dialogVisible: false,
        primary: {
          xAxisData: [],
          yAxisData1: [],
          yAxisData2: []
        },
        data: {},
        isExist: false,
      }
    },
    props: {
      fromParent: {
        type: Object,
        default: () => {
        }
      }
    },
    computed: {
      dialogTitle() {
        return `产品 [ ${this.data.skuCode} / ${this.data.productName}  ${this.data.color ? this.data.color : ""} ]销售情况`;
      }
    },
    components: {StockChangeChart},
    methods: {
      initData() {
        let url = "/amazonSales/weekProductSales/";
        if (this.fromParent.merchantId == null) {
          this.$message.error("请选择销售渠道！")
          return false;
        } else {
          url += this.fromParent.merchantId;
        }
        if (this.fromParent.week != null) {
          url += "?weekNum=" + this.fromParent.week;
        }
        if (this.fromParent.categoryId != null) {
          if (url.indexOf('?') != -1) {
            url += "&cid=" + this.fromParent.categoryId;
          } else {
            url += "?cid=" + this.fromParent.categoryId;
          }
        }
        if (this.data.skuCode != null) {
          url += "&sku=" + this.data.skuCode;
        }
        url += "&type=d";
        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data;
            res.forEach(element => {
              this.primary.xAxisData.push(element.formatStartTime);
              this.primary.yAxisData1.push(element.inStockQty);
              this.primary.yAxisData2.push(element.totalStockQty - element.inStockQty)
            });
            this.isExist = true;
          })
          .catch(err => {
          })
      },
      closeDialog() {
        this.primary.xAxisData = [];
        this.primary.yAxisData1 = [];
        this.primary.yAxisData2 = [];
        this.dialogVisible = false
        this.isExist = false
      },

      openDialog(row) {
        this.dialogVisible = true;
        this.data = row;
        this.initData();
      },
    }

  }
</script>

<style scoped>
  .chart-container {
    position: relative;
    width: 100%;
    height: 450px;
  }
</style>

