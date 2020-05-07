<template>
  <div class="app-container">

    <div class="ph-card">
      <div class="ph-card-body">

        <el-tabs v-model="activeStatus" type="border-card" @tab-click="handleTabClick">

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="inpayment" class="fontColor" lazy>
            <span slot="label">
              <i class="el-icon-coin"></i> 待结算
            </span>
            <keep-alive>
              <phTab type="inpayment" ref="editTable"/>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="unpaid" lazy>
            <span slot="label">
              <i class="el-icon-s-check"></i> 结算中
            </span>
            <keep-alive>
              <phTab type="unpaid"/>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="rejected" lazy>
            <span slot="label">
              <i class="el-icon-money"></i> 已结算
            </span>
            <keep-alive>
              <phTab type="rejected"/>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
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

  const actionFlag = 's='
  export default {
    name: 'SettlementBillResource_menu',
    components: {
      phTab
    },

    data() {
      return {
        // TODO 页面标题
        title: '采购计划管理',

        // TODO 默认Tab激活状态
        activeStatus: location.href.indexOf(actionFlag) > -1
          ? (this.$route.query.s !== null ? this.$route.query.s : 'inpayment')
          : 'inpayment',
      }
    },

    computed: {},

    // 各种相关方法定义
    methods: {
      /* 点击Tag相应事件 */
      // TODO: 通过URL记录点击Tab，方便刷新后不会切换视图
      handleTabClick(tab, event) {
        const queryFlag = '?s=';
        const queryPath = '/m2/SettlementBill_index';
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
  .ph-table {
    padding: 0 !important;
  }
</style>
