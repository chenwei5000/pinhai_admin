<template>
  <div class="app-container">

    <div class="ph-card">
      <div class="ph-card-body">

        <el-tabs v-model="activeStatus" type="border-card" @tab-click="handleTabClick">

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="warehouse" class="fontColor" lazy>
            <span slot="label">
              <i class="el-icon-s-home"></i> 仓库维度
            </span>
            <keep-alive>
              <phTab type="warehouse" ref="warehouseTable"/>
            </keep-alive>
          </el-tab-pane>


        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>
  import phTab from './components/tab'
  import {checkPermission} from "@/utils/permission";

  const actionFlag = 's='

  export default {

    components: {
      phTab
    },

    data() {
      return {
        // TODO 页面标题
        title: '库存商品进销存报表',

        // TODO 默认Tab激活状态
        activeStatus: location.href.indexOf(actionFlag) > -1
          ? (this.$route.query.s !== null ? this.$route.query.s : 'warehouse')
          : 'warehouse',
      }
    },

    computed: {
      hasNew() {
        return checkPermission('ProcurementPlanResource_create');
      }
    },

    // 各种相关方法定义
    methods: {
      /* 点击Tag相应事件 */
      // TODO: 通过URL记录点击Tab，方便刷新后不会切换视图
      handleTabClick(tab, event) {
        const queryFlag = '?s=';
        const queryPath = '/m10/EndAndTerm_index';
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
