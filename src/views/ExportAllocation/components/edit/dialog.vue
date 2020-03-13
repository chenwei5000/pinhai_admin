<template>

  <!-- 修改弹窗 TODO: title -->
    <el-dialog :title="title"
               class="ph-dialog"
               :visible.sync="dialogVisible"
               v-if="dialogVisible"
               style="padding-bottom: 40px"
               @close='closeDialog'
               fullscreen>


    <el-row
      style="text-align:right; position:fixed; left:0; bottom: 0px; background-color:#FFF; padding: 5px 30px; z-index: 9999; width: 100%;">


      <el-button type="warning" size="small" icon="el-icon-brush" v-if="primary.status === 3" @click="onBoxCode">生成箱码
      </el-button>

      <el-button type="primary" size="small" icon="el-icon-download" @click="downloadAmazonPackageLabels">下载箱贴
      </el-button>

      <router-link target="_blank" :to="'/exportAllocation/print?id='+primary.id">
        <el-button type="primary" size="small" icon="el-icon-printer">打印调拨单</el-button>
      </router-link>

      <el-button type="success" size="small" icon="el-icon-s-claim" @click="onComplete" v-if="primary.status === 3">
        确认发货
      </el-button>

      <el-button type="danger" size="small" icon="el-icon-s-opportunity" v-if="hasAdmin" @click="onStatus">
        修改状态
      </el-button>

      <el-button size="small" @click="closeDialog">取 消</el-button>
    </el-row>

    <itemTable ref="itemTable" :primary="primary"></itemTable>
    <h4>附件</h4>
    <attachment ref="attachment" :primary="primary"></attachment>
    <saveDialog ref="saveDialog" @modifyCBEvent="modifyCBEvent"></saveDialog>
    <phStatus statusName="WarehouseAllocationStatus" @saveStatusCBEvent="saveStatusCBEvent" ref="phStatus"
              :objStatus="primary.status"></phStatus>
  </el-dialog>

</template>

<script>
  import itemTable from './detailTable'
  import attachment from './attachment'
  import saveDialog from './saveDialog'
  import phStatus from '@/components/PhStatus'
  import {checkPermission} from "../../../../utils/permission";


  export default {
    components: {
      itemTable,
      attachment,
      phStatus,
      saveDialog
    },
    props: {},
    computed: {
      title() {
        return '出口调拨  ---  [' + this.primary.code + '] --- (' + this.primary.statusName + "状态)";
      },
      hasAdmin() {
        return checkPermission('WarehouseAllocationResource_updateStatus');
      },
    },

    data() {
      return {
        primaryId: null,  //主ID
        primary: {}, //主对象
        dialogVisible: false, //Dialog 是否开启
        activeNames: [], //折叠面板开启项
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
            .get(`/exportAllocations/${this.primaryId}?relations=${JSON.stringify(["linerShippingPlan", "fromWarehouse"])}`)
            .then(resp => {
              let res = resp.data;
              this.primary = res || {};
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
        this.activeNames = ['infoFrom', 'itemTable'];
      },
      closeDialog() {
        this.primaryId = null;
        this.primary = {};
        this.activeNames = [];
        this.dialogVisible = false;
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("modifyCBEvent", object);
        this.closeDialog();
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

        let url = `/warehouseAllocations/status/${this.primaryId}/${status}`;
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

      //确认发货
      onComplete() {
        // 明细对象
        let details = this.$refs.itemTable.data;
        this.$refs.saveDialog.openDialog(this.primary, details);
      },

      onBoxCode() {
        let loading = this.$loading({
          lock: true,
          text: '加载数据中',
          spinner: 'el-icon-upload',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.global.axios.put(`/warehouseAllocations/boxCode/${this.primaryId}`)
          .then(resp => {
            this.$message.success("箱码生成成功");
            loading.close();
            this.$refs.itemTable.getList();
          })
          .catch(err => {
            loading.close();
          })
      },

      // 下载箱贴
      downloadAmazonPackageLabels(command) {
        if (!this.primary.linerShippingPlan.shipmentId) {
          this.$message.error("必须优先设置FBA ID");
          return false;
        }
        let url = `${this.global.generateUrl('/linerShippingPlans/downloadPackageLabels')}/${this.primary.linerShippingPlan.id}?accessToken=${this.$store.state.user.token}`;
        url += '&pageType=PackageLabel_Plain_Paper';
        window.open(url, '_blank');
        return false;
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

