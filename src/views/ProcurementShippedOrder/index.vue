<template>
  <div class="app-container">

    <div class="ph-card">
      <div class="ph-card-body">

        <el-tabs v-model="activeStatus" type="border-card" @tab-click="handleTabClick">

          <!-- TODO: name 根据实际情况修改  -->

          <el-tab-pane name="completionDate" lazy>
            <span slot="label">
              <i class="el-icon-date"></i> 确认交货日期
            </span>
            <keep-alive>
              <unPlanTable ref="completionDate" />
            </keep-alive>
          </el-tab-pane>

          <el-tab-pane name="orderExecuting" lazy>
            <span slot="label">
              <i class="el-icon-edit"></i> 交货计划
            </span>
            <keep-alive>
              <planTable ref="orderExecuting"/>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="executing" lazy>
            <span slot="label">
              <i class="el-icon-s-flag"></i> 发货计划
            </span>
            <keep-alive>
              <phTab type="executing" ref="executing"/>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="shipped" lazy>
            <span slot="label">
              <i class="el-icon-s-home"></i> 待收货
            </span>
            <keep-alive>
              <phTab type="shipped"/>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="complete" lazy>
            <span slot="label">
              <i class="el-icon-s-order"></i> 完成
            </span>
            <keep-alive>
              <phTab type="complete"/>
            </keep-alive>
          </el-tab-pane>

          <el-tab-pane name="all" lazy>
            <span slot="label">
              <i class="el-icon-s-order"></i> 全部
            </span>
            <keep-alive>
              <phTab type="all"/>
            </keep-alive>
          </el-tab-pane>

        </el-tabs>


      </div>
    </div>

  </div>
</template>

<script>
  import phTab from './components/tab'
  import unPlanTable from './components/deliveryPlan/unPlanTable'
  import planTable from './components/deliveryPlan/planTable'

  const actionFlag = 's='

  export default {
    name: 'ProcurementShippedOrderResource_menu',

    components: {
      unPlanTable,
      planTable,
      phTab
    },

    data() {
      return {

        // TODO 默认Tab激活状态
        activeStatus: location.href.indexOf(actionFlag) > -1
          ? (this.$route.query.s !== null ? this.$route.query.s : 'completionDate')
          : 'completionDate',
      }
    },

    computed: {},

    // 各种相关方法定义
    methods: {
      /* 点击Tag相应事件 */
      // TODO: 通过URL记录点击Tab，方便刷新后不会切换视图
      handleTabClick(tab, event) {
        const queryFlag = '?s=';
        const queryPath = '/m2/ProcurementShippedOrder_index';
        let newUrl = location.origin + "/#" + queryPath + queryFlag + this.activeStatus;
        history.pushState(history.state, 'ph-table search', newUrl);
      },
      /* 创建成功之后回调，刷新草稿状态列表列表 TODO: */
      createCBEvent(objectId) {
        if (objectId) {
          if (this.$refs.editTable) {
            this.$refs.orderExecuting.onRefreshTable();
            this.$refs.executing.onRefreshTable();
          }
        }
      }
    },

  }
</script>

<style type="text/less" lang="scss" scoped>
  .ph-table {
    padding: 0 !important;
  }
</style>
