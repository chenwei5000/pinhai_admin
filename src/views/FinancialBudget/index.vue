<template>
  <el-card>
    <div class="form-class">
      <el-form :inline="true" inline-message>
        <el-form-item label="供货商" size="mini">
          <el-select
            size="mini"
            filterable
            v-model="searchParam.supplierId.value"
            style="width: 120px"
            placeholder="请选择供货商"
          >
            <el-option
              v-for="(item,idx) in supplierSelectOptions"
              :label="item.label"
              :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="最晚付款时间" label-width="120px">
          <el-date-picker
            v-model="searchParam.latestPaymentTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 150px"
            placeholder="请选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item size="mini">
          <el-button size="mini" @click="getTableData()" type="primary">查询</el-button>
          <el-button size="mini" @click="reset" type="info">重置</el-button>
          <el-button size="mini" @click="exportToExcel" type="danger" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table
          :data="tableData"
          border
          stripe
          v-loading="loading"
          element-loading-text="页面正在玩命加载中..."
          element-loading-spinner="el-icon-loading"
          show-summary
          :summary-method="getSummaries"
          height="460"
          class="tableClass"
          ref="table"
        >
          <el-table-column prop="supplierId" label="供货商ID" v-if="false"></el-table-column>
          <el-table-column prop="supplierName" label="供货商" align="center"></el-table-column>
          <el-table-column prop="symbolLeft" label="单价左侧符号" align="center" v-if="false"></el-table-column>
          <el-table-column prop="unpaidAmount" label="未付金额" align="center"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          background
          style="margin-top:40px;text-align: right; padding: 10px 10px 10px 10px"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </el-card>
</template>

<script>
import supplierModel from "@/api/supplier";

export default {
  data() {
    return {
      searchParam: {
        skuCode: "",
        supplierId: { value: null, op: "in", id: "supplierId" },
        latestPaymentTime: ""
      },
      tableData: [],
      supplierSelectOptions: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      loading: false,
      unpaidAmount: "",
      filters: ''
    };
  },
  computed: {},
  created() {
    this.getTableData();
  },
  mounted() {},

  methods: {
    getTableData() {
      this.supplierSelectOptions = supplierModel.getSelectOptions();
      this.loading = true;
      let filters = [];

      if (
        this.searchParam.supplierId.value != null &&
        this.searchParam.supplierId.value !== ""
      ) {
        filters.push({
          field: "supplier_id",
          op: "equal",
          data: `${this.searchParam.supplierId.value}`
        });
      }

      if (
        this.searchParam.latestPaymentTime != null &&
        this.searchParam.latestPaymentTime !== ""
      ) {
        filters.push({
          field: "latestPaymentTime",
          op: "le",
          data: `${this.searchParam.latestPaymentTime}`
        });
      }

      this.filters = JSON.stringify(filters);

      this.global
        .axios({
          header: {
            "TK-Authorization":
              "MUQ5RjMwRjcwMUE0NkUwRkUxNkUyMkNDNkZFNDNBOTEsMg=="
          },
          url: "/report/findFinancialBudgetCount",
          method: "GET",
          params: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            filters: JSON.stringify(filters),
            sorts: ""
          }
        })
        .then(res => {
          this.total = res.data;
        });

      this.global
        .axios({
          header: {
            "TK-Authorization":
              "MUQ5RjMwRjcwMUE0NkUwRkUxNkUyMkNDNkZFNDNBOTEsMg=="
          },
          url: "/report/findFinancialBudgetList",
          method: "GET",
          params: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            filters: JSON.stringify(filters),
            sorts: ""
          }
        })
        .then(res => {
          this.tableData = res.data;
          this.loading = false;
        });

      this.global
        .axios({
          header: {
            "TK-Authorization":
              "MUQ5RjMwRjcwMUE0NkUwRkUxNkUyMkNDNkZFNDNBOTEsMg=="
          },
          url: "/report/findFinancialBudgetCurrencySummary",
          method: "GET",
          params: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            filters: JSON.stringify(filters),
            sorts: ""
          }
        })
        .then(res => {
          this.unpaidAmount = res.data;
        });
    },
    reset() {
      this.searchParam.skuCode = "";
      this.searchParam.supplierId.value = "";
      this.searchParam.latestPaymentTime = "";
      this.getTableData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getTableData();
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },

    // 汇总数据
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (column.property == "unpaidAmount") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          let a = this.unpaidAmount.usd + "\r\n" + this.unpaidAmount.cny;
          sums[1] = a;
          sums[index];
        }
      });
      return sums;
    },
    exportToExcel() {
      import("@/vendor/Export2Excel").then(excel => {
        this.loading = true;
        excel.export_el_table_to_excel({
          table: this.$refs.table,
          downloadUrl: `/report/findFinancialBudgetList?currentPage=1&pageSize=500&filters=${[
            encodeURI(this.filters)
          ]}`,
          filename: "财务预算-内容"
        });
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped type="text/less" lang="scss">
.form-class {
  padding: 0px 20px 1px 10px;
  font-size: 12px;
  position: relative;
  border-bottom: 1px solid #f6f6f6;
  color: #333;
  border-radius: 2px 2px 0 0;
  /* font-weight: bold !important;
  line-height: 26px !important;
  color: #333; */
}
.el-table {
  overflow: visible !important;
}
.tableClass {
  th {
    padding: 0px !important;
    height: 30px;
  }
  td {
    padding: 0px !important;
    height: 30px;
  }
}
</style>
