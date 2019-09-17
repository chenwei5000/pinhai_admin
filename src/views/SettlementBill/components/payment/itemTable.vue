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
      :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
      id="table"
    >
      <el-table-column prop="pdRemarks" label="付款项目" min-width="150">
      </el-table-column>

      <el-table-column prop="pdNumber" label="数量" width="150">
      </el-table-column>

      <el-table-column prop="pdPrice" label="单价" width="150">
        <template slot-scope="scope">
          {{scope.row.pdPrice, primary.currency ? primary.currency.symbolLeft : '' | currency}}
        </template>
      </el-table-column>

      <el-table-column prop="pdAmount" label="金额" width="150">
        <template slot-scope="scope">
          {{scope.row.pdAmount, primary.currency ? primary.currency.symbolLeft : '' | currency}}
        </template>
      </el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation"
                       no-export="true"
                       width="120" fixed="right">
        <template slot-scope="scope">

          <el-button v-if="hasEdit" size="small" icon="el-icon-edit" circle
                     @click="onDefaultEdit(scope.row)" type="primary" id="ph-table-edit">
          </el-button>

          <el-button v-if="hasDelete" type="danger" size="mini"
                     id="ph-table-del" icon="el-icon-delete" circle
                     @click="onDefaultDelete(scope.row)">

          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑明细对话框 -->
    <itemDialog @modifyCBEvent="modifyCBEvent" ref="itemDialog" :primary="primary">
    </itemDialog>
  </div>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'
  import tableToolBar from '@/components/PhTableToolBar'
  import itemDialog from './itemDialog'

  export default {
    components: {
      tableToolBar,
      itemDialog
    },
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
        financeBills: [], // 采购预付款单

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

        //类型、数量、单价、总金额、备注
        this.data.push({
          pdNumber: 1,
          pdPrice: this.primary.unpaidAmount,
          pdRemarks: '购买产品的费用',
          financeBillId: null,
          pdAmount: this.primary.unpaidAmount
        });

        console.log(this.primary);

        let url = "/financeBills";
        let filters = [
          {"field": "relevanceCode", "op": "eq", "data": this.primary.procurementOrderCode},
          {"field": "status", "op": "eq", "data": 2},
        ]
        url += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});
        url += "&sort=id&dir=asc";

        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data || [];
            res.forEach(r => {
              this.data.push({
                pdNumber: 1,
                financeBillId: r.id,
                pdPrice: -r.paymentAmount,
                pdRemarks: `预付款单[${r.code}]冲销`,
                pdAmount: -r.paymentAmount
              });
            });
          })
          .catch(err => {
          });

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
          if (column.property == 'costManagementTitle') {
            const values = data.map(item => item[column.property]);
            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);
            sums[index] = '合计: ' + sums[index] + ' 行';
          }

          if (column.property == 'phNumber') {
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
            } else {
              sums[index] = 'N/A';
            }
          }

          if (column.property == 'pdAmount' || column.property == 'pdPrice') {
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
      /* 行修改功能 */
      onDefaultEdit(row) {
        if (row.financeBillId) {
          this.$message.error("冲销项目不能修改只能删除!");
        }
        else {
          this.$refs.itemDialog.openDialog(row);
        }
      },

      /* 行删除功能 */
      onDefaultDelete(row) {
        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              let idx = null;

              this.data.forEach((item, index) => {
                  if (item.pdRemarks === row.pdRemarks) {
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

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        let addFlg = true;
        this.data.forEach((item, index, arr) => {
          if (item.pdRemarks == object.pdRemarks) {
            arr[index] = object;
            addFlg = false;
          }
        });

        if (addFlg) {
          this.data.push(object);
        }
        this.data.push({});
        this.data.pop();
        this.search();
      },

      /********************* 工具条按钮  ***************************/
      onToolBarAdd() {
        this.$refs.itemDialog.openDialog(null);
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

