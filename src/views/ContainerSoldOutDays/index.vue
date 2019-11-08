<template>
  <div class="app-container">
    <div class="ph-card">
      <div class="ph-card-body">

        <div class="ph-table">

          <el-form :inline="true"
                   ref="searchForm"
                   :rules="rules"
                   id="filter-form"
                   :model="searchParam"
                   status-icon
                   inline
                   label-position="right"
                   inline-message>

            <el-form-item label="销售渠道" size="mini" prop="merchantId">
              <el-select filterable v-model="searchParam.merchantId" placeholder="请选择销售渠道">
                <el-option
                  v-for="(item,idx) in merchantSelectOptions"
                  :label="item.label" :value="item.value"
                  :key="idx"
                ></el-option>

              </el-select>
            </el-form-item>

            <el-form-item label="分类" size="mini">
              <el-select filterable v-model="searchParam.categoryId" placeholder="请选择分类">
                <el-option
                  v-for="(item,idx) in categorySelectOptions"
                  :label="item.label" :value="item.value"
                  :key="idx"
                ></el-option>

              </el-select>
            </el-form-item>

            <el-form-item label="周数" size="mini">
              <el-select filterable v-model="searchParam.week" placeholder="统计周数">
                <el-option
                  v-for="(item,idx) in weekSelectOptions"
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

          <el-table
            ref="table"
            style="width: 100%"
            stripe
            border
            highlight-current-row
            :max-height="tableMaxHeight"
            cell-class-name="ph-cell"
            header-cell-class-name="ph-cell-header"
            :data="data"
            v-loading="loading"
            id="table"
          >
            <el-table-column prop="id" label="ID" width="80" v-if="false" align="center"></el-table-column>
            <el-table-column prop="skuCode" label="SKU编码" width="150" fixed="left" align="center"></el-table-column>
            <el-table-column prop="productImgUrl" label="图片" width="40">
              <template slot-scope="scope" v-if="scope.row.productImgUrl">
                <el-image
                  :z-index="10000"
                  style="width: 30px; height: 30px;margin-top: 5px"
                  :src="scope.row.productImgUrl"
                  :preview-src-list="[scope.row.productImgUrl.replace('_SL75_','_SL500_')]" lazy>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名" width="200" align="center"></el-table-column>
            <el-table-column prop="categoryName" label="分类" width="80" align="center"></el-table-column>
            <el-table-column prop="fnSku" label="FNSKU" width="100" align="center"></el-table-column>
            <el-table-column prop="groupName" label="产品款式" width="100" align="center"></el-table-column>
            <el-table-column prop="vipLevel" label="vip等级" width="80" align="center"></el-table-column>
            <el-table-column prop="sevenAmendQty" label="7日销量修正" width="100" align="center"></el-table-column>
            <el-table-column prop="inStockQty" label="库存" width="80" align="center"></el-table-column>
            <el-table-column prop="onPassageQty" label="待入库" width="80" align="center"></el-table-column>
            <el-table-column prop="stockSoldOutTime" label="库售罄时间" width="80" align="center"></el-table-column>
            <el-table-column prop="allSoldOutTime" label="途售罄时间" width="80" align="center"></el-table-column>
            <el-table-column prop="containerSoldOutTime" label="途断货日期" width="80" align="center"></el-table-column>
            <el-table-column prop="containerSoldOutDay" label="途断货天数" width="80" fixed="right" align="center"></el-table-column>
            <el-table-column prop="containerSoldOutCartonQty" label="途缺口箱数" width="80" fixed="right" align="center"></el-table-column>

            <el-table-column label="操作"
                             no-export="true"
                             width="130" fixed="right">
              <template slot-scope="scope">

                <el-button size="mini" icon="el-icon-s-data" circle
                           type="primary" id="ph-table-sell" @click="saleSituation(scope.row)">
                </el-button>

                <el-button size="mini" icon="el-icon-ship" circle
                           type="success" id="ph-table-box" @click="stockSituation(scope.row)">
                </el-button>

                <el-button size="mini" icon="el-icon-s-home" circle
                           type="warning" id="ph-table-time" @click="soldOutTime(scope.row)">
                </el-button>
              </template>
            </el-table-column>

          </el-table>

          <chartDialog ref="chartDialog" :fromParent="searchParam"></chartDialog>

          <stockSituationDialog ref="stockSituationDialog" :fromParent="searchParam"></stockSituationDialog>

          <saleStockDialog ref="saleStockDialog" :fromParent="searchParam"></saleStockDialog>

        </div>

      </div>
    </div>
  </div>
