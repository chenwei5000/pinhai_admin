<template>

  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">

    <!--表格 TODO:根据实际情况调整 el-table-column  -->
    <el-table
      ref="table"
      style="width: 100%"
      stripe
      border
      highlight-current-row
      :row-class-name="dangerClassName"
      cell-class-name="ph-cell"
      header-cell-class-name="ph-cell-header"
      :data="tableData"
      v-loading="loading"
      show-summary
      :summary-method="getSummaries"
      :default-sort="{prop: 'invoiceNumber', order: 'ascending'}"
      id="table"
    >
      <el-table-column prop="invoiceNo" label="发票号" width="130">
      </el-table-column>

      <el-table-column prop="invoiceDate" label="开票日期" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.invoiceDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="amount" label="发票金额" width="100">
        <template slot-scope="scope">
          {{scope.row.amount, primary.currency ? primary.currency.symbolLeft : '' | currency}}
        </template>
      </el-table-column>

      <el-table-column prop="company" label="内容" min-width="150">
        <template slot-scope="scope">
          <el-table :data="scope.row.invoiceDetails"
                    style="width: 100%"
                    stripe
                    border
                    highlight-current-row
                    cell-class-name="ph-cell"
                    header-cell-class-name="ph-cell-header"
          >
            <el-table-column prop="name" label="项目" align="center">
            </el-table-column>

            <el-table-column prop="model" label="规格型号" align="center">
            </el-table-column>

            <el-table-column prop="unit" label="单位" align="center">
            </el-table-column>

            <el-table-column prop="qty" label="数量" align="center">
            </el-table-column>

            <el-table-column prop="price" label="单价" align="center">
              <template slot-scope="scope">
                {{scope.row.price, primary.currency ? primary.currency.symbolLeft : '' | currency}}
              </template>
            </el-table-column>

            <el-table-column prop="amount" label="金额" align="right">
              <template slot-scope="scope">
                {{scope.row.amount, primary.currency ? primary.currency.symbolLeft : '' | currency}}
              </template>
            </el-table-column>

            <el-table-column prop="taxRate" label="税率%" align="center">
              <template slot-scope="scope">
                {{scope.row.taxRate}}%
              </template>
            </el-table-column>

            <el-table-column prop="tax" label="税额" align="right">
              <template slot-scope="scope">
                {{scope.row.tax, primary.currency ? primary.currency.symbolLeft : '' | currency}}
              </template>
            </el-table-column>

          </el-table>
        </template>

      </el-table-column>

    </el-table>
  </div>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency, parseTime} from '@/utils'
  import moment from 'moment'

  export default {
    components: {},
    props: {
      primary: {
        type: [Object],
        default: null
      }
    },
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),
    },
    filters: {
      currency: currency
    },

    data() {
      return {

        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,

        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
        filters: [
          {
            field: "paymentOrderId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          },
          {
            field: "type",
            op: 'eq',
            data: 'SH'
          }
        ],   //搜索对象
        relations: [],  // 关联对象

        // 表格加载效果
        loading: false,

        // 记录修改的那一行
        row: {},
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
        this.loading = true;
        //获取计划数据
        this.global.axios
          .get(`/invoices?filters=${JSON.stringify({
            "groupOp": "AND",
            "rules": this.filters
          })}&relations=${JSON.stringify(this.relations)}`)
          .then(resp => {
            let res = resp.data;
            this.data = res || [];
            this.search();
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
      },

      /********************* 表格相关方法  ***************************/
      //报警样式 TODO:根据实际情况调整
      dangerClassName({row, rowIndex}) {
        return '';
      },

      /*汇总数据*/
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];

        columns.forEach((column, index) => {
          if (column.property == 'invoiceNumber') {
            const values = data.map(item => item[column.property]);
            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);
            sums[index] = '合计: ' + sums[index] + ' 行';
          }

          if (column.property == 'price') {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] = currency(sums[index], this.primary.currency.symbolLeft);
            } else {
              sums[index] = 'N/A';
            }
          }
        });

        return sums;
      },

      /********************* 搜索相关方法  ***************************/
      /*本地搜索*/
      search() {
        this.tableData = this.data;
      },

      /*本地重置搜索*/
      resetSearch() {
        this.search();
      },

      /********************* 操作按钮相关方法  ***************************/
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

