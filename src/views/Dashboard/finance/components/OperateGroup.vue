<template>

  <el-card class="box-card" style="margin-top:10px;">

    <div slot="header">
      <svg-icon icon-class="business"/>
      <span style="margin-left:10px;">运营业务</span>
    </div>

    <el-row :gutter="40" class="panel-group">

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <logistic-payment :mine="mine"></logistic-payment>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <payment :mine="mine"></payment>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <pre-payment :mine="mine"></pre-payment>
      </el-col>

    </el-row>

  </el-card>
</template>

<script>
  import LogisticPayment from "../operate/logisticPayment";
  import Payment from "../operate/payment";
  import PrePayment from "../operate/prePayment";
  export default {
    props: {
      mine: {
        type: Object,
      }
    },
    components: {
      PrePayment,
      Payment,
      LogisticPayment
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
