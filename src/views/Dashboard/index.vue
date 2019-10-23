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

      <el-tab-pane name="purchasesDashboard" lazy>
          <span slot="label" style="color: #F56C6C;">
            <i class="el-icon-shopping-cart-full"></i> 采购
          </span>
        <keep-alive>
          <component is="purchasesDashboard"/>
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane name="documentaryDashboard" lazy>
          <span slot="label" style="color: #F56C6C;">
            <i class="el-ph-icon-exclamation-circle"></i> 跟单
          </span>
        <keep-alive>
          <component is="documentaryDashboard"/>
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
  import purchasesDashboard from './purchases'
  import documentaryDashboard from './documentary'

  export default {
    name: 'Dashboard',
    components: {adminDashboard, editorDashboard, salesDashboard, purchasesDashboard, documentaryDashboard},
    data() {
      return {
        activeStatus: 'documentaryDashboard'
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
