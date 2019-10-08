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

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 付款项</div>
        <itemTable ref="itemTable" :primary="primary" v-if="primaryComplete"></itemTable>
      </el-collapse-item>

      <el-collapse-item name="billTable" style="margin-top: 10px">
        <div slot="title" class="title">3. 发票信息</div>
        <billTable ref="billTable" :primary="primary" v-if="primaryComplete"></billTable>
      </el-collapse-item>

      <el-collapse-item name="attachment" style="margin-top: 10px">
        <div slot="title" class="title">4. 发票文件</div>
        <attachment ref="attachment" :primary="primary"
                    v-if="primaryComplete"></attachment>
      </el-collapse-item>

      <el-collapse-item name="paymentFrom" style="margin-top: 10px">
        <div slot="title" class="title">5. 确认付款</div>
        <paymentFrom ref="paymentFrom" :primary="primary"
                     v-if="primaryComplete"></paymentFrom>
      </el-collapse-item>

    </el-collapse>

    <el-row type="flex" justify="center">
      <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onPayment">
        确认付款
      </el-button>
      <el-button type="danger" style="margin-top: 15px" :loading="confirmLoading" @click="onRefuse">
        拒绝申请
      </el-button>
    </el-row>

    <auditing ref="auditing" @saveAuditCBEvent="saveAuditCBEvent"></auditing>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import infoForm from './info'
  import paymentFrom from './form'
  import itemTable from '../../../../SettlementBill/components/view/paymentItemTable'
  import billTable from '../../../../SettlementBill/components/view/paymentBillTable'
  import attachment from '../../../../SettlementBill/components/view/paymentAttachment'
  import auditing from '@/components/PhAuditing'

  export default {
    components: {
      infoForm,
      paymentFrom,
      itemTable,
      billTable,
      attachment,
      auditing
    },
    props: {},
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),

      hasExecute() {
        if ([2, 3, 4, 5, 6, 7].indexOf(this.primary.status) > -1) {
          return true;
        }
        else {
          return false;
        }
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
          let relations = ["supplier", "currency", "creator", "settlementBill", "settlementBill.procurementOrder"];
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
        this.activeNames = ['infoForm', 'itemTable', 'billTable', 'attachment', 'paymentFrom'];
      },
      closeDialog() {
        this.primary = {};
        this.primaryId = null;
        this.dialogVisible = false;
        this.primaryComplete = false;
      },

      onPayment() {
        this.$refs.paymentFrom.$refs.editObject.validate(valid => {
            if (!valid) {
              return false
            }
            let paymentObject = JSON.parse(JSON.stringify(this.$refs.paymentFrom.editObject));
            this.savePaymentOrder(paymentObject);
          }
        );
      },
      savePaymentOrder(order) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.global.axios.put(`/procurementPaymentOrders/payment/${order.id}`, order)
          .then(resp => {
              let _newObject = resp.data;
              loading.close();
              this.$message.success('操作成功');
              this.$emit("modifyCBEvent", _newObject);
              this.closeDialog();
            }
          )
          .catch(err => {
            console.log(err);
            loading.close();
          })
      },

      onRefuse() {
        this.$refs.auditing.openDialog('refuse');
      },

      saveAuditCBEvent(note) {
        if (!note || note == ' ') {
          this.$message.error("必须填写拒绝理由!");
          return;
        }

        this.$confirm("确认拒绝该付款申请吗?", '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              let paymentObject = {};
              paymentObject.id = this.$refs.paymentFrom.editObject.id;
              paymentObject.procurementPaymentOrderId = this.$refs.paymentFrom.editObject.id;
              paymentObject.approvalContent = note;

              this.refusePaymentOrder(paymentObject);

              done();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })

      },

      refusePaymentOrder(order) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.global.axios.put(`/procurementPaymentOrders/approval/${order.id}`, order)
          .then(resp => {
              let _newObject = resp.data;
              loading.close();
              this.$message.success('操作成功');
              this.$emit("modifyCBEvent", _newObject);
              this.closeDialog();
            }
          )
          .catch(err => {
            console.log(err);
            loading.close();
          })
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("modifyCBEvent", object);
      }
      ,
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

