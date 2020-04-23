<template>
  <!-- 表格工具条 添加、导入、导出等 -->
  <div class="ph-table">
    <tableToolBar
      :hasExportTpl="hasExportTpl"
      :hasImport="hasImport"
      :hasAdd="hasAdd"
      :hasDelete="hasDelete"
      @onToolBarAdd="onDefaultAdd"
      @onToolBarDelete="onToolBarDelete"
      @onToolBarDownloadTpl="onToolBarDownloadTpl"
      @onToolBarImportData="onToolBarImportData"
    ></tableToolBar>

    <!--表格 TODO:根据实际情况调整 el-table-column  -->
    <el-table
      ref="table"
      style="width: 100%"
      stripe
      border
      highlight-current-row
      :max-height="tableMaxHeight"
      cell-class-name="ph-cell"
      header-cell-class-name="ph-cell-header"
      @selection-change="handleSelectionChange"
      :data="tableData"
      v-loading="loading"
      :default-sort="{prop: 'skuCode', order: 'ascending'}"
      id="table"
    >
      <el-table-column v-if="hasDelete" type="selection" align="center" width="30"></el-table-column>

      <el-table-column prop="skuCode" label="SKU" sortable min-width="150" fixed="left"></el-table-column>

      <el-table-column prop="productName" label="原料名" min-width="200"></el-table-column>

      <el-table-column prop="cartonSpecCode" label="箱规" min-width="120"></el-table-column>
      <el-table-column prop="numberOfCarton" label="装箱数" min-width="80"></el-table-column>
      <el-table-column prop="number" :label="'米数'" min-width="90"></el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation" no-export="true" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="small"
            icon="el-icon-edit"
            circle
            @click="onDefaultEdit(scope.$index, scope.row)"
            type="primary"
            id="ph-table-edit"
          ></el-button>

          <el-button
            type="danger"
            size="mini"
            id="ph-table-del"
            icon="el-icon-delete"
            circle
            @click="onDefaultDelete(scope.$index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑明细对话框 -->
    <itemDialog :primary="primary" @modifyCBEvent="modifyCBEvent" ref="itemDialog"></itemDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { currency } from "@/utils";
import itemDialog from "./dialog";
import tableToolBar from "@/components/PhTableToolBar";
import { parseTime } from "../../../../utils";

