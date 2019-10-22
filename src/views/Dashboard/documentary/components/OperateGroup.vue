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
        <material-management :mine="mine"></material-management>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <product-management :mine="mine"></product-management>
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
  import ConfirmDate from '../operate/confirmDate'
  import ProcurementShippedPlan from "../operate/procurementShippedPlan";
  import ProcurementShipped from "../operate/procurementShipped";
  import ProductManagement from "../operate/productManagement";
  import MaterialManagement from "../operate/materialManagement";
  import Supplier from "../operate/supplier";

  export default {
    props: {
      mine: {
        type: Object,
      }
    },
    components: {
      Supplier,
      MaterialManagement,
      ProductManagement,
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
