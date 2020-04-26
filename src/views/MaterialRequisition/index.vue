<template>
  <div class="app-container">
    <div class="ph-card">
      <div class="ph-card-body">
        <el-tabs v-model="activeStatus" type="border-card" @tab-click="handleTabClick">
          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="create" lazy v-if="hasNew">
            <span slot="label">
              <i class="el-icon-circle-plus-outline"></i> 创建领料单
            </span>
            <keep-alive>
              <create @createCBEvent="createCBEvent"></create>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="materialRequisition" lazy>
            <span slot="label">
              <i class="el-icon-s-check"></i> 领料单
            </span>
            <keep-alive>
              <phTab type="materialRequisition" />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import phTab from "./components/tab";
import create from "./components/create/create";
import { checkPermission } from "@/utils/permission";

const actionFlag = "s=";

export default {
  name: 'MaterialRequisitionResource_menu',
  components: {
    phTab,
    create
  },

  data() {
    return {
      // TODO 页面标题
      title: "领料单",

      // TODO 默认Tab激活状态
      activeStatus:
        location.href.indexOf(actionFlag) > -1
          ? this.$route.query.s !== null
            ? this.$route.query.s
            : "materialRequisition"
          : "materialRequisition"
    };
  },

  computed: {
    hasNew() {
      return checkPermission("MaterialRequisitionResource_create");
    }
  },

  // 各种相关方法定义
  methods: {
    /* 点击Tag相应事件 */
    // TODO: 通过URL记录点击Tab，方便刷新后不会切换视图
    handleTabClick(tab, event) {
      const queryFlag = "?s=";
      const queryPath = "/m3/MaterialRequisition_index";
      let newUrl =
        location.origin + "/#" + queryPath + queryFlag + this.activeStatus;
      history.pushState(history.state, "ph-table search", newUrl);
    },
    /* 创建成功之后回调，刷新草稿状态列表列表 TODO: */
    createCBEvent(objectId) {
      if (objectId) {
        if (this.$refs.editTable) {
          this.$refs.editTable.onRefreshTable();
        }
      }
    }
  }
};
</script>

<style type="text/less" lang="scss" scoped>
</style>
