<template>

  <div class="ph-table">

    <!--搜索 TODO: 更加实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam" ref="searchForm" id="filter-form"
             @submit.native.prevent>

      <el-form-item label="调拨编码">
        <el-input v-model="searchParam.code.value" clearable size="mini" style="width: 160px"
                  placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="FBA ID">
        <el-input v-model="searchParam.linerShippingPlan_shipmentId.value" clearable size="mini" style="width: 160px"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="提单号">
        <el-input v-model="searchParam.linerShippingPlan_ladingBillNumber.value" clearable size="mini" style="width: 160px"
                  placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="箱号">
        <el-input v-model="searchParam.linerShippingPlan_boxNumber.value" clearable size="mini" style="width: 160px"
                  placeholder="请输入"></el-input>
      </el-form-item>


      <el-form-item label="发货仓库">
        <el-select filterable v-model="searchParam.fromWarehouseId.value"
                   size="mini"
                   style="width: 160px" placeholder="请选择">
          <el-option
            v-for="(item,idx) in warehouseSelectOptions"
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
      @cell-dblclick="handleDblclick"
      id="table"
    >
      <el-table-column prop="linerShippingPlan.formatEtdTime" label="发船日期" width="120" align="center"></el-table-column>

      <el-table-column prop="statusName" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag size="small"
                  :type="scope.row.status === 3
            ? 'warning' : scope.row.status === 4
            ? 'primary' : scope.row.status === 6
            ? 'info' : 'success'"
                  disable-transitions>{{ scope.row.statusName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="code" label="调拨单编码" width="120" align="center"></el-table-column>
      <el-table-column prop="linerShippingPlan.code" label="货柜编号" min-width="90" align="center"></el-table-column>
      <el-table-column prop="linerShippingPlan.portOfLoading" label="发船港口" min-width="100" align="center"></el-table-column>
      <el-table-column prop="linerShippingPlan.categoryName" label="出口品类" min-width="200" align="center"></el-table-column>
      <el-table-column prop="linerShippingPlan.shipmentId" label="FBA ID" min-width="120" align="center"></el-table-column>
      <el-table-column prop="linerShippingPlan.ladingBillNumber" label="提单号" min-width="130" align="center"></el-table-column>
      <el-table-column prop="linerShippingPlan.boxNumber" label="箱号" min-width="130" align="center"></el-table-column>
      <el-table-column prop="fromWarehouse.name" label="发货仓库" width="120" align="center"></el-table-column>
      <el-table-column prop="toWarehouse.name" label="收货仓库" width="120" align="center"></el-table-column>
      <el-table-column prop="linerShippingPlan.destinationFulfillmentCenterId" label="收货仓库标识" width="120" align="center"></el-table-column>
      <el-table-column prop="linerShippingPlan.merchandiser" label="负责人" width="120" align="center"></el-table-column>
      <el-table-column prop="linerShippingPlan" label="出口信息" width="180">
        <template slot-scope="scope">
            <span>
              船运公司: {{ scope.row.linerShippingPlan.carrier}}<br>
              货代公司: {{ scope.row.linerShippingPlan.forwardingCompany}}<br>
            </span>
        </template>
      </el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation" width="50" fixed="right" align="center">
        <template slot-scope="scope">

          <el-button v-if="hasEdit" size="small" icon="el-icon-receiving" circle
                     @click="onDefaultEdit(scope.row)" type="success" id="ph-table-edit">
          </el-button>

          <el-button v-if="hasView" size="small" icon="el-icon-view" circle
                     @click="onDefaultView(scope.row)" type="primary" id="ph-table-view">
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
      @cell-dblclick="handleDblclick"
      ref="pageForm"
    >
      <el-button icon="el-icon-refresh" @click="onRefreshTable" class="btn-prev" circle></el-button>

    </el-pagination>

    <!--编辑对话框-->
    <editDialog @modifyCBEvent="modifyCBEvent" ref="editDialog">
    </editDialog>

    <!--查看对话框-->
    <viewDialog ref="viewDialog" >
    </viewDialog>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import qs from 'qs'
  import editDialog from './edit/dialog'
  import viewDialog from './view/dialog'
  import phEnumModel from '@/api/phEnum'
  import phPercentage from '@/components/PhPercentage/index'
  import warehouseModel from "../../../api/warehouse";
  import {getObjectValueByArr} from "../../../utils";

  const valueSeparator = '~'
  const valueSeparatorPattern = new RegExp(valueSeparator, 'g')
  const paramSeparator = ','
  const equal = '='
  const equalPattern = /=/g
  const queryFlag = 'q='
  const queryPattern = new RegExp('q=.*' + paramSeparator)

  export default {

    components: {
      editDialog,
      viewDialog,
      phPercentage
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
        'device', 'rolePower'
      ]),
      hasEdit() {
        if (this.type === 'shipped'|| this.type === 'executing') {
          return true;
        }
        return false;
      },
      hasView() {
        if (this.type === 'complete' || this.type === 'all') {
          return true;
        }
        return false;
      },
      hasOperation() {
        return this.hasView || this.hasEdit
      }
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
        url: '/exportAllocations', // 资源URL
        countUrl: '/exportAllocations/count', // 资源URL
        relations: ["team", "linerShippingPlan","fromWarehouse", "toWarehouse"],  // 关联对象
        data: [],
        phSort: {prop: "id", order: "desc"},
        // 表格加载效果
        loading: false,

        //搜索 TODO: 根据实际情况调整

        warehouseSelectOptions: [],

        searchParam: {
          fromWarehouseId: {value: null, op: 'eq', id: 'fromWarehouseId'},
          toWarehouseId: {value: null, op: 'eq', id: 'toWarehouseId'},
          linerShippingPlan_shipmentId: {value: null, op: 'in', id: 'linerShippingPlan_shipmentId'},
          linerShippingPlan_ladingBillNumber: {value: null, op: 'in', id: 'linerShippingPlan_ladingBillNumber'},
          linerShippingPlan_boxNumber: {value: null, op: 'in', id: 'linerShippingPlan_boxNumber'},
          code: {value: null, op: 'bw', id: 'code'},
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
          if (params.code) {
            this.searchParam.code.value = params.code;
          }
          if (params.fromWarehouseId) {
            this.searchParam.fromWarehouseId.value = params.fromWarehouseId;
          }
          if (params.toWarehouseId) {
            this.searchParam.toWarehouseId.value = params.toWarehouseId;
          }
          if (params.linerShippingPlan_shipmentId) {
            this.searchParam.linerShippingPlan_shipmentId.value = params.linerShippingPlan_shipmentId;
          }
          if (params.linerShippingPlan_ladingBillNumber) {
            this.searchParam.linerShippingPlan_ladingBillNumber.value = params.linerShippingPlan_ladingBillNumber;
          }
          if (params.linerShippingPlan_boxNumber) {
            this.searchParam.linerShippingPlan_boxNumber.value = params.linerShippingPlan_boxNumber;
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
        this.statusSelectOptions = phEnumModel.getSelectOptions('LinerShippingPlanItemStatus');
        this.warehouseSelectOptions = warehouseModel.getSelectDomesticOptions(true);
      },

      // 获取表格的高度
      getTableHeight() {
        if (this.device !== 'mobile') {
          //浏览器高度
          let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          //表格高度
          let tableHeight = windowHeight;
          tableHeight = tableHeight - 30; //减框架头部高度
          tableHeight = tableHeight - 82; //减标题高度
          tableHeight = tableHeight - (this.$refs.searchForm ? this.$refs.searchForm.$el.offsetHeight : 0); //减搜索区块高度
          tableHeight = tableHeight - (this.$refs.operationForm ? this.$refs.operationForm.$el.offsetHeight : 0); //减操作区块高度
          tableHeight = tableHeight - (this.$refs.pageForm ? this.$refs.pageForm.$el.offsetHeight : 0); //减分页区块高度
          tableHeight = tableHeight - 42;  //减去一些padding,margin，border偏差
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
        this.searchParam.code.value = null;
        this.searchParam.fromWarehouseId.value = null;
        this.searchParam.toWarehouseId.value = null;
        this.searchParam.linerShippingPlan_shipmentId.value = null;
        this.searchParam.linerShippingPlan_ladingBillNumber.value = null;
        this.searchParam.linerShippingPlan_boxNumber.value = null;

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

      handleDblclick(row, column, cell, event) {
        let val = getObjectValueByArr(row, column.property);
        if (val) {
          this.$copyText(val)
            .then(res => {
                this.$message.success("单元格内容已成功复制，可直接去粘贴");
              },
              err => {
                this.$message.error("复制失败");
              })
        }
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
        this.$refs.editDialog.openDialog(row.id);
      },

      /* 行查看按钮 */
      onDefaultView(row) {
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
      width: 230px !important;
    }
  }
</style>

