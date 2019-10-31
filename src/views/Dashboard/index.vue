<template>

  <div class="dashboard-container">

    <el-tabs v-model="activeStatus" type="border-card">

      <el-tab-pane name="purchasesDashboard" lazy v-if="hasPurchases">
          <span slot="label" style="color: #67C23A;">
            <i class="el-icon-shopping-cart-full"></i> 采购
          </span>
        <keep-alive>
          <component is="purchasesDashboard"/>
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane name="documentaryDashboard" lazy v-if="hasDocumentary">
          <span slot="label" style="color: #E6A23C;">
           <i class="el-icon-video-camera-solid"></i>跟单
          </span>
        <keep-alive>
          <component is="documentaryDashboard"/>
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane name="stockManagerDashboard" lazy v-if="hasStockManager">
          <span slot="label" style="color: #409EFF;">
            <i class="el-icon-s-home"></i>库管
          </span>
        <keep-alive>
          <component is="stockManagerDashboard"/>
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane name="financeDashboard" lazy v-if="hasFinance">
          <span slot="label" style="color: #F56C6C;">
            <i class="el-icon-money"></i>财务
          </span>
        <keep-alive>
          <component is="financeDashboard"/>
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane name="salesDashboard" lazy v-if="hasSales">
          <span slot="label" style="color: #409EFF;">
            <i class="el-icon-s-data"></i>销售
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
  import salesDashboard from './sales'
  import purchasesDashboard from './purchases'
  import documentaryDashboard from './documentary'
  import stockManagerDashboard from './stockManager'
  import financeDashboard from './finance'
  import {checkRole} from "../../utils/permission";


  export default {
    name: 'Dashboard',
    components: {
      adminDashboard,
      salesDashboard,
      purchasesDashboard,
      documentaryDashboard,
      stockManagerDashboard,
      financeDashboard
    },

    data() {
      return {
        activeStatus: null
      }
    },
    computed: {
      ...mapGetters([
        'roles'
      ]),
      hasPurchases() {
        return checkRole("采购");
      },
      hasDocumentary() {
        return checkRole("跟单");
      },
      hasSales() {
        return checkRole("销售");
      },
      hasStockManager() {
        return checkRole("库管");
      },
      hasFinance() {
        return checkRole("财务");
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.activeStatus = this.hasSales ? 'documentaryDashboard' :
          this.hasPurchases ? 'purchasesDashboard' :
            this.hasDocumentary ? 'salesDashboard' :
              this.hasStockManager ? 'stockManagerDashboard' :
                this.hasFinance ? 'financeDashboard' : null;
      })
    },
  }
</script>
