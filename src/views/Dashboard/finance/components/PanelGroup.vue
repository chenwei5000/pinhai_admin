<template>
  <el-card class="box-card">
    <div slot="header">
      <i class="el-icon-money" />
      <span style="margin-left:10px;">财务</span>
    </div>

    <el-row :gutter="20" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <pre-payment :mine="mine"></pre-payment>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <payment :mine="mine"></payment>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <logistic-payment :mine="mine"></logistic-payment>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      </el-col>

    </el-row>
  </el-card>
</template>

<script>
import LogisticPayment from "../../components/panel/logisticPayment"
import Payment from "../../components/panel/payment"
import PrePayment from "../../components/panel/prePayment"

  export default {
    props: {
      mine: {
        type: Object,
      }
    },
    components: {
      Payment,
      LogisticPayment,
      PrePayment
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

