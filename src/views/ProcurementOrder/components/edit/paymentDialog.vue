<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title"
             append-to-body
             v-if="dialogVisible"
             width="80%"
             top="3vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="block" style="height: 420px;">
      <el-scrollbar style="height: 100%">
        <payment ref="payment" :primary="primary" @paymentCBEvent="onPaymentCBEvent"></payment>
      </el-scrollbar>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">关 闭</el-button>
    </div>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import payment from './payment'
  import {currency, intArrToStrArr} from '@/utils'

  export default {
    components: {
      payment
    },
    props: {},
    filters: {
      currency: currency
    },
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),
      title() {
        return '采购单申请预付款';
      }
    },

    data() {
      return {
        primary: {}, //主对象
        dialogVisible: false, //Dialog 是否开启
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
      });
    },
    methods: {
      initData() {

      },

      /* 开启弹出编辑框 需要传主键ID */
      openDialog(primary) {
        this.primary = primary;
        this.initData();
        this.dialogVisible = true;
      },
      closeDialog() {
        this.primary = {};
        this.dialogVisible = false;
      },

      /* 子组件编辑完成后相应事件 */
      onPaymentCBEvent(object) {
        this.$emit("paymentCBEvent", object);
      },
    }
  }
</script>

<style type="text/less" lang="scss" scoped>
  .title {
    font-size: 14px;
    font-weight: bold;
  }
</style>

