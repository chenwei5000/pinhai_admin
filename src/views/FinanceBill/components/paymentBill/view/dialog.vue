<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title"
             v-if="dialogVisible"
             :visible.sync="dialogVisible"
             class="ph-dialog"
             @close='closeDialog'
             fullscreen
  >

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoForm" style="margin-top: 10px">
        <div slot="title" class="title">1. 基本信息</div>
        <infoForm ref="infoForm" :primary="primary" v-if="primaryComplete"></infoForm>
      </el-collapse-item>

      <el-collapse-item name="detailTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 产品明细</div>
        <detailTable ref="detailTable" :primary="primary.settlementBill" v-if="primaryComplete"></detailTable>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">3. 付款项</div>
        <itemTable ref="itemTable" :primary="primary" v-if="primaryComplete"></itemTable>
      </el-collapse-item>

      <el-collapse-item name="billTable" style="margin-top: 10px">
        <div slot="title" class="title">4. 发票信息</div>
        <billTable ref="billTable" :primary="primary" v-if="primaryComplete"></billTable>
      </el-collapse-item>

      <el-collapse-item name="attachment" style="margin-top: 10px">
        <div slot="title" class="title">5. 发票文件</div>
        <attachment ref="attachment" :primary="primary"
                    v-if="primaryComplete"></attachment>
      </el-collapse-item>

      <el-collapse-item name="paymentsTable" style="margin-top: 10px">
        <div slot="title" class="title">6. 相关预付款单</div>
        <reverseTable ref="reverseTable" :primary="primary.settlementBill" v-if="primaryComplete"></reverseTable>
      </el-collapse-item>

      <el-collapse-item name="orderTable" style="margin-top: 10px">
        <div slot="title" class="title">7. 相关付款单</div>
        <orderTable ref="orderTable" :primary="primary.settlementBill" v-if="primaryComplete"></orderTable>
      </el-collapse-item>

      <el-collapse-item name="paymentInfo" style="margin-top: 10px" v-if="primary.status != 1">
        <div slot="title" class="title">8. 付款信息</div>
        <paymentLogs ref="paymentLogs" :primary="primary" v-if="primaryComplete"></paymentLogs>
      </el-collapse-item>

    </el-collapse>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import infoForm from '../payment/info'
  import detailTable from '../../../../SettlementBill/components/view/detailTable'
  import reverseTable from '../../../../SettlementBill/components/view/reverseTable'
  import orderTable from '../../../../SettlementBill/components/view/paymentsTable'
  import itemTable from '../../../../SettlementBill/components/view/paymentItemTable'
  import billTable from '../../../../SettlementBill/components/view/paymentBillTable'
  import attachment from '../../../../SettlementBill/components/view/paymentAttachment'
  import paymentLogs from './paymentLogs'

  export default {
    components: {
      infoForm,
      itemTable,
      billTable,
      attachment,
      detailTable,
      reverseTable,
      orderTable,
      paymentLogs
    },
    props: {},
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),

      hasExecute() {
        return false;
      },
      hasAdmin() {
        return true;
      },
      title() {
        return `采购付款单 [${this.primary.code}]`;
      }
    },

    data() {
      return {
        primaryId: null,  //主ID
        primary: {}, //主对象
        primaryComplete: false,
        dialogVisible: false, //Dialog 是否开启
        confirmLoading: false,
        activeNames: [],   //折叠面板开启项
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
        if (this.primaryId) {
          let relations = ["supplier", "currency", "creator", "settlementBill", "settlementBill.currency", "settlementBill.company"];
          //获取计划数据
          this.global.axios
            .get(`/procurementPaymentOrders/${this.primaryId}?relations=${JSON.stringify(relations)}`)
            .then(resp => {
              let res = resp.data;
              this.primary = res || {};
              this.dialogVisible = true;
              this.primaryComplete = true;
            })
            .catch(err => {
            });
        }
        else {
          this.$message.error("无效的采购预付款单");
        }
      },

      /* 开启弹出编辑框 需要传主键ID */
      openDialog(primaryId) {
        this.primaryId = primaryId;
        this.initData();
        // 默认展开所有折叠面板
        //this.activeNames = ['infoForm', 'detailTable', 'itemTable', 'billTable', 'attachment', 'paymentsTable', 'orderTable', 'paymentInfo'];
        this.activeNames = ['infoForm', 'detailTable', 'itemTable', 'paymentsTable', 'orderTable', 'paymentInfo'];
      },
      closeDialog() {
        this.primary = {};
        this.primaryId = null;
        this.dialogVisible = false;
        this.primaryComplete = false;
      },

      /* 重新加载 */
      reloadCBEvent() {
        this.initData();
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

