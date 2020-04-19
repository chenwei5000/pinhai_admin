<template>

  <div class="ph-table">

    <!--搜索 TODO: 更加实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam"
             ref="searchForm"
             inline-message
             @submit.native.prevent>

      <el-form-item label="编号">
        <el-input size="mini" v-model="searchParam.procurementOrder_code.value" style="width: 150px"
                  placeholder="请输入编号"></el-input>
      </el-form-item>

      <el-form-item label="供货商">
        <el-select size="mini" filterable v-model="searchParam.procurementOrder_supplierId.value" style="width: 120px"
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

      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search" size="mini">查询</el-button>
        <el-button @click="resetSearch" size="mini">重置</el-button>
      </el-form-item>
    </el-form>


    <!-- 表格工具条 添加、导入、导出等 -->
    <tableToolBar
      ref="tableToolBar"
      :hasExport="hasExport"
      :hasImport="hasImport"
      @onToolBarDownloadData="onToolBarDownloadData"
      @onToolBarImportData="onToolBarImportData"
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
      <el-table-column prop="product.skuCode" label="SKU" sortable="custom" min-width="120" fixed="left" align="center">
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

      <el-table-column prop="procurementOrder.code" label="完成度" width="90" align="center">
        <template slot-scope="scope">
          <el-progress :text-inside="true" :stroke-width="16"
                       :percentage="scope.row.orderedCompleteness > 100 ? 100: scope.row.orderedCompleteness"
                       status="success"
          ></el-progress>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="procurementOrder.supplier.name" label="供货商" width="100" align="center"></el-table-column>
      <el-table-column prop="procurementOrder.otdTime" sortable="custom" label="期望交货日期" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.procurementOrder.otdTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="procurementOrder.code" label="采购单编号" width="120" align="center"></el-table-column>
      <el-table-column prop="procurementOrder.procurementPlan.code" label="采购计划编号" width="120" align="center"></el-table-column>
      <el-table-column prop="product.name" label="产品名称" min-width="200" align="center"></el-table-column>
      <el-table-column prop="procurementOrder.name" label="采购单名称" min-width="150" align="center"></el-table-column>

      <el-table-column prop="cartonQty" label="采购箱数" width="100" align="center"></el-table-column>
      <el-table-column prop="orderCartonQty" label="已确认箱数" width="100" align="center"></el-table-column>

      <el-table-column prop="sumCartonSpecWeight" label="未确认重量(Kg)" min-width="110" align="center"></el-table-column>
      <el-table-column prop="sumCartonVolume" label="未确认体积(m³)" min-width="110" align="center"></el-table-column>

      <el-table-column prop="unOrderCartonQty" label="未确认箱数" width="100" align="center" fixed="right"></el-table-column>
      <el-table-column prop="unOrderQty" label="未确认件数" width="100" align="center" fixed="right"></el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation" width="50" fixed="right" align="center">
        <template slot-scope="scope">

          <el-button v-if="hasEdit" size="mini" icon="el-icon-date" circle
                     @click="onDefaultEdit(scope.row)" type="primary">
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

    <!--确认交货日期对话框-->
    <editDialog @modifyCBEvent="modifyCBEvent" ref="editDialog">
    </editDialog>

  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import qs from 'qs'
  import {currency, parseTime} from '@/utils'
  import editDialog from './dialog'
  import phEnumModel from '@/api/phEnum'
  import phPercentage from '@/components/PhPercentage/index'
  import excelConfig from './excelConfig'
  import supplierModel from '@/api/supplier'
  import {getObjectValueByArr} from "../../../../utils";
  import tableToolBar from '@/components/PhTableToolBar'
  import {checkPermission} from "../../../../utils/permission";
  import moment from 'moment'
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
      editDialog,
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

      hasExport() {
        return checkPermission('ProcurementDeliveryPlanResource_create');
      },

      hasImport() {
        return checkPermission('ProcurementDeliveryPlanResource_create');
      },
      hasEdit() {
        return checkPermission('ProcurementDeliveryPlanResource_create');
      },
      hasOperation() {
        return this.hasEdit;
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
        maxUploadCount: 1,

        //分页
        size: 20,
        page: 1,
        layout: 'total, sizes, slot, prev, pager, next, jumper',
        paginationSizes: [20, 50, 100, 500, 1000],
        total: 0,

        //抓数据 TODO: 根据实际情况调整
        url: '/procurementOrderItems/listNoDeliveryPlans', // 资源URL
        downloadUrl: "", //下载Url
        countUrl: '/procurementOrderItems/countNoDeliveryPlans', // 资源URL
        relations: ["product", "cartonSpec", "procurementOrder", "procurementOrder.creator", "procurementOrder.supplier", "procurementOrder.procurementPlan","product.cartonSpec"],  // 关联对象
        data: [],
        phSort: {prop: "procurementOrder.otdTime", order: "asc"},
        // 表格加载效果
        loading: false,

        //搜索 TODO: 根据实际情况调整
        statusSelectOptions: [],
        supplierSelectOptions: [],
        categorySelectOptions: [],

        searchParam: {
          procurementOrder_supplierId: {value: null, op: 'in', id: 'procurementOrder_supplierId'},
          product_skuCode: {value: null, op: 'eq', id: 'product_skuCode'},
          procurementOrder_code: {value: null, op: 'eq', id: 'procurementOrder_code'},
          product_categoryId: {value: null, op: 'eq', id: 'product_categoryId'},
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
          if (params.procurementOrder_supplierId) {
            this.searchParam.procurementOrder_supplierId.value = params.procurementOrder_supplierId;
          }
          if (params.product_skuCode) {
            this.searchParam.product_skuCode.value = params.product_skuCode;
          }
          if (params.procurementOrder_code) {
            this.searchParam.procurementOrder_code.value = params.procurementOrder_code;
          }
          if (params.product_categoryId) {
            this.searchParam.product_categoryId.value = params.product_categoryId;
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
        this.statusSelectOptions = phEnumModel.getSelectOptions('ProcurementOrderStatus');
        this.supplierSelectOptions = supplierModel.getSelectOptions();
        this.categorySelectOptions = categoryModel.getMineSelectOptions();

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
          tableHeight = tableHeight - (this.$refs.tableToolBar ? this.$refs.tableToolBar.$el.offsetHeight : 0); //减分页区块高度
          tableHeight = tableHeight - 84;  //减去一些padding,margin，border偏差
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
        this.searchParam.procurementOrder_supplierId.value = null;
        this.searchParam.product_skuCode.value = null;
        this.searchParam.procurementOrder_code.value = null;

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

          if (column.property == 'cartonQty' || column.property == 'shippedCartonQty' ||  column.property == 'unOrderCartonQty' || column.property == 'orderCartonQty') {
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

          if (column.property == 'qty' || column.property == 'shippedQty' || column.property == 'unOrderQty' || column.property == 'unPlanQty') {
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
        this.$refs.editDialog.openDialog(row);
      },

      /* 子组件修改完成后消息回调 编辑完成之后需要刷新列表 */
      modifyCBEvent(object) {
        this.getList();
      },
      /********************* 工具条按钮  ***************************/
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

      uploadPromise(res) {
        let url = '/procurementDeliveryPlans';
        return this.global.axios.post(url, res)
          .then(resp => {
          })
          .catch(err => {
          })
      },

      formatDate(numb) {
        const time = new Date((numb - 2) * 24 * 3600000 + 1);
        time.setYear(time.getFullYear() - 70);
        return moment(time).format('YYYY-MM-DD');
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

        // 导入数据
        let promiseArr = [];
        let resData = [];

        // 创建提交列表
        excelData.results.forEach(obj => {
          let _res = {};
          _res.deliveryTime = this.formatDate(obj["交货日期"]);
          _res.procurementOrderCode = obj["采购单编号"];
          _res.supplierName = obj["供货商"];
          _res.skuCode = obj["SKU编码"];
          _res.cartonQty = obj["计划交货箱数"];
          _res.cartonSpecCode = obj["箱规"];
          _res.numberOfCarton = obj["装箱数"];
          _res.remark = obj["备注"];
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
</style>

