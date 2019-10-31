<template>
  <div>
    <el-row style="background:#fff;padding:5px 5px 0;">
      <el-form :inline="true" ref="searchForm" id="filter-form"
               @submit.native.prevent>
        <el-form-item label="销售渠道">
          <el-select filterable v-model="searchParam.merchantId" placeholder="请选择销售渠道" >
            <el-option
              v-for="(item,idx) in merchantSelectOptions"
              :label="item.label" :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类">
          <el-select filterable v-model="searchParam.categoryId" placeholder="请选择分类" >
            <el-option
              v-for="(item,idx) in categorySelectOptions"
              :label="item.label" :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="周数">
          <el-select filterable v-model="searchParam.week" placeholder="统计周数" >
            <el-option
              v-for="(item,idx) in weekSelectOptions"
              :label="item.label" :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>
        </el-form-item>

         <el-button type="primary"  @click="onSearch">
              查看销售情况
            </el-button>

      </el-form>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 18}" :xl="{span: 18}"
              style="padding-right:8px;margin-bottom:30px;">

        <panel-group @handleSetLineChartData="handleSetLineChartData" :mine="mine"/>
        <operate-group @handleSetLineChartData="handleSetLineChartData" :mine="mine"/>

        <el-card class="box-card" style="margin-top:10px;">
          <div slot="header" class="clearfix">
            <svg-icon icon-class="sales-statistics"/>
            <span style="margin-left:10px;">销售情况</span>
          </div>
          <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
            <line-chart :chart-data="lineChartData"/>
          </el-row>
          <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
            <saleDetails :fromParent="searchParam" ref="saleDetails" />
          </el-row>
        </el-card>

      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"
              style="margin-bottom:30px;">
        <todo-list/>
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

  const lineChartData = {
    newVisitis: {
      expectedData: [100, 120, 161, 134, 105, 160, 165]
    },
    messages: {
      expectedData: [200, 192, 120, 144, 160, 130, 140],
      actualData: [180, 160, 151, 106, 145, 150, 130]
    },
    purchases: {
      expectedData: [80, 100, 121, 104, 105, 90, 100],
      actualData: [120, 90, 100, 138, 142, 130, 130]
    },
    shoppings: {
      expectedData: [130, 140, 141, 142, 145, 150, 160],
      actualData: [120, 82, 91, 154, 162, 140, 130]
    }
  }

  const merchantOptions = [
    {
      label: 'Rose Home Fashion',
      value: '8a23287966dc9acb0166dca2574c0000'
    }
  ]

  const weekSelectOptions = [
    {
      label: '10周',
      value: '10'
    },
    {
      label: '19周',
      value: '19'
    },
    {
      label: '20周',
      value: '20'
    },
    {
      label: '21周',
      value: '21'
    }
  ]

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
    data() {
      return {
        categorySelectOptions: [],
       // searchParam: {merchantId: null, categoryId: null, week: null},
        searchParam: {merchantId: '8a23287966dc9acb0166dca2574c0000', categoryId: '10', week: 20},
        lineChartData: {
          expectedData: [],
          dateData: [],
        }
      }
    },
    created() {
      this.categorySelectOptions = categoryModel.getMineSelectProdcutOptions();
      this.merchantSelectOptions = merchantOptions;
      this.weekSelectOptions = weekSelectOptions;
    },

    mounted() {
    },
    methods: {
      initData(){
        let url = "/amazonSales/weekSales/";
        if (this.searchParam.merchantId == null){
          this.$message.error("请选择销售渠道！")
          return false;
        }else{
          url += this.searchParam.merchantId;
        }
        if (this.searchParam.week != null){
          url += "?weekNum=" + this.searchParam.week;
        }
        if (this.searchParam.categoryId != null){
          if (url.indexOf('?') != -1){
            url += "&cid=" + this.searchParam.categoryId;
          }else{
            url += "?cid=" + this.searchParam.categoryId;
          }
        }
        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data;
            res.forEach(element => {
            this.lineChartData.expectedData.push(element.saleQty);
            this.lineChartData.dateData.push(element.formatStartTime)
            });
          })
          .catch(err => {
          })
      },
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type]
      },
      onSearch(){
        this.lineChartData.expectedData = [],
        this.lineChartData.dateData = [],
        this.initData();
        this.$refs.saleDetails.getList();
      }
    }
  }
</script>

<style lang="scss" scoped>
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
