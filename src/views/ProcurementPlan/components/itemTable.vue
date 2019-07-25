<template>

  <div class="ph-table">

    <!--表格 TODO:根据实际情况调整 el-table-column  -->
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
      v-loading="loading"
      @selection-change="handleSelectionChange"
      @sort-change='handleSortChange'
      @filter-change="handleFilterChange"
      id="table"
    >
      <el-table-column prop="id" label="Id" width="90" v-if='false'></el-table-column>
      <el-table-column prop="code" label="编号" width="150" fixed="left"></el-table-column>
      <el-table-column prop="categoryName" label="分类" min-width="120"></el-table-column>
      <el-table-column prop="name" label="名称" min-width="250"></el-table-column>
      <el-table-column prop="formatLimitTime" label="下单截止日" width="120"></el-table-column>
      <el-table-column prop="formatExecuteTime" label="交货截止日" width="120"></el-table-column>
      <el-table-column prop="tags" label="标签" width="120"></el-table-column>

      <el-table-column prop="note" label="备注" width="120">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="备注" width="250" trigger="hover">
            <div v-html="scope.row.formatNote"></div>
            <span slot="reference">{{ scope.row.note ? scope.row.note.substr(0,8)+'..' : '' }}</span>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="statusName" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="info"
            disable-transitions>{{ scope.row.statusName }}
          </el-tag>
        </template>
      </el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation" width="100" fixed="right">
        <template slot-scope="scope">

          <el-button v-if="hasEdit" size="small" icon="el-icon-edit" circle
                     @click="onDefaultEdit(scope.row)" type="primary" id="ph-table-edit">
          </el-button>

          <el-button v-if="hasDelete" type="danger" size="mini"
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
  import {mapGetters} from 'vuex'
  import qs from 'qs'

  const valueSeparator = '~'
  const valueSeparatorPattern = new RegExp(valueSeparator, 'g')
  const paramSeparator = ','
  const equal = '='
  const equalPattern = /=/g
  const queryFlag = 'q='
  const queryPattern = new RegExp('q=.*' + paramSeparator)

  export default {
    name: 'procurementPlans',
    components: {},
    props: {
      plan: {
        type: Object,
        default: null
      }
    },
    computed: {
      ...mapGetters([
        'device'
      ]),

      phTableAttrs() {
        return Object.assign(this.defaultTableAttrs, this.tableAttrs);
      },
    },

    data() {
      return {
        //样式
        tableMaxHeight: this.device !== 'mobile' ? 400 : 40000000,

        //操作
        hasOperation: true,
        hasEdit: true,
        hasDelete: true,
        selected: [],

        //分页
        size: 20,
        page: 1,
        layout: 'total, sizes, slot, prev, pager, next, jumper',
        paginationSizes: [20, 50, 100],
        total: 0,

        //数据 TODO: 根据实际情况调整
        url: this.plan ? 'a' : null, // 资源URL
        //'/amazonStocks/plans/8a23287966dc9acb0166dca2574c0000?warehouse=3&category=6&safetyStockWeek=2&vip1SafetyStockWeek=3&vip2SafetyStockWeek=2&exclude=1
        relations: [],  // 关联对象
        data: [],
        loading: false,

        //搜索 TODO: 根据实际情况调整
        categorySelectOptions: [],
        searchParam: {
          categoryId: {value: null, op: 'in', id: 'categoryId'},
          name: {value: null, op: 'bw', id: 'name'},
          limitTime: {value: null, op: 'timeRange', id: 'limitTime'},
        },

        //弹窗
        dialogTitle: '新增',
        dialogVisible: false,
        isNew: true,
        isEdit: false,
        isView: false,
        confirmLoading: false,

        // 记录修改的那一行
        row: {},
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
        this.initLoadData();
        this.getList();
      })
    },
    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initLoadData() {
      },
      /********************* 搜索相关方法  ***************************/

      /*搜索*/
      search() {
        this.$refs.searchForm.validate(valid => {
          if (!valid) return
          this.page = 1
          this.getList(true);
        })
      },

      /*重置*/
      resetSearch() {
        // reset后, form里的值会变成 undefined, 在下一次查询会赋值给query
        this.$refs.searchForm.resetFields();
        this.page = 1

        //TODO:根据实际情况调整
        this.searchParam.categoryId.value = null;
        this.searchParam.skuCode.value = null;
        this.searchParam.name.value = null;

        // 重置
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

        this.$emit(
          'update:customQuery',
          Object.assign(this.customQuery, JSON.parse(this.initCustomQuery))
        )
      },

      /********************* 表格相关方法  ***************************/
      /*格式化列输出*/
      // Formatter TODO:根据实际情况调整
      vipLevelFormatter(row, column) {
        if (row.vipLevel === 0) {
          return "0-普通"
        }
        else if (row.vipLevel === 1) {
          return "1-热销"

        }
        else if (row.vipLevel === 2) {
          return "2-爆款"
        }
        else {
          return row.vipLevel;
        }
      },

      //报警样式 TODO:根据实际情况调整
      dangerClassName({row}) {
        return '';
      },

      /*获取列表*/
      getList(shouldStoreQuery) {
        let url = this.url
        let params = ''
        let searchParams = ''
        let size = this.size
        let page = this.page

        if (!url) {
          console.warn('url 为空, 不发送请求')
          return
        }

        // 构造查询url
        if (url.indexOf('?') > -1) {
          url += '&'
        }
        else {
          url += '?'
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
          .get(url + params)
          .then(resp => {
            let res = resp.data
            let data = res || []
            this.data = data
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

      //筛选 TODO: 待定
      handleFilterChange: function (filters) {
        let row = null
        let val = null
        // 拷贝filters的值。
        for (const i in filters) {
          row = i // 保存 column-key的值，如果事先没有为column-key赋值，系统会自动生成一个唯一且恒定的名称
          val = filters[i]
        }
        const filter = [{
          row: row,
          op: 'contains',
          value: val
        }]
      },

      // 行编辑按钮
      onDefaultEdit(row) {

      },
      cancel() {

      },
      confirm() {

      },

      /********************* 分页工具条相关方法  ***************************/
      /* 一页显示数量调整 */
      handleSizeChange(val) {
        if (this.size === val) return

        this.page = 1
        this.size = val
        this.getList(true)
      },

      /* 第几页调整 */
      handleCurrentChange(val) {
        if (this.page === val) return

        this.page = val
        this.getList(true)
      },

      /* 刷新功能 */
      onRefreshTable: function () {
        this.getList();
      }
    }
  }
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

  .el-form-item__content {
    /deep/ .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
      width: 230px !important;
    }
  }
</style>

