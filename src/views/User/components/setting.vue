<template>

  <el-dialog :title="title" class="ph-dialog"
             :visible.sync="dialogVisible"
             @close='closeDialog'
             v-if="dialogVisible" fullscreen>


    <!-- 表格 -->
    <el-tabs v-model="activeStatus" type="border-card">
      <el-tab-pane name="role" lazy v-if="dialogVisible">
          <span slot="label" >
            <i class="el-ph-icon-check-circle"></i> 角色
          </span>
        <keep-alive>
          <role :userId="userId" v-if="userId"/>
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane name="dataAuth" lazy v-if="dialogVisible">
          <span slot="label" >
            <i class="el-ph-icon-check-circle"></i> 数据权限
          </span>
        <keep-alive>
          <dataAuth :userId="userId" v-if="userId"/>
        </keep-alive>
      </el-tab-pane>

    </el-tabs>

  </el-dialog>
</template>

<script>
  // loading 组件
  import dataAuth from './dataAuth';
  import role from './role';

  export default {

    components: {
      dataAuth,
      role
    },

    props: {},

    data() {
      return {
        title: "",
        activeStatus: 'role',
        dialogVisible: false,
        userId: 0
      };
    },
    methods: {
      openDiaLog(id, name) {
        this.userId = id
        this.title = `${name} 权限管理`;
        this.dialogVisible = true;
      },
      closeDialog() {
        this.dialogVisible = false;
        this.title = "";
        this.userId = 0;
      },
    }
  };
</script>

<style type="text/less" lang="scss" scoped>
  .el-scrollbar {
    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
</style>
