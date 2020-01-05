<template>

  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">

    <!-- 表格工具条 添加、导入、导出等 -->
    <tableToolBar
      v-bind="toolbarConfig"
      @onToolBarAdd="onToolBarAdd"
      @onToolBarEdit="onToolBarEdit"
      @onToolBarDelete="onToolBarDelete"
      @onToolBarDownloadTpl="onToolBarDownloadTpl"
      @onToolBarDownloadData="onToolBarDownloadData"
      @onToolBarImportData="onToolBarImportData"
    >
    </tableToolBar>

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
      :default-sort="{prop: 'invoiceDate', order: 'ascending'}"
      id="table"
    >
      <el-table-column prop="invoiceNo" label="发票号" width="180">
        <template slot-scope="scope">
          <el-input v-model.trim="scope.row.invoiceNo"
                    maxlength="50"
                    size="mini"
                    style="width: 170px;margin: 3px 0;" placeholder="发票号"></el-input>

        </template>
      </el-table-column>

      <el-table-column prop="invoiceDate" label="开票日期" width="140">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.invoiceDate"
            format="yyyy-MM-dd"
            type="date"
            @input="updateInput"
            style="width: 130px"
            size="mini"
            placeholder="开票日期"></el-date-picker>
        </template>
      </el-table-column>

      <el-table-column prop="amount" label="发票金额" width="130">
        <template slot-scope="scope">
          <el-input v-model.trim="scope.row.amount"
                    show-word-limit
                    size="mini"
                    style="width: 120px" placeholder="发票金额" clearable></el-input>
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
            <el-table-column prop="name" label="项目" align="center" width="100">
              <template slot-scope="scope">
                <el-input type="textarea" v-model="scope.row.name"
                          rows="1"
                          style="width: 90px;margin: 3px 0;"
                          show-word-limit></el-input>

              </template>
            </el-table-column>

            <el-table-column prop="model" label="规格型号" align="center" width="100">
              <template slot-scope="scope">
                <el-input type="textarea" v-model="scope.row.model"
                          rows="1"
                          style="width: 90px;margin: 3px 0;"
                          show-word-limit></el-input>

              </template>
            </el-table-column>

            <el-table-column prop="unit" label="单位" align="center" width="100">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.unit"
                          maxlength="50"
                          size="mini"
                          style="width: 90px;margin: 3px 0;" placeholder="单位"></el-input>

              </template>
            </el-table-column>

            <el-table-column prop="qty" label="数量" align="center" width="100">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.qty"
                          maxlength="50"
                          size="mini"
                          style="width: 90px;margin: 3px 0;" placeholder="数量"></el-input>

              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" align="center" width="100">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.price"
                          maxlength="50"
                          size="mini"
                          style="width: 90px;margin: 3px 0;" placeholder="单价"></el-input>

              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" align="center" width="100">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.amount"
                          maxlength="50"
                          size="mini"
                          style="width: 90px;margin: 3px 0;" placeholder="金额"></el-input>

              </template>
            </el-table-column>
            <el-table-column prop="taxRate" label="税率%" align="center" width="100">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.taxRate"
                          maxlength="50"
                          size="mini"
                          style="width: 90px;margin: 3px 0;" placeholder="税率"></el-input>

              </template>
            </el-table-column>
            <el-table-column prop="tax" label="税额" align="center" width="100">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.tax"
                          maxlength="50"
                          size="mini"
                          style="width: 90px;margin: 3px 0;" placeholder="税额"></el-input>

              </template>
            </el-table-column>


            <!--默认操作列-->
            <el-table-column label="操作"
                             no-export="true" align="center"
                             width="50" fixed="right">
              <template slot-scope="scope">
                <el-button type="danger" size="mini"
                           id="ph-table-del" icon="el-icon-refresh" circle
                           @click="onDefaultDetailDelete(scope.row)">

                </el-button>
              </template>
            </el-table-column>

          </el-table>
        </template>

      </el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation"
                       no-export="true" align="center"
                       width="100" fixed="right">
        <template slot-scope="scope">

          <el-button type="success" size="mini"
                     id="ph-table-del" icon="el-icon-circle-plus-outline" circle
                     @click="onDefaultDetailAdd(scope.row)">
          </el-button>

          <el-button v-if="hasDelete" type="danger" size="mini"
                     id="ph-table-del" icon="el-icon-delete" circle
                     @click="onDefaultDelete(scope.row)">

          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'
  import tableToolBar from '@/components/PhTableToolBar'
  import moment from 'moment'

  export default {
    components: {
      tableToolBar
    },
    props: {
      primary: {
        type: [Object],
        default: null
      },
      selCurrency: {
        type: [Object],
        default: null
      }
    },
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),
      hasExecute() {
        if ([2, 3, 4, 5, 6, 7, 8].indexOf(this.primary.status) > -1) {
          return true;
        }
        else {
          return false;
        }
      },
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

        //操作按钮控制
        hasOperation: true,
        hasAdd: true,
        hasEdit: true,
        hasDelete: true,

        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用

        // 表格加载效果
        loading: false,

        // 记录修改的那一行
        row: {},

        // 表格工具条配置
        toolbarConfig: {
          hasEdit: false,
          hasDelete: false,
          hasAdd: true,
          hasExportTpl: false,
          hasExport: false,
          hasImport: false,
        }
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
        this.search();
        this.loading = false;
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
          if (column.property == 'invoiceNo') {
            const values = data.map(item => item[column.property]);
            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);
            sums[index] = '合计: ' + sums[index] + ' 行';
          }

          if (column.property == 'amount') {
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
              sums[index] = currency(sums[index], this.selCurrency.symbolLeft);
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


      addInvoice(invoice) {
        if (invoice) {
          let addFlg = true;
          this.data.forEach(r => {
            if (r.invoiceNo == invoice.InvoiceCode + invoice.InvoiceNum) {
              addFlg = false;
            }
          });

          if (addFlg) {
            let details = [];
            for (var i = 0; i < invoice.CommodityName.length; i++) {

              details.push({
                name: invoice.CommodityName[i] ? invoice.CommodityName[i].word : '',
                model: invoice.CommodityType[i] ? invoice.CommodityType[i].word : '',
                unit: invoice.CommodityUnit[i] ? invoice.CommodityUnit[i].word : '',
                qty: invoice.CommodityNum[i] ? invoice.CommodityNum[i].word : '',
                price: invoice.CommodityPrice[i] ? invoice.CommodityPrice[i].word : '',
                taxRate: invoice.CommodityTaxRate[i] ? invoice.CommodityTaxRate[i].word.replace('%', '') : '',
                tax: invoice.CommodityTax[i] ? invoice.CommodityTax[i].word : '',
                amount: invoice.CommodityAmount[i] ? invoice.CommodityAmount[i].word : '',
              });
            }

            this.data.push({
              invoiceNo: invoice.InvoiceCode + invoice.InvoiceNum,
              invoiceDate: moment(invoice.InvoiceDate, "YYYY年MM月DD日").format("YYYY-MM-DD"),
              amount: invoice.AmountInFiguers,
              tax: invoice.TotalTax,
              seller: invoice.SellerName + ":" + invoice.SellerRegisterNum,
              buyer: invoice.PurchaserName + ":" + invoice.PurchaserRegisterNum,
              invoiceDetails: details
            });
          }
        }
        else {
          this.data.push({
            invoiceNo: '',
            invoiceDate: '',
            amount: '',
            tax: '',
            seller: '',
            buyer: '',
            invoiceDetails: [{
              name: '',
              model: '',
              unit: '',
              qty: '',
              price: '',
              taxRate: '',
              tax: '',
              amount: '',
            }]
          });
        }
        this.search();
        console.log(this.tableData);
      },

      /********************* 操作按钮相关方法  ***************************/
      onDefaultDetailAdd(row) {
        row.invoiceDetails.push({
          name: '',
          model: '',
          unit: '',
          qty: '',
          price: '',
          taxRate: '',
          tax: '',
          amount: '',
        })
      },
      onDefaultDetailDelete(row) {
        this.$confirm('确认清空该项目内容吗？', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              row.name = '';
              row.model = '';
              row.unit = '';
              row.qty = '';
              row.price = '';
              row.taxRate = '';
              row.tax = '';
              row.amount = '';
              done();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },

      /* 行删除功能 */
      onDefaultDelete(row) {
        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              let idx = null;

              this.data.forEach((item, index) => {
                  if (item.invoiceNo === row.invoiceNo) {
                    idx = index;
                    return;
                  }
                }
              );
              this.date = this.data.splice(idx, 1);
              this.search();

              done();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },

      updateInput(val) {
        this.$forceUpdate();
      },

      /********************* 工具条按钮  ***************************/
      onToolBarAdd() {
        this.addInvoice(null);
      },
      onToolBarEdit() {

      },
      onToolBarDelete() {

      },
      onToolBarDownloadTpl() {

      },
      onToolBarDownloadData() {

      },
      onToolBarImportData() {

      }
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
