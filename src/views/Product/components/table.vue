<template>

  <div class="ph-table">

    <!--搜索-->
    <el-form :inline="true" :model="productParam" ref="searchForm" id="filter-form"
             @submit.native.prevent>
      <el-form-item label="分类">
        <el-select filterable v-model="productParam.categoryId.value" placeholder="请选择分类">
          <el-option
            v-for="(item,idx) in categorySelectOptions"
            :label="item.label" :value="item.value"
            :key="idx"
          ></el-option>

        </el-select>
      </el-form-item>

      <el-form-item label="SKU">
        <el-input v-model="productParam.skuCode.value" placeholder="请输入SKU"></el-input>
      </el-form-item>

      <el-form-item label="名称">
        <el-input v-model="productParam.name.value" placeholder="请输入名称"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search" size="small">查询</el-button>
        <el-button @click="resetSearch" size="small">重置</el-button>
      </el-form-item>
    </el-form>

    <!--表格-->
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
      :max-height="tableMaxHeight"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      @sort-change='handleSortChange'
      @filter-change="handleFilterChange"
      id="table"
    >

      <el-table-column prop="skuCode" sortable="custom" label="SKU" min-width="150" fixed="left"></el-table-column>
      <el-table-column prop="name" label="名称" min-width="250"></el-table-column>
      <el-table-column prop="category.name" label="分类" width="80"></el-table-column>
      <el-table-column prop="groupName" v-if="unfinishedHide" label="款式" width="80"></el-table-column>
      <el-table-column prop="model" v-if="unfinishedHide" label="型号" min-width="120"></el-table-column>
      <el-table-column prop="color" v-if="unfinishedHide" label="颜色" min-width="120"></el-table-column>
      <el-table-column prop="grossWeight" label="净重(Kg)" sortable="custom" width="100"></el-table-column>
      <el-table-column prop="length" label="长(Cm)" width="100"></el-table-column>
      <el-table-column prop="width" label="宽(Cm)" width="100"></el-table-column>
      <el-table-column prop="height" label="高(Cm)" width="100"></el-table-column>
      <el-table-column prop="volume" label="体积(Cm³)" sortable="custom" width="120"></el-table-column>
      <el-table-column prop="supplier.name" label="供货商" min-width="100"></el-table-column>
      <el-table-column prop="currencyName" label="结算货币" min-width="100"></el-table-column>
      <el-table-column prop="price" label="采购价" sortable="custom" min-width="100"></el-table-column>
      <el-table-column prop="cartonSpec.code" label="箱规" min-width="150"></el-table-column>
      <el-table-column prop="numberOfCarton" label="装箱数" width="100"></el-table-column>
      <el-table-column prop="asin" v-if="unfinishedHide" label="ASIN" min-width="120"></el-table-column>
      <el-table-column prop="fnSku" v-if="unfinishedHide" label="FN-SKU" min-width="120"></el-table-column>
      <el-table-column prop="parentSku" v-if="unfinishedHide" label="Parent Asin" min-width="120"></el-table-column>
      <el-table-column prop="vipLevel" v-if="unfinishedHide" label="Vip级别" min-width="100"
                       :formatter="vipLevelFormatter"></el-table-column>
      <el-table-column prop="oversize" v-if="unfinishedHide" label="超大" min-width="100"
                       :formatter='row => (row.oversize === 1 ? "是" : "否")'></el-table-column>
      <el-table-column prop="comment" label="备注" min-width="120"></el-table-column>

      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? 'success' : 'info'"
            disable-transitions>{{ scope.row.status === 1 ? '启用' : '禁用' }}
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
  import _get from 'lodash.get'
  import {mapGetters} from 'vuex'
  import qs from 'qs'
  import categoryModel from '@/api/category'
  import createFrom from './createFrom'

  const valueSeparator = '~'
  const valueSeparatorPattern = new RegExp(valueSeparator, 'g')
  const paramSeparator = ','
  const equal = '='
  const equalPattern = /=/g
  const queryFlag = 'q='
  const queryPattern = new RegExp('q=.*' + paramSeparator)

  export default {

    components: {createFrom},
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
        'device'
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
      }
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

        //数据
        url: this.type === 'unfinished' ? '/products/unfinishs' : '/products', // 资源URL
        countUrl: this.type === 'unfinished' ? '/products/countUnfinishs' : '/products/count', // 资源URL
        relations: ["category", "supplier", "cartonSpec", "currency"],  // 关联对象
        data: [],
        phSort: {prop: "skuCode", order: "asc"},
        loading: false,

        //搜索
        categorySelectOptions: [],
        productParam: {
          categoryId: {value: null, op: 'eq', id: 'categoryId'},
          skuCode: {value: null, op: 'bw', id: 'skuCode'},
          name: {value: null, op: 'bw', id: 'name'},
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
        if (params.skuCode) {
          this.productParam.skuCode.value = params.skuCode;
        }
        if (params.name) {
          this.productParam.name.value = params.name;
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
          tableHeight = tableHeight - 84; //减框架头部高度
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
        this.productParam.name.value = null;
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

        this.$emit(
          'update:customQuery',
          Object.assign(this.customQuery, JSON.parse(this.initCustomQuery))
        )
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
        if (!row.price && (row.price == "" || row.price <= 0)) { //价格不全
          return 'danger-row';
        }

        return '';
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

      onDefaultEdit(row) {

        let self = this;
        //后台加载新数据
        let url = '/products/' + row.id;

        if (this.relations && this.relations.length > 0) {
          url += "?relations=" + JSON.stringify(this.relations);
        }

        this.global.axios.get(url)
          .then(resp => {
            let option = {
              title: '编辑产品',
              component: createFrom,
              _top_: '3vh',
              _width_: '90%',
              data: resp.data,
              callback: (val) => {
                if (val) {
                  this.getList();
                }
              }
            };
            common.dialog(option);
          })
          .catch(err => {
          })
      },
      cancel() {
      },
      confirm() {
      },
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
</style>

