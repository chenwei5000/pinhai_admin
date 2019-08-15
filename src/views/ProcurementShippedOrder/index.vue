<template>
  <div class="app-container">

    <div class="ph-card">
      <div class="ph-card-body">

        <el-tabs v-model="activeStatus" type="border-card" @tab-click="handleTabClick">

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="orderExecuting" class="fontColor" lazy>
            <span slot="label">
              <i class="el-icon-edit"></i> 采购单待发货
            </span>
            <keep-alive>
              <phTab type="orderExecuting" ref="editTable"/>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="orderPartShipped" lazy>
            <span slot="label">
              <i class="el-icon-s-check"></i> 部分发货
            </span>
            <keep-alive>
              <phTab type="orderPartShipped"/>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="executing" lazy>
            <span slot="label">
              <i class="el-icon-s-flag"></i> 发货任务待确认
            </span>
            <keep-alive>
              <phTab type="executing"/>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="shipped" lazy>
            <span slot="label">
              <i class="el-icon-s-claim"></i> 待收货
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
        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>
  import phTab from './components/tab'

  const actionFlag = 's='

  export default {

    components: {
      phTab
    },

    data() {
      return {
        // TODO 页面标题
        title: '发货计划',

        // TODO 默认Tab激活状态
        activeStatus: location.href.indexOf(actionFlag) > -1
          ? (this.$route.query.s !== null ? this.$route.query.s : 'orderExecuting')
          : 'orderExecuting',
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
            this.$refs.editTable.onRefreshTable();
          }
        }
      }
    },

  }
</script>

<style type="text/less" lang="scss" scoped>

</style>