</template>

<script>

  import categoryModel from "../../api/category";
  import merchantModel from "../../api/merchant";
  import qs from 'qs'
  import {checkPermission} from "@/utils/permission";
  import {currency, parseTime} from '@/utils'
  import validRules from "../../components/validRules";

  import chartDialog from '../Dashboard/sales/components/SaleDetails/components/chartDialog'
  import stockSituationDialog from '../Dashboard/sales/components/SaleDetails/components/stockSituationDialog'
  import saleStockDialog from '../Dashboard/sales/components/SaleDetails/components/saleStockDialog'


  const valueSeparator = '~'
  const valueSeparatorPattern = new RegExp(valueSeparator, 'g')
  const paramSeparator = ','
  const equal = '='
  const equalPattern = /=/g
  const queryFlag = 'q='
  const queryPattern = new RegExp('q=.*' + paramSeparator)

  export default {
    components: {
      chartDialog,
      stockSituationDialog,
      saleStockDialog
    },

    data() {
      return {
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,
        data: [],
        total: 0,
        loading: false,
        categorySelectOptions: [],
        weekSelectOptions: [],
        merchantSelectOptions: [],
        searchParam: {merchantId: null, categoryId: '-1', week: 20},
        routerMode: 'hash',

        title: '途断货情况',
        url: '/amazonStocks/containerSoldOutDays',
        tableAttrs: {
          "row-class-name": this.statusClassName
        },
        rules: {
          merchantId: [
            validRules.required
          ]
        },
      }
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

        if (params.categoryId) {
          this.searchParam.categoryId = params.categoryId;
        }
        if (params.merchantId) {
          this.searchParam.merchantId = params.merchantId;
        }
        if (params.week) {
          this.searchParam.week = params.week;
        }
      }

      this.$nextTick(() => {
        this.getTableHeight();
        this.initData();
        this.getList();
      })
    },

    computed: {},

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
          tableHeight = tableHeight - 41; //减标题高度
          this.tableMaxHeight = tableHeight;
        }
        else {
          this.tableMaxHeight = 400;
        }
      },

      initData() {
        this.categorySelectOptions = categoryModel.getMineSelectProdcutOptions();
        this.merchantSelectOptions = merchantModel.getSelectOptions();
        this.weekSelectOptions = [];
        for (let i = 1; i < 52; i++) {
          this.weekSelectOptions.push({
            label: `${i}周`,
            value: i
          })
        }
        this.categorySelectOptions.unshift({label: '全部', value: '-1'});
      },

      statusClassName({row}) {
        return '';
      },

      saleSituation(row) {
        this.$refs.chartDialog.openDialog(row);
      },

      stockSituation(row) {
        this.$refs.stockSituationDialog.openDialog(row);
      },

      soldOutTime(row) {
        this.$refs.saleStockDialog.openDialog(row);
      },

      getList() {
        this.$refs.searchForm.validate(valid => {
          if (!valid) {
            return false
          }

          let url = this.url;
          if (!url) {
            console.warn('url 为空, 不发送请求')
            return
          }
          url += `/${this.searchParam.merchantId}?cid=${this.searchParam.categoryId}&weekNum=${this.searchParam.week}`;
          // 请求开始
          this.loading = true
          //获取数据
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data
              let data = res || []

              this.data = data;
              this.total = res.length || 0;
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
          if (this.routerMode) {
            let newUrl = ''
            let searchParams = `merchantId=${this.searchParam.merchantId}&categoryId=${this.searchParam.categoryId}&weekNum=${this.searchParam.week}`
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
        });
      },

      search() {
        this.$refs.searchForm.validate(valid => {
          if (!valid) {
            return false
          }
          this.getList();
        });
      },

      // 重置
      resetSearch() {
        // reset后, form里的值会变成 undefined, 在下一次查询会赋值给query
        this.$refs.searchForm.resetFields();
        this.searchParam = {merchantId: null, categoryId: '-1', week: 20};
        this.data = [];

        // 重置
        history.replaceState(history.state, '', location.href.replace(queryPattern, ''))
        this.$nextTick(() => {
          this.getList()
        });
      },
    },
    watch: {}
  }
</script>

<style scoped>
  .ph-table {
    padding: 10px 15px;

  }

</style>
