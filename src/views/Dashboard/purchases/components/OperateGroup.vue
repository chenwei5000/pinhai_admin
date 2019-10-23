<template>

  <el-card class="box-card" style="margin-top:10px;">

    <div slot="header">
      <svg-icon icon-class="business"/>
      <span style="margin-left:10px;">运营业务</span>
    </div>

    <el-row :gutter="40" class="panel-group">

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <newSteamship :mine="mine"></newSteamship>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <newPrepare :mine="mine"></newPrepare>
      </el-col>


      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <auditingPlan :mine="mine"></auditingPlan>
      </el-col>


      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <auditingOrder :mine="mine"></auditingOrder>
      </el-col>


      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <newProduct :mine="mine"></newProduct>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <saleSetting :mine="mine"></saleSetting>
      </el-col>

    </el-row>

  </el-card>
</template>

<script>
  import newSteamship from './operate/newSteamship'
  import newPrepare from './operate/newPrepare'
  import auditingPlan from './operate/auditingPlan'
  import auditingOrder from './operate/auditingOrder'
  import newProduct from './operate/newProduct'
  import saleSetting from './operate/saleSetting'

  export default {
    props: {
      mine: {
        type: Object,
        default: {merchantId: '', categoryId: '', week: '20'}
      }
    },
    components: {
      newSteamship,
      newPrepare,
      auditingPlan,
      auditingOrder,
      newProduct,
      saleSetting
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
