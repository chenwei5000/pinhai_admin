<template>
  <el-card>
    <div class="form-class">
      <el-form :inline="true" inline-message>
        <el-form-item label="SKU编码" size="mini">
          <el-input
            placeholder="请输入SKU编码"
            size="mini"
            v-model="searchParam.skuCode"
            @keyup.enter.native="getTableData"
            clearable
          ></el-input>
        </el-form-item>
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
          height="470"
          show-summary
          :summary-method="getSummaries"
          ref="table"
        >
          <el-table-column
            prop="skuCode"
            label="SKU编码"
            min-width="100px"
            width="300"
            align="center"
          ></el-table-column>
          <el-table-column prop="supplierId" label="供货商ID" v-if="false"></el-table-column>
          <el-table-column prop="supplierName" label="供货商" width="150" align="center"></el-table-column>
          <el-table-column prop="price" label="平均价" align="center"></el-table-column>
          <el-table-column prop="cartonQty" label="应发箱数" width="100%" align="center"></el-table-column>
          <el-table-column prop="qty" label="应发件数" align="center"></el-table-column>
          <el-table-column prop="sumCartonSpecWeight" label="应发毛重(Kg)" align="center"></el-table-column>
          <el-table-column prop="cartonSpecVolume" label="应发体积(m³)" align="center"></el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          background
          style="margin-top:40px; text-align: right; padding: 10px 0"
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
        supplierId: { value: null, op: "in", id: "supplierId" }
      },
      tableData: [],
      supplierSelectOptions: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      loading: false,
      summary: {},
      filters: ""
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
      if (this.searchParam.skuCode != null && this.searchParam.skuCode !== "") {
        filters.push({
          field: "skuCode",
          op: "like",
          data: `%${this.searchParam.skuCode}%`
        });
      }
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

      this.filters = JSON.stringify(filters);

      let sorts = [];
      sorts.push({ propName: "p.sku_code", orderType: "asc" });

      this.global
        .axios({
          header: {
            "TK-Authorization":
              "MUQ5RjMwRjcwMUE0NkUwRkUxNkUyMkNDNkZFNDNBOTEsMg=="
          },
          url: "/report/findCustomsDeclarationCount",
          method: "GET",
          params: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            filters: JSON.stringify(filters),
            sorts: JSON.stringify(sorts)
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
          url: "/report/findCustomsDeclarationList",
          method: "GET",
          params: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            filters: JSON.stringify(filters),
            sorts: JSON.stringify(sorts)
          }
        })
        .then(res => {
          this.tableData = res.data;
        });

      this.global
        .axios({
          header: {
            "TK-Authorization":
              "MUQ5RjMwRjcwMUE0NkUwRkUxNkUyMkNDNkZFNDNBOTEsMg=="
          },
          url: "/report/findCustomsDeclarationCurrencySummary",
          method: "GET",
          params: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            filters: JSON.stringify(filters),
            sorts: JSON.stringify(sorts)
          }
        })
        .then(res => {
          this.summary = res.data;
          this.loading = false;
        });
    },
    reset() {
      this.searchParam.skuCode = "";
      this.searchParam.supplierId.value = "";
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

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (column.property == "cartonQty") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index];
        }

        if (column.property == "qty") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index];
        }

        if (column.property == "sumCartonSpecWeight") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index];
        }

        if (column.property == "cartonSpecVolume") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[0] = this.summary.total;
          sums[3] = this.summary.cartonQty;
          sums[4] = this.summary.qty;
          sums[5] = this.summary.sumCartonSpecWeight;
          sums[6] = this.summary.cartonSpecVolume;
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
          downloadUrl: `/report/findCustomsDeclarationList?currentPage=1&pageSize=500&filters=${[
            encodeURI(this.filters)
          ]}`,
          filename: "报关报表-内容"
        });
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped type="text/less" lang="scss">
.el-table {
  overflow: visible !important;
}
.form-class {
  padding: 0px 15px;
  font-size: 12px;
  position: relative;
  border-bottom: 1px solid #f6f6f6;
  color: #333;
  border-radius: 2px 2px 0 0;
  /* font-weight: bold !important;
  line-height: 26px !important;
  color: #333; */
}
</style>
