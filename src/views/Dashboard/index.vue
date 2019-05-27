<template>

  <div class="dashboard-container">

    <el-tabs v-model="activeStatus" type="border-card">

      <el-tab-pane name="adminDashboard" lazy>
          <span slot="label" style="color: #67C23A;">
            <i class="el-ph-icon-check-circle"></i> 管理员
          </span>
        <keep-alive>
          <component is="adminDashboard"/>
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane name="editorDashboard" lazy>
          <span slot="label">
            <i class="el-ph-icon-times-circle"></i> 普通
          </span>
        <keep-alive>
          <component is="editorDashboard"/>
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane name="salesDashboard" lazy>
          <span slot="label" style="color: #F56C6C;">
            <i class="el-ph-icon-exclamation-circle"></i> 销售
          </span>
        <keep-alive>
          <component is="salesDashboard"/>
        </keep-alive>
      </el-tab-pane>


    </el-tabs>

  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import adminDashboard from './admin'
  import editorDashboard from './editor'
  import salesDashboard from './sales'

  export default {
    name: 'Dashboard',
    components: {adminDashboard, editorDashboard, salesDashboard},
    data() {
      return {
        activeStatus: 'salesDashboard'
      }
    },
    computed: {
      ...mapGetters([
        'roles'
      ])
    },
    created() {
      if (!this.roles.includes('admin')) {
        this.currentRole = 'adminDashboard'
      }
    }
  }
</script>
