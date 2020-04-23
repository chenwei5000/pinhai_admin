<template>

  <div class="app-container">

    <div class="ph-card">

      <!-- 表格 -->
      <div class="ph-card-body">

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
                style="width: 150px"
                value-format="yyyy-MM-dd"
                placeholder="交货日期">
              </el-date-picker>

            </el-form-item>


            <el-form-item label="供货商" v-if="hasNotSales">
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
                        placeholder="请输入SKU"></el-input>
            </el-form-item>

            <el-form-item label="产品名称">
              <el-input size="mini" v-model="searchParam.product_name.value" style="width: 150px"
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

            <el-table-column prop="skuCode" label="SKU" min-width="150" fixed="left" align="center">
            </el-table-column>

            <el-table-column prop="productName" label="产品名称" min-width="200" align="center"></el-table-column>

            <el-table-column prop="cartonSpecCode" label="箱规" min-width="120" align="center"></el-table-column>
            <el-table-column prop="numberOfCarton" label="装箱数" min-width="80" align="center"></el-table-column>

            <el-table-column prop="sumCartonWeight" label="库存重量(Kg)" min-width="100"
                             align="center"></el-table-column>
            <el-table-column prop="sumCartonVolume" label="库存体积(m³)" min-width="100" align="center"></el-table-column>

            <el-table-column prop="cartonQty" label="库存箱数" width="100" align="center"
                             fixed="right"></el-table-column>
            <el-table-column prop="qty" label="库存件数" width="100" align="center" fixed="right"></el-table-column>

          </el-table>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import qs from 'qs'
  import {currency, parseTime} from '@/utils'
  import excelConfig from './excelConfig'
  import tableToolBar from '@/components/PhTableToolBar'
  import supplierModel from '@/api/supplier'
  import categoryModel from '@/api/category'
  import {getObjectValueByArr} from "../../utils";
  import {checkNotRole} from "../../utils/permission";

  const valueSeparator = '~'
  const valueSeparatorPattern = new RegExp(valueSeparator, 'g')
  const paramSeparator = ','
  const equal = '='
  const equalPattern = /=/g
  const queryFlag = 'q='
  const queryPattern = new RegExp('q=.*' + paramSeparator)

  export default {
    name: '采购在途库存',
    components: {
      tableToolBar
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
      hasNotSales() {
        return checkNotRole("销售");
      },
      hasExport() {
        return true;
      }
    },

    data() {
      return {
        //样式
        tableMaxHeight: this.device !== 'mobile' ? 400 : 40000000,

        // 多选记录对象
        selected: [],

        //分页
        size: 100,
        page: 1,
        layout: 'total, sizes, slot, prev, pager, next, jumper',
        paginationSizes: [20, 50, 100, 500, 1000],
        total: 0,

        //抓数据 TODO: 根据实际情况调整
        url: '/transportationStocks/stocks', // 资源URL
        downloadUrl: "", //下载Url
        data: [],
        // 表格加载效果
        loading: false,

        //搜索 TODO: 根据实际情况调整
        supplierSelectOptions: [],
        categorySelectOptions: [],

        searchParam: {
          deliveryTime: {value: null, op: 'timeRange', id: 'deliveryTime'},
          supplierId: {value: null, op: 'in', id: 'supplierId'},
          product_categoryId: {value: null, op: 'eq', id: 'product_categoryId'},
          product_skuCode: {value: null, op: 'eq', id: 'product_skuCode'},
          product_name: {value: null, op: 'bw', id: 'product_name'},
        },

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
          if (params.product_name) {
            this.searchParam.product_name.value = params.product_name;
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
        this.supplierSelectOptions = supplierModel.getSelectOptions();
        this.categorySelectOptions = categoryModel.getMineSelectOptions();
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
          tableHeight = tableHeight - 70;  //减去一些padding,margin，border偏差
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
        this.searchParam.product_skuCode.value = null;
        this.searchParam.product_name.value = null;
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

          if (column.property == 'skuCode') {
            const values = data.map(item => item[column.property]);
            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);

            sums[index] = '合计: ' + sums[index] + ' 行';
          }

          if (column.property == 'cartonQty') {
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

          if (column.property == 'qty') {
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

          if (column.property == 'sumCartonWeight') {
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
              sums[index] = currency(sums[index]) + ' m³';
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

        // 请求开始
        this.loading = true
        this.downloadUrl = url + params;

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

      onToolBarDownloadData() {
        //获取数据
        let downloadUrl = this.downloadUrl;
        import('@/vendor/Export2ExcelPinHai').then(excel => {
          this.loading = true;
          excel.export_json_url_to_excel_with_formulae({
            url: downloadUrl,
            excelField: excelConfig.excelField,
            filename: `采购在途库存-${parseTime(new Date(), '{y}-{m}-{d}')}`
          });
          this.loading = false;
        })
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
