<template>
  <div class="app-container">

    <div class="ph-card">
      <div class="ph-card-body">

        <el-tabs v-model="activeStatus" type="border-card" @tab-click="handleTabClick">

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="create" lazy v-if="hasNew">
            <span slot="label">
              <i class="el-icon-circle-plus-outline"></i> 创建计划
            </span>
            <keep-alive>
              <phCreate @createCBEvent="createCBEvent"></phCreate>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="editing" class="fontColor" lazy>
            <span slot="label">
              <i class="el-icon-edit"></i> 编辑中
            </span>
            <keep-alive>
              <phTab type="editing" ref="editTable"/>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="auditing" lazy>
            <span slot="label">
              <i class="el-icon-s-check"></i> 待审核
            </span>
            <keep-alive>
              <phTab type="auditing"/>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="executing" lazy>
            <span slot="label">
              <i class="el-icon-s-flag"></i> 执行中
            </span>
            <keep-alive>
              <phTab type="executing"/>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="complete" lazy>
            <span slot="label">
              <i class="el-icon-s-claim"></i> 完成
            </span>
            <keep-alive>
              <phTab type="complete"/>
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
  import phCreate from './components/create'
  import {checkPermission} from "@/utils/permission";

  const actionFlag = 's='

  export default {
    name: '采购计划',

    components: {
      phTab,
      phCreate
    },

    data() {
      return {
        // TODO 页面标题
        title: '采购计划管理',

        // TODO 默认Tab激活状态
        activeStatus: location.href.indexOf(actionFlag) > -1
          ? (this.$route.query.s !== null ? this.$route.query.s : 'editing')
          : 'editing',
      }
    },

    computed: {
      hasNew(){
        return checkPermission('ProcurementPlanResource_create');
      }
    },

    // 各种相关方法定义
    methods: {
      /* 点击Tag相应事件 */
      // TODO: 通过URL记录点击Tab，方便刷新后不会切换视图
      handleTabClick(tab, event) {
        const queryFlag = '?s=';
        const queryPath = '/m2/ProcurementPlan_index';
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
