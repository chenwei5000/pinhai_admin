<template>

  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">

    <!--本地搜索 TODO: 更加实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam" ref="searchForm" id="filter-form"
             @submit.native.prevent v-if="false">

      <el-form-item label="SKU">
        <el-input v-model="searchParam.skuCode"
                  size="mini"
                  placeholder="请输入SKU"
                  clearable></el-input>
      </el-form-item>

      <el-form-item label="分类">
        <el-input v-model="searchParam.category"
                  size="mini"
                  placeholder="请输入分类名称"
                  clearable></el-input>
      </el-form-item>

      <el-form-item label="款式">
        <el-input v-model="searchParam.groupName"
                  size="mini"
                  placeholder="请输入产品款式"
                  clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search" size="mini">查询</el-button>
        <el-button @click="resetSearch" size="mini">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格工具条 添加、导入、导出等 -->
    <tableToolBar
      :hasAdd="hasAdd"
      @onToolBarAdd="onAdd"
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
      cell-class-name="ph-cell"
      header-cell-class-name="ph-cell-header"
      :data="data"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
      id="table"
    >
      <el-table-column prop="code" label="编号" width="140"></el-table-column>

      <el-table-column prop="statusName" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag size="mini"
                  :type="scope.row.status === 0
            ? 'info' : scope.row.status === 1
            ? 'primary' : scope.row.status === 2
            ? 'success' : ''"
                  disable-transitions>{{ scope.row.statusName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="companyManagement.abbreviation" label="收款公司" min-width="90">
      </el-table-column>


      <el-table-column prop="currency.name" label="付款货币" width="90">
      </el-table-column>


      <el-table-column prop="applicationTime" label="申请日期" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.applicationTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="paymentAmountTime" label="付款日期" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.paymentAmountTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="latestPaymentTime" label="要求缴款日期" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.latestPaymentTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="payableAmount" label="申请金额" width="100">
        <template slot-scope="scope">
          <div style="text-align: right;">
            {{ scope.row.payableAmount, (scope.row.currency? scope.row.currency.symbolLeft : '') | currency }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="invoicedAmount" label="开票金额" width="100">
        <template slot-scope="scope">
          <div style="text-align: right;">
            {{ scope.row.invoicedAmount, (scope.row.currency? scope.row.currency.symbolLeft : '')  | currency }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="paymentAmount" label="已付金额" width="100">
        <template slot-scope="scope">
          <div style="text-align: right;">
            {{ scope.row.paymentAmount, (scope.row.currency? scope.row.currency.symbolLeft : '')  | currency }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="申请说明" width="100">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="申请说明" width="250" trigger="hover"
                      v-if="scope.row.remark && scope.row.remark.length > 10">
            <div v-html="scope.row.formatRemark"></div>
            <span slot="reference">{{ scope.row.remark ? scope.row.remark.substr(0,8)+'..' : '' }}</span>
          </el-popover>
          <span v-else>
            {{ scope.row.remark }}
          </span>
        </template>
      </el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation"
                       width="120" fixed="right">
        <template slot-scope="scope">

          <el-button v-if="hasView" size="mini" icon="el-icon-view" circle
                     @click="onDefaultView(scope.row)" type="primary" id="ph-table-edit">
          </el-button>

          <el-button v-if="scope.row.status == 1 && hasEdit" size="mini" icon="el-icon-edit" circle
                     @click="onDefaultEdit(scope.row)" type="primary" id="ph-table-edit">
          </el-button>

          <el-button v-if="scope.row.status == 1 && hasDelete" type="danger" size="mini"
                     id="ph-table-del" icon="el-icon-delete" circle
                     @click="onDefaultDelete(scope.row)">
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
      style="text-align: right; padding: 10px 0 0 0"
      background
      :layout="layout"
      id="ph-table-page"
      ref="pageForm"
    >
      <el-button icon="el-icon-refresh" @click="onRefreshTable" class="btn-prev" circle></el-button>

    </el-pagination>


    <!-- 编辑明细对话框 -->
    <createPaymentDialog @modifyCBEvent="modifyCBEvent" ref="createPaymentDialog" :plan="primary">
    </createPaymentDialog>

    <!-- 编辑明细对话框 -->
    <editPaymentDialog @modifyCBEvent="modifyCBEvent" ref="editPaymentDialog" :plan="primary">
    </editPaymentDialog>

    <!-- 查看明细对话框 -->
    <viewPaymentDialog ref="viewPaymentDialog" :plan="primary">
    </viewPaymentDialog>

  </div>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'
  import createPaymentDialog from './create/dialog'
  import editPaymentDialog from './edit/dialog'
  import viewPaymentDialog from './view/dialog'
  import {checkPermission} from "../../../../utils/permission";
  import tableToolBar from '@/components/PhTableToolBar';

  export default {
    components: {
      tableToolBar,
      createPaymentDialog,
      editPaymentDialog,
      viewPaymentDialog
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

      hasAdd(){
        return checkPermission('LogisticPaymentBillResource_create');
      },
      hasEdit(){
        return checkPermission('LogisticPaymentBillDetailResource_update');
      },
      hasDelete(){
        return checkPermission('LogisticPaymentBillDetailResource_remove');
      },
      hasView(){
        return checkPermission('LogisticPaymentBillResource_get');
      },
      hasOperation(){
        return this.hasEdit || this.hasView || this.hasDelete;
      }
    },
    filters: {
      currency: currency
    },

    data() {
      return {
        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,

        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 多选记录对象
        selected: [],

        //分页
        size: 20,
        page: 1,
        layout: 'total, sizes, slot, prev, pager, next, jumper',
        paginationSizes: [20, 50, 100, 500, 1000],
        total: 0,

        //数据 TODO: 根据实际情况调整
        url: "/logisticPaymentBills", // 资源URL
        countUrl: '/logisticPaymentBills/count', // 资源URL
        downloadUrl: "", //下载Url
        searchParam: {
          skuCode: null,
          category: null,
          groupName: null,
        },
        filters: [
          {
            field: "linerShippingPlanId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ],   //搜索对象
        relations: ["companyManagement", "currency"],  // 关联对象
        data: [], // 从后台加载的数据
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
        this.getTableHeight();
        this.initData();
        this.getList();
      })
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
      },

      // 获取表格的高度
      getTableHeight() {
        if (this.device !== 'mobile') {
          //浏览器高度
          let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          //表格高度
          let tableHeight = windowHeight;
          tableHeight = tableHeight - 240; //减框架头部高度
          this.tableMaxHeight = tableHeight;
        }
      },

      /********************* 表格相关方法  ***************************/
      //报警样式 TODO:根据实际情况调整
      dangerClassName({row, rowIndex}) {
        return '';
      },

      /*获取列表*/
      /* shouldStoreQuery 是否开启通过url记录查询参数， true表示开启 */
      getList() {
        let url = this.url
        let countUrl = this.countUrl
        let params = ''
        let size = this.size
        let page = this.page

        if (!url) {
          console.warn('url 为空, 不发送请求')
          return
        }

        if (!countUrl) {
          console.warn('countUrl 为空, 异常！如果不需要统计结果数量。请查找删除 countUrl 相关代码!')
          return
        }

        // 构造查询url
        if (url.indexOf('?') > -1) {
          url += '&'
        }
        else {
          url += '?'
        }

        if (countUrl.indexOf('?') > -1) {
          countUrl += '&'
        }
        else {
          countUrl += '?'
        }

        // 处理分页信息
        // 根据偏移值计算接口正确的页数
        params += `pageSize=${size}&currentPage=${page}`

        // 处理排序
        if (this.phSort) {
          params += `&sort=${this.phSort.prop}&dir=${this.phSort.order}`
        }

        // 处理查询
        let filters = this.filters;
        Object.keys(this.searchParam).filter(k => {
          return this.searchParam[k] && this.searchParam[k].value !== ''
            && this.searchParam[k].value !== null && this.searchParam[k].value !== undefined
        }).forEach(param => {
          filters.push({
            'field': param,
            op: this.searchParam[param].op ? this.searchParam[param].op : 'eq',
            data: this.searchParam[param].value ? encodeURIComponent(this.searchParam[param].value.toString().trim()) : ''
          })
        });

        if (filters && filters.length > 0) {
          params += "&filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});
        }

        // 处理关联加载
        if (this.relations && this.relations.length > 0) {
          params += "&relations=" + JSON.stringify(this.relations);
        }

        // 请求开始
        this.loading = true

        //获取数据
        this.global.axios
          .get(countUrl + params)
          .then(resp => {
            let res = resp.data
            this.total = res || 0
          })
          .catch(err => {
          })

        //获取数据
        this.global.axios
          .get(url + params)
          .then(resp => {
            let res = resp.data
            let data = res || []
            this.data = data
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
      /*搜索*/
      search() {
        this.$refs.searchForm.validate(valid => {
          if (!valid) {
            return
          }
          this.page = 1
          this.getList();
        })
      },

      /*搜索重置*/
      resetSearch() {
        // reset后, form里的值会变成 undefined, 在下一次查询会赋值给query
        this.$refs.searchForm.resetFields();
        this.page = 1

        //TODO:根据实际情况调整
        //this.searchParam.latestPaymentTime.value = null;
        //this.searchParam.supplierId.value = null;
        //this.searchParam.code.value = null;

        this.$nextTick(() => {
          this.getList()
        })
        this.$emit('reset')
      },

      /********************* 分页工具条相关方法  ***************************/
      /* 一页显示数量调整 */
      handleSizeChange(val) {
        if (this.size === val) {
          return
        }
        this.page = 1
        this.size = val
        this.getList(true)
      },

      /* 第几页调整 */
      handleCurrentChange(val) {
        if (this.page === val) {
          return
        }
        this.page = val
        this.getList(true)
      },

      /* 刷新功能 */
      onRefreshTable: function () {
        this.getList();
      },


      /********************* 操作按钮相关方法  ***************************/
      onAdd(){
        this.$refs.createPaymentDialog.openDialog();
      },
      /* 行修改功能 */
      onDefaultEdit(row) {
        this.$refs.editPaymentDialog.openDialog(row.id);
      },
      /* 行查看功能 */
      onDefaultView(row) {
        this.$refs.viewPaymentDialog.openDialog(row.id);
      },

      /* 行删除功能 */
      onDefaultDelete(row) {
        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              let url = `${this.url}/${row.id}`;
              this.global.axios.delete(url).then(resp => {
                this.$message({type: 'success', message: '删除成功'});
                let obj = resp.data;
                this.getList();
              })
                .catch(err => {
                })
              done();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.getList();
      },

      /********************* 工具条按钮  ***************************/
      onToolBarAdd() {
        this.$refs.paymentDialog.openDialog(null);
      },
      onToolBarEdit() {

      },
      onToolBarDelete() {

      },
      onToolBarDownloadTpl() {
        //获取数据
        let table = this.$refs.table;
        let downloadUrl = this.downloadUrl;

        import('@/vendor/Export2Excel').then(excel => {
          excel.export_el_table_to_excel({
            table: table,
            downloadUrl: downloadUrl,
            filename: "采购计划内容-模版",
            noExportProps: ['操作', '金额', 'ID', '下单件数', '发货件数', '收货件数'],
            tpl: true,
          })
        })
      },
      onToolBarDownloadData() {
        //获取数据
        let table = this.$refs.table;
        let downloadUrl = this.downloadUrl;

        import('@/vendor/Export2Excel').then(excel => {
          this.loading = true;
          excel.export_el_table_to_excel({
            table: table,
            downloadUrl: downloadUrl,
            filename: "采购计划内容",
            noExportProps: ['操作', '金额', 'ID']
          })
          this.loading = false;
        })
      },
      onToolBarImportData() {

      }
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

