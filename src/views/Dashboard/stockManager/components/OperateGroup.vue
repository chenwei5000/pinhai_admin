<template>

  <el-card class="box-card" style="margin-top:10px;">

    <div slot="header">
      <svg-icon icon-class="business"/>
      <span style="margin-left:10px;">运营业务</span>
    </div>

    <el-row :gutter="40" class="panel-group">

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <allocation-received :mine="mine"></allocation-received>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <export-allocation :mine="mine"></export-allocation>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <procurement-received :mine="mine"></procurement-received>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <stock-inventory :mine="mine"></stock-inventory>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <warehouse-allocation :mine="mine"></warehouse-allocation>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <warehouse-order :mine="mine"></warehouse-order>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <warehouse-stock :mine="mine"></warehouse-stock>
      </el-col>

    </el-row>

  </el-card>
</template>

<script>

  import AllocationReceived from "../../components/operate/allocationReceived";
  import ExportAllocation from "../../components/operate/exportAllocation";
  import ProcurementReceived from "../../components/operate/procurementReceived";
  import StockInventory from "../../components/operate/stockInventory";
  import WarehouseAllocation from "../../components/operate/warehouseAllocation";
  import WarehouseOrder from "../../components/operate/warehouseOrder";
  import WarehouseStock from "../../components/operate/warehouseStock";
  export default {
    props: {
      mine: {
        type: Object,
      }
    },
    components: {
      WarehouseStock,
      WarehouseOrder,
      WarehouseAllocation,
      StockInventory,
      ProcurementReceived,
      ExportAllocation,
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
