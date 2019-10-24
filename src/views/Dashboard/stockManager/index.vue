<template>
  <div>
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 18}" :xl="{span: 18}"
              style="padding-right:8px;margin-bottom:30px;">

        <panel-group @handleSetLineChartData="handleSetLineChartData" :mine="mine"/>
        <operate-group @handleSetLineChartData="handleSetLineChartDat
        a" :mine="mine"/>

        <el-card class="box-card" style="margin-top:10px;">
          <div slot="header" class="clearfix">
            <svg-icon icon-class="sales-statistics"/>
            <span style="margin-left:10px;">销售情况</span>
          </div>
          <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
            <line-chart :chart-data="lineChartData"/>
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
  import TodoList from './components/TodoList'

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
      TodoList
    },
    computed: {
      //store 的状态必须变成计算方法，只有这样state值修改之后，才会重新计算
      mine() {
        return this.$store.state.user.user;
      }
    },
    data() {
      return {
        lineChartData: lineChartData.newVisitis
      }
    },
    created() {
    },
    methods: {
      initData(){

      },
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type]
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
