<template>
  <div class="app-container">

    <div class="ph-card">
      <div class="ph-card-body">

        <el-tabs v-model="activeStatus" type="border-card" @tab-click="handleTabClick">

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="advanceBill" class="fontColor" lazy>
            <span slot="label">
              <i class="el-icon-coin"></i> 采购预付款单
            </span>
            <keep-alive>
              <advanceTab type="advanceBill" ref="advanceBill" />
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="paymentBill" lazy>
            <span slot="label">
              <i class="el-icon-s-check"></i> 采购付款单
            </span>
            <keep-alive>
              <paymentTab type="paymentBill" ref="paymentBill"/>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="logisticsBill" lazy>
            <span slot="label">
              <i class="el-icon-money"></i> 物流付款单
            </span>
            <keep-alive>
              <logisticTab type="logisticBill" ref="logisticBill"/>
            </keep-alive>
          </el-tab-pane>

        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>
  import advanceTab from './components/advanceBill/tab'
  import paymentTab from './components/paymentBill/tab'
  import logisticTab from './components/logisticPaymentBill/tab'

  const actionFlag = 's='
  export default {
    components: {
      advanceTab,
      paymentTab,
      logisticTab
    },

    data() {
      return {
        // TODO 页面标题
        title: '采购计划管理',

        // TODO 默认Tab激活状态
        activeStatus: location.href.indexOf(actionFlag) > -1
          ? (this.$route.query.s !== null ? this.$route.query.s : 'advanceBill')
          : 'advanceBill',
      }
    },

    computed: {},

    // 各种相关方法定义
    methods: {
      /* 点击Tag相应事件 */
      // TODO: 通过URL记录点击Tab，方便刷新后不会切换视图
      handleTabClick(tab, event) {
        const queryFlag = '?s=';
        const queryPath = '/m8/FinanceBill_index';
        let newUrl = location.origin + "/#" + queryPath + queryFlag + this.activeStatus;
        history.pushState(history.state, 'ph-table search', newUrl);
      },
      /* 创建成功之后回调，刷新草稿状态列表列表 TODO: */
      createCBEvent(objectId) {
        if (objectId) {
          if (this.$refs.advanceBill) {
            this.$refs.advanceBill.onRefreshTable();
          }
        }
      }
    },

  }
</script>

<style type="text/less" lang="scss" scoped>

</style>
