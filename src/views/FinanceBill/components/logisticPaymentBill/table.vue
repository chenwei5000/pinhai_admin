<template>

  <div class="ph-table">

    <!--搜索 TODO: 更加实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam"
             ref="searchForm"
             id="filter-form"
             inline-message
             @submit.native.prevent>

      <el-form-item label="编码">
        <el-input size="mini" clearable v-model="searchParam.code.value" style="width: 140px"
                  placeholder="请输入编码"></el-input>
      </el-form-item>

      <el-form-item label="收款公司">
        <el-select size="mini" filterable v-model="searchParam.companyManagementId.value" style="width: 120px"
                   placeholder="收款公司">
          <el-option
            v-for="(item,idx) in supplierSelectOptions"
            :label="item.label" :value="item.value"
            :key="idx"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="最晚付款时间">
        <el-date-picker
          size="mini"
          v-model="searchParam.latestPaymentTime.value"
          format="yyyy-MM-dd"
          style="width: 120px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="状态">
        <el-select filterable v-model="searchParam.status.value" size="mini" style="width: 100px" placeholder="请选择状态">
          <el-option
            v-for="(item,idx) in statusSelectOptions"
            :label="item.label" :value="item.value"
            :key="idx"
          ></el-option>
        </el-select>
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
      highlight-current-row
      :row-class-name="dangerClassName"
      cell-class-name="ph-cell"
      header-cell-class-name="ph-cell-header"
      :data="data"
      :max-height="tableMaxHeight"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      @sort-change='handleSortChange'
      id="table"
    >
      <el-table-column prop="companyManagement.abbreviation" label="收款公司" min-width="120" fixed="left">
      </el-table-column>

      <el-table-column prop="code" label="编号" min-width="130"></el-table-column>


      <el-table-column prop="statusName" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag size="mini"
                  :type="scope.row.status === 1
            ? 'primary' : scope.row.status === 2
            ? 'success' : scope.row.status === 0
            ? 'info' : ''"
                  disable-transitions>{{ scope.row.statusName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="creator.name" label="申请人" width="80">
      </el-table-column>

      <el-table-column prop="applicationTime" label="申请日期" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.applicationTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="linerShippingPlanId" label="货柜信息" min-width="180">
        <template slot-scope="scope">
          <span>
          {{scope.row.linerShippingPlan.formatEtdTime}}{{scope.row.linerShippingPlan.portOfLoading}}-{{scope.row.linerShippingPlan.code}}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="currency.name" label="付款货币" width="80">
      </el-table-column>

      <el-table-column prop="paymentAmount" label="实付金额" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.paymentAmount, scope.row.currency.symbolLeft | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentAmountTime" label="付款日期" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.paymentAmountTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="id" label="ID" width="60"></el-table-column>

      <el-table-column prop="latestPaymentTime" label="最晚付款时间" width="100" fixed="right">
        <template slot-scope="scope">
          <span>{{ scope.row.latestPaymentTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="settlementAmount" label="申请金额" width="100" fixed="right">
        <template slot-scope="scope">
          <span>{{ scope.row.payableAmount, scope.row.currency.symbolLeft | currency }}</span>
        </template>
      </el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation" width="90" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1 && hasEdit" size="mini" icon="el-icon-money" circle
                     @click="onDefaultEdit(scope.row)" type="success" id="ph-table-edit">
          </el-button>

          <el-button v-if="scope.row.status == 1 && hasView" type="primary" size="mini"
                     id="ph-table-del" icon="el-icon-view" circle
                     @click="onDefaultView(scope.row)">
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

    <!--编辑对话框-->
    <viewDialog ref="viewDialog">
    </viewDialog>

    <!--查看对话框-->
    <paymentDialog @modifyCBEvent="modifyCBEvent" ref="paymentDialog">
    </paymentDialog>

  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import {currency, parseTime} from '@/utils'
  import qs from 'qs'
  import paymentDialog from './payment/dialog'
  import viewDialog from './view/dialog'
  import companyManagementModel from '@/api/companyManagement'
  import phEnumModel from '@/api/phEnum'
  import {checkPermission} from "@/utils/permission";

  const valueSeparator = '~'
  const valueSeparatorPattern = new RegExp(valueSeparator, 'g')
  const paramSeparator = ','
  const equal = '='
  const equalPattern = /=/g
  const queryFlag = 'q='
  const queryPattern = new RegExp('q=.*' + paramSeparator)

  export default {

    components: {
      paymentDialog,
      viewDialog
    },
    props: {
      type: {
        type: String,
        default: 'valid'
      }
    },
    computed: {
      ...mapGetters([
        'device', 'rolePower'
      ]),

      hasView() {
        return checkPermission('LogisticPaymentBillDetailResource_get');
      },
      hasEdit() {
        return checkPermission('LogisticPaymentBillResource_create');
      },
      hasOperation() {
        return this.hasView || this.hasEdit;
      }
    },
    filters: {
      currency: currency
    },

    data() {
      return {
        //样式
        tableMaxHeight: this.device !== 'mobile' ? 400 : 40000000,

        // 多选记录对象
        selected: [],

        //分页
        size: 20,
        page: 1,
        layout: 'total, sizes, slot, prev, pager, next, jumper',
        paginationSizes: [20, 50, 100, 500, 1000],
        total: 0,

        //抓数据 TODO: 根据实际情况调整
        url: '/logisticPaymentBills', // 资源URL
        countUrl: '/logisticPaymentBills/count', // 资源URL
        relations: ["companyManagement", "linerShippingPlan", "currency", "creator"],  // 关联对象
        data: [],
        phSort: {prop: "latestPaymentTime", order: "asc"},

        // 表格加载效果
        loading: false,

        //搜索 TODO: 根据实际情况调整
        supplierSelectOptions: [],
        statusSelectOptions: [],

        searchParam: {
          companyManagementId: {value: null, op: 'in', id: 'companyManagementId'},
          latestPaymentTime: {value: null, op: 'timeRange', id: 'latestPaymentTime'},
          code: {value: null, op: 'bw', id: 'code'},
          status: {value: '1', op: 'in', id: 'status'}
        },

        //弹窗
        dialogTitle: '新增',
        dialogVisible: false,
        isNew: true,
        isEdit: false,
        isView: false,

        // 记录修改的那一行
        row: {},
      }
    },

    created() {
    },

    mounted() {
      //全屏，表格高度处理
      window.onresize = () => {
        this.getTableHeight();
      }

      // 搜索区块，根据url恢复功能
      // 恢复查询条件
      {
        let matches = location.href.match(queryPattern)
        if (matches) {
          let query = matches[0].substr(2).replace(valueSeparatorPattern, equal)
          let params = qs.parse(query, {delimiter: paramSeparator})
          // page size 特殊处理
          this.page = params.currentPage ? params.currentPage * 1 : this.page
          this.size = params.pageSize ? params.pageSize * 1 : this.size
          this.phSort.prop = params.sort ? params.sort : this.phSort.prop
          this.phSort.order = params.dir ? params.dir : this.phSort.order

          //TODO:根据实际情况调整
          if (params.latestPaymentTime) {
            this.searchParam.latestPaymentTime.value = params.latestPaymentTime;
          }
          if (params.companyManagementId) {
            this.searchParam.companyManagementId.value = params.companyManagementId;
          }
          if (params.code) {
            this.searchParam.code.value = params.code;
          }
          if (params.status) {
            this.searchParam.status.value = params.status;
          }
        }
      }

      // 渲染完毕，控件加载完毕后执行
      this.$nextTick(() => {
        this.getTableHeight();
        this.initData();
        this.getList();
      })
    },
    methods: {
      /********************* 基础方法  *****************************/
      //初始化数据 TODO:根据实际情况调整
      initData() {
        this.supplierSelectOptions = companyManagementModel.getSelectOptions();
        this.statusSelectOptions = phEnumModel.getSelectOptions("LogisticPaymentStatus");
        this.statusSelectOptions.unshift({label: '全部', value: null});
      },

      // 获取表格的高度
      getTableHeight() {
        if (this.device !== 'mobile') {
          //浏览器高度
          let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          //表格高度
          let tableHeight = windowHeight;
          tableHeight = tableHeight - 68; //减框架头部高度
          tableHeight = tableHeight - (this.$refs.searchForm ? this.$refs.searchForm.$el.offsetHeight : 0); //减搜索区块高度
          tableHeight = tableHeight - (this.$refs.operationForm ? this.$refs.operationForm.$el.offsetHeight : 0); //减操作区块高度
          tableHeight = tableHeight - (this.$refs.pageForm ? this.$refs.pageForm.$el.offsetHeight : 0); //减分页区块高度
          tableHeight = tableHeight - 82;  //减去一些padding,margin，border偏差
          this.tableMaxHeight = tableHeight;
        }
        else {
          this.tableMaxHeight = 400;
        }
      },

      /********************* 搜索相关方法  ***************************/
      /*搜索*/
      search() {
        this.$refs.searchForm.validate(valid => {
          if (!valid) {
            return
          }
          this.page = 1
          this.getList(true);
        })
      },

      /*搜索重置*/
      resetSearch() {
        // reset后, form里的值会变成 undefined, 在下一次查询会赋值给query
        this.$refs.searchForm.resetFields();
        this.page = 1

        //TODO:根据实际情况调整
        this.searchParam.latestPaymentTime.value = null;
        this.searchParam.companyManagementId.value = null;
        this.searchParam.status.value = '1';
        this.searchParam.code.value = null;

        // 重置url
        history.replaceState(history.state, '', location.href.replace(queryPattern, ''))

        this.$nextTick(() => {
          this.getList()
        })

        /**
         * 按下重置按钮后触发,
         * 另外, 当customQuery.sync时, 会重置customQuery
         * @event reset
         */
        this.$emit('reset')

        // this.$emit(
        //   'update:customQuery',
        //   Object.assign(this.customQuery, JSON.parse(this.initCustomQuery))
        // )
      },

      /********************* 表格相关方法  ***************************/
      /*格式化列输出 Formatter*/
      //  TODO:根据实际情况调整
      exempleFormatter(row, column) {
        return '';
      },

      /*报警样式 */
      //  TODO:根据实际情况调整
      dangerClassName({row}) {
        return '';
      },

      /*获取列表*/
      /* shouldStoreQuery 是否开启通过url记录查询参数， true表示开启 */
      getList(shouldStoreQuery) {
        let url = this.url
        let countUrl = this.countUrl
        let params = ''
        let searchParams = ''
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
        searchParams += `pageSize=${size}&currentPage=${page}`

        // 处理排序
        if (this.phSort) {
          params += `&sort=${this.phSort.prop}&dir=${this.phSort.order}`
          searchParams += `&sort=${this.phSort.prop}&dir=${this.phSort.order}`
        }

        // 处理查询
        let filters = [];

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

        filters.forEach((param, k) => {
          searchParams += "&" + param.field + "=" + encodeURIComponent(param.data ? param.data.toString().trim() : '')
        })

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

        // 存储query记录, 便于后面恢复
        if (shouldStoreQuery > 0) {

          let newUrl = ''
          let searchQuery = queryFlag + (searchParams)
            .replace(/&/g, paramSeparator)
            .replace(equalPattern, valueSeparator) + paramSeparator

          // 非第一次查询
          if (location.href.indexOf(queryFlag) > -1) {
            newUrl = location.href.replace(queryPattern, searchQuery)
          } else {
            let search = location.href.indexOf('?') > -1 ? `&${searchQuery}` : `?${searchQuery}`
            newUrl = location.origin + location.pathname + location.search + location.hash + search
          }
          history.pushState(history.state, 'ph-table search', newUrl)
        }
      },

      /* 多选功能 */
      handleSelectionChange(val) {
        this.selected = val

        /**
         * 多选启用时生效, 返回(selected)已选中行的数组
         * @event selection-change
         */
        this.$emit('selection-change', val)
      },

      /* 排序功能 */
      handleSortChange: function (column) {
        if (column.prop) {
          this.phSort.prop = column.prop;
          this.phSort.order = column.order === 'ascending' ? 'asc' : 'desc';
        }
        this.page = 1;
        this.getList(true);
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
      /* 行编辑按钮 */
      onDefaultEdit(row) {
        // 弹窗
        this.$refs.paymentDialog.openDialog(row.id);
      },

      /* 行删除按钮 */
      onDefaultView(row) {
        // 弹窗
        this.$refs.viewDialog.openDialog(row.id);
      },

      /* 子组件修改完成后消息回调 编辑完成之后需要刷新列表 */
      modifyCBEvent(object) {
        this.getList();
      },
    }
  }
</script>


<style type="text/less" lang="scss" scoped>
  .el-form-item__content {
    /deep/ .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
      width: 220px !important;
    }
  }
</style>

