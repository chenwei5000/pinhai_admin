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
          <el-date-picker
            v-model="searchParam.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-value="['2020-03-11','2020-01-23']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item size="mini">
          <el-button size="mini" @click="getTableData()" type="primary">查询</el-button>
          <el-button size="mini" @click="reset" type="info">重置</el-button>
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
          height="500"
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
          <el-table-column prop="productName" label="产品名" align="center"></el-table-column>
          <el-table-column prop="initialStage" label="期初" align="center"></el-table-column>
          <el-table-column prop="initialEnd" label="期末" width="100%" align="center"></el-table-column>
          <el-table-column prop="eoutTotal" label="出口总数" align="center"></el-table-column>
          <el-table-column prop="inTotal" label="入库总数" align="center"></el-table-column>
          <el-table-column prop="inventory" label="剩余库存" align="center"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          background
          style="text-align: right; padding: 10px 0"
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
        timeRange: ["2020-03-22  00:00:00", "2020-03-23  00:00:00"]
      },
      tableData: [],
      supplierSelectOptions: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      loading: false,
      startDate: "",
      endDate: ""
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
          field: "sku_Code",
          op: "equal",
          data: `${this.searchParam.skuCode}`
        });
      }
      if (
        this.searchParam.supplierId.value != null &&
        this.searchParam.supplierId.value !== ""
      ) {
        filters.push({
          field: "s.id",
          op: "equal",
          data: `${this.searchParam.supplierId.value}`
        });
      }

      let sorts = [];
      sorts.push({ propName: "p.last_modified", orderType: "asc" });

      let nowdays = new Date();
      let year = nowdays.getFullYear();
      let month = nowdays.getMonth();
      if (month == 0) {
        month = 12;
        year = year - 1;
      }
      if (month < 10) {
        month = "0" + month;
      }
      let myDate = new Date(year, month, 0);
      let startDate = year + "-" + month + "-01 00:00:00"; //上个月第一天
      let endDate = year + "-" + month + "-" + myDate.getDate() + " 23:59:59"; //上个月最后一天
      this.startDate = startDate;
      this.endDate = endDate;

      this.global
        .axios({
          header: {
            "TK-Authorization":
              "MUQ5RjMwRjcwMUE0NkUwRkUxNkUyMkNDNkZFNDNBOTEsMg=="
          },
          url: "/report/findBeginEndOfPeriodCount",
          method: "GET",
          params: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            filters: JSON.stringify(filters),
            startTime: startDate,
            endTime: endDate
          }
        })
        .then(res => {
          this.total = res.data;
          console.log(this.searchParam.timeRange);
        });

      this.global
        .axios({
          header: {
            "TK-Authorization":
              "MUQ5RjMwRjcwMUE0NkUwRkUxNkUyMkNDNkZFNDNBOTEsMg=="
          },
          url: "/report/findBeginEndOfPeriodList",
          method: "GET",
          params: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            filters: JSON.stringify(filters),
            startTime: startDate,
            endTime: endDate
          }
        })
        .then(res => {
          this.tableData = res.data;
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
    }
  }
};
</script>

<style scoped type="text/less" lang="scss">
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
