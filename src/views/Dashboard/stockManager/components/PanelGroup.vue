<template>
  <el-card class="box-card">
    <div slot="header">
      <i class="el-icon-s-home"></i>
      <span style="margin-left:10px;">库管</span>
    </div>

    <el-row :gutter="20" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <procurement-received :mine="mine"></procurement-received>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <allocation-received :mine="mine"></allocation-received>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <warehouse-allocation :mine="mine"></warehouse-allocation>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <export :mine="mine"></export>
      </el-col>

    </el-row>

  </el-card>
</template>

<script>

  import AllocationReceived from "../../components/panel/allocationReceived";
  import WarehouseAllocation from "../../components/panel/warehouseAllocation";
  import ProcurementReceived from "../../components/panel/procurementReceived";
  import Export from "../../components/panel/exportAllocation";

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
    margin-bottom: 32px;
  }

  }
</style>
