<template>

  <el-card class="box-card" style="margin-top:10px;">

    <div slot="header">
      <svg-icon icon-class="business"/>
      <span style="margin-left:10px;">库管</span>
    </div>

    <el-row :gutter="40" class="panel-group">

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <procurement-received :mine="mine"></procurement-received>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <allocation-received :mine="mine"></allocation-received>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <warehouse-allocation :mine="mine"></warehouse-allocation>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <export :mine="mine"></export>
      </el-col>

    </el-row>

  </el-card>
</template>

<script>

  import AllocationReceived from "../panel/allocationReceived";
  import WarehouseAllocation from "../panel/warehouseAllocation";
  import ProcurementReceived from "../panel/procurementReceived";
  import Export from "../panel/export";

  export default {
    props: {
      mine: {
        type: Object,
      }
    },
    components: {
      Export,
      ProcurementReceived,
      WarehouseAllocation,
      AllocationReceived
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
