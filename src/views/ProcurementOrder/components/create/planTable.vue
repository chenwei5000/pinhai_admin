<template>

  <div class="ph-table">

    <!--搜索 TODO: 更加实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam"
             ref="searchForm"
             id="filter-form"
             inline-message
             @submit.native.prevent>

      <el-form-item label="编码">
        <el-input size="mini" v-model="searchParam.code.value" style="width: 110px" placeholder="请输入编码"></el-input>
      </el-form-item>

      <el-form-item label="名称">
        <el-input size="mini" v-model="searchParam.name.value" style="width: 110px" placeholder="请输入名称"></el-input>
      </el-form-item>

      <el-form-item label="期望交货日期">
        <el-date-picker
          size="mini"
          v-model="searchParam.limitTime.value"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>

      </el-form-item>

      <el-form-item label="状态">
        <el-select size="mini" filterable v-model="searchParam.status.value" style="width: 120px" placeholder="请选择状态">
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
      <el-table-column prop="code" label="采购计划编号" width="140"></el-table-column>

      <el-table-column prop="statusName" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag size="mini"
                  :type="scope.row.status === 1
            ? 'warning' : scope.row.status === 0
            ? 'danger' : scope.row.status === 2
            ? 'primary' : scope.row.status === 8
            ? 'info' : 'success'"
                  disable-transitions>{{ scope.row.statusName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="下单完成度" width="120">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="下单完成度" width="250" trigger="hover">
            <div>
              完成度：{{ scope.row.qty.orderedCompleteness }}%<BR/>
              总件数：{{ scope.row.qty.qty }} 件<BR/>
              已下单：{{scope.row.qty.orderQty}} 件 <BR/>
            </div>
            <span slot="reference">
              <el-progress :text-inside="true" :stroke-width="16"
                           :percentage="scope.row.qty.orderedCompleteness > 100 ? 100: scope.row.qty.orderedCompleteness"
                           status="success"
              ></el-progress>
            </span>
          </el-popover>

        </template>
      </el-table-column>

      <el-table-column prop="categoryName" label="分类" min-width="150">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="200" trigger="hover"
                      v-if="scope.row.categoryName && scope.row.categoryName.length > 10">
            <div v-html="scope.row.categoryName"></div>
            <span slot="reference">{{
              scope.row.categoryName ? scope.row.categoryName.length > 10 ? scope.row.categoryName.substr(0,8)+'..' : scope.row.categoryName : ''
              }}</span>
          </el-popover>
          <span v-else>
            {{ scope.row.categoryName }}
          </span>
        </template>

      </el-table-column>

      <el-table-column prop="name" label="名称" min-width="250">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="200" trigger="hover"
                      v-if="scope.row.name && scope.row.name.length > 18">
            <div v-html="scope.row.name"></div>
            <span slot="reference">{{
              scope.row.name ? scope.row.name.length > 18 ? scope.row.name.substr(0,16)+'..' : scope.row.name : ''
              }}</span>
          </el-popover>
          <span v-else>
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="formatLimitTime" label="期望交货日期" width="100"></el-table-column>

      <el-table-column prop="note" label="交货要求" width="130">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="交货要求" width="250" trigger="hover"
                      v-if="scope.row.note && scope.row.note.length > 10">
            <div v-html="scope.row.formatNote"></div>
            <span slot="reference">{{ scope.row.note ? scope.row.note.substr(0,8)+'..' : '' }}</span>
          </el-popover>
          <span v-else>
            {{ scope.row.formatNote }}
          </span>
        </template>
      </el-table-column>


      <el-table-column prop="creator.name" label="创建人" width="80"></el-table-column>

      <el-table-column prop="id" label="ID" width="60"></el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation" width="60" fixed="right">
        <template slot-scope="scope">

          <el-button v-if="hasEdit" size="mini" icon="el-icon-document-add" circle
                     @click="onDefaultEdit(scope.row)" type="success" id="ph-table-edit">
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
      style="text-align: right; padding: 10px 0"
      background
      :layout="layout"
      id="ph-table-page"
      ref="pageForm"
    >
      <el-button icon="el-icon-refresh" @click="onRefreshTable" class="btn-prev" circle></el-button>

    </el-pagination>

    <!--编辑对话框-->
    <createDialog @createCBEvent="createCBEvent" ref="createDialog">
    </createDialog>

  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import qs from 'qs'
  import phEnumModel from '@/api/phEnum'
  import createDialog from './dialog'

  const valueSeparator = '~'
  const valueSeparatorPattern = new RegExp(valueSeparator, 'g')
  const paramSeparator = ','
  const equal = '='
  const equalPattern = /=/g
  const queryFlag = 'q='
  const queryPattern = new RegExp('q=.*' + paramSeparator)

  export default {

    components: {
      createDialog
    },
    props: {
      type: {
        type: String,
        default: 'valid'
      },
      defaultFilters: {
        type: Object,
        default: {}
      }
    },
    computed: {
      ...mapGetters([
        'device', 'rolePower', 'rolePower'
      ]),

      // 显示进度条
      hasCompleteness() {
          return true;
      }
    },

    data() {
      return {
        //样式
        tableMaxHeight: this.device !== 'mobile' ? 400 : 40000000,

        //操作按钮控制
        hasOperation: true,
        hasEdit: true,
        hasDelete: true,
        // 多选记录对象
        selected: [],

        //分页
        size: 20,
        page: 1,
        layout: 'total, sizes, slot, prev, pager, next, jumper',
        paginationSizes: [1, 20, 50, 100],
        total: 0,

        //抓数据 TODO: 根据实际情况调整
        url: '/procurementPlans', // 资源URL
        countUrl: '/procurementPlans/count', // 资源URL
        relations: ["creator"],  // 关联对象
        data: [],
        phSort: {prop: "limitTime", order: "asc"},
        // 表格加载效果
        loading: false,

        //搜索 TODO: 根据实际情况调整
        statusSelectOptions: [],
        categorySelectOptions: [],
        searchParam: {
          categoryId: {value: null, op: 'in', id: 'categoryId'},
          name: {value: null, op: 'bw', id: 'name'},
          limitTime: {value: null, op: 'timeRange', id: 'limitTime'},
          status: {value: null, op: 'eq', id: 'status'},
          code: {value: null, op: 'bw', id: 'name'},
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
          if (params.categoryId) {
            this.searchParam.categoryId.value = params.categoryId;
          }
          if (params.limitTime) {
            this.searchParam.limitTime.value = params.limitTime;
          }
          if (params.name) {
            this.searchParam.name.value = params.name;
          }
          if (params.status) {
            this.searchParam.status.value = params.status;
          }
          if (params.code) {
            this.searchParam.code.value = params.code;
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
        this.statusSelectOptions = phEnumModel.getSelectOptions('ProcurementPlanStatus');

        if (this.type === 'editing') {
        }
        //待审核 无删除
        else if (this.type === 'auditing') {
          this.hasDelete = false;
        }
        //执行中 无删除
        else if (this.type === 'executing') {
          this.hasDelete = false;
        }//完成 无删除
        else if (this.type === 'complete') {
          this.hasDelete = false;
        }
        else if (this.type === 'all') {
        }
      },

      // 获取表格的高度
      getTableHeight() {
        if (this.device !== 'mobile') {
          //浏览器高度
          let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          //表格高度
          let tableHeight = windowHeight;
          tableHeight = tableHeight - 84; //减框架头部高度
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
        this.searchParam.categoryId.value = null;
        this.searchParam.limitTime.value = null;
        this.searchParam.name.value = null;
        this.searchParam.status.value = null;
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
        if (row.limitTime > 0) {
          var day = (row.limitTime - new Date()) / 86400000;

          if (day > 0 && day <= 10) { //交期15天预警
            return 'warning-row';
          }
          else if (day <= 0 ) { //可售周数超2周
            return 'danger-row';
          }
        }

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
        filters.push(JSON.parse(JSON.stringify(this.defaultFilters)));

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
        this.$refs.createDialog.openDialog(row.id);
      },

      /* 子组件修改完成后消息回调 编辑完成之后需要刷新列表 */
      createCBEvent(object) {
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

