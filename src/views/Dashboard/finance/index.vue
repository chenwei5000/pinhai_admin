<template>
  <div>
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 18}" :xl="{span: 18}"
              style="padding-right:8px;margin-bottom:30px;">

        <panel-group @handleSetLineChartData="handleSetLineChartData" :mine="mine"/>
        <operate-group @handleSetLineChartData="handleSetLineChartData" :mine="mine"/>

      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"
              style="margin-bottom:30px;">
        <todo-list panelType="finance"/>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import OperateGroup from './components/OperateGroup'
  import PanelGroup from './components/PanelGroup'
  import TodoList from '../components/TodoList'

  export default {
    name: 'DashboardAdmin',
    components: {
      PanelGroup,
      OperateGroup,
      TodoList
    },
    computed: {
      //store 的状态必须变成计算方法，只有这样state值修改之后，才会重新计算
      mine() {
        return this.$store.state.user.user;
      }
    },
    data() {
      return {}
    },
    created() {
    },
    methods: {
      initData() {
      },
      handleSetLineChartData(type) {
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

