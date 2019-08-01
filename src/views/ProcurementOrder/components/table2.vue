<template>
  <div class="ph-table">
    <!--搜索-->
    <!-- <el-form
      :inline="true"
      :model="searchParam"
      ref="searchForm"
      id="filter-form"
      @submit.native.prevent
    >
      <el-form-item label="编码">
        <el-input v-model="searchParam.name.value" placeholder="请输入编码"></el-input>
      </el-form-item>

      <el-form-item label="状态">
        <el-input v-model="searchParam.status.value" placeholder="请输入状态"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search" size="small">查询</el-button>
        <el-button @click="resetSearch" size="small">重置</el-button>
      </el-form-item>
    </el-form> -->

    <!--表格-->
    <el-table
      ref="table"
      style="width: 100%"
      stripe
      border
      highlight-current-row
      :row-class-name="dangerClassName"
      :cell-style="{padding: '2px 0', 'font-size': '13px'}"
      :header-cell-style="{padding: '2px 0'}"
      :data="data"
      :max-height="tableMaxHeight"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      id="table"
    >
      <el-table-column prop="statusName" label="状态" width="100" fixed="left"></el-table-column>
      <el-table-column prop="skuCode" label="SKU编码" width="100"></el-table-column>
      <el-table-column prop="product.name" label="产品名" width="100"></el-table-column>
      <el-table-column prop="priorityName" label="优先级" width="100"></el-table-column>
      <el-table-column prop="cartonSpecName" label="箱规" width="100"></el-table-column>
      <el-table-column prop="qty" label="采购件数" width="100"></el-table-column>
      <el-table-column prop="numberOfCarton" label="采购箱数" width="100"></el-table-column>
      <!-- 销售要求未知 -->
      <el-table-column prop="wu" label="销售要求" width="100"></el-table-column>
      <el-table-column prop="price" label="采购价" width="100"></el-table-column>
      <el-table-column prop="amount" label="总金额" width="100"></el-table-column>
      <el-table-column prop="shippedQty" label="发货数量" width="100"></el-table-column>
      <el-table-column prop="receivedQty" label="收货数量" width="100"></el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="paginationSizes"
      :page-size="size"
      :total="total"
      style="text-align: right; padding: 10px 0"
      background
      :layout="layout"
      id="ph-table-page"
      ref="pageForm"
    >
      <el-button icon="el-icon-refresh" @click="onRefreshTable" class="btn-prev" circle></el-button>
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import qs from "qs";
import { constants } from "crypto";

const valueSeparator = "~";
const valueSeparatorPattern = new RegExp(valueSeparator, "g");
const paramSeparator = ",";
const equal = "=";
const equalPattern = /=/g;
const queryFlag = "q=";
const queryPattern = new RegExp("q=.*" + paramSeparator);

