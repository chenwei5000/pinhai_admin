<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" style="padding-bottom: 40px"
             class="ph-dialog" @close='closeDialog' fullscreen>

    <el-row
      style="text-align:right; position:fixed; left:0; bottom: 0px; background-color:#FFF; padding: 5px 30px; z-index: 9999; width: 100%;">

      <el-button type="warning" icon="el-icon-refresh-left" v-if="hasWithdraw" size="small" @click="onWithdraw">撤回
      </el-button>
      <el-button type="success" icon="el-icon-s-claim" v-if="hasShipped" size="small" @click="onShipped">执行发货
      </el-button>

      <el-button type="warning" size="small" icon="el-icon-brush" v-if="hasPackageLabel" @click="onBoxCode">生成箱码</el-button>

      <a target="_blank"
         :href="global.generateUrl('/pdfs/shippedPackageLabels')+'/'+ primary.id + '?accessToken=' + $store.state.user.token">
        <el-button type="primary" size="small" v-if="hasPackageLabel" icon="el-icon-download">下载箱贴</el-button>
      </a>

      <router-link target="_blank" :to="'/procurementShippedOrder/print?id='+primary.id" v-if="hasExecute">
        <el-button type="primary" icon="el-icon-printer" v-if="hasPackageLabel" size="small">打印发货单</el-button>
      </router-link>

      <el-button type="success" size="small" icon="el-icon-s-claim" v-if="hasExecute" @click="onComplete">结束发货计划
      </el-button>

      <el-button type="danger" icon="el-icon-s-opportunity" v-if="hasAdmin" size="small" @click="onStatus">修改状态
      </el-button>
      <el-button @click="closeDialog" size="small">取 消</el-button>
    </el-row>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" v-if="primaryComplete" :primary="primary"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 发货计划内容</div>
        <itemTable ref="itemTable" v-if="primaryComplete" :primary="primary"></itemTable>
      </el-collapse-item>

      <el-collapse-item name="attachment" style="margin-top: 10px">
        <div slot="title" class="title">3. 附件</div>
        <attachment ref="attachment" v-if="primaryComplete" :primary="primary"></attachment>
      </el-collapse-item>

      <el-collapse-item name="person" style="margin-top: 10px">
        <div slot="title" class="title">4. 指派仓库负责人</div>
        <person @reloadCBEvent="reloadCBEvent" ref="person" v-if="primaryComplete" :primary="primary"></person>
      </el-collapse-item>
    </el-collapse>

    <!-- 弹窗框 -->
    <shippedDialog ref="shippedDialog" @shippedCBEvent="onShippedCBEvent"></shippedDialog>
    <phStatus statusName="ProcurementShippedOrderStatus" @saveStatusCBEvent="saveStatusCBEvent" ref="phStatus"
              :objStatus="primary.status"></phStatus>


  </el-dialog>
</template>

<script>
  import infoFrom from './form'
  import itemTable from '../detail/table'
  import attachment from './attachment'
  import person from './person'
  import shippedDialog from './shippedDialog'
  import phStatus from '@/components/PhStatus'
  import {checkPermission} from "../../../../utils/permission";

  export default {
    components: {
      infoFrom,
      itemTable,
      attachment,
      person,
      shippedDialog,
      phStatus
    },
    props: {},
    computed: {
      hasExecute() {
        if ([3, 4].indexOf(this.primary.status) > -1) {
          if (!checkPermission('ProcurementShippedOrderResource_print')) {
            return false;
          }
          return true;
        }
        else {
          return false;
        }
      },
      hasAdmin() {
        return checkPermission('ProcurementShippedOrderResource_updateStatus');
      },

      hasWithdraw() {
        if ([4].indexOf(this.primary.status) > -1) {
          if (!checkPermission('ProcurementShippedOrderResource_withdraw')) {
            return false;
          }
          return true;
        }
        else {
          return false;
        }
      },
      hasPackageLabel() {
        if ([3].indexOf(this.primary.status) > -1) {
          if (this.hasExecute && checkPermission('PdfResource_shippedPackageLabels')) {
            return true;
          }
          return false;
        }
        else {
          return false;
        }
      },
      hasShipped() {
        if (this.primary.status == 3) {
          if (!checkPermission('ProcurementShippedOrderResource_shippedOrder')) {
            return false;
          }
          return true;
        }
        else {
          return false;
        }
      },
      title() {
        let action = "";
        if ([1, 3].indexOf(this.primary.status) != -1) {
          action = "编辑";
        }
        else {
          action = "查看"
        }
        return action + '发货计划 [' + this.primary.code + '] -- (' + this.primary.statusName + "状态)";
      }
    },

    data() {
      return {
        primaryId: null,  //主ID
        primaryComplete: false,
        primary: {}, //主对象
        dialogVisible: false, //Dialog 是否开启
        activeNames: ['infoFrom', 'itemTable', 'attachment', 'person'],   //折叠面板开启项
        relations: ["supplier", "warehouse"],
        url: "/procurementShippedOrders"
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
      });
    },
    updated() {
    },
    methods: {
      initData() {
        if (this.primaryId) {
          //获取计划数据
          let url = `${this.url}/${this.primaryId}`;
          if (this.relations && this.relations.length > 0) {
            url += "?relations=" + JSON.stringify(this.relations);
          }
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data;
              this.primary = res || {};
              this.dialogVisible = true;
              this.primaryComplete = true;
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
        //this.activeNames = ['infoFrom', 'itemTable'];
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("modifyCBEvent", object);
        this.initData();
      },
      //打印发货单
      onPrint() {
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

              let url = `/procurementShippedOrders/${bAction}/${this.primaryId}`;
              this.global.axios.put(url, note ? note : ' ')
                .then(resp => {
                  done();
                  this.$message.success(message);
                  this.initData();
                  loading.close();
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
        this.business('确认撤回该采购发货单吗?', 'withdraw', "操作成功!");
      },

      //确认发货
      onShipped() {
        this.$refs.shippedDialog.openDialog(this.primary);
      },
      onShippedCBEvent(object) {
        this.primaryComplete = false;
        this.initData();
        this.$emit("modifyCBEvent");
      },

      //完成
      onComplete() {
        this.business('确认发货计划结束了吗?', 'complete', "操作成功!", "");
      },

      onBoxCode() {
        let loading = this.$loading({
          lock: true,
          text: '加载数据中',
          spinner: 'el-icon-upload',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.global.axios.put(`/procurementShippedOrders/boxCode/${this.primaryId}`)
          .then(resp => {
            this.$message.success("箱码生成成功");
            loading.close();
            this.$refs.itemTable.getList();
          })
          .catch(err => {
            loading.close();
          })
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

        let url = `/procurementShippedOrders/status/${this.primaryId}/${status}`;
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

      closeDialog() {
        this.primaryId = null;
        this.primary = null;
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

