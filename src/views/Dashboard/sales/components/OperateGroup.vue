<template>

  <el-card class="box-card" style="margin-top:10px;">

    <div slot="header">
      <svg-icon icon-class="business"/>
      <span style="margin-left:10px;">运营业务</span>
    </div>

    <el-row :gutter="40" class="panel-group">

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <newSteamship :searchParam="searchParam"></newSteamship>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <newPrepare :searchParam="searchParam"></newPrepare>
      </el-col>


      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <auditingPlan :searchParam="searchParam"></auditingPlan>
      </el-col>


      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col" v-if="false">
        <auditingOrder :searchParam="searchParam"></auditingOrder>
      </el-col>


      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <newProduct :searchParam="searchParam"></newProduct>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <saleSetting :searchParam="searchParam"></saleSetting>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <productSafetyStock :searchParam="searchParam"></productSafetyStock>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <materialSafetyStock :searchParam="searchParam"></materialSafetyStock>
      </el-col>

    </el-row>

  </el-card>
</template>

<script>
  import newSteamship from '../../components/operate/newSteamship'
  import newPrepare from '../../components/operate/newPrepare'
  import auditingPlan from '../../components/operate/auditingPlan'
  import auditingOrder from '../../components/operate/auditingOrder'
  import newProduct from '../../components/operate/newProduct'
  import saleSetting from '../../components/operate/saleSetting'
  import materialSafetyStock from '../../components/operate/materialSafetyStock'
  import productSafetyStock from '../../components/operate/productSafetyStock'

  export default {
    props: {
      searchParam: {
        type: Object,
        default: {merchantId: null, categoryId: null, week: 20}
      }
    },
    components: {
      newSteamship,
      newPrepare,
      auditingPlan,
      auditingOrder,
      newProduct,
      saleSetting,
      materialSafetyStock,
      productSafetyStock
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>

  .panel-group {
    margin-top: 10px;

    .card-panel-col {
      margin-bottom: 15px;
      align-content: center;
      text-align: center;
    }

  }

</style>
