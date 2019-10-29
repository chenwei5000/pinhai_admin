<template>
  <div class="ph-table">
    <!-- @submit.native.prevent -->
    <!-- 阻止表单提交的默认行为 -->
    <!-- https://www.w3.org/MarkUp/html-spec/html-spec_8.html#SEC8.2 -->

    <!--搜索-->
    <ph-form v-if="searchForm.length > 0 || !!$slots.search" inline :content="searchForm" ref="searchForm"
             id="filter-form"
             @submit.native.prevent>
      <!--@slot 额外的搜索内容, 当searchForm不满足需求时可以使用-->
      <slot name="search"></slot>
      <el-form-item>
        <!--https://github.com/ElemeFE/element/pull/5920-->
        <el-button native-type="submit" type="primary" @click="search" size="mini">查询</el-button>
        <el-button @click="resetSearch" size="mini">重置</el-button>
      </el-form-item>
    </ph-form>

    <!--筛选过滤-->
    <div class="filterbox">
      <div class="filter-with-count" v-if="filterData">
        <el-tag
          disable-transitions
          v-for="(item, index) in filterData"
          :key="index"
          closable
          style="margin-right:10px;"
          @close="handleTagClose(item)"
          size="mini"
          type='info'>
        <span
          style="color:#bbb"
          v-if="item.ftn">
          {{item.ftn}}:
        </span>
          {{item.label}}
        </el-tag>
        <div class="count">
          <slot name="tip">
            <b>
              <slot name="count"></slot>
            </b>
          </slot>
        </div>
        <div class="count">
          <slot name="curnum">
            <b>
              <slot name="curcount"></slot>
            </b>
          </slot>
        </div>
        <div class="count">
          <slot name="selectnum">
            <b>
              <slot name="selectcount"></slot>
            </b>
          </slot>
        </div>
      </div>
      <div>
        <slot></slot>
      </div>
    </div>

    <!--新增、编辑-->
    <tableToolBar
      ref="tableToolBar"
      v-bind="toolbarConfig"
      @onToolBarAdd="onToolBarAdd"
      @onToolBarEdit="onToolBarEdit"
      @onToolBarDelete="onToolBarDelete"
      @onToolBarDownloadTpl="onToolBarDownloadTpl"
      @onToolBarDownloadData="onToolBarDownloadData"
      @onToolBarImportData="onToolBarImportData"
    >
    </tableToolBar>

    <!--表格-->
    <el-table
      ref="table"
      v-bind="phTableAttrs"
      :data="data"
      :row-style="showRow"
      :max-height="tableMaxHeight"
      cell-class-name="ph-cell"
      header-cell-class-name="ph-cell-header"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      @sort-change='handleSortChange'
      id="ph-table"
      @filter-change="handleFilterChange"
    >

      <template v-if="isTree">

        <!--有多选-->
        <template v-if="hasSelect">
          <el-table-column key="selection-key" v-bind="columns[0]" align="center">
          </el-table-column>

          <el-table-column
            key="tree-ctrl"
            v-bind="columns[1]">
            <template slot-scope="scope">
              <span v-if="isTree" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
              <span v-if="isTree && iconShow(scope.$index, scope.row)" class="tree-ctrl"
                    @click="toggleExpanded(scope.$index)">
                <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
                <i v-else class="el-icon-minus"></i>
              </span>
              {{scope.row[columns[1].prop]}}
            </template>
          </el-table-column>

          <el-table-column
            v-for="(col) in columns.filter((c, i) => i !== 0 && i !== 1)"
            :key="col.prop"
            v-bind="col"
            v-if="!col.hidden"
          >

          </el-table-column>
        </template>

        <!--无选择-->
        <template v-else>

          <!--展开这列, 丢失 el-table-column属性-->
          <el-table-column
            key="tree-ctrl"
            v-bind="columns[0]">
            <template slot-scope="scope">
              <span v-if="isTree" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
              <span v-if="isTree && iconShow(scope.$index, scope.row)" class="tree-ctrl"
                    @click="toggleExpanded(scope.$index)">
                <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
                <i v-else class="el-icon-minus"></i>
              </span>
              {{scope.row[columns[0].prop]}}
            </template>
          </el-table-column>

          <el-table-column
            v-for="(col) in columns.filter((c, i) => i !== 0)"
            :key="col.prop"
            v-bind="col"
            v-if="!col.hidden"
          >
          </el-table-column>
        </template>
      </template>

      <!--非树-->
      <template v-else>

        <el-table-column
          v-for="(col) in columns"
          :key="col.prop"
          v-bind="col"
          v-if="!col.hidden"
          :align="col.align ? col.align : 'center'"
        >


        </el-table-column>

      </template>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation"
                       v-bind="operationAttrs"
      >
        <template slot-scope="scope">
          <el-button v-if="isTree && hasNew" type="primary" size="mini"
                     @click="onDefaultNew(scope.row)">新增
          </el-button>
          <el-button v-if="hasEdit" size="mini" icon="el-icon-edit" circle
                     @click="onDefaultEdit(scope.row)" type="primary" id="ph-table-edit">
          </el-button>
          <el-button v-if="hasView" type="info" size="mini" icon="el-icon-search" circle
                     @click="onDefaultView(scope.row)">
          </el-button>

          <el-button v-if="hasDelete && canDelete(scope.row)" type="danger" size="mini"
                     id="ph-table-del" icon="el-icon-delete" circle
                     @click="onDefaultDelete(scope.row)">
          </el-button>

          <el-button v-if="hasSetting" type="warning" size="mini"
                     id="ph-table-setting" icon="el-icon-setting" circle
                     @click="onDefaultSetting(scope.row)">
          </el-button>


        </template>
      </el-table-column>

      <!--@slot 自定义操作列, 当extraButtons不满足需求时可以使用 -->
      <slot></slot>

    </el-table>

    <!--分页-->
    <el-pagination
      v-if="hasPagination"
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

    <!--弹出框-->
    <el-dialog :title="dialogTitle" class="ph-dialog" :visible.sync="dialogVisible" v-if="hasDialog" top="3vh">

      <el-scrollbar class="menu-wrapper" noresize>
        <el-row>
          <el-col :span="22">
            <!--https://github.com/FEMessage/onDefaultEdit-->
            <ph-form :content="form" ref="dialogForm" v-bind="formAttrs" :disabled="isView">
              <!--@slot 额外的弹窗表单内容, 当form不满足需求时可以使用 -->
              <slot name="form"></slot>
            </ph-form>
          </el-col>
        </el-row>
      </el-scrollbar>

      <div slot="footer" v-show="!isView">
        <el-button @click="cancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" :loading="confirmLoading" size="mini">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import qs from 'qs'
  import SelfLoadingButton from './self-loading-button.vue'
  import {mapGetters} from 'vuex'
  import {getObjectVal, parseTime} from '@/utils'
  // 过滤功能
  import editFilter from './Filters/edit.vue'
  import dateFilter from './Filters/date.vue'
  import cascaderFilter from './Filters/cascader.vue'
  import searchFilter from './Filters/search.vue'
  import radiosFilter from './Filters/radio.vue'
  import rangeFilter from './Filters/range.vue'
  import {doDeleteFilter} from './js/index.js'
  import tableToolBar from '@/components/PhTableToolBar'

  const myFilterComponts = {
    edit: editFilter,
    date: dateFilter,
    cascader: cascaderFilter,
    search: searchFilter,
    radio: radiosFilter,
    range: rangeFilter
  }

  // 渲染出来后各种类型筛选器的数量 对应的filter的key
  // 因为可能有多个一样类型的筛选器
  const curFilterCount = {
    edit: 0,
    date: 0,
    cascader: 0,
    search: 0,
    radio: 0,
    range: 0
  }
  const _regFilter = {}
  const _filterAction = {}
  // 存放当前显示的 filter数据 e--》filter的header  filter--》filter的对象映射
  const _curFilter = ''
  const _filterbar = null
  const _regfilterarr = []


  // 默认返回的数据格式如下
  //          {
  //            "page": 1
  //            "pageSize": 4
  //            "rows":[]
  //            "total": 10
  //          }

  // 可根据实际情况传入 data/total 两个字段的路径, 分别对应上面数据结构中的 content/totalElements
  // 如果接口不分页, 则传hasPagination=false, 此时数据取 rows, 当然也可以自定义, 设置dataPath即可

  const defaultFirstPage = 1 //默认第一页

  const dataPath = ''
  const totalPath = ''
  const noPaginationDataPath = ''

  const treeChildKey = 'children'
  const treeParentKey = 'parentId'
  const treeParentValue = 'id'
  const defaultId = 'id'

  const dialogForm = 'dialogForm'

  const equal = '='
  const equalPattern = /=/g

  const valueSeparator = '~'
  const paramSeparator = ','

  const valueSeparatorPattern = new RegExp(valueSeparator, 'g')

  const queryFlag = 'q='
  const queryPattern = new RegExp('q=.*' + paramSeparator)


  export default {
    name: 'ElDataTable',
    components: {
      SelfLoadingButton,
      tableToolBar
    },
    props: {
      /**
       * 请求url, 如果为空, 则不会发送请求; 改变url, 则table会重新发送请求
       */
      url: {
        type: String,
        default: ''
      },
      /**
       * 请求url, 如果为空, 则不会发送请求; 改变url, 则table会重新发送请求
       */
      countUrl: {
        type: String,
        default: '/count'
      },

      importMethod: {
        type: String,
        default: 'post'
      },
      maxUploadCount: {
        type: Number,
        default: 1
      },
      tplNoExportProps: {
        type: Array,
        default() {
          return ['操作', '修改时间', 'ID', '创建人', '状态']
        }
      },

      noExportProps: {
        type: Array,
        default() {
          return ['操作', '修改时间']
        }
      },

      /**
       * 主键，默认值 id，
       * 修改/删除时会用到,请求会根据定义的属性值获取主键,即row[this.id]
       */
      id: {
        type: String,
        default: defaultId
      },
      exportFileName: {
        type: String,
        default: '列表'
      },
      /**
       * 分页请求的第一页的值(有的接口0是第一页)
       */
      firstPage: {
        type: Number,
        default: defaultFirstPage
      },
      /**
       * 渲染组件的分页数据在接口返回的数据中的路径, 嵌套对象使用.表示即可
       */
      dataPath: {
        type: String,
        default: dataPath
      },
      /**
       * 分页数据的总数在接口返回的数据中的路径, 嵌套对象使用.表示即可
       */
      totalPath: {
        type: String,
        default: totalPath
      },
      /**
       * 列属性设置, 详情见element-ui官网
       * @link https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes
       */
      columns: {
        type: Array,
        default() {
          return []
        }
      },
      /**
       * 查询字段渲染, 配置参考onDefaultEdit
       * @link https://github.com/FEMessage/onDefaultEdit/blob/master/README.md
       */
      searchForm: {
        type: Array,
        default() {
          return []
        }
      },
      /**
       * 点击查询按钮, 查询前执行的函数, 需要返回Promise
       */
      beforeSearch: {
        type: Function,
        default() {
          return Promise.resolve()
        }
      },
      /**
       * 路由模式, hash | history || '', 决定了查询参数存放的形式, 设置为空则不存储查询参数
       */
      routerMode: {
        type: String,
        default: 'hash'
      },
      /**
       * 单选, 适用场景: 不可以批量删除
       */
      single: {
        type: Boolean,
        default: false
      },
      /**
       * 操作列的自定义按钮, 渲染的是element-ui的button, 支持包括style在内的以下属性:
       * {type: '', text: '', atClick: row => Promise.resolve(), show: row => return true时显示 }
       * 点击事件 row参数 表示当前行数据, 需要返回Promise, 默认点击后会刷新table, resolve(false) 则不刷新
       */
      extraButtons: {
        type: Array,
        default() {
          return []
        }
      },
      /**
       * 头部的自定义按钮, 渲染的是element-ui的button, 支持包括style在内的以下属性:
       * {type: '', text: '', atClick: selected => Promise.resolve(), show: selected => return true时显示, disabled: selected => return true时禁用}
       * 点击事件 selected参数 表示选中行所组成的数组, 函数需要返回Promise, 默认点击后会刷新table, resolve(false) 则不刷新
       */
      headerButtons: {
        type: Array,
        default() {
          return []
        }
      },
      /**
       * 是否有新增按钮
       */
      hasNew: {
        type: Boolean,
        default: true
      },
      /**
       * 是否有编辑按钮
       */
      hasEdit: {
        type: Boolean,
        default: true
      },

      hasExportTpl: {
        type: Boolean,
        default: false
      },

      hasExport: {
        type: Boolean,
        default: false
      },

      hasImport: {
        type: Boolean,
        default: false
      },

      /**
       * 是否有查看按钮
       */
      hasView: {
        type: Boolean,
        default: false
      },
      /**
       * table头部是否有删除按钮(该按钮要多选时才会出现)
       */
      hasDelete: {
        type: Boolean,
        default: true
      },

      hasSetting: {
        type: Boolean,
        default: false
      },
      /**
       * 某行数据是否可以删除, 返回true表示可以, 控制的是单选时单行的删除按钮
       */
      canDelete: {
        type: Function,
        default() {
          return true
        }
      },
      /**
       * 点击新增按钮时的方法, 当默认新增方法不满足需求时使用, 需要返回promise
       * 参数(data, row) data 是form表单的数据, row 是当前行的数据, 只有isTree为true时, 点击操作列的新增按钮才会有值
       */
      onNew: {
        type: Function
      },
      /**
       * 点击修改按钮时的方法, 当默认修改方法不满足需求时使用, 需要返回promise
       * 参数(data, row) data 是form表单的数据, row 是当前行的数据
       */
      onEdit: {
        type: Function
      },
      /**
       * 点击删除按钮时的方法, 当默认删除方法不满足需求时使用, 需要返回promise
       * 多选时, 参数为selected, 代表选中的行组成的数组; 非多选时参数为row, 代表单行的数据
       */
      onDelete: {
        type: Function
      },
      /**
       * 是否分页
       */
      hasPagination: {
        type: Boolean,
        default: true
      },
      /**
       * 分页组件的子组件布局，子组件名用逗号分隔，对应element-ui pagination的layout属性
       * @link http://element.eleme.io/#/zh-CN/component/pagination
       */
      paginationLayout: {
        type: String,
        default: 'total, sizes, slot, prev, pager, next, jumper'
      },
      /**
       * 分页组件的每页显示个数选择器的选项设置，对应element-ui pagination的page-sizes属性
       * @link http://element.eleme.io/#/zh-CN/component/pagination
       */
      paginationSizes: {
        type: Array,
        default: () => [20, 50, 100]
      },
      /**
       * 分页组件的每页显示个数选择器默认选项，对应element-ui pagination的page-size属性
       * @link http://element.eleme.io/#/zh-CN/component/pagination
       */
      paginationSize: {
        type: Number,
        default: 20
      },
      /**
       * 不分页时的size的大小
       */
      noPaginationSize: {
        type: Number,
        default: 9999
      },
      /**
       * 要渲染的数据是否是树形结构
       */
      isTree: {
        type: Boolean,
        default: false
      },
      /**
       * 树形结构相关: 子节点的字段名
       */
      treeChildKey: {
        type: String,
        default: treeChildKey
      },
      /**
       * 树形结构相关: 父节点的字段名
       */
      treeParentKey: {
        type: String,
        default: treeParentKey
      },
      /**
       * 树形结构相关: 父节点字段值的来源字段。
       * 新增/修改时会用到, 例如, 在id为2的节点新增子节点, 则子节点的parentId为2, 也即parentId的值来源于字段id, 故treeParentValue为id
       */
      treeParentValue: {
        type: String,
        default: treeParentValue
      },
      /**
       * 树形结构相关: 是否展开所有节点
       */
      expandAll: {
        type: Boolean,
        default: false
      },
      /**
       * element table 属性设置, 详情配置参考element-ui官网
       * @link https://element.eleme.cn/#/zh-CN/component/table#table-attributes
       */
      tableAttrs: {
        type: Object,
        default() {
          return {}
        }
      },
      /**
       * 操作列属性
       */
      operationAttrs: {
        type: Object,
        default() {
          return {width: '80', fixed: 'right'}
        }
      },
      /**
       * 是否有弹窗, 用于不需要弹窗时想减少DOM渲染的场景
       */
      hasDialog: {
        type: Boolean,
        default: true
      },
      /**
       * 新增弹窗的标题
       */
      dialogNewTitle: {
        type: String,
        default: '新增'
      },
      /**
       * 修改弹窗的标题
       */
      dialogEditTitle: {
        type: String,
        default: '修改'
      },
      dialogViewTitle: {
        type: String,
        default: '查看'
      },
      /**
       * 弹窗表单, 用于新增与修改, 详情配置参考onDefaultEdit
       * @link https://github.com/FEMessage/onDefaultEdit/blob/master/README.md
       */
      form: {
        type: Array,
        default() {
          return []
        }
      },
      /**
       * 弹窗表单属性设置, 详情配置参考element-ui官网
       * @link http://element.eleme.io/#/zh-CN/component/form#form-attributes
       */
      formAttrs: {
        type: Object,
        default() {
          return {
            "label-width": "100px",
            "label-suffix": ":",
            "status-icon": true,
            size: "mini",
            "inline-message": true,
          }
        }
      },
      /**
       * 新增/修改提交时注入额外的参数
       */
      extraParams: {
        type: Object
      },
      /**
       * 在新增/修改弹窗 点击确认时调用，返回Promise, 如果reject, 则不会发送新增/修改请求
       * 参数: (data, isNew) data为表单数据, isNew true 表示是新增弹窗, false 为 编辑弹窗
       */
      beforeConfirm: {
        type: Function,
        default() {
          return Promise.resolve()
        }
      },

      /**
       * 在新增/修改弹窗 点击确认后调用，返回Promise, 如果reject, 则不会发送新增/修改请求
       * 参数: (data, isNew) data为表单数据, isNew true 表示是新增弹窗, false 为 编辑弹窗
       */
      afterConfirm: {
        type: Function,
        default() {
          return Promise.resolve()
        }
      },

      /**
       * 外部的注入额外的查询参数, 键值对形式
       */
      customQuery: {
        type: Object,
        default() {
          return {}
        }
      },
      /**
       * 是否使用状态特殊样式
       */
      statusClass: {
        type: Boolean,
        default: false
      },
      /**
       * 关联加载对象
       */
      relations: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        downloadUrl: "", //下载Url
        tableMaxHeight: this.device !== 'mobile' ? 400 : 40000000,
        data: [],
        hasSelect: this.columns.length && this.columns[0].type == 'selection',
        size: this.paginationSize || this.paginationSizes[0],
        page: defaultFirstPage,
        phSort: null,
        defaultTableAttrs: {
          'style': "width: 100%",
          stripe: true,
          border: true,
          "highlight-current-row": true,
        },

        // https://github.com/ElemeFE/element/issues/1153
        total: null,
        loading: false,
        selected: [],
        filterData: [],

        //弹窗
        dialogTitle: this.dialogNewTitle,
        dialogVisible: false,
        isNew: true,
        isEdit: false,
        isView: false,
        confirmLoading: false,
        // 要修改的那一行
        row: {},

        // 表格工具条配置
        toolbarConfig: {
          hasEdit: this.hasEdit,
          hasDelete: this.hasDelete,
          hasAdd: this.hasNew,
          hasExportTpl: this.hasExportTpl,
          hasExport: this.hasExport,
          hasImport: this.hasImport,
        },

        // 初始的customQuery值, 重置查询时, 会用到
        // JSON.stringify是为了后面深拷贝作准备
        initCustomQuery: JSON.stringify(this.customQuery)
      }
    },
    watch: {
      url: function (val, old) {
        this.page = defaultFirstPage
        this.getList()
      },
      dialogVisible: function (val, old) {
        if (!val) {
          this.isNew = false
          this.isEdit = false
          this.isView = false
          this.confirmLoading = false

          this.$refs[dialogForm].resetFields()
        }
      }
    },

    computed: {
      ...mapGetters([
        'device', 'rolePower'
      ]),

      phTableAttrs() {
        return Object.assign(this.defaultTableAttrs, this.tableAttrs);
      },
      hasOperation() {
        return this.hasEdit || this.hasDelete;
      }
    },

    mounted() {
      //全屏，表格高度处理
      window.onresize = () => {
        this.getTableHeight();
      }

      //搜索区块，根据url恢复功能
      let searchForm = this.$refs.searchForm
      if (searchForm) {
        // 恢复查询条件
        let matches = location.href.match(queryPattern)

        if (matches) {
          let query = matches[0].substr(2).replace(valueSeparatorPattern, equal)
          let params = qs.parse(query, {delimiter: paramSeparator})
          // page size 特殊处理
          this.page = params.currentPage * 1
          this.size = params.pageSize * 1

          // 对slot=search无效
          searchForm.updateForm(
            Object.keys(params).reduce((acc, k) => {
              if (k !== 'pageSize' && k !== 'currentPage') {
                acc[k] = params[k]
              }
              return acc
            }, {})
          )
        }
      }

      this.$nextTick(() => {
        this.getTableHeight();
        this.getList();
      })
    },
    methods: {
      getColVal(row, prop, formatter) {
        if (formatter && typeof formatter === "function") {
          return formatter.call(this, row);
        }

        return getObjectVal(row, prop)
      },
      // 获取表格的高度
      getTableHeight() {
        if (this.device !== 'mobile') {
          //浏览器高度
          let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          //表格高度
          let tableHeight = windowHeight;
          tableHeight = tableHeight - 115; //减框架头部高度
          //tableHeight = tableHeight - 82; //减标题高度
          tableHeight = tableHeight - (this.$refs.searchForm ? this.$refs.searchForm.$el.offsetHeight : 0); //减搜索区块高度
          tableHeight = tableHeight - (this.$refs.operationForm ? this.$refs.operationForm.$el.offsetHeight : 0); //减操作区块高度
          tableHeight = tableHeight - (this.$refs.pageForm ? this.$refs.pageForm.$el.offsetHeight : 0); //减分页区块高度

          tableHeight = tableHeight - (this.$refs.tableToolBar && this.$refs.tableToolBar.$el.offsetHeight ? this.$refs.tableToolBar.$el.offsetHeight : 0); //减分页区块高度
          //tableHeight = tableHeight - 42;  //减去一些padding,margin，border偏差
          this.tableMaxHeight = tableHeight;
        }
        else {
          this.tableMaxHeight = 400;
        }
      },
      /*获取列表*/
      getList(shouldStoreQuery) {
        //搜索表单，搜索用
        let searchForm = this.$refs.searchForm

        let formQuery = searchForm ? searchForm.getFormValue() : {}

        // TODO Object.assign IE不支持, 所以后面Object.keys的保守其实是没有必要的。。。
        let query = Object.assign({}, formQuery, this.customQuery)

        let url = this.url;
        let countUrl = this.url + this.countUrl;
        let params = ''
        let searchParams = ''
        let size = this.hasPagination ? this.size : this.noPaginationSize

        if (!url) {
          console.warn('DataTable: url 为空, 不发送请求')
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
        let pageOffset = this.firstPage - defaultFirstPage
        let page = this.page + pageOffset


        if (size != this.noPaginationSize) {
          params += `pageSize=${size}&`
          searchParams += `pageSize=${size}&`
        }
        params += `currentPage=${page}`
        searchParams += `currentPage=${page}`

        // 处理排序
        if (this.phSort) {
          params += this.phSort
          searchParams += this.phSort
        }
        // 处理筛选
        // 无效值过滤. query 有可能值为 0, 所以只能这样过滤
        // TODO Object.values IE11不兼容, 暂时使用Object.keys
        let filters = [];

        Object.keys(query).filter(k => {
          return query[k] !== '' && query[k] !== null && query[k] !== undefined
        }).forEach(function (param, k) {
          let oParam = query[param];

          filters.push({
            'field': param,
            op: oParam.op ? oParam.op : 'eq',
            data: oParam.data ? encodeURIComponent(oParam.data.toString().trim()) : ''
          })
        });

        if (filters && filters.length > 0) {
          params += "&filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});
        }

        searchParams += Object.keys(query)
          .filter(k => {
            return query[k] !== '' && query[k] !== null && query[k] !== undefined
          })
          .reduce(
            (searchParams, k) =>
              (searchParams += `&${k}=${encodeURIComponent(
                query[k].data ? query[k].data.toString().trim() : ''
              )}`),
            ''
          )
        // 处理关联加载
        if (this.relations && this.relations.length > 0) {
          params += "&relations=" + JSON.stringify(this.relations);
        }

        // 请求开始
        this.loading = true
        this.downloadUrl = url + params;

        //获取列表数量数据
        this.global.axios
          .get(countUrl + params)
          .then(resp => {
            let res = resp.data
            this.total = res || 0;
          })
          .catch(err => {
            /**
             * 请求数据失败，返回err对象
             * @event error
             */
            this.$emit('error', err)
          })

        //获取列表数据
        this.global.axios
          .get(url + params)
          .then(resp => {
            let res = resp.data
            let data = res || []

            this.data = data
            // 树形结构逻辑
            if (this.isTree) {
              this.data = this.tree2Array(data, this.expandAll)
            }

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
        if (this.routerMode && shouldStoreQuery > 0) {
          let newUrl = ''
          let searchQuery =
            queryFlag +
            (searchParams)
              .replace(/&/g, paramSeparator)
              .replace(equalPattern, valueSeparator) +
            paramSeparator

          // 非第一次查询
          if (location.href.indexOf(queryFlag) > -1) {
            newUrl = location.href.replace(queryPattern, searchQuery)
          } else if (this.routerMode == 'hash') {
            let search =
              location.hash.indexOf('?') > -1
                ? `&${searchQuery}`
                : `?${searchQuery}`
            newUrl =
              location.origin +
              location.pathname +
              location.search +
              location.hash +
              search
          } else {
            let search = location.search ? `&${searchQuery}` : `?${searchQuery}`
            newUrl =
              location.origin +
              location.pathname +
              location.search +
              search +
              location.hash
          }
          history.pushState(history.state, 'ph-table search', newUrl)
        }
      },
      // 搜索
      search() {
        this.$refs.searchForm.validate(valid => {
          if (!valid) return

          this.beforeSearch()
            .then(() => {
              this.page = defaultFirstPage
              this.getList(true)
            })
            .catch(err => {
              this.$emit('error', err)
            })
        })
      },
      // 重置
      resetSearch() {
        // reset后, form里的值会变成 undefined, 在下一次查询会赋值给query
        this.$refs.searchForm.resetFields()
        this.page = defaultFirstPage

        // 重置
        history.replaceState(
          history.state,
          '',
          location.href.replace(queryPattern, '')
        )

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

      // 删除tag
      handleTagClose(tag) {
        this.filterData.splice(this.filterData.indexOf(tag), 1);

        var dofilter = doDeleteFilter(tag)
        this.$emit('filter-change', dofilter)
      },

      // 一页显示数量调整
      handleSizeChange(val) {
        if (this.size === val) return

        this.page = defaultFirstPage
        this.size = val
        this.getList(true)
      },

      // 第几页调整
      handleCurrentChange(val) {
        if (this.page === val) return

        this.page = val
        this.getList(true)
      },

      // 多选按钮修改
      handleSelectionChange(val) {
        this.selected = val

        /**
         * 多选启用时生效, 返回(selected)已选中行的数组
         * @event selection-change
         */
        this.$emit('selection-change', val)
      },

      onRefreshTable: function () {
        this.getList();
      },

      // 排序列修改
      handleSortChange: function (column) {
        if (column.column.sortable == 'custom') {
          if (column.prop) {
            this.phSort = '&sort=' + column.prop + "&dir=" + (column.order === 'ascending' ? 'asc' : 'desc');
          }
          else {
            this.phSort = '';
          }
          this.getList();
        }
      },

      //筛选
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

      // 弹窗相关
      // 除非树形结构在操作列点击新增, 否则 row 都是 undefined
      onDefaultNew(row = {}) {
        this.row = row
        this.isNew = true
        this.isEdit = false
        this.isView = false
        this.dialogTitle = this.dialogNewTitle
        this.dialogVisible = true
      },

      onDefaultView(row) {
        this.row = row
        this.isView = true
        this.isNew = false
        this.isEdit = false
        this.dialogTitle = this.dialogViewTitle
        this.dialogVisible = true

        // 给表单填充值
        this.$nextTick(() => {
          this.$refs[dialogForm].updateForm(row)
        })
      },

      onDefaultEdit(row) {
        this.row = row
        this.isEdit = true
        this.isNew = false
        this.isView = false
        this.dialogTitle = this.dialogEditTitle
        this.dialogVisible = true

        // 给表单填充值
        this.$nextTick(() => {

          //后台加载新数据
          let url = this.url + '/' + row[this.id];

          if (this.relations && this.relations.length > 0) {
            url += "?relations=" + JSON.stringify(this.relations);
          }

          this.global.axios.get(url)
            .then(resp => {
              this.$refs[dialogForm].updateForm(resp.data);
            })
            .catch(err => {
            })
        })
      },

      // 取消
      cancel() {
        this.dialogVisible = false
      },

      // 确定
      confirm() {
        if (this.isView) {
          this.cancel()
          return
        }

        this.$refs[dialogForm].validate(valid => {
          if (!valid) return false

          let data = Object.assign(
            {},
            this.$refs[dialogForm].getFormValue(),
            this.extraParams
          )

          if (this.isTree) {
            if (this.isNew)
              data[this.treeParentKey] = this.row[this.treeParentValue]
            else data[this.treeParentKey] = this.row[this.treeParentKey]
          }

          this.beforeConfirm(data, this.isNew)
            .then(resp => {

              let condiction = 'isNew'
              let customMethod = 'onNew'

              if (this.isEdit) {
                condiction = 'isEdit'
                customMethod = 'onEdit'
              }

              if (this[condiction] && this[customMethod]) {
                this[customMethod](data, this.row)
                  .then(resp => {
                    this.getList()
                    this.showMessage(true)
                    this.cancel()
                  })
                  .catch(e => {
                  })
                return
              }

              // 默认新增/修改逻辑
              let method = 'post'
              let url = this.url + ''

              if (this.isEdit) {
                method = 'put'
                url += `/${this.row[this.id]}`
              }

              this.confirmLoading = true

              this.global.axios[method](url, data)
                .then(resp => {
                  this.getList()
                  this.showMessage(true)
                  this.cancel()
                })
                .catch(err => {
                  this.confirmLoading = false
                })
            })
            .catch(e => {
            })

          this.afterConfirm();

        })
      },
      onDefaultDelete(row) {
        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true

              if (this.onDelete) {
                this.onDelete(
                  this.hasSelect
                    ? !this.single
                    ? this.selected
                    : this.selected[0]
                    : row
                )
                  .then(resp => {
                    this.showMessage(true)
                    done()
                    this.getList()
                  })
                  .catch(e => {
                  })
                  .finally(e => {
                    instance.confirmButtonLoading = false
                  })
                return
              }

              // 默认删除逻辑
              // 单个删除
              if (!this.hasSelect || row) {
                this.global.axios
                  .delete(this.url + '/' + row[this.id])
                  .then(resp => {
                    instance.confirmButtonLoading = false
                    done()
                    this.showMessage(true)
                    this.getList()
                  })
                  .catch(er => {
                    instance.confirmButtonLoading = false
                  })
              } else {
                if (this.selected.length <= 0) {
                  this.$message.error("请选择要删除的行!");
                  instance.confirmButtonLoading = false;
                  done(false);
                  return;
                }
                // 多选模式
                let ids = this.selected.map(v => v[this.id]).toString();
                if (!ids && ids == '') {
                  ids = row[this.id];
                }

                this.global.axios
                  .delete(this.url + '/' + ids)
                  .then(resp => {
                    instance.confirmButtonLoading = false
                    done()
                    this.showMessage(true)
                    this.getList()
                  })
                  .catch(er => {
                    instance.confirmButtonLoading = false
                  })
              }
              this.afterConfirm();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },

      onDefaultSetting(row) {
        this.$emit("onSetting", row);
        return false;
      },

      // 树形table相关
      // https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable
      tree2Array(data, expandAll, parent = null, level = null) {
        let tmp = []
        data.forEach(record => {
          if (record._expanded === undefined) {
            this.$set(record, '_expanded', expandAll)
          }
          let _level = 0
          if (level !== undefined && level !== null) {
            _level = level + 1
          }
          this.$set(record, '_level', _level)
          // 如果有父元素
          if (parent) {
            this.$set(record, 'parent', parent)
          }
          tmp.push(record)

          if (record[this.treeChildKey] && record[this.treeChildKey].length > 0) {
            const children = this.tree2Array(
              record[this.treeChildKey],
              expandAll,
              record,
              _level
            )
            tmp = tmp.concat(children)
          }
        })
        return tmp
      },
      showRow(row) {
        const show = true
        row.row._show = true
        return show
          ? 'animation:treeTableShow 1s-webkit-animation:treeTableShow 1s'
          : 'display:none'
      },
      // 切换下级是否展开
      toggleExpanded(trIndex) {
        const record = this.data[trIndex]
        record._expanded = !record._expanded
      },
      // 图标显示
      iconShow(index, record) {
        //      return index ===0 && record.children && record.children.length > 0;
        return record[this.treeChildKey] && record[this.treeChildKey].length > 0
      },
      showMessage(isSuccess = true) {
        if (isSuccess) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: '操作失败'
          })
        }
      },

      /********************* 工具条按钮  ***************************/
      onToolBarAdd() {
        this.onDefaultNew();
      },
      onToolBarEdit() {

      },
      onToolBarDelete() {
        this.onDefaultDelete();
      },
      onToolBarDownloadTpl() {
        //获取数据
        let table = this.$refs.table;
        let downloadUrl = this.downloadUrl;

        import('@/vendor/Export2Excel').then(excel => {
          excel.export_el_table_to_excel({
            table: table,
            downloadUrl: downloadUrl,
            filename: `${this.exportFileName}-模版-${parseTime(new Date(), '{y}-{m}-{d}')}"`,
            noExportProps: this.tplNoExportProps,
            tpl: true,
          })
        })
      },
      onToolBarDownloadData() {
        //获取数据
        let table = this.$refs.table;
        let downloadUrl = this.downloadUrl;
        downloadUrl = downloadUrl.replace(/pageSize=\d*/, 'pageSize=-1');
        downloadUrl = downloadUrl.replace(/currentPage=\d*/, 'currentPage=1');

        import('@/vendor/Export2Excel').then(excel => {
          this.loading = true;
          excel.export_el_table_to_excel({
            table: table,
            downloadUrl: downloadUrl,
            filename: `${this.exportFileName}-${parseTime(new Date(), '{y}-{m}-{d}')}"`,
            noExportProps: this.noExportProps
          })
          this.loading = false;
        })
      },

      uploadPromise(res) {
        let url = this.url;
        if(this.importMethod != "post"){
          url = `${url}/${res.id}`;
        }
        return this.global.axios[this.importMethod](url, res)
          .then(resp => {
          })
          .catch(err => {
          })
      },

      async onToolBarImportData(excelData) {
        if (!excelData) {
          this.$message.error("导入失败!");
          return false;
        }
        let loading = this.$loading({
          lock: true,
          text: '导入数据中',
          spinner: 'el-icon-upload',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        let table = this.$refs.table;
        let columns = (table && table.columns) ? table.columns : [];
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
              if (prop.indexOf('.') !== false) {
                let tmps = prop.split('.');
                for (var i = 0; i < tmps.length; i++) {
                  if (i === 0) {
                    prop = tmps[0];
                  }
                  else {
                    prop += tmps[1].charAt(0).toUpperCase() + tmps[1].slice(1);
                  }
                }
              }
              _res[prop] = obj[_head];
            }
          });
          resData.push(_res);
        });
        for (var i = 0; i < resData.length; i++) {
          promiseArr.push(this.uploadPromise(resData[i]));
          if (promiseArr.length >= this.maxUploadCount) {
            await Promise.all(promiseArr).then(obj => {
              loading.text = "共[" + resData.length + "]条数据, 已经上传[" + (i + 1) + "]条";
              promiseArr = [];
            });
            promiseArr = [];
          }
        }

        if (promiseArr.length > 0) {
          await Promise.all(promiseArr).then(obj => {
            loading.text = "共[" + resData.length + "]条数据, 已经上传[" + resData.length + "]条";
          });
        }

        loading.close();
        this.$message.success("导入成功");
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

  .ph-table {

    padding: 10px 15px;

    .ms-tree-space {
      position: relative;
      top: 1px;
      display: inline-block;
      font-style: normal;
      font-weight: 400;
      line-height: 1;
      width: 18px;
      height: 14px;

      &
      ::before {
        content: '';
      }

    }

    .tree-ctrl {
      position: relative;
      cursor: pointer;
      color: #2196F3;
    }

    @keyframes treeTableShow {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

  }

</style>