export default {
  components: {
    tableToolBar,
    itemDialog
  },
  props: {
    primary: {
      type: [Object],
      default: {}
    }
  },
  computed: {
    ...mapGetters(["device", "rolePower"]),
    typeName() {
      return "领料单";
    },
    hasAdd() {
      return true;
    },
    hasExportTpl() {
      return true;
    },
    hasImport() {
      return true;
    },
    hasDelete() {
      return true;
    }
  },
  filters: {},

  data() {
    return {
      exportFileName: "领料单明细",
      tplNoExportProps: ["图片", "原料名", "箱规", "装箱数"],
      maxUploadCount: 20,
      selected: [],
      // 选择项
      // 表格最大高度
      tableMaxHeight: this.device !== "mobile" ? 500 : 40000000,
      // 点击按钮之后，按钮锁定不可在点
      confirmLoading: false,
      //操作按钮控制
      hasOperation: true,
      tableData: [], // 前端表格显示的数据，本地搜索用
      // 表格加载效果
      loading: false
    };
  },

  created() {},
  watch: {},

  mounted() {
    //全屏，表格高度处理
    window.onresize = () => {
      this.getTableHeight();
    };

    this.$nextTick(() => {
      this.getTableHeight();
    });
  },

  methods: {
    /********************* 基础方法  *****************************/
    //初始化加载数据 TODO:根据实际情况调整
    initData() {},

    // 获取表格的高度
    getTableHeight() {
      if (this.device !== "mobile") {
        //浏览器高度
        let windowHeight =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight;
        //表格高度
        let tableHeight = windowHeight;
        tableHeight = tableHeight - 180;
        this.tableMaxHeight = tableHeight;
      } else {
        this.tableMaxHeight = 400;
      }
    },

    /* 多选功能 */
    handleSelectionChange(val) {
      this.selected = val;
    },

    /********************* 操作按钮相关方法  ***************************/
    /* 行修改功能 */
    onDefaultEdit(index, row) {
      row.detailItemId = index + 1;
      this.$refs.itemDialog.openDialog(row);
    },

    /* 行删除功能 */
    onDefaultDelete(index) {
      this.$confirm("确认删除吗", "提示", {
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action == "confirm") {
            this.tableData.splice(index, 1);
            done();
          } else done();
        }
      }).catch(er => {
        /*取消*/
      });
    },

    /* 子组件编辑完成后相应事件 */
    modifyCBEvent(object) {
      let flag = true; //是否存在此SKU的产品
      let idx = null;
      let _tmp = JSON.parse(JSON.stringify(this.tableData));
      this.tableData.forEach((item, index, arr) => {
        if (item.skuCode === object.skuCode) {
          arr[index] = object;
          flag = false;
        }
      });
      if (flag) {
        this.tableData.push(object);
      }
      this.tableData.push({});
      this.tableData.pop();
    },

    /********************* 工具条按钮  ***************************/
    onDefaultAdd() {
      if (this.primary == null || this.primary.warehouseId == null) {
        this.$message.error("请选择原料仓库!");
        return false;
      }
      this.$refs.itemDialog.openDialog(null);
    },

    onToolBarDelete() {
      this.$confirm("确认删除吗", "提示", {
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action == "confirm") {
            this.selected.forEach(data => {
              this.tableData.splice(data.id, 1);
            });
            done();
          } else done();
        }
      }).catch(er => {
        /*取消*/
      });
    },
    onToolBarDownloadTpl() {
      //获取数据
      let table = this.$refs.table;
      let downloadUrl = this.downloadUrl;

      import("@/vendor/Export2Excel").then(excel => {
        excel.export_el_table_to_excel({
          table: table,
          downloadUrl: downloadUrl,
          filename: `${this.exportFileName}-模版-${parseTime(
            new Date(),
            "{y}-{m}-{d}"
          )}"`,
          noExportProps: this.tplNoExportProps,
          tpl: true
        });
      });
    },

    uploadPromise(detailItem) {
      if (!detailItem.skuCode) {
        this.$message.error("请输入原料SKU");
      } else {
        let url = `/products/sku?sku=${encodeURIComponent(
          detailItem.skuCode
        )}&relations=${JSON.stringify(["cartonSpec", "category"])}`;
        return this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data;
            let data = res || {};

            detailItem.cartonSpecId = data.cartonSpecId + "";
            detailItem.numberOfCarton = data.numberOfCarton;
            detailItem.cartonSpecCode = data.cartonSpecCode;
            // 转字段
            detailItem.productName = data.name;
            this.modifyCBEvent(detailItem);
          })
          .catch(err => {});
      }
    },

    async onToolBarImportData(excelData) {
      if (!excelData) {
        this.$message.error("导入失败!");
        return false;
      }
      let loading = this.$loading({
        lock: true,
        text: "导入数据中",
        spinner: "el-icon-upload",
        background: "rgba(0, 0, 0, 0.7)"
      });

      let table = this.$refs.table;
      let columns = table && table.columns ? table.columns : [];
      let header = [];
      // 处理头部映射
      excelData.header.forEach(_head => {
        columns.forEach(_col => {
          if (_head == _col.label) {
            header[_head] = _col.property;
          }
        });
      });

      // 导入数据
      let promiseArr = [];
      let resData = [];

      // 创建提交列表
      excelData.results.forEach(obj => {
        let _res = {};
        excelData.header.forEach(_head => {
          let prop = header[_head];
          if (prop) {
            if (prop.indexOf(".") !== false) {
              let tmps = prop.split(".");
              for (var i = 0; i < tmps.length; i++) {
                if (i === 0) {
                  prop = tmps[0];
                } else {
                  prop += tmps[1].charAt(0).toUpperCase() + tmps[1].slice(1);
                }
              }
            }
            _res[prop] = obj[_head];
          }
        });
        _res["number"] = obj["米数"];
        resData.push(_res);
      });
      for (var i = 0; i < resData.length; i++) {
        promiseArr.push(this.uploadPromise(resData[i]));
        if (promiseArr.length >= this.maxUploadCount) {
          await Promise.all(promiseArr).then(obj => {
            loading.text =
              "共[" + resData.length + "]条数据, 已经上传[" + (i + 1) + "]条";
            promiseArr = [];
          });
          promiseArr = [];
        }
      }

      if (promiseArr.length > 0) {
        await Promise.all(promiseArr).then(obj => {
          loading.text =
            "共[" +
            resData.length +
            "]条数据, 已经上传[" +
            resData.length +
            "]条";
        });
      }

      loading.close();
      this.$message.success("导入成功");
    }
  }
};
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

.table-tool {
  background-color: #dfe6ec;
  position: relative;
  z-index: 890;
  width: 100%;
  min-height: 40px;
  line-height: 30px;
  padding: 5px 10px;
}

.excel-upload-input {
  display: none !important;
}
</style>

