<template>
  <el-card >
    <div class="form-class">
      <el-form :inline="true" inline-message>
        <el-form-item label="请求地址" size="mini">
          <el-input
            placeholder="请输入请求地址"
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
          style="text-align: right; padding: 10px 0"
          layout="total, sizes, prev, pager, next, jumper"
        >
          <el-button icon="el-icon-refresh" @click="onRefreshTable" class="btn-prev" circle></el-button>
        </el-pagination>
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
      loading: false
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
          op: "equal",
          data: `${this.searchParam.skuCode}`
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
      this.global
        .axios({
          header: {
            "TK-Authorization":
              "MUQ5RjMwRjcwMUE0NkUwRkUxNkUyMkNDNkZFNDNBOTEsMg=="
          },
          url: "/report/linerShippingPlanItemVOCount",
          method: "GET",
          params: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            filters: JSON.stringify(filters)
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
          url: "/report/linerShippingPlanItemVOList",
          method: "GET",
          params: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            filters: JSON.stringify(filters)
          }
        })
        .then(res => {
          this.tableData = res.data;
          this.loading = false;
        });
    },
    reset() {
      this.searchParam.skuCode = "";
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
    onRefreshTable: function() {
      this.getTableData();
    }
  },

  // 观察data中的值发送变化后，调用
  watch: {}
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
