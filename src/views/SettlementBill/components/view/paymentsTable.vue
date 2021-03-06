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
      :summary-method="getSummaries"
      @selection-change="handleSelectionChange"
      :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
      id="table"
    >
      <el-table-column prop="code" label="付款单编码" sortable width="140" align="center">
      </el-table-column>

      <el-table-column prop="statusName" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag size="mini"
                  :type="scope.row.status === 1
            ? 'warning' : scope.row.status === 2
            ? 'danger' : 'success'"
                  disable-transitions>{{ scope.row.statusName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="approvalContent" label="付款说明"  align="center">
      </el-table-column>

      <el-table-column prop="payableAmount" label="申请金额" width="100" align="right">
        <template slot-scope="scope">
          {{scope.row.payableAmount, scope.row.currency ? scope.row.currency.symbolLeft : '' | currency}}
        </template>
      </el-table-column>

      <el-table-column prop="paymentAmount" label="实付金额" width="100" align="right">
        <template slot-scope="scope">
          {{scope.row.paymentAmount ? scope.row.paymentAmount : 0, scope.row.currency ? scope.row.currency.symbolLeft :
          '' | currency}}
        </template>
      </el-table-column>

      <el-table-column prop="advanceAmount" label="预付冲账金额" width="100"  align="right">
        <template slot-scope="scope">
          {{scope.row.advanceAmount, scope.row.currency ? scope.row.currency.symbolLeft : '' | currency}}
        </template>
      </el-table-column>

      <el-table-column prop="invoicedAmount" label="开票金额" width="100" align="right">
        <template slot-scope="scope">
          {{scope.row.invoicedAmount, scope.row.currency ? scope.row.currency.symbolLeft : '' | currency}}
        </template>
      </el-table-column>


      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation"
                       no-export="true" align="center"
                       width="50" fixed="right">
        <template slot-scope="scope">

          <el-button v-if="hasView" type="primary" size="mini"
                     id="ph-table-del" icon="el-icon-view" circle
                     @click="onDefaultView(scope.row)">
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!--查看对话框-->
    <paymentsViewDialog ref="paymentsViewDialog">
    </paymentsViewDialog>

  </div>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency, parseTime} from '@/utils'
  import paymentsViewDialog from './paymentsViewDialog'

  export default {
    components: {
      paymentsViewDialog
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
        // 选择项
        statusSelectOptions: [],
        prioritySelectOptions: [],

        hasOperation: true,
        hasView: true,

        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,

        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 多选记录对象
        selected: [],

        //数据 TODO: 根据实际情况调整
        url: "/procurementPaymentOrders", // 资源URL
        downloadUrl: "", //下载Url
        filters: [
          {
            field: "settlementBillId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ],   //搜索对象
        relations: ["currency"],  // 关联对象
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
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
        this.getList();
      })
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        this.loading = true;
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
          if (column.property == 'code') {
            const values = data.map(item => item[column.property]);
            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);
            sums[index] = '合计: ' + sums[index] + ' 行';
          }

          if (column.property == 'payableAmount' ||
            column.property == 'paymentAmount' ||
            column.property == 'advanceAmount' ||
            column.property == 'invoicedAmount'
          ) {
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

      /*获取列表*/
      getList() {
        let url = this.url;
        let params = '';

        if (!url) {
          console.warn('url 为空, 不发送请求')
          return
        }

        // 处理查询
        if (this.filters && this.filters.length > 0) {
          params += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": this.filters});
        }

        // 处理关联加载
        if (this.relations && this.relations.length > 0) {
          params += "&relations=" + JSON.stringify(this.relations);
        }

        // 请求开始
        this.loading = true

        //获取数据
        this.global.axios
          .get(url + params)
          .then(resp => {
            let res = resp.data
            let data = res || []

            this.data = data
            this.search()

            this.total = res.length || 0
            this.loading = false
            /**
             * 请求返回, 数据更新后触发, 返回(data, resp) data是渲染table的数据, resp是请求返回的完整response
             * @event update
             */
            this.$emit('update', data, res)
          })
          .catch(err => {
            /**
             * 请求数据失败，返回err对象
             * @event error
             */
            this.$emit('error', err)
            this.loading = false
          })
      },

      /* 多选功能 */
      handleSelectionChange(val) {
        this.selected = val
      },

      /********************* 搜索相关方法  ***************************/
      /*本地搜索*/
      search() {
        this.tableData = this.data;
      },

      /*本地重置搜索*/
      resetSearch() {
        this.$refs.searchForm.resetFields();
        this.search();
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 行删除按钮 */
      onDefaultView(row) {
        // 弹窗
        this.$refs.paymentsViewDialog.openDialog(row.id);
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

