<template>
  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             class="ph-dialog"
             width="90%"
             top="2vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">


    <div class="ph-table">

      <!--本地搜索 TODO: 更加实际情况调整 el-form-item -->
      <el-form :inline="true" :model="searchParam" ref="searchForm" id="filter-form"
               @submit.native.prevent>

        <el-form-item label="SKU">
          <el-input v-model="searchParam.skuCode" size="mini" placeholder="请输入SKU" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button native-type="submit" type="primary" @click="search" size="mini">查询</el-button>
          <el-button @click="resetSearch" size="mini">重置</el-button>
        </el-form-item>
      </el-form>

      <!--表格 TODO:根据实际情况调整 el-table-column  -->
      <el-table
        ref="table"
        style="width: 100%"
        stripe
        border
        max-height="450"
        highlight-current-row
        :row-class-name="dangerClassName"
        cell-class-name="ph-cell"
        header-cell-class-name="ph-cell-header"
        :data="tableData"
        v-loading="loading"
        show-summary
        :summary-method="getSummaries"
        @selection-change="handleSelectionChange"
        :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
        id="table"
      >
        <!--el-table-column prop="sortNum" type="index" label="序号" width="50" fixed="left"></el-table-column-->

        <el-table-column
          type="selection"
          align="center"
          width="30"
          v-if="false"
        >
        </el-table-column>

        <el-table-column prop="skuCode" label="SKU编码" width="150" fixed="left">
        </el-table-column>

        <el-table-column prop="warehouseName" label="发货仓库" width="90"></el-table-column>

        <el-table-column prop="productImgUrl" label="图片" width="40">
          <template slot-scope="scope" v-if="scope.row.productImgUrl">
            <el-image
              :z-index="10000"
              style="width: 30px; height: 30px;margin-top: 5px"
              :src="scope.row.productImgUrl"
              :preview-src-list="[scope.row.productImgUrl.replace('_SL75_','_SL500_')]" lazy>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column prop="productName" label="产品名" min-width="200">
        </el-table-column>

        <el-table-column prop="cartonSpecCode" label="箱规" width="120"></el-table-column>
        <el-table-column prop="numberOfCarton" label="装箱数" width="80"></el-table-column>

        <el-table-column prop="cartonQty" label="库存箱数" width="85"></el-table-column>
        <el-table-column prop="shippedCartonQty" label="发货箱数" width="130">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.shippedCartonQty"
                             size="mini"
                             style="width: 120px;margin: 3px 0;"
                             :precision="3"
                             :min="0"
                             :step="1"
                             :max="scope.row.cartonQty" label="请填本次发货箱数">
            </el-input-number>
          </template>
        </el-table-column>

        <el-table-column prop="shippedNote" label="发货备注" width="120">
          <template slot-scope="scope">
            <el-input type="textarea" v-model="scope.row.shippedNote"
                      size="mini"
                      rows="1"
                      style="width: 110px;margin: 3px 0;"
                      show-word-limit></el-input>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="onSave" :loading="confirmLoading">添 加</el-button>
      <el-button @click="closeDialog" size="mini">取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>

  export default {
    components: {},
    props: {},
    computed: {
      dialogTitle() {
        return "添加国内调拨明细";
      },
      hasAdd() {
        return (this.detailItemId == null);
      },
    },

    data() {
      return {
        //Dialog 是否开启
        dialogVisible: false,
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        //数据 TODO: 根据实际情况调整
        url: '/warehouseStocks/stocks', // 资源URL
        countUrl: '/count',
        relations: ["warehouse", "product"],//关联数据字典
        filters: [],   //搜索对象
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
        // 多选记录对象
        selected: [],

        searchParam: {
          skuCode: null,
        },
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
      });
    },
    updated() {
    },
    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
      },


      /********************* 表格相关方法  ***************************/
      //报警样式 TODO:根据实际情况调整
      dangerClassName({row}) {
      },

      /*汇总数据*/
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];

        columns.forEach((column, index) => {
          if (column.property == 'skuCode') {
            const values = data.map(item => item[column.property]);
            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);
            sums[index] = '合计: ' + sums[index] + ' 行';
          }

          if (column.property == 'shippedCartonQty' || column.property == 'cartonQty') {
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
              sums[index] += ' 箱';
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
            data.forEach(r => {

            });

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

      /********************* 搜索相关方法  ***************************/
      /*本地搜索*/
      search() {
        this.tableData = this.data;
        if (this.searchParam.skuCode != null && this.searchParam.skuCode != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.skuCode && item.skuCode.indexOf(this.searchParam.skuCode) !== -1) {
                return true;
              }
            });
        }
      },
      /*本地重置搜索*/
      resetSearch() {
        this.$refs.searchForm.resetFields();
        //TODO:根据实际情况调整
        this.searchParam.skuCode = null;
        this.search();
      },

      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        //获取数据
        // 箱规
      },

      /* 多选功能 */
      handleSelectionChange(val) {
        val.shippedCartonQty = 100;
        this.selected = val;
      },


      /* 开启弹出编辑框 需要传明细ID */
      openDialog(row) {
        this.filters = [
          {
            field: "warehouseId",
            op: 'eq',
            data: row ? row.fromWarehouseId : -1
          }
        ]
        this.initData();
        this.getList();
        this.dialogVisible = true;
      },

      closeDialog() {
        this.dialogVisible = false;
        this.loading = false;
        this.confirmLoading = false;
        this.filters = [];   //搜索对象
        this.data = []; // 从后台加载的数据
        this.tableData = [];  // 前端表格显示的数据，本地搜索用
        this.selected = [];
      },
      calShippedQty(shippedCartonQty, numberOfCarton) {
        if (shippedCartonQty && numberOfCarton) {
          return (shippedCartonQty * numberOfCarton).toFixed(0);
        }
        else {
          return 0;
        }
      },

      // 保存
      onSave() {
        // if (this.selected == null || this.selected.length == 0) {
        //   this.$message.error("请选择要发货的产品!");
        //   return false;
        // }
        this.tableData.forEach(r => {
          if (r.shippedCartonQty > 0) {
            this.$emit("modifyCBEvent", {
              skuCode: r.skuCode,
              productName: r.productName,
              cartonSpecId: r.cartonSpecId + '',
              cartonSpecCode: r.cartonSpecCode,
              numberOfCarton: r.numberOfCarton,
              shippedCartonQty: r.shippedCartonQty,
              imgUrl : r.productImgUrl,
              shippedQty: this.calShippedQty(r.shippedCartonQty, r.numberOfCarton),
              shippedNote: r.shippedNote
            });
          }
        });

        this.closeDialog();
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

