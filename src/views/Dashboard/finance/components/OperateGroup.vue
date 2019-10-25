<template>

  <el-card class="box-card" style="margin-top:10px;">

    <div slot="header">
      <svg t="1571972813475" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2680" width="16" height="16"><path d="M642.327273 265.309091c51.2 27.927273 93.090909 65.163636 125.672727 116.363636 9.309091 18.618182 27.927273 27.927273 46.545455 27.927273 9.309091 0 18.618182 0 23.272727-4.654545 23.272727-13.963636 32.581818-46.545455 18.618182-69.818182-41.890909-79.127273-111.709091-134.981818-190.836364-172.218182-9.309091-79.127273-74.472727-139.636364-153.6-139.636364C428.218182 23.272727 358.4 93.090909 358.4 181.527273S428.218182 335.127273 512 335.127273c55.854545 0 102.4-27.927273 130.327273-69.818182zM823.854545 516.654545c-83.781818 0-153.6 69.818182-153.6 153.6 0 32.581818 9.309091 60.509091 23.272728 83.781819-51.2 41.890909-116.363636 65.163636-186.181818 65.163636-27.927273 0-51.2 23.272727-51.2 51.2s23.272727 51.2 51.2 51.2c102.4 0 195.490909-37.236364 269.963636-107.054545 13.963636 4.654545 27.927273 9.309091 46.545454 9.30909 83.781818 0 153.6-69.818182 153.6-153.6s-69.818182-153.6-153.6-153.6zM214.109091 516.654545c0-60.509091 23.272727-116.363636 55.854545-167.563636 18.618182-18.618182 9.309091-51.2-9.309091-69.818182-23.272727-13.963636-55.854545-9.309091-74.472727 13.963637-51.2 69.818182-79.127273 148.945455-79.127273 237.381818v18.618182c-37.236364 23.272727-60.509091 69.818182-60.50909 121.018181 0 83.781818 69.818182 153.6 153.6 153.6s153.6-69.818182 153.6-153.6c4.654545-79.127273-60.509091-144.290909-139.636364-153.6z" fill="#b47969" p-id="2681"></path></svg>
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
