<template>

  <div class="ph-table">

    <!--搜索-->
    <el-form :inline="true" :model="productParam" ref="searchForm" id="filter-form"
             @submit.native.prevent>

      <el-form-item label="渠道" size="mini">
        <el-select filterable v-model="productParam.merchantId.value"
                   placeholder="请选择销售渠道"
                   style="width: 160px">
          <el-option
            v-for="(item,idx) in merchantSelectOptions"
            :label="item.label" :value="item.value"
            :key="idx"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="分类">
        <el-select filterable v-model="productParam.categoryId.value"
                   style="width: 120px"
                   size="mini" placeholder="请选择分类">
          <el-option
            v-for="(item,idx) in categorySelectOptions"
            :label="item.label" :value="item.value"
            :key="idx"
          ></el-option>

        </el-select>
      </el-form-item>

      <el-form-item label="SKU">
        <el-input v-model="productParam.skuCode.value" size="mini" placeholder="请输入SKU"></el-input>
      </el-form-item>

      <el-form-item label="FNSKU">
        <el-input v-model="productParam.fnSku.value" size="mini" placeholder="请输入FNSKU"></el-input>
      </el-form-item>

      <el-form-item label="名称">
        <el-input v-model="productParam.name.value" size="mini" placeholder="请输入名称"></el-input>
      </el-form-item>

      <el-form-item label="款式">
        <el-input v-model="productParam.groupName.value" size="mini" placeholder="请输入款式"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search" size="mini">查询</el-button>
        <el-button @click="resetSearch" size="mini">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格工具条 添加、导入、导出等 -->
    <tableToolBar
      :hasExportTpl="hasExportTpl"
      :hasExport="hasExport"
      :hasImport="hasImport"
      :hasDelete="hasDelete"

      @onToolBarDelete="onToolBarDelete"
      @onToolBarDownloadTpl="onToolBarDownloadTpl"
      @onToolBarDownloadData="onToolBarDownloadData"
      @onToolBarImportData="onToolBarImportData"
    >
    </tableToolBar>

    <!--表格-->
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
      @filter-change="handleFilterChange"
      id="table"
    >

      <el-table-column
        v-if="hasDelete"
        type="selection"
        width="30" align="center">
      </el-table-column>

      <el-table-column prop="skuCode" sortable="custom" label="SKU" min-width="150" fixed="left"
                       align="center"></el-table-column>

      <el-table-column prop="imgUrl" label="图片" width="40">
        <template slot-scope="scope" v-if="scope.row.imgUrl">
          <el-image
            :z-index="10000"
            style="width: 30px; height: 30px;margin-top: 5px"
            :src="scope.row.imgUrl"
            :preview-src-list="[scope.row.imgUrl.replace('_SL75_','_SL500_')]" lazy>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column prop="merchantName" label="销售渠道" min-width="150" align="center"></el-table-column>

      <el-table-column prop="name" label="名称" min-width="250" align="center"></el-table-column>
      <el-table-column prop="category.name" label="分类" width="80" align="center"></el-table-column>
      <el-table-column prop="groupName" v-if="unfinishedHide" label="款式" width="80" align="center"></el-table-column>
      <el-table-column prop="model" v-if="unfinishedHide" label="型号" min-width="120" align="center"></el-table-column>
      <el-table-column prop="color" v-if="unfinishedHide" label="颜色" min-width="120" align="center"></el-table-column>
      <el-table-column prop="grossWeight" label="净重(Kg)" sortable="custom" width="100" align="center"></el-table-column>
      <el-table-column prop="length" label="长(Cm)" width="100" align="center"></el-table-column>
      <el-table-column prop="width" label="宽(Cm)" width="100" align="center"></el-table-column>
      <el-table-column prop="height" label="高(Cm)" width="100" align="center"></el-table-column>
      <el-table-column prop="volume" label="体积(Cm³)" sortable="custom" width="120" align="center"></el-table-column>
      <el-table-column prop="supplier.name" label="供货商" min-width="100" v-if="hasSupplier"
                       align="center"></el-table-column>
      <el-table-column prop="currencyName" label="结算货币" min-width="100" v-if="hasPrice"
                       align="center"></el-table-column>
      <el-table-column prop="price" label="采购价" v-if="hasPrice" sortable="custom" min-width="100"
                       align="center"></el-table-column>
      <el-table-column prop="cartonSpec.code" label="箱规" min-width="150" align="center"></el-table-column>
      <el-table-column prop="numberOfCarton" label="装箱数" width="100" align="center"></el-table-column>
      <el-table-column prop="asin" v-if="unfinishedHide" label="ASIN" min-width="120" align="center"></el-table-column>
      <el-table-column prop="fnSku" v-if="unfinishedHide" label="FN-SKU" min-width="120"
                       align="center"></el-table-column>
      <el-table-column prop="parentSku" v-if="unfinishedHide" label="Parent Asin" min-width="120"
                       align="center"></el-table-column>
      <el-table-column prop="vipLevel" v-if="unfinishedHide" label="Vip级别" min-width="100"
                       :formatter="vipLevelFormatter" align="center"></el-table-column>
      <el-table-column prop="oversize" v-if="unfinishedHide" label="超大" min-width="100"
                       :formatter='row => (row.oversize === 1 ? "是" : "否")' align="center"></el-table-column>
      <el-table-column prop="newGoods" v-if="unfinishedHide" label="新品" min-width="100"
                       :formatter='row => (row.newGoods === 1 ? "是" : "否")' align="center"></el-table-column>

      <el-table-column prop="id" label="ID" min-width="80" align="center"></el-table-column>

      <el-table-column prop="lastModified" sortable="custom" label="修改时间" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastModified | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag size="mini"
                  :type="scope.row.status === 1 ? 'success' : 'info'"
                  disable-transitions>{{ scope.row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation" width="150" fixed="right" align="center">
        <template slot-scope="scope">

          <el-button v-if="hasEdit" size="mini" icon="el-icon-edit" circle
                     @click="onDefaultEdit(scope.row)" type="primary">
          </el-button>
          <el-button v-if="hasView" size="mini" icon="el-icon-view" circle
                     @click="onDefaultEdit(scope.row)" type="primary">
          </el-button>
          <el-button v-if="hasDelete" type="danger" size="mini"
                     icon="el-icon-delete" circle
                     @click="onDefaultDelete(scope.row)">
          </el-button>
          <a target="_blank"
             :href="global.generateUrl('/pdfs/productBarCode')+'/'+ scope.row.id + '?accessToken=' + $store.state.user.token">
            <el-button size="mini" icon="el-icon-printer" circle type="success">
            </el-button>
          </a>


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


    <createDialog ref="createDialog" @modifyCBEvent="modifyCBEvent"></createDialog>

  </div>


</template>

<script>
  import {mapGetters} from 'vuex'
  import qs from 'qs'
  import categoryModel from '@/api/category'
  import createDialog from './dialog'
  import {checkPermission} from "@/utils/permission";
  import tableToolBar from '@/components/PhTableToolBar'
  import {currency, parseTime} from '@/utils'
  import {getObjectValueByArr} from "../../../utils";
  import merchantModel from "../../../api/merchant";


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
      tableToolBar
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

      phTableAttrs() {
        return Object.assign(this.defaultTableAttrs, this.tableAttrs);
      },

      unfinishedHide() {
        if (this.type === 'unfinished') {
          return false;
        }
        else {
          return true;
        }
      },

      hasOperation() {
        return this.hasEdit || this.hasDelete || this.hasView;
      },
      hasView() {
        return !this.hasEdit;
      },
      hasEdit() {
        return checkPermission('ProductResource_update');
      },
      hasDelete() {
        return checkPermission('ProductResource_remove');
      },
      hasSupplier() {
        return checkPermission('SupplierVisible');
      },
      hasPrice() {
        return checkPermission('PurchasePriceVisible');
      },
      hasExportTpl() {
        return checkPermission('ProductResource_export');
      },
      hasExport() {
        return checkPermission('ProductResource_export');
      },
      hasImport() {
        return checkPermission('ProductResource_import');
      }
    },

    data() {
      return {
        //样式
        tableMaxHeight: this.device !== 'mobile' ? 400 : 40000000,
        exportFileName: '产品列表',
        maxUploadCount: 10,
        //操作
        selected: [],

        //分页
        size: 20,
        page: 1,
        layout: 'total, sizes, slot, prev, pager, next, jumper',
        paginationSizes: [20, 50, 100, 500, 1000],
        total: 0,

        //数据
        url: this.type === 'unfinished' ? '/products/unfinishs' : '/products', // 资源URL
        countUrl: this.type === 'unfinished' ? '/products/countUnfinishs' : '/products/count', // 资源URL
        downloadUrl: this.type === 'unfinished' ? '/products/unfinishs' : '/products', // 资源URL

        relations: ["category", "merchant", "supplier", "cartonSpec", "currency", "declareConfig"],  // 关联对象
        data: [],
        phSort: {prop: "skuCode", order: "asc"},
        loading: false,

        //搜索
        categorySelectOptions: [],
        merchantSelectOptions: [],
        productParam: {
          categoryId: {value: null, op: 'eq', id: 'categoryId'},
          merchantId: {value: null, op: 'eq', id: 'categoryId'},
          skuCode: {value: null, op: 'bw', id: 'skuCode'},
          fnSku: {value: null, op: 'eq', id: 'fnSku'},
          name: {value: null, op: 'bw', id: 'name'},
          groupName: {value: null, op: 'bw', id: 'groupName'},
        },
        //弹窗
        dialogTitle: '新增',
        dialogVisible: false,
        isNew: true,
        isEdit: false,
        isView: false,
        confirmLoading: false,
        // 要修改的那一行
        row: {},
      }
    },
    created() {
      this.categorySelectOptions = categoryModel.getMineSelectProdcutOptions();
      this.merchantSelectOptions = merchantModel.getSelectOptions();
    },

    mounted() {

      //全屏，表格高度处理
      window.onresize = () => {
        this.getTableHeight();
      }

      //搜索区块，根据url恢复功能
      // 恢复查询条件
      let matches = location.href.match(queryPattern)

      if (matches) {
        let query = matches[0].substr(2).replace(valueSeparatorPattern, equal)
        let params = qs.parse(query, {delimiter: paramSeparator})
        // page size 特殊处理
        this.page = params.currentPage ? params.currentPage * 1 : this.page
        this.size = params.pageSize ? params.pageSize * 1 : this.size
        this.phSort.prop = params.sort ? params.sort : this.phSort.prop
        this.phSort.order = params.dir ? params.dir : this.phSort.order

        if (params.categoryId) {
          this.productParam.categoryId.value = params.categoryId;
        }
        if (params.merchantId) {
          this.productParam.merchantId.value = params.merchantId;
        }
        if (params.skuCode) {
          this.productParam.skuCode.value = params.skuCode;
        }
        if (params.fnSku) {
          this.productParam.fnSku.value = params.fnSku;
        }
        if (params.name) {
          this.productParam.name.value = params.name;
        }
        if (params.groupName) {
          this.productParam.groupName.value = params.groupName;
        }

      }

      this.$nextTick(() => {
        this.getTableHeight();
        this.getList();
      })
    },
    methods: {
      // 获取表格的高度
      getTableHeight() {
        if (this.device !== 'mobile') {
          //浏览器高度
          let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          //表格高度
          let tableHeight = windowHeight;
          tableHeight = tableHeight - 65; //减框架头部高度
          tableHeight = tableHeight - (this.$refs.searchForm ? this.$refs.searchForm.$el.offsetHeight : 0); //减搜索区块高度
          tableHeight = tableHeight - (this.$refs.operationForm ? this.$refs.operationForm.$el.offsetHeight : 0); //减操作区块高度
          tableHeight = tableHeight - (this.$refs.pageForm ? this.$refs.pageForm.$el.offsetHeight : 0); //减分页区块高度
          tableHeight = tableHeight - 125; //减标题高度
          this.tableMaxHeight = tableHeight;
        }
        else {
          this.tableMaxHeight = 400;
        }
      },

      /*获取列表*/
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

        // 构造查询url
        if (url.indexOf('?') > -1) {
          url += '&'
        }
        else {
          url += '?'
        }

        // 构造查询url
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


        this.downloadUrl = url;

        // 处理查询
        let filters = [];
        Object.keys(this.productParam).filter(k => {
          return this.productParam[k] && this.productParam[k].value !== ''
            && this.productParam[k].value !== null && this.productParam[k].value !== undefined
        }).forEach(param => {
          filters.push({
            'field': param,
            op: this.productParam[param].op ? this.productParam[param].op : 'eq',
            data: this.productParam[param].value ? encodeURIComponent(this.productParam[param].value.toString().trim()) : ''
          })
        });

        filters.forEach((param, k) => {
          searchParams += "&" + param.field + "=" + encodeURIComponent(param.data ? param.data.toString().trim() : '')
        })
        filters.push(JSON.parse(JSON.stringify(this.defaultFilters)));

        if (filters && filters.length > 0) {
          params += "&filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});
          this.downloadUrl += "&filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});
        }

        // 处理关联加载
        if (this.relations && this.relations.length > 0) {
          params += "&relations=" + JSON.stringify(this.relations);
          this.downloadUrl += "&relations=" + JSON.stringify(this.relations);
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
            let search = location.hash.indexOf('?') > -1 ? `&${searchQuery}` : `?${searchQuery}`
            newUrl = location.origin + location.pathname + location.search + location.hash + search
          }
          history.pushState(history.state, 'ph-table search', newUrl)
        }
      },

      search() {
        this.$refs.searchForm.validate(valid => {
          if (!valid) return
          this.page = 1
          this.getList(true);
        })
      },

      // 重置
      resetSearch() {
        // reset后, form里的值会变成 undefined, 在下一次查询会赋值给query
        this.$refs.searchForm.resetFields();
        this.productParam.categoryId.value = null;
        this.productParam.skuCode.value = null;
        this.productParam.fnSku.value = null;
        this.productParam.name.value = null;
        this.productParam.groupName.value = null;
        this.productParam.merchantId.value = null;
        this.page = 1

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

        // this.$emit(
        //   'update:customQuery',
        //   Object.assign(this.customQuery, JSON.parse(this.initCustomQuery))
        // )
      },

      // Formatter
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

      //报警样式
      dangerClassName({row}) {
        if (row.categoryId == null || row.categoryId == "") { //分类不全
          return 'danger-row';
        }
        if (row.supplierId == null || row.supplierId == "") { //供货商不全
          return 'danger-row';
        }
        if (row.numberOfCarton == null || row.numberOfCarton == "") { //装箱数不全
          return 'danger-row';
        }
        if (row.cartonSpecId == null || row.cartonSpecId == "" || row.cartonSpecId == -1) { //箱规不全
          return 'danger-row';
        }
        if (row.grossWeight == null || row.grossWeight == "" || row.grossWeight <= 0) { //重量不全
          return 'danger-row';
        }
        if (this.hasPrice && !row.price && (row.price == "" || row.price <= 0)) { //价格不全
          return 'danger-row';
        }

        return '';
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

      // 一页显示数量调整
      handleSizeChange(val) {
        if (this.size === val) return
        this.page = 1
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

      // 排序列修改
      handleSortChange: function (column) {
        if (column.prop) {
          this.phSort.prop = column.prop;
          this.phSort.order = column.order === 'ascending' ? 'asc' : 'desc';
        }
        this.page = 1;
        this.getList(true);
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

      cancel() {
      },
      confirm() {
      },
      onRefreshTable: function () {
        this.getList();
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 行编辑按钮 */
      onDefaultEdit(row) {
        // 弹窗
        this.$refs.createDialog.openDialog(row.id);
      },

      /* 行删除按钮 */
      onDefaultDelete(row) {
        let url = `${this.url}/${row.id}`;
        this.$confirm('确认删除吗?', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              this.loading = true

              this.global.axios
                .delete(url)
                .then(resp => {
                  this.loading = false
                  this.$message.success("删除成功!");
                  done()
                  this.getList()
                })
                .catch(er => {
                  this.loading = false
                })
            } else {
              this.loading = false;
              done();
            }
          }
        }).catch(er => {
          /*取消*/
        })
      },

      /* 子组件修改完成后消息回调 编辑完成之后需要刷新列表 */
      modifyCBEvent(object) {
        this.$emit("modifyCBEvent", object);
      },

      onToolBarDelete() {
        let ids = [];
        this.selected.forEach(data => {
          ids.push(data.id);
        });
        if (ids == null || ids.length == 0) {
          this.$message.error("请选择要删除的产品");
          return false;
        }
        this.loading = true;
        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              let url = `${this.url}/${ids.join(",")}`;
              this.global.axios.delete(url)
                .then(resp => {
                  this.$message({type: 'success', message: '删除成功'});
                  let obj = resp.data;
                  this.loading = false;
                  this.getList();
                })
                .catch(err => {
                  this.loading = false;
                })
              done();
            } else {
              this.loading = false
              done()
            }
          }
        }).catch(er => {
          /*取消*/
        })
      },

      onToolBarDownloadTpl() {
        //获取数据
        let table = this.$refs.table;
        let downloadUrl = this.downloadUrl;
        if (!downloadUrl) {
          console.warn('url 为空, 导出数据失败！')
          return
        }
        import('@/vendor/Export2Excel').then(excel => {
          excel.export_el_table_to_excel({
            table: table,
            downloadUrl: downloadUrl,
            filename: `${this.exportFileName}-模版-${parseTime(new Date(), '{y}-{m}-{d}')}"`,
            noExportProps: ['图片', '型号', '颜色', '净重(Kg)', '长(Cm)', '宽(Cm)', '高(Cm)', '体积(Cm³)', '供货商',
              '结算货币', '采购价', 'ASIN', 'FN-SKU', 'Parent Asin', 'Vip级别', '超大', '新品', '修改时间', '状态'],
            tpl: true,
          })
        })
      },

      onToolBarDownloadData() {
        //获取数据
        let table = this.$refs.table;
        let downloadUrl = this.downloadUrl;
        if (!downloadUrl) {
          console.warn('url 为空, 导出数据失败！')
          return
        }
        import('@/vendor/Export2Excel').then(excel => {
          this.loading = true;
          excel.export_el_table_to_excel({
            table: table,
            downloadUrl: downloadUrl,
            filename: `${this.exportFileName}-${parseTime(new Date(), '{y}-{m}-{d}')}"`,
            noExportProps: this.hasPrice ? ['图片'] : ['图片', '结算货币', '采购价', '供货商']
          })
          ;
          this.loading = false;
        })
      },

      uploadPromise(res) {
        let url = this.url + '';
        return this.global.axios.post(url, res)
          .then(resp => {
          })
          .catch(err => {
            try {
              this.$store.dispatch('errorLog/addErrorLog', {
                message: err.response.data.description,
                //url: window.location.href,
                title: '导入产品',
                time: new Date()
              });
            }
            catch (e) {
              console.log(e);
            }
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

        // 导入数据
        let promiseArr = [];
        let resData = [];

        // 创建提交列表
        excelData.results.forEach(obj => {
          let _res = {};
          _res.skuCode = obj["SKU"];
          _res.name = obj["名称"];
          _res.categoryName = obj["分类"];
          _res.groupName = obj["款式"];
          _res.model = obj["型号"];
          _res.merchantName = obj["销售渠道"];
          _res.color = obj["颜色"];
          _res.grossWeight = obj["净重(Kg)"];
          _res.length = obj["长(Cm)"];
          _res.width = obj["宽(Cm)"];
          _res.height = obj["高(Cm)"];
          _res.supplierName = obj["供货商"];
          _res.currencyName = obj["结算货币"];
          _res.price = obj["采购价"];
          _res.cartonSpecName = obj["箱规"];
          _res.numberOfCarton = obj["装箱数"];
          _res.asin = obj["ASIN"];
          _res.fnSku = obj["FN-SKU"];
          _res.vipLevel = obj["Vip级别"];
          _res.oversize = obj["超大"];
          _res.newGoods = obj["新品"];
          _res.status = obj["状态"];

          _res.leadDay = obj["交期(天)"];
          _res.brand = obj["品牌"];
          _res.brandType = obj["品牌类型"];
          _res.preferentialDuties = obj["出口享惠类型"];
          _res.texture = obj["材质"];
          _res.purpose = obj["用途"];
          _res.origin = obj["产地"];
          _res.invoiceTitle = obj["开票抬头"];
          _res.invoiceUnit = obj["开票单位"];

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

