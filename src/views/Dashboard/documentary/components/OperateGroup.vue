<template>

  <el-card class="box-card" style="margin-top:10px;">

    <div slot="header">
      <svg-icon icon-class="business"/>
      <span style="margin-left:10px;">运营业务</span>
    </div>

    <el-row :gutter="40" class="panel-group">

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <confirm-date :mine="mine"></confirm-date>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <product :mine="mine"></product>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <material :mine="mine"></material>
      </el-col>


      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <procurement-shipped-plan :mine="mine"></procurement-shipped-plan>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <procurement-shipped :mine="mine"></procurement-shipped>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <supplier :mine="mine"></supplier>
      </el-col>

    </el-row>

  </el-card>
</template>

<script>
  import ConfirmDate from '../../components/operate/confirmDate'
  import ProcurementShippedPlan from "../../components/operate/procurementShippedPlan";
  import ProcurementShipped from "../../components/operate/procurementShipped";
  import product from '../../components/operate/product'
  import material from '../../components/operate/material'
  import Supplier from "../../components/operate/supplierStock";

  export default {
    props: {
      mine: {
        type: Object,
      }
    },
    components: {
      Supplier,
      product,
      material,
      ProcurementShipped,
      ProcurementShippedPlan,
      ConfirmDate,
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
