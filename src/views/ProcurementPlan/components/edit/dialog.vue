<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" class="ph-dialog" @close='closeDialog' fullscreen>
    <el-row style="text-align:right; position:fixed; right: 20px;bottom: 0px; background-color:#FFF; padding: 5px; z-index: 9999; width: 100%;">
      <el-button type="primary" icon="el-icon-s-check" v-if="primary.status == 1" @click="onCommit">提交审核</el-button>
      <el-button type="success" icon="el-icon-success" v-if="primary.status == 0" @click="onAgree">同意</el-button>
      <el-button type="warning" icon="el-icon-error" v-if="primary.status == 0" @click="onRefuse">不同意</el-button>

      <el-button type="primary" icon="el-icon-refresh-left" v-if="primary.status != 1" @click="onWithdraw">撤回
      </el-button>
      <el-button type="success" icon="el-icon-s-claim" v-if="hasExecute" @click="onComplete">结束计划</el-button>

      <el-button type="danger" icon="el-icon-s-opportunity" v-if="hasAdmin" @click="onStatus">修改状态</el-button>

      <el-button type="primary" icon="el-icon-user-solid" v-if="false" @click="onAssign">指派处理人</el-button>
      <el-button type="primary" icon="el-icon-s-goods" v-if="false" @click="onHandover">交接工作</el-button>
      <el-button type="primary" icon="el-icon-share" v-if="false" @click="onShare">分享</el-button>

    </el-row>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" v-if="primaryComplete" :primary="primary"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 采购计划内容</div>
        <itemTable ref="itemTable" :primary="primary" v-if="primaryComplete"></itemTable>
      </el-collapse-item>

      <el-collapse-item name="attachment" style="margin-top: 10px">
        <div slot="title" class="title">3. 附件</div>
        <attachment ref="attachment" :primary="primary" v-if="primaryComplete"></attachment>
      </el-collapse-item>

      <el-collapse-item name="person" style="margin-top: 10px">
        <div slot="title" class="title">4. 指派采购负责人</div>
        <person @reloadCBEvent="reloadCBEvent" ref="person" v-if="primaryComplete" :primary="primary"></person>
      </el-collapse-item>

      <el-collapse-item name="logs" style="margin-top: 10px">
        <div slot="title" class="title">5. 日志</div>
        <logs @reloadCBEvent="reloadCBEvent" ref="logs" :logs="logs" v-if="logComplete"></logs>
      </el-collapse-item>
    </el-collapse>

    <phStatus statusName="ProcurementPlanStatus" @saveStatusCBEvent="saveStatusCBEvent" ref="phStatus"
              :objStatus="primary.status"></phStatus>

    <auditing ref="auditing" @saveAuditCBEvent="saveAuditCBEvent"></auditing>
  </el-dialog>

</template>

<script>
  import infoFrom from './form'
  import itemTable from '../detail/table'
  import attachment from './attachment'
  import logs from './logs';
  import person from './person'
  import phStatus from '@/components/PhStatus'
  import auditing from '@/components/PhAuditing'

  export default {
    components: {
      infoFrom,
      itemTable,
      attachment,
      person,
      phStatus,
      auditing,
      logs
    },
    props: {},
    computed: {
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
        return '编辑采购计划 [' + this.primary.name + '] -- (' + this.primary.statusName + "状态)";
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
          //获取计划数据
          this.global.axios
            .get(`/procurementPlans/${this.primaryId}`)
            .then(resp => {
              let res = resp.data;
              this.primary = res || {};
              this.dialogVisible = true;
              this.primaryComplete = true;
            })
            .catch(err => {
            });

          // 获取日志数据
          let filters = [];
          let logUrl = '/procurementPlanLogs';
          let relations = ["creator"]

          filters.push(
            {
              field: "procurementPlanId",
              op: 'eq',
              data: this.primaryId
            })
          logUrl += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});
          logUrl += "&sort=id&dir=desc";
          logUrl += "&relations=" + JSON.stringify(relations);

          this.global.axios
            .get(logUrl)
            .then(resp => {
              let res = resp.data;
              this.logs = res || [];
              this.logComplete = true;
              this.dialogVisible = true;
            })
            .catch(err => {
            });
        }
      },

      /* 开启弹出编辑框 需要传主键ID */
      openDialog(primaryId) {
        this.primaryId = primaryId;
        this.initData();
        // 默认展开所有折叠面板
        this.activeNames = ['infoFrom', 'itemTable', 'attachment', 'person', 'logs'];
      },
      closeDialog(){
        this.primary={};
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
            this.$message.info('操作成功!');
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
                  this.$message.info(message);
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

