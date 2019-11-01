<template>
  <el-card class="box-card">
    <div slot="header">
      <i class="el-icon-video-camera-solid" />
      <span style="margin-left:10px;">采购跟单</span>
    </div>

    <el-row :gutter="20" class="panel-group">

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <confirm-date :mine="mine"></confirm-date>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <unfinishedProduct :mine="mine"></unfinishedProduct>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <unfinishedMaterial :mine="mine"></unfinishedMaterial>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <procurement-shipped-plan :mine="mine"></procurement-shipped-plan>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <procurement-shipped :mine="mine"></procurement-shipped>
      </el-col>

    </el-row>

  </el-card>
</template>

<script>
  import ConfirmDate from '../../components/panel/confirmDate'
  import ProcurementShippedPlan from "../../components/panel/procurementShippedPlan";
  import ProcurementShipped from "../../components/panel/procurementShipped";
  import unfinishedProduct from '../../components/panel/unfinishedProduct';
  import unfinishedMaterial from '../../components/panel/unfinishedMaterial';

  export default {
    props: {
      mine: {
        type: Object,
      }
    },
    components: {
      unfinishedProduct,
      unfinishedMaterial,
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
      margin-bottom: 32px;
    }
  }
</style>
