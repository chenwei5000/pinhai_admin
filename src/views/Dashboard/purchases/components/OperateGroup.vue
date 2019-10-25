<template>

  <el-card class="box-card" style="margin-top:10px;">

    <div slot="header">
      <svg-icon icon-class="business"/>
      <span style="margin-left:10px;">运营业务</span>
    </div>

    <el-row :gutter="40" class="panel-group">

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <doOrder :mine="mine"></doOrder>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <procurementSettlement :mine="mine"></procurementSettlement>
      </el-col>


      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <product :mine="mine"></product>
      </el-col>


      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <material :mine="mine"></material>
      </el-col>


      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <productSafetyStock :mine="mine"></productSafetyStock>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <materialSafetyStock :mine="mine"></materialSafetyStock>
      </el-col>

    </el-row>

  </el-card>
</template>

<script>
  import doOrder from './operate/doOrder'
  import material from './operate/material'
  import materialSafetyStock from './operate/materialSafetyStock'
  import procurementSettlement from './operate/procurementSettlement'
  import product from './operate/product'
  import productSafetyStock from './operate/productSafetyStock'

  export default {
    props: {
      mine: {
        type: Object,
        default: {merchantId: '', categoryId: '', week: '20'}
      }
    },
    components: {
      doOrder,
      material,
      materialSafetyStock,
      procurementSettlement,
      product,
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
