<template>

  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">

    <!--本地搜索 TODO: 更加实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam" ref="searchForm" id="filter-form"
             @submit.native.prevent>

      <el-form-item label="SKU">
        <el-input v-model="searchParam.skuCode" size="mini" placeholder="请输入SKU" clearable></el-input>
      </el-form-item>

      <el-form-item label="产品款式">
        <el-input v-model="searchParam.groupName" size="mini" placeholder="请输入产品款式" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search(true)" size="mini">查询</el-button>
        <el-button @click="resetSearch" size="mini">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格工具条 添加、导入、导出等 -->
    <tableToolBar
      :hasExport="hasExport"
      @onToolBarDownloadData="onToolBarDownloadData"
    >
    </tableToolBar>

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
      :data="tableData"
      v-loading="loading"
      @row-dblclick="handleDoubleClick"
      :default-sort="{prop: 'skuCode', order: 'ascending'}"
      id="table"
    >
      <el-table-column prop="skuCode" label="SKU" sortable width="150" fixed="left" align="center">
      </el-table-column>

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

      <el-table-column prop="categoryName" label="分类" width="80" align="center"></el-table-column>

      <el-table-column prop="fnSku" label="FNSKU" width="120" hidden align="center"></el-table-column>

      <el-table-column prop="groupName" label="产品款式" width="110" hidden align="center"></el-table-column>
      <el-table-column prop="model" label="型号" width="110" hidden align="center"></el-table-column>
      <el-table-column prop="color" label="颜色" width="110" hidden align="center"></el-table-column>

      <el-table-column prop="size" label="尺码" width="110" hidden align="center" v-if="false"></el-table-column>

      <el-table-column prop="vipLevel" label="Vip级别" width="110" align="center"></el-table-column>
      <el-table-column prop="saleQty" label="总销量" width="110" align="center"></el-table-column>
      <el-table-column prop="sevenSaleQty" label="7日销量" width="110" align="center"></el-table-column>
      <el-table-column prop="sevenAmendQty" label="7日销量修正" width="110" align="center"></el-table-column>
      <el-table-column prop="sevenOutOfStockDay" label="7日缺货天数" width="110" align="center"></el-table-column>
      <el-table-column prop="inStockQty" label="库存" width="110" align="center"></el-table-column>

      <el-table-column prop="onPassageQty" label="待入库" width="110" align="center"></el-table-column>
      <el-table-column prop="reservedQty" label="Reserved" width="110" align="center"></el-table-column>
      <el-table-column prop="stockSaleWeek" label="库周转" width="110" align="center"></el-table-column>
      <el-table-column prop="stockSoldOutTime" label="库售罄时间" width="110" align="center"></el-table-column>
      <el-table-column prop="allSaleWeek" label="途周转" width="110" align="center"></el-table-column>
      <el-table-column prop="containerSoldOutDay" label="途断货天数" width="110" align="center"></el-table-column>
      <el-table-column prop="allSoldOutTime" label="途售罄时间" width="110" align="center"></el-table-column>
      <el-table-column prop="safetyWeek" label="安全库存(周)" width="110" align="center"></el-table-column>
      <el-table-column prop="stockGap" label="库存缺口" width="110" align="center"></el-table-column>

      <el-table-column prop="productName" label="产品名" width="200" align="center">
      </el-table-column>


      <!--默认操作列-->
      <el-table-column label="操作"
                       no-export="true"
                       width="130" fixed="right">
        <template slot-scope="scope">

          <el-button size="mini" icon="el-icon-s-data" circle
                     type="primary" id="ph-table-sell" @click="saleSituation(scope.row)">
          </el-button>

          <el-button size="mini" icon="el-icon-ship" circle
                     type="success" id="ph-table-box" @click="stockSituation(scope.row)">
          </el-button>

          <el-button size="mini" icon="el-icon-s-home" circle
                     type="warning" id="ph-table-time" @click="soldOutTime(scope.row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="paginationSizes"
      :page-size="size"
      :total="total"
      style="text-align: right; padding: 7px 0 0 0;"
      background
      size="mini"
      :layout="paginationLayout"
      id="ph-table-page"
      ref="pageForm"
    >
      <el-button icon="el-icon-refresh" @click="onRefreshTable" class="btn-prev" circle></el-button>
    </el-pagination>

    <chartDialog ref="chartDialog" :fromParent="fromParent"></chartDialog>

    <stockSituationDialog ref="stockSituationDialog" :fromParent="fromParent"></stockSituationDialog>

    <saleStockDialog ref="saleStockDialog" :fromParent="fromParent"></saleStockDialog>

  </div>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'
  import tableToolBar from '@/components/PhTableToolBar'
  import {checkPermission} from "@/utils/permission";
  import {parse} from 'path'
  import chartDialog from './components/chartDialog'
  import stockSituationDialog from './components/stockSituationDialog'
  import saleStockDialog from './components/saleStockDialog'
  import {parseTime} from "../../../../../utils";

  export default {
    components: {
      tableToolBar,
      chartDialog,
      stockSituationDialog,
      saleStockDialog
    },
    props: {
      fromParent: {
        type: [Object],
        default: {merchantId: null, categoryId: null, week: 20}
      }
    },
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),

      hasExport() {
        return true;
      },
    },


    watch: {
      fromParent: {
        handler(newValue, oldValue) {
          this.initData();
          this.getList();
        },
        deep: true
      }
    },

    filters: {},

    data() {
      return {
        // 选择项
        statusSelectOptions: [],
        prioritySelectOptions: [],

        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,

        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 分页
        paginationSizes: [10, 20, 50],
        total: null,
        size: 10,
        page: 1,
        paginationLayout: 'total, sizes, slot, prev, pager, next, jumper',
        //数据 TODO: 根据实际情况调整
        url: "/amazonStocks", // 资源URL
        downloadUrl: "", //下载Url
        searchParam: {
          skuCode: null,
          groupName: null,
        },
        filters: [],   //搜索对象
        relations: ["shipmentItems"],  // 关联对象
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
        // 设置下载链接
        this.downloadUrl = this.url;
        if (this.filters && this.filters.length > 0) {
          this.downloadUrl += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": this.filters});
        }

        // 处理关联加载
        if (this.relations && this.relations.length > 0) {
          this.downloadUrl += "&relations=" + JSON.stringify(this.relations);
        }
      },

      /*获取列表*/
      getList() {
        if (this.fromParent.merchantId == null) {
          return;
        }
        let url = `${this.url}/${this.fromParent.merchantId}`;
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
          if (params.indexOf("?") == -1) {
            params += "?relations=" + JSON.stringify(this.relations);
          } else {
            params += "&relations=" + JSON.stringify(this.relations);
          }
        }

        if (this.fromParent.categoryId != null) {
          if (params.indexOf("?") == -1) {
            params += "?cid=" + this.fromParent.categoryId;
          } else {
            params += "&cid=" + this.fromParent.categoryId;
          }
        }
        else {
          return false;
        }

        if (this.fromParent.week != null) {
          if (params.indexOf("?") == -1) {
            params += "?weekNum=" + this.fromParent.week;
          } else {
            params += "&weekNum=" + this.fromParent.week;
          }
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
            this.search(false)

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

      // 一页显示数量调整
      handleSizeChange(val) {
        if (this.size === val) return
        this.page = 1
        this.size = val
        this.search(false);
      },

      // 第几页调整
      handleCurrentChange(val) {
        if (this.page === val) return
        this.page = val
        this.search(false);
      },

      onRefreshTable: function () {
        this.getList();
      },


      handleDoubleClick(row) {
        //this.$refs.chartDialog.openDialog(row);
      },

      saleSituation(row) {
        this.$refs.chartDialog.openDialog(row);
      },

      stockSituation(row) {
        this.$refs.stockSituationDialog.openDialog(row);
      },

      soldOutTime(row) {
        this.$refs.saleStockDialog.openDialog(row);
      },
      /********************* 搜索相关方法  ***************************/
      /*本地搜索*/
      search(flg) {
        if(flg){
          this.page = 1;
        }
        this.tableData = JSON.parse(JSON.stringify(this.data));

        if (this.searchParam.skuCode != null && this.searchParam.skuCode != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.skuCode.indexOf(this.searchParam.skuCode) !== -1) {
                return true;
              }
            });
        }

        if (this.searchParam.groupName != null && this.searchParam.groupName != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.groupName.indexOf(this.searchParam.groupName) !== -1) {
                return true;
              }
            });
        }

        this.total = this.tableData.length;

        this.tableData = this.tableData.slice((this.page - 1) * this.size, this.page * this.size);
      },

      /*本地重置搜索*/
      resetSearch() {
        this.$refs.searchForm.resetFields();
        this.searchParam.skuCode = null;
        this.searchParam.groupName = null;
        this.search(true);
      },
      onToolBarDownloadData() {
        if(this.fromParent.merchantId == null){
          return false;
        }
        //获取数据
        let table = this.$refs.table;
        let params = '';
        if (this.fromParent.categoryId != null) {
          if (params.indexOf("?") == -1) {
            params += "?cid=" + this.fromParent.categoryId;
          } else {
            params += "&cid=" + this.fromParent.categoryId;
          }
        }
        else {
          this.$message.error("请选择分类！")
          return;
        }

        if (this.fromParent.week != null) {
          if (params.indexOf("?") == -1) {
            params += "?weekNum=" + this.fromParent.week;
          } else {
            params += "&weekNum=" + this.fromParent.week;
          }
        }

        let downloadUrl = `${this.url}/${this.fromParent.merchantId}` + params;
        import('@/vendor/Export2Excel').then(excel => {
          this.loading = true;
          excel.export_el_table_to_excel({
            table: table,
            downloadUrl: downloadUrl,
            filename: `销售产品明细-${parseTime(new Date(), '{y}-{m}-{d}')}"`,
            noExportProps: ['操作', '图片', 'ID']
          })
          this.loading = false;
        })
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

