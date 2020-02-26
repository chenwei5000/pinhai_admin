<template>

  <div class="ph-table">

    <!--搜索 TODO: 更加实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam"
             ref="searchForm"
             inline-message
             @submit.native.prevent>

      <el-form-item label="交货日期">

        <el-date-picker
          size="mini"
          v-model="searchParam.deliveryTime.value"
          format="yyyy-MM-dd"
          style="width: 220px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="交货日期"
          end-placeholder="结束日期">
        </el-date-picker>

      </el-form-item>


      <el-form-item label="供货商">
        <el-select size="mini" filterable v-model="searchParam.supplierId.value" style="width: 120px"
                   placeholder="请选择供货商">
          <el-option
            v-for="(item,idx) in supplierSelectOptions"
            :label="item.label" :value="item.value"
            :key="idx"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="分类">
        <el-select
          v-model="searchParam.product_categoryId.value"
          size="mini"
          style="width: 120px"
          filterable
          placeholder="请选择分类">
          <el-option
            v-for="(item,idx) in categorySelectOptions"
            :label="item.label" :value="item.value"
            :key="idx"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SKU">
        <el-input size="mini" v-model="searchParam.product_skuCode.value" style="width: 150px"
                  placeholder="请输入名称"></el-input>
      </el-form-item>

      <el-form-item label="采购单编号">
        <el-input size="mini" v-model="searchParam.procurementOrder_code.value" style="width: 150px"
                  placeholder="请输入采购单编号"></el-input>
      </el-form-item>

      <el-form-item label="状态">
        <el-select filterable v-model="searchParam.status.value" style="width: 120px;" size="mini" placeholder="请选择状态">
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


    <!-- 表格工具条 添加、导入、导出等 -->
    <tableToolBar
      ref="tableToolBar"
      :hasAdd="hasAdd"
      addTitle="创建发货计划"
      :hasDelete="hasDelete"
      :hasExport="hasExport"
      @onToolBarAdd="onToolBarAdd"
      @onToolBarDelete="onToolBarDelete"
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
      :row-class-name="dangerClassName"
      cell-class-name="ph-cell"
      header-cell-class-name="ph-cell-header"
      :data="data"
      :max-height="tableMaxHeight"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      @sort-change='handleSortChange'
      @cell-dblclick="handleDblclick"
      show-summary
      :summary-method="getSummaries"
      id="table"
    >

      <el-table-column
        type="selection"
        width="30"
        align="center"
      >
      </el-table-column>

      <el-table-column prop="product.skuCode" label="SKU" sortable="custom" min-width="120" fixed="left" align="center">
      </el-table-column>

      <el-table-column prop="statusName" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag size="mini"
                  :type="scope.row.status === 1
            ? 'warning' : scope.row.status === 0
            ? 'danger' : scope.row.status === 2
            ? 'primary' : scope.row.status === 3
            ? 'info' : 'success'"
                  disable-transitions>{{ scope.row.statusName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="product.imgUrl" label="图片" width="40" align="center">
        <template slot-scope="scope" v-if="scope.row.product.imgUrl">
          <el-image
            :z-index="10000"
            style="width: 30px; height: 30px;margin-top: 5px"
            :src="scope.row.product.imgUrl"
            :preview-src-list="[scope.row.product.imgUrl.replace('_SL75_','_SL500_')]" lazy>
          </el-image>
        </template>
      </el-table-column>


      <el-table-column prop="supplier.name" label="供货商" width="100" align="center"></el-table-column>
      <el-table-column prop="deliveryTime" sortable="custom" label="交货日期" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deliveryTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="procurementOrder.code" label="采购编号" width="120" align="center"></el-table-column>
      <el-table-column prop="product.name" label="产品名称" min-width="200" align="center"></el-table-column>

      <el-table-column prop="procurementOrder.name" label="采购单名称" min-width="150" align="center"></el-table-column>
      <el-table-column prop="cartonSpec.code" label="箱规" min-width="100" align="center"></el-table-column>
      <el-table-column prop="numberOfCarton" label="装箱数" min-width="80" align="center"></el-table-column>
      <el-table-column prop="creator.name" label="创建人" min-width="80" align="center"></el-table-column>

      <el-table-column prop="cartonQty" label="计划箱数" width="100" align="center"></el-table-column>
      <el-table-column prop="qty" label="计划件数" width="100" align="center"></el-table-column>

      <el-table-column prop="shippedCartonQty" label="已发货箱数" width="100" align="center"></el-table-column>
      <el-table-column prop="shippedQty" label="已发货件数" width="100" align="center"></el-table-column>

      <el-table-column prop="sumCartonSpecWeight" label="未发货重量(Kg)" min-width="110" align="center"></el-table-column>
      <el-table-column prop="sumCartonVolume" label="未发货体积(Cm³)" min-width="110" align="center"></el-table-column>


      <el-table-column prop="unCartonPlanQty" label="未发货箱数" width="100" align="center" fixed="right"></el-table-column>
      <el-table-column prop="unPlanQty" label="未发货件数" width="100" align="center" fixed="right"></el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation" width="100" fixed="right" align="center">
        <template slot-scope="scope">

          <el-button v-if="(scope.row.status == 0 || scope.row.status == 1 || scope.row.status == 5) && hasEdit" size="mini" icon="el-icon-edit" circle
                     @click="onDefaultEdit(scope.row)" type="primary" id="ph-table-edit">
          </el-button>

          <el-button v-if="scope.row.status == 0 && hasDelete" type="danger" size="mini"
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

    <!--编辑明细对话框-->
    <itemDialog @modifyCBEvent="modifyCBEvent" ref="itemDialog">
    </itemDialog>

    <!--创建发货计划对话框-->
    <createDialog @modifyCBEvent="modifyCBEvent" ref="createDialog">
    </createDialog>

  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import qs from 'qs'
  import {currency, parseTime} from '@/utils'
  import itemDialog from './planDialog'
  import phEnumModel from '@/api/phEnum'
  import excelConfig from './excelPlanConfig'
  import phPercentage from '@/components/PhPercentage/index'
  import tableToolBar from '@/components/PhTableToolBar'
  import supplierModel from '@/api/supplier'
  import {getObjectValueByArr} from "../../../../utils";
  import createDialog from "../create/dialog"
  import categoryModel from '@/api/category'

  const valueSeparator = '~'
  const valueSeparatorPattern = new RegExp(valueSeparator, 'g')
  const paramSeparator = ','
  const equal = '='
  const equalPattern = /=/g
  const queryFlag = 'q='
  const queryPattern = new RegExp('q=.*' + paramSeparator)

  export default {

    components: {
      createDialog,
      itemDialog,
      tableToolBar,
      phPercentage
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
      hasAdd() {
        return this.searchParam.status.value == '0' || this.searchParam.status.value == '1' || this.searchParam.status.value == '5';
      },
      hasEdit() {
        return true;
      },
      hasDelete() {
        return this.searchParam.status.value == '0';
      },
      hasOperation() {
        return (this.hasEdit || this.hasDelete) && this.searchParam.status.value == '0' || this.searchParam.status.value == '1' || this.searchParam.status.value == '5';
      },
      hasExport() {
        return true;
      },
      hasSmart() {
        return true;
      },
      // 显示进度条
      hasCompleteness() {
        return false;
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
        url: '/procurementDeliveryPlans', // 资源URL
        downloadUrl: "", //下载Url
        countUrl: '/procurementDeliveryPlans/count', // 资源URL
        relations: ["product", "cartonSpec", "creator", "procurementOrder", "supplier"],  // 关联对象
        data: [],
        phSort: {prop: "deliveryTime", order: "asc"},
        // 表格加载效果
        loading: false,

        //搜索 TODO: 根据实际情况调整
        statusSelectOptions: [],
        supplierSelectOptions: [],
        categorySelectOptions: [],

        searchParam: {
          deliveryTime: {value: null, op: 'timeRange', id: 'deliveryTime'},
          status: {value: '0', op: 'eq', id: 'status'},
          supplierId: {value: null, op: 'in', id: 'supplierId'},
          product_categoryId: {value: null, op: 'eq', id: 'product_categoryId'},
          product_skuCode: {value: null, op: 'eq', id: 'product_skuCode'},
          procurementOrder_code: {value: null, op: 'eq', id: 'procurementOrder_code'},
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
          if (params.supplierId) {
            this.searchParam.supplierId.value = params.supplierId;
          }
          if (params.product_categoryId) {
            this.searchParam.product_categoryId.value = params.product_categoryId;
          }
          if (params.product_skuCode) {
            this.searchParam.product_skuCode.value = params.product_skuCode;
          }
          if (params.procurementOrder_code) {
            this.searchParam.procurementOrder_code.value = params.procurementOrder_code;
          }
          if (params.status) {
            this.searchParam.status.value = params.status;
          }
          if (params.deliveryTime) {
            this.searchParam.deliveryTime.value = params.deliveryTime;
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
        this.statusSelectOptions = phEnumModel.getSelectOptions('ProcurementDeliveryPlanStatus');
        this.supplierSelectOptions = supplierModel.getSelectOptions();
        this.categorySelectOptions = categoryModel.getMineSelectOptions();
        this.statusSelectOptions.unshift({label: '全部', value: null});

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
        this.searchParam.supplierId.value = null;
        this.searchParam.product_categoryId.value = null;
        this.searchParam.status.value = '0';
        this.searchParam.product_skuCode.value = null;
        this.searchParam.procurementOrder_code.value = null;
        this.searchParam.deliveryTime.value = null;

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
        this.$emit('reset');
      },


      /*汇总数据*/
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];

        columns.forEach((column, index) => {

          if (column.property == 'product.skuCode') {
            const values = data.map(item => item[column.property]);
            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);

            sums[index] = '合计: ' + sums[index] + ' 行';
          }

          if (column.property == 'cartonQty' || column.property == 'shippedCartonQty'  || column.property == 'unCartonPlanQty') {
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

          if (column.property == 'qty' || column.property == 'shippedQty' || column.property == 'unPlanQty') {
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
              sums[index] += ' 件';
            } else {
              sums[index] = 'N/A';
            }
          }

          if (column.property == 'sumCartonSpecWeight') {
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
              sums[index] = currency(sums[index]) + ' Kg';
            } else {
              sums[index] = 'N/A';
            }
          }

          if (column.property == 'sumCartonVolume') {
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
              sums[index] = currency(sums[index]) + ' Cm³';
            } else {
              sums[index] = 'N/A';
            }
          }

        });

        return sums;
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
        let downloadParams = ''
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

        let downloadUrl = url;

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
        downloadParams += '1=1'

        // 处理排序
        if (this.phSort) {
          params += `&sort=${this.phSort.prop}&dir=${this.phSort.order}`
          searchParams += `&sort=${this.phSort.prop}&dir=${this.phSort.order}`
          downloadParams += `&sort=${this.phSort.prop}&dir=${this.phSort.order}`
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
          downloadParams += "&filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});
        }

        // 处理关联加载
        if (this.relations && this.relations.length > 0) {
          params += "&relations=" + JSON.stringify(this.relations);
          downloadParams += "&relations=" + JSON.stringify(this.relations);
        }
        this.downloadUrl = downloadUrl + downloadParams;

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
      /* 行修改功能 */
      onDefaultEdit(row) {
        this.$refs.itemDialog.openDialog(row.id, {});
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
                this.$emit("reloadCBEvent");
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

      /*创建发货计划*/
      onToolBarAdd() {
        if (this.selected == null || this.selected.length == 0) {
          this.$confirm('您没有选择任何交货商品，如果您确认。将手工维护发货计划明细，是否继续？', '提示', {
            type: 'warning',
            beforeClose: (action, instance, done) => {
              if (action == 'confirm') {
                done();
                this.$refs.createDialog.openDialog(JSON.parse(JSON.stringify(this.selected)));
              } else done()
            }
          }).catch(er => {
            /*取消*/
          })
        }
        else {

          let sid = null;
          this.selected.forEach(r => {
            if (sid == null) {
              sid = r.supplierId;
            }
            else {
              if (sid != r.supplierId) {
                sid = false;
              }
            }
          });
          if (sid === false) {
            this.$message.error("一个发货计划对应一个供货商!");
            return false;
          }
          this.$refs.createDialog.openDialog(JSON.parse(JSON.stringify(this.selected)));
        }

      },
      /*批量删除*/
      onToolBarDelete() {
        if (this.selected.length <= 0) {
          this.$message.error("请选择要删除的行!");
          done(false);
          return;
        }

        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              // 多选模式
              let ids = this.selected.map(v => v['id']).toString();
              if (ids != '') {
                this.loading = true;
                this.global.axios
                  .delete(this.url + '/' + ids)
                  .then(resp => {
                    this.$message({type: 'success', message: '删除成功'});
                    this.getList()
                    this.$emit("reloadCBEvent");

                    this.loading = false;
                  })
                  .catch(er => {
                    this.loading = false;
                  })
              }
              done()
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },

      onToolBarDownloadData() {
        //获取数据
        let downloadUrl = this.downloadUrl;
        import('@/vendor/Export2ExcelPinHai').then(excel => {
          this.loading = true;
          excel.export_json_url_to_excel_with_formulae({
            url: downloadUrl,
            excelField: excelConfig.excelField,
            filename: `交货计划-${parseTime(new Date(), '{y}-{m}-{d}')}`
          });
          this.loading = false;
        })
      },

      /* 子组件修改完成后消息回调 编辑完成之后需要刷新列表 */
      modifyCBEvent(object) {
        this.getList();
      },
    }
  }
</script>


<style type="text/less" lang="scss" scoped>
  .table-tool {
    background-color: #dfe6ec;
    position: relative;
    z-index: 890;
    width: 100%;
    min-height: 24px;
    line-height: 24px;
    padding: 5px 10px;
  }
</style>

