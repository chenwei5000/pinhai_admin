<template>

  <div class="ph-table">

    <!--搜索 TODO: 更加实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam"
             ref="searchForm"
             id="filter-form"
             inline-message
             @submit.native.prevent>

      <el-form-item label="供货商">
        <el-select size="mini" filterable v-model="searchParam.supplierId.value" style="width: 160px"
                   placeholder="请选择供货商">
          <el-option
            v-for="(item,idx) in supplierSelectOptions"
            :label="item.label" :value="item.value"
            :key="idx"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="日期">
        <el-date-picker
          size="mini"
          style="width: 220px"
          v-model="searchParam.reportDate.value"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="|"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>

      </el-form-item>

      <el-form-item label="SKU">
        <el-input size="mini" clearable v-model="searchParam.skuCode.value" style="width: 160px"
                  placeholder="请输入SKU"></el-input>
      </el-form-item>

      <el-form-item label="产品名称">
        <el-input size="mini" clearable v-model="searchParam.productName.value" style="width: 160px"
                  placeholder="请输入产品名称"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search" size="mini">查询</el-button>
        <el-button @click="resetSearch" size="mini">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格工具条 添加、导入、导出等 -->
    <tableToolBar
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
      show-summary
      :summary-method="getSummaries"
      @cell-dblclick="handleDblclick"
      id="table"
    >
      <el-table-column prop="skuCode" label="skuCode" width="150" align="center" fixed="left"></el-table-column>

      <el-table-column prop="supplierName" label="供货商" min-width="100" align="center">
      </el-table-column>

      <el-table-column prop="productName" label="产品名称" min-width="250" align="center">
      </el-table-column>

      <el-table-column label="期初" align="center">
        <el-table-column prop="initialStageVolume" label="体积(m³)" width="90" align="center"></el-table-column>
        <el-table-column prop="initialStageCartonQty" label="箱数" width="90" align="center"></el-table-column>
        <el-table-column prop="initialStageQty" label="件数" width="90" align="center"></el-table-column>
        <el-table-column prop="initialStagePrice" v-if="hasPrice" label="单价" width="90" align="right">
          <template slot-scope="scope">
            {{scope.row.initialStagePrice, scope.row.symbolLeft ? scope.row.symbolLeft : '' | currency}}
          </template>
        </el-table-column>
        <el-table-column prop="initialStageAmount" v-if="hasPrice" label="总额" width="90" align="right">
          <template slot-scope="scope">
            {{scope.row.initialStageAmount, scope.row.symbolLeft ? scope.row.symbolLeft : '' | currency}}
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="入库" align="center">
        <el-table-column prop="inTotalVolume" label="体积(m³)" width="90" align="center"></el-table-column>
        <el-table-column prop="inTotalCartonQty" label="箱数" width="90" align="center"></el-table-column>
        <el-table-column prop="inTotalQty" label="件数" width="90" align="center"></el-table-column>
        <el-table-column prop="inTotalPrice" v-if="hasPrice" label="单价" width="90" align="right">
          <template slot-scope="scope">
            {{scope.row.inTotalPrice, scope.row.symbolLeft ? scope.row.symbolLeft : '' | currency}}
          </template>
        </el-table-column>
        <el-table-column prop="inTotalAmount" v-if="hasPrice" label="总额" width="90" align="right">
          <template slot-scope="scope">
            {{scope.row.inTotalAmount, scope.row.symbolLeft ? scope.row.symbolLeft : '' | currency}}
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="出库" align="center">
        <el-table-column prop="outTotalVolume" label="体积(m³)" width="90" align="center"></el-table-column>
        <el-table-column prop="outTotalCartonQty" label="箱数" width="90" align="center"></el-table-column>
        <el-table-column prop="outTotalQty" label="件数" width="90" align="center"></el-table-column>
        <el-table-column prop="outTotalPrice" v-if="hasPrice" label="单价" width="90" align="right">
          <template slot-scope="scope">
            {{scope.row.outTotalPrice, scope.row.symbolLeft ? scope.row.symbolLeft : '' | currency}}
          </template>
        </el-table-column>
        <el-table-column prop="outTotalAmount" v-if="hasPrice" label="总额" width="90" align="right">
          <template slot-scope="scope">
            {{scope.row.outTotalAmount, scope.row.symbolLeft ? scope.row.symbolLeft : '' | currency}}
          </template>
        </el-table-column>
      </el-table-column>


      <el-table-column label="期末" align="center">
        <el-table-column prop="endStageVolume" label="体积(m³)" width="90" align="center"></el-table-column>
        <el-table-column prop="endStageCartonQty" label="箱数" width="90" align="center"></el-table-column>
        <el-table-column prop="endStageQty" label="件数" width="90" align="center"></el-table-column>
        <el-table-column prop="endStagePrice" v-if="hasPrice" label="单价" width="90" align="right">
          <template slot-scope="scope">
            {{scope.row.endStagePrice, scope.row.symbolLeft ? scope.row.symbolLeft : '' | currency}}
          </template>
        </el-table-column>
        <el-table-column prop="endStageAmount" v-if="hasPrice" label="总额" width="90" align="right">
          <template slot-scope="scope">
            {{scope.row.endStageAmount, scope.row.symbolLeft ? scope.row.symbolLeft : '' | currency}}
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="出口" align="center">
        <el-table-column prop="exportTotalVolume" label="体积(m³)" width="90" align="center"></el-table-column>
        <el-table-column prop="exportTotalCartonQty" label="箱数" width="90" align="center"></el-table-column>
        <el-table-column prop="exportTotalQty" label="件数" width="90" align="center"></el-table-column>
        <el-table-column prop="exportTotalPrice" v-if="hasPrice" label="单价" width="90" align="right">
          <template slot-scope="scope">
            {{scope.row.exportTotalPrice, scope.row.symbolLeft ? scope.row.symbolLeft : '' | currency}}
          </template>
        </el-table-column>
        <el-table-column prop="exportTotalAmount" v-if="hasPrice" label="总额" width="90" align="right">
          <template slot-scope="scope">
            {{scope.row.exportTotalAmount, scope.row.symbolLeft ? scope.row.symbolLeft : '' | currency}}
          </template>
        </el-table-column>

      </el-table-column>
      <el-table-column label="库龄30天" align="center">
        <el-table-column prop="stockAgeCartonQty1" label="箱数" width="90" align="center"></el-table-column>
        <el-table-column prop="stockAgeQty1" label="件数" width="90" align="center"></el-table-column>
      </el-table-column>
      <el-table-column label="库龄31-90天" align="center">
        <el-table-column prop="stockAgeCartonQty2" label="箱数" width="90" align="center"></el-table-column>
        <el-table-column prop="stockAgeQty2" label="件数" width="90" align="center"></el-table-column>
      </el-table-column>
      <el-table-column label="库龄91天以上" align="center">
        <el-table-column prop="stockAgeCartonQty3" label="箱数" width="90" align="center"></el-table-column>
        <el-table-column prop="stockAgeQty3" label="件数" width="90" align="center"></el-table-column>
      </el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasView" width="90" fixed="right" align="center">
        <template slot-scope="scope">

          <el-button v-if="hasView" size="mini"
                     icon="el-icon-view" circle
                     @click="onDefaultEdit(scope.row)" type="primary" id="ph-table-view">
          </el-button>

        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import qs from 'qs'
  import {checkPermission} from "@/utils/permission";
  import {currency, getObjectValueByArr} from "../../../utils";
  import moment from 'moment';
  import supplierModel from "../../../api/supplier";
  import tableToolBar from '@/components/PhTableToolBar'
  import excelConfig from './supplierExcelConfig'

  const valueSeparator = '~'
  const valueSeparatorPattern = new RegExp(valueSeparator, 'g')
  const paramSeparator = ','
  const equal = '='
  const equalPattern = /=/g
  const queryFlag = 'q='
  const queryPattern = new RegExp('q=.*' + paramSeparator)

  export default {

    components: {
      tableToolBar
    },
    props: {
      type: {
        type: String,
        default: 'supplier'
      },
    },

    filters: {
      currency: currency
    },
    computed: {
      ...mapGetters([
        'device', 'rolePower', 'rolePower'
      ]),

      //操作按钮控制
      hasView() {
        return false;
      },

      hasExport() {
        return true;
      },

      hasPrice() {
        return checkPermission('PurchasePriceVisible');
      }
    },

    data() {
      return {
        //样式
        tableMaxHeight: this.device !== 'mobile' ? 400 : 40000000,

        //抓数据 TODO: 根据实际情况调整
        url: '/report/findBeginEndOfPeriodList?type=supplier', // 资源URL
        downloadUrl: '',
        relations: null,  // 关联对象
        data: [],
        // 表格加载效果
        loading: false,

        //搜索 TODO: 根据实际情况调整
        supplierSelectOptions: [],

        searchParam: {
          supplierId: {value: null, op: 'eq', id: 'supplierId'},
          reportDate: {
            value: `${moment(new Date()).startOf('month').format("YYYY-MM-DD")}|${moment(new Date()).endOf('month').format("YYYY-MM-DD")}`,
            op: 'timeRange',
            id: 'reportDate'
          },
          skuCode: {value: null, op: 'bw', id: 'skuCode'},
          productName: {value: null, op: 'bw', id: 'productName'}
        },

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

          //TODO:根据实际情况调整
          if (params.supplierId) {
            this.searchParam.supplierId.value = params.supplierId;
          }
          if (params.reportDate) {
            this.searchParam.reportDate.value = params.reportDate;
          }
          if (params.skuCode) {
            this.searchParam.skuCode.value = params.skuCode;
          }
          if (params.productName) {
            this.searchParam.productName.value = params.productName;
          }
        }
      }

      // 渲染完毕，控件加载完毕后执行
      this.$nextTick(() => {
        this.getTableHeight();
        this.initData();
        //this.getList();
      })
    },
    methods: {
      /********************* 基础方法  *****************************/
      //初始化数据 TODO:根据实际情况调整
      initData() {
        this.supplierSelectOptions = supplierModel.getSelectOptions();
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
          tableHeight = tableHeight - 120;  //减去一些padding,margin，border偏差
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
          this.getList(true);
        })
      },

      /*搜索重置*/
      resetSearch() {
        // reset后, form里的值会变成 undefined, 在下一次查询会赋值给query
        this.$refs.searchForm.resetFields();

        //TODO:根据实际情况调整
        this.searchParam.supplierId.value = null;
        this.searchParam.reportDate.value = `${moment(new Date()).startOf('month').format("YYYY-MM-DD")}|${moment(new Date()).endOf('month').format("YYYY-MM-DD")}`;
        this.searchParam.skuCode.value = null;
        this.searchParam.productName.value = null;

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

        let amount = [];
        amount['initialStageAmount'] = [];
        amount['endStageAmount'] = [];
        amount['inTotalAmount'] = [];
        amount['outTotalAmount'] = [];
        amount['exportTotalAmount'] = [];

        data.forEach(r => {
          let symbolLeft = r['symbolLeft'];

          if (amount['initialStageAmount'].hasOwnProperty(symbolLeft)) {
            if (amount['initialStageAmount'][symbolLeft]['price']) {
              amount['initialStageAmount'][symbolLeft]['price'] += r.initialStageAmount;
            }
            else {
              amount['initialStageAmount'][symbolLeft]['price'] = r.initialStageAmount;
            }
          }
          else {
            amount['initialStageAmount'][symbolLeft] = {};
            amount['initialStageAmount'][symbolLeft]['price'] = r.initialStageAmount;
          }

          if (amount['endStageAmount'].hasOwnProperty(symbolLeft)) {
            if (amount['endStageAmount'][symbolLeft]['price']) {
              amount['endStageAmount'][symbolLeft]['price'] += r.endStageAmount;
            }
            else {
              amount['endStageAmount'][symbolLeft]['price'] = r.endStageAmount;
            }
          }
          else {
            amount['endStageAmount'][symbolLeft] = {};
            amount['endStageAmount'][symbolLeft]['price'] = r.endStageAmount;
          }

          if (amount['inTotalAmount'].hasOwnProperty(symbolLeft)) {
            if (amount['inTotalAmount'][symbolLeft]['price']) {
              amount['inTotalAmount'][symbolLeft]['price'] += r.inTotalAmount;
            }
            else {
              amount['inTotalAmount'][symbolLeft]['price'] = r.inTotalAmount;
            }
          }
          else {
            amount['inTotalAmount'][symbolLeft] = {};
            amount['inTotalAmount'][symbolLeft] ['price'] = r.inTotalAmount;
          }

          if (amount['outTotalAmount'].hasOwnProperty(symbolLeft)) {
            if (amount['outTotalAmount'][symbolLeft]['price']) {
              amount['outTotalAmount'][symbolLeft]['price'] += r.outTotalAmount;
            }
            else {
              amount['outTotalAmount'][symbolLeft]['price'] = r.outTotalAmount;
            }
          }
          else {
            amount['outTotalAmount'][symbolLeft] = {};
            amount['outTotalAmount'][symbolLeft]['price'] = r.outTotalAmount;
          }

          if (amount['exportTotalAmount'].hasOwnProperty(symbolLeft)) {
            if (amount['exportTotalAmount'][symbolLeft]['price']) {
              amount['exportTotalAmount'][symbolLeft]['price'] += r.exportTotalAmount;
            }
            else {
              amount['exportTotalAmount'][symbolLeft]['price'] = r.exportTotalAmount;
            }
          }
          else {
            amount['exportTotalAmount'][symbolLeft] = {};
            amount['exportTotalAmount'][symbolLeft]['price'] = r.exportTotalAmount;
          }
        });

        columns.forEach((column, index) => {
          if (column.property == 'skuCode') {
            const values = data.map(item => item[column.property]);
            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);
            sums[index] = '合计: ' + sums[index] + ' 行';
          }
          else if (column.property.indexOf('CartonQty') > -1) {
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
          else if (column.property.indexOf('Qty') > -1) {
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
          else if (column.property.indexOf('Amount') > -1) {

            var keys = Object.keys(amount[column.property]);
            var str = '';
            for (var i = 0; i < keys.length; i++) {
              str += currency(amount[column.property][keys[i]].price, keys[i]) + ' \n ';
            }
            sums[index] = str;
          }
          else if (column.property.indexOf('Volume') > -1) {
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

      /*获取列表*/
      /* shouldStoreQuery 是否开启通过url记录查询参数， true表示开启 */
      getList(shouldStoreQuery) {
        let url = this.url
        let params = ''
        let searchParams = ''

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

        // 处理关联加载
        if (this.relations && this.relations.length > 0) {
          params += "&relations=" + JSON.stringify(this.relations);
        }

        // 请求开始
        this.loading = true

        this.downloadUrl = url + params;

        if(this.searchParam.supplierId.value == null){
          this.$message.error("不选择供货商只能进行导出操作!");
          this.loading = false
          return false;
        }

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

      onToolBarDownloadData() {
        //获取数据
        let downloadUrl = this.downloadUrl;
        if (downloadUrl) {
          import('@/vendor/Export2ExcelPinHai').then(excel => {
            this.loading = true;
            excel.export_json_url_to_excel_with_formulae({
              url: downloadUrl,
              excelMerges: excelConfig.excelMerges,
              excelField: excelConfig.excelField,
              filename: '商品进销存报表-供货商维度'
            });
            this.loading = false;
          })
        }
        else{
          this.$message.error("请先选择供货商、日期！");
        }
      },

    }
  }
</script>


<style type="text/less" lang="scss" scoped>
  .ph-table {
    padding: 0 10px !important;
  }

</style>

