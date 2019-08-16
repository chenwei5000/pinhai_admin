<template>

  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">

    <!--本地搜索 TODO: 更加实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam" ref="searchForm" id="filter-form"
             @submit.native.prevent>

      <el-form-item label="SKU">
        <el-input v-model="searchParam.skuCode" placeholder="请输入SKU" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search" size="small">查询</el-button>
        <el-button @click="resetSearch" size="small">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格工具条 添加、导入、导出等 -->
    <tableToolBar
      v-bind="toolbarConfig"
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
      :row-class-name="dangerClassName"
      :cell-style="{padding: '2px 0', 'font-size': '13px'}"
      :header-cell-style="{padding: '2px 0'}"
      :data="tableData"
      v-loading="loading"
      show-summary
      :summary-method="getSummaries"
      @selection-change="handleSelectionChange"
      :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
      id="table"
    >
      <el-table-column prop="sortNum" label="序号" sortable width="50" fixed="left"></el-table-column>      <el-table-column prop="statusName" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 0
            ? 'warning' : scope.row.status === 3
            ? 'primary' : scope.row.status === 6
            ? 'info' : 'success'"
            disable-transitions>{{ scope.row.statusName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="skuCode" label="SKU编码" width="120"></el-table-column>
      <el-table-column prop="product.name" label="产品名" width="120"></el-table-column>
      <el-table-column prop="numberOfCarton" label="装箱数" width="120"></el-table-column>
      <el-table-column prop="boxCode" label="箱码" sortable width="100"></el-table-column>
      <el-table-column prop="shippedCartonQty" label="发货数量(箱)" width="130"></el-table-column>
      <el-table-column prop="storageLocation.code" label="存放货位" width="100"></el-table-column>
      <el-table-column prop="shippedQty" label="总发货件数" width="100"></el-table-column>
      <el-table-column prop="receivedQty" label="收货数量" width="100"></el-table-column>
      <el-table-column prop="receivedNote" label="异常备注" width="100"></el-table-column>
      <el-table-column prop="receivedCartonQty" label="合计箱数" width="100"></el-table-column>


      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation"
                       no-export="true"
                       width="120" fixed="right">
        <template slot-scope="scope">

          <el-button v-if="hasEdit" size="small" icon="el-icon-edit" circle
                     @click="onDefaultEdit(scope.row)" type="primary" id="ph-table-edit">
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑明细对话框 -->
    <itemDialog @modifyCBEvent="modifyCBEvent" ref="itemDialog" :primaryId="primary.id">
    </itemDialog>
  </div>

</template>

<script>

  import {mapGetters} from 'vuex'
  import tableToolBar from '@/components/PhTableToolBar'
  import itemDialog from './dialog'

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
        'device'
      ])
    },
    filters: {
    },

    data() {
      return {

        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,

        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        //操作按钮控制
        hasOperation: true,
        hasAdd: false,
        hasEdit: true,
        hasDelete: true,

        // 多选记录对象
        selected: [],

        //数据 TODO: 根据实际情况调整
        url: "/procurementReceivedOrderItems", // 资源URL
        downloadUrl: "", //下载Url
        searchParam: {
          skuCode: null,
        },
        filters: [
          {
            field: "procurementShippedOrderId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ],   //搜索对象
        relations: ["product", "cartonSpec", "procurementShippedOrder", "procurementOrderItem", "storageLocation"],
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
        // 表格加载效果
        loading: false,

        // 记录修改的那一行
        row: {},

        // 表格工具条配置
        toolbarConfig: {
          hasEdit: true,
          hasDelete: false,
          hasAdd: false,
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
        this.getList();
      })
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        this.loading = true;

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

      /********************* 表格相关方法  ***************************/
      //报警样式 TODO:根据实际情况调整

      /*汇总数据*/

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

      /********************* 搜索相关方法  ***************************/
      /*本地搜索*/
      search() {
        this.tableData = this.data;
        if (this.searchParam.skuCode != null && this.searchParam.skuCode != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.product && item.product.skuCode.indexOf(this.searchParam.skuCode) !== -1) {
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


      /********************* 操作按钮相关方法  ***************************/
      /* 行修改功能 */
      onDefaultEdit(row) {
        this.$refs.itemDialog.openDialog(row.id);
      },

      /* 行删除功能 */

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.getList();
      },

      /********************* 工具条按钮  ***************************/
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

  .el-form-item {
    //margin-bottom: 7px;
  }

  .ph-table {
    width: 100%;
  }

  .el-table {
    /deep/ .ph-header-small {
      font-size: 12px !important;
    }
    /deep/ tr.warning-row {
      background: rgb(250, 236, 216) !important;
    }

    /deep/ tr.warning-row td {
      background: rgb(250, 236, 216) !important;
    }

    /deep/ tr.danger-row {
      background: rgb(253, 226, 226) !important;
    }

    /deep/ tr.danger-row td {
      background: rgb(253, 226, 226) !important;
    }
  }

  .el-form-item__content {
    /deep/ .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
      width: 230px !important;
    }
  }
</style>