export default {
  components: {},
  props: {},

  computed: {
    ...mapGetters(["device"]),

    phTableAttrs() {
      return Object.assign(this.defaultTableAttrs, this.tableAttrs);
    }
  },

  data() {
    return {
      //样式
      tableMaxHeight: this.device !== "mobile" ? 400 : 40000000,

      //操作
      hasOperation: true,
      hasEdit: true,
      hasDelete: true,
      hasSetting: true,
      selected: [],

      //分页
      size: 20,
      page: 1,
      layout: "total, sizes, slot, prev, pager, next, jumper",
      paginationSizes: [20, 50, 100],
      total: 0,

      //数据
      url: "/procurementOrderItems", // 资源URL

      relations: [
        "product",
        "currency",
        "cartonSpec",
        "procurementOrder",
        "procurementPlanItem",
        "product.supplier"
      ], // 关联对象

      data: [],
      phSort: { prop: "id", order: "asc" },
      loading: false,

      //搜索
      searchParam: {
        procurementOrderId: {
          value: "511",
          op: "eq",
          id: "procurementOrderId"
        },
        name: { value: null, op: "bw", id: "name" },
        status: { value: null, op: "eq", id: "status" }
      },
      //弹窗
      dialogTitle: "新增",
      dialogVisible: false,
      isNew: true,
      isEdit: false,
      isView: false,
      confirmLoading: false,
      // 要修改的那一行
      row: {}
    };
  },
  created() {},

  mounted() {
    console.log(11111);
    //全屏，表格高度处理

    window.onresize = () => {
      this.getTableHeight();
    };

    this.getList();

    this.$nextTick(() => {
      this.getTableHeight();
      this.getList();
    });
  },
  methods: {
    // 获取表格的高度
    getTableHeight() {
      this.tableMaxHeight = 500;
    },

    /*获取列表*/
    getList(shouldStoreQuery) {
      let url = this.url;
      let params = "";
      let size = this.size;
      let page = this.page;

      if (!url) {
        console.warn("url 为空, 不发送请求");
        return;
      }

      // 构造查询url
      if (url.indexOf("?") > -1) {
        url += "&";
      } else {
        url += "?";
      }

      // 处理分页信息
      // 根据偏移值计算接口正确的页数
      params += `pageSize=${size}&currentPage=${page}`;

      // 处理排序
      if (this.phSort) {
        params += `&sort=${this.phSort.prop}&dir=${this.phSort.order}`;
      }

      // 处理查询
      let filters = [];
      Object.keys(this.searchParam)
        .filter(k => {
          return (
            this.searchParam[k] &&
            this.searchParam[k].value !== "" &&
            this.searchParam[k].value !== null &&
            this.searchParam[k].value !== undefined
          );
        })
        .forEach(param => {
          filters.push({
            field: param,
            op: this.searchParam[param].op ? this.searchParam[param].op : "eq",
            data: this.searchParam[param].value
              ? encodeURIComponent(
                  this.searchParam[param].value.toString().trim()
                )
              : ""
          });
        });

      if (filters && filters.length > 0) {
        params +=
          "&filters=" + JSON.stringify({ groupOp: "AND", rules: filters });
      }

      // 处理关联加载
      if (this.relations && this.relations.length > 0) {
        params += "&relations=" + JSON.stringify(this.relations);
      }

      // 请求开始
      this.loading = true;

      //获取数据
      this.global.axios
        .get(url + params)
        .then(resp => {
          let res = resp.data;
          let data = res || [];
          // 修改字段
          this.data = data;
          this.total = data.length || 0;

          this.loading = false;
          /**
           * 请求返回, 数据更新后触发, 返回(data, resp) data是渲染table的数据, resp是请求返回的完整response
           * @event update
           */
          this.$emit("update", data, res);
        })
        .catch(err => {
          /**
           * 请求数据失败，返回err对象
           * @event error
           */
          this.$emit("error", err);
          this.loading = false;
        });
    },

    search() {
      this.$refs.searchForm.validate(valid => {
        if (!valid) return;
        this.page = 1;
        this.getList(true);
      });
    },

    // 重置
    resetSearch() {
      // reset后, form里的值会变成 undefined, 在下一次查询会赋值给query
      this.$refs.searchForm.resetFields();
      this.searchParam.name.value = null;
      this.searchParam.status.value = null;
      this.page = 1;

      // 重置
      history.replaceState(
        history.state,
        "",
        location.href.replace(queryPattern, "")
      );

      this.$nextTick(() => {
        this.getList();
      });
    },

    //报警样式
    dangerClassName({ row }) {
      return "";
    },

    // 一页显示数量调整
    handleSizeChange(val) {
      if (this.size === val) return;

      this.page = 1;
      this.size = val;
      this.getList(true);
    },

    // 第几页调整
    handleCurrentChange(val) {
      if (this.page === val) return;

      this.page = val;
      this.getList(true);
    },

    // 多选按钮修改
    handleSelectionChange(val) {
      this.selected = val;

      /**
       * 多选启用时生效, 返回(selected)已选中行的数组
       * @event selection-change
       */
      this.$emit("selection-change", val);
    },

    // 排序列修改
    handleSortChange: function(column) {
      if (column.prop) {
        this.phSort.prop = column.prop;
        this.phSort.order = column.order === "ascending" ? "asc" : "desc";
      }
      this.page = 1;
      this.getList(true);
    },

    onDefaultEdit(row) {
      this.$emit("openEditDialog", row);
    },
    onDefaultView(row) {
      this.$emit("onDefaultView", row);
    },

    cancel() {},
    confirm() {},
    onRefreshTable: function() {
      this.getList();
    },
    onDefaultDelete(row) {
      this.$confirm("确认删除？")
        .then(_ => {
          let id = row.id;
          let url = `/procurementOrders/${id}`;
          console.log("delete ", url);
          this.global.axios
            .delete(url)
            .then(data => {
              console.log("data ", data);
            })
            .catch(data => {
              console.log("删除失败");
            });
        })
        .catch(_ => {});
    }
  }
};
</script>

<style type="text/less" lang="scss" scoped>
.el-table {
  /deep/ .ph-header-small {
    font-size: 12px !important;
  }
  /deep/ tr.warning-row {
    background: rgb(233, 233, 235) !important;
  }

  /deep/ tr.warning-row td {
    background: rgb(233, 233, 235) !important;
  }

  /deep/ tr.danger-row {
    background: rgb(253, 226, 226) !important;
  }

  /deep/ tr.danger-row td {
    background: rgb(253, 226, 226) !important;
  }
}
</style>

