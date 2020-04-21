<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" class="ph-dialog" @close='closeDialog'
             fullscreen>

    <el-row
      style="text-align:right; position:fixed; left:0; bottom: 0px; background-color:#FFF; padding: 5px 30px; z-index: 9999; width: 100%;"
      v-if="primaryComplete">

      <el-button type="success" size="small" icon="el-icon-s-claim" v-if="hasExecute" @click="onComplete">完成结算申报
      </el-button>
      <el-button type="danger" size="small" icon="el-icon-s-opportunity" v-if="hasAdmin" @click="onStatus">修改状态
      </el-button>
      <el-button type="danger" size="small" icon="el-icon-delete" v-if="hasAdmin" @click="onDelete">删除</el-button>

      <el-button size="small" @click="closeDialog">取 消</el-button>

    </el-row>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" v-if="primaryComplete" :primary="primary"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 采购产品明细</div>
        <detailTable ref="detailTable" :primary="primary" v-if="primaryComplete"></detailTable>
      </el-collapse-item>

      <el-collapse-item name="paymentsTable" style="margin-top: 10px">
        <div slot="title" class="title">3. 相关付款单</div>
        <paymentsTable ref="paymentsTable" :primary="primary" v-if="primaryComplete"></paymentsTable>
      </el-collapse-item>
    </el-collapse>

    <phStatus statusName="SettlementBillStatus" @saveStatusCBEvent="saveStatusCBEvent" ref="phStatus"
              :objStatus="primary.status"></phStatus>
  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import infoFrom from './form'
  import detailTable from './detailTable'
  import paymentsTable from './paymentsTable'
  import {checkPermission} from "../../../../utils/permission";
  import phStatus from '@/components/PhStatus'

  export default {
    components: {
      infoFrom,
      detailTable,
      paymentsTable,
      phStatus
    },
    props: {},
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),

      hasExecute() {
        if ([0].indexOf(this.primary.status) > -1) {
          return true;
        }
        else {
          return false;
        }
      },
      hasAdmin() {
        return checkPermission('ProcurementPlanResource_updateStatus');
      },
      title() {
        return `结算单 [${this.primary.code}]`;
      }
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
          let relations = ["supplier", "currency", "procurementOrder", "procurementOrder.company", "procurementOrder.creator"];
          //获取计划数据
          this.global.axios
            .get(`/settlementBills/${this.primaryId}?relations=${JSON.stringify(relations)}`)
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
          this.$message.error("无效的结算单");
        }
      },

      /* 开启弹出编辑框 需要传主键ID */
      openDialog(primaryId) {
        this.primaryId = primaryId;
        this.initData();
        // 默认展开所有折叠面板
        this.activeNames = ['infoFrom', 'itemTable', 'paymentsTable'];
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

        let url = `/settlementBills/status/${this.primaryId}/${status}`;
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

              let url = `/settlementBills/${bAction}/${this.primaryId}`;
              this.global.axios.put(url, note ? note : ' ')
                .then(resp => {
                  done();
                  this.$message.success(message);
                  loading.close();
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

      //撤回
      onWithdraw() {
        this.business('确认撤回该结算单吗?', 'withdraw', "操作成功!");
      },
      //完成
      onComplete() {
        this.business('确认该结算单已经申报完成了吗?', 'commitComplete', "操作成功!");
      },
      onDelete() {
        this.$confirm("确认要删除该结算单吗?", '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });

              let url = `/settlementBills/${this.primaryId}`;
              this.global.axios
                .delete(url)
                .then(resp => {
                  done();
                  this.$message.success('操作成功');
                  loading.close();
                  // 继续向父组件抛出事件 修改成功刷新列表
                  this.$emit("modifyCBEvent");
                  this.closeDialog();
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

