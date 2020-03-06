<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title"
             v-if="dialogVisible"
             :visible.sync="dialogVisible"
             width="70%"
             top="1vh"
             class="ph-dialog"
             @close='closeDialog'
  >

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" v-if="primaryComplete" :primary="primary"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="attachment" style="margin-top: 10px">
        <div slot="title" class="title">2. 附件</div>
        <attachment ref="attachment" :primary="primary"
                    v-if="primaryComplete"></attachment>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">3. 付款</div>
        <paymentFrom ref="paymentFrom" :primary="primary" v-if="primaryComplete"></paymentFrom>
      </el-collapse-item>
    </el-collapse>

    <el-row type="flex" justify="center">
      <el-button type="primary" style="margin-top: 15px" size="mini"  :loading="confirmLoading" @click="onPayment">
        确认付款
      </el-button>
      <el-button type="danger" style="margin-top: 15px"  size="mini"  :loading="confirmLoading" @click="onRefuse">
        拒绝申请
      </el-button>
    </el-row>

    <auditing ref="auditing" @saveAuditCBEvent="saveAuditCBEvent"></auditing>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import infoFrom from './info'
  import paymentFrom from './form'
  import attachment from './attachment'
  import auditing from '@/components/PhAuditing'

  export default {
    components: {
      infoFrom,
      attachment,
      paymentFrom,
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
        return `预付款单 [${this.primary.code}]`;
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
          let relations = ["supplier", "currency", "procurementOrder", "procurementOrderAmount"];
          //获取计划数据
          this.global.axios
            .get(`/financeBills/${this.primaryId}?relations=${JSON.stringify(relations)}`)
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
        this.activeNames = ['infoFrom', 'itemTable', 'billTable', 'attachment'];
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

        this.global.axios.put(`/financeBills/payment/${order.id}`, order)
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

              let paymentObject = JSON.parse(JSON.stringify(this.$refs.paymentFrom.editObject));
              paymentObject.note = note;

              this.refusePaymentOrder(paymentObject);

              done();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })

      },

      refusePaymentOrder(order){
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.global.axios.put(`/financeBills/refuse/${order.id}`, order)
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

