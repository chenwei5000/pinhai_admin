<template>

  <el-card class="box-card" style="margin-top:10px;">

    <div slot="header">
      <svg t="1571804357599" class="icon" viewBox="0 0 1134 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21082" width="16" height="16"><path d="M1134.237447 0L374.755353 714.919402 0 519.031941 1134.237447 0zM1134.237447 0L910.335903 950.04282 447.705649 747.82174 1134.237447 0zM614.296064 840.487455l-114.622261 183.512545-51.968154-258.996289 166.590415 75.483744z" fill="#2196F3" p-id="21083"></path></svg>
      <span style="margin-left:10px;">采购跟单</span>
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

    </el-row>

  </el-card>
</template>

<script>
  import ConfirmDate from '../panel/confirmDate'
  import ProcurementShippedPlan from "../panel/procurementShippedPlan";
  import ProcurementShipped from "../panel/procurementShipped";
  import ProductManagement from "../panel/productManagement";
  import MaterialManagement from "../panel/materialManagement";

  export default {
    props: {
      mine: {
        type: Object,
      }
    },
    components: {
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
