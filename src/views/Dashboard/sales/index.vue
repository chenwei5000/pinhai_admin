<template>
  <div class="dashboard">
    <el-row
      style="text-align:left;
             position:fixed;
             width: 100%;vertical-align: bottom;
             bottom: 0px; background-color:#efefef; padding: 0px 30px; z-index: 100; ">

      <el-form :inline="true" ref="searchForm" id="filter-form"
               @submit.native.prevent>
        <el-form-item label="销售渠道" size="small">
          <el-select filterable v-model="searchParam.merchantId" placeholder="请选择销售渠道">
            <el-option
              v-for="(item,idx) in merchantSelectOptions"
              :label="item.label" :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类" size="small">
          <el-select filterable v-model="searchParam.categoryId" placeholder="请选择分类">
            <el-option
              v-for="(item,idx) in categorySelectOptions"
              :label="item.label" :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="统计周数" size="small">
          <el-select filterable v-model="searchParam.week" placeholder="统计周数">
            <el-option
              v-for="(item,idx) in weekSelectOptions"
              :label="item.label" :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 18}" :xl="{span: 18}"
              style="padding-right:8px;margin-bottom:30px;">

        <panel-group :searchParam="searchParam"/>
        <operate-group :searchParam="searchParam" />

        <el-card class="box-card" style="margin-top:10px;">
          <div slot="header" class="clearfix">
            <svg-icon icon-class="sales-statistics"/>
            <span style="margin-left:10px;">销售情况</span>
          </div>
          <el-row style="background:#fff;padding:5px 5px 0;margin-bottom:10px;">
            <line-chart :chart-data="lineChartData" :searchParam="searchParam"/>
          </el-row>
        </el-card>

        <el-card class="box-card" style="margin-top:10px;">
          <div slot="header" class="clearfix">
            <svg-icon icon-class="product"/>
            <span style="margin-left:10px;">销售产品明细</span>
          </div>
          <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
            <saleDetails ref="saleDetails" :fromParent="searchParam"/>
          </el-row>

        </el-card>

      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"
              style="margin-bottom:32px;">
        <todo-list panelType="sales"/>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import OperateGroup from './components/OperateGroup'
  import PanelGroup from './components/PanelGroup'
  import LineChart from './components/LineChart'
  import TodoList from '../components/TodoList'
  import categoryModel from '@/api/category'
  import saleDetails from './components/SaleDetails'
  import merchantModel from '@/api/merchant'

  export default {
    name: 'DashboardAdmin',
    components: {
      PanelGroup,
      OperateGroup,
      LineChart,
      TodoList,
      saleDetails
    },
    computed: {
      //store 的状态必须变成计算方法，只有这样state值修改之后，才会重新计算
      mine() {
        return this.$store.state.user.user;
      }
    },

    watch: {
      searchParam: {
        handler(newValue, oldValue) {
          this.onSearch();
        },
        deep: true
      }
    },

    data() {
      return {
        categorySelectOptions: [],
        weekSelectOptions: [],
        merchantSelectOptions: [],
        searchParam: {merchantId: null, categoryId: null, week: 20},
        lineChartData: {
          xData: [],
          yData: [],
        }
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },
    methods: {
      initData() {
        this.categorySelectOptions = categoryModel.getMineSelectOptions();
        this.categorySelectOptions.unshift({
          label: "全部",
          value: null
        });
        this.merchantSelectOptions = merchantModel.getSelectOptions();
        this.searchParam.merchantId ='8a23287966dc9acb0166dca2574c0000';

        this.weekSelectOptions = [];
        for (let i = 1; i <= 104; i++) {
          this.weekSelectOptions.push({
            label: `${i}周`,
            value: i
          })
        }

        this.loadSaleData();
      },

      loadSaleData() {
        this.lineChartData.xData = [];
        this.lineChartData.yData = [];
        if (this.searchParam.merchantId == null) {
          return false;
        }
        let url = `/amazonSales/weekSales/${this.searchParam.merchantId}`;
        url += "?weekNum=" + (this.searchParam.week ? this.searchParam.week : 20);
        if (this.searchParam.categoryId != null) {
          url += "&cid=" + this.searchParam.categoryId;
        }

        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data;
            res.forEach(element => {
              this.lineChartData.xData.push(element.formatStartTime);
              this.lineChartData.yData.push(element.saleQty);
            });
          })
          .catch(err => {
          })
      },

      onSearch() {
        this.loadSaleData();
      }
    }
  }
</script>

<style lang="scss" scoped>

  .dashboard {

  /deep/ .el-form-item--small.el-form-item {
    margin-top: 5px !important;
    margin-bottom: 5px !important;
  }

  /deep/ .el-card__body {
    padding: 5px;
  }

  }

  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

  }
</style>
