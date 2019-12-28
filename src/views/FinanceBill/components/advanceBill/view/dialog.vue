<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" class="ph-dialog" @close='closeDialog'
             fullscreen>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" v-if="primaryComplete" :primary="primary"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 采购产品明细   [{{this.primary.procurementOrder.formatCreateTime}}]</div>
        <detailTable ref="detailTable" :primary="primary" v-if="primaryComplete"></detailTable>
      </el-collapse-item>

      <el-collapse-item name="receivedDetailTable" style="margin-top: 10px">
        <div slot="title" class="title">3. 收货明细</div>
        <receivedDetailTable ref="receivedDetailTable" :primary="primary" v-if="primaryComplete"></receivedDetailTable>
      </el-collapse-item>

      <el-collapse-item name="attachment" style="margin-top: 10px">
        <div slot="title" class="title">4. 附件</div>
        <attachment ref="attachment" :primary="primary" v-if="primaryComplete"></attachment>
      </el-collapse-item>

      <el-collapse-item name="paymentsTable" style="margin-top: 10px">
        <div slot="title" class="title">5. 相关预付款单</div>
        <paymentsTable ref="paymentsTable" :primary="primary" v-if="primaryComplete"></paymentsTable>
      </el-collapse-item>

      <el-collapse-item name="paymentInfo" style="margin-top: 10px" v-if="primary.status != 1 ">
        <div slot="title" class="title">6. 付款信息</div>
        <paymentInfo ref="paymentInfo" :primary="primary" v-if="primaryComplete"></paymentInfo>
      </el-collapse-item>

    </el-collapse>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import infoFrom from './form'
  import detailTable from './detailTable'
  import receivedDetailTable from './receivedDetailTable'
  import attachment from './attachment'
  import paymentsTable from './paymentsTable'
  import paymentInfo from './paymentInfo'

  export default {
    components: {
      infoFrom,
      detailTable,
      receivedDetailTable,
      attachment,
      paymentsTable,
      paymentInfo
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
      },
    },

    data() {
      return {
        primaryId: null,  //主ID
        primary: {}, //主对象
        logs: [], //日志对象
        primaryComplete: false,
        logComplete: false,
        dialogVisible: false, //Dialog 是否开启
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
          let relations = ["supplier", "currency", "procurementOrder", "procurementOrderAmount","procurementShippedOrder"];
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
        this.activeNames = ['infoFrom', 'itemTable', 'receivedDetailTable', 'paymentsTable', 'attachment', 'paymentInfo'];
      },
      closeDialog() {
        this.primary = {};
        this.primaryId = null;
        this.logs = [];
        this.dialogVisible = false;
        this.primaryComplete = false;
        this.logComplete = false;
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("modifyCBEvent", object);
      },
      /* 重新加载 */
      reloadCBEvent() {
        this.initData();
      },

      // 管理员修改状态
      onStatus() {
        this.$refs.phStatus.openDialog();
      },
      saveStatusCBEvent(status) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        let url = `/procurementPlans/status/${this.primaryId}/${status}`;
        this.global.axios.put(url)
          .then(resp => {
            this.$refs.phStatus.closeDialog();
            this.$message.success('操作成功!');
            loading.close();
            this.initData();
            // 继续向父组件抛出事件 修改成功刷新列表
            this.$emit("modifyCBEvent");
          })
          .catch(err => {
            loading.close();
          });
      },

      // 业务
      business(title, bAction, message, note) {
        this.$confirm(title, '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });

              let url = `/procurementPlans/${bAction}/${this.primaryId}`;
              this.global.axios.put(url, note ? note : ' ')
                .then(resp => {
                  done();
                  this.$message.success(message);
                  loading.close();
                  this.$refs.auditing.closeDialog();
                  this.initData();
                  // 继续向父组件抛出事件 修改成功刷新列表
                  this.$emit("modifyCBEvent");
                })
                .catch(err => {
                  loading.close();
                });
              done();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },


      // 提交审核
      saveAuditCBEvent(note, type) {
        //提交审核
        if (type == 'commit') {
          this.business('确认将该计划提交给上级审核吗?', 'commit', "提交成功,请耐心等待上级处理!", note);
        }
        //同意审核
        else if (type == 'agree') {
          this.business('确认同意该计划吗?', 'agree', "操作成功!", note);
        }
        //拒绝审核
        else if (type == 'refuse') {
          this.business('确认拒绝该计划吗?', 'refuse', "操作成功!", note);
        }
      },

      onCommit() {
        this.$refs.auditing.openDialog('commit');
      },

      onAgree() {
        this.$refs.auditing.openDialog('agree');
      },

      onRefuse() {
        this.$refs.auditing.openDialog('refuse');
      },
      //撤回
      onWithdraw() {
        this.business('确认撤回该计划吗?', 'withdraw', "操作成功!");
      },
      //交接
      onHandover() {
      },
      //分享
      onShare() {
      },
      //完成
      onComplete() {
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .title {
    font-size: 14px;
    font-weight: bold;
  }

</style>

