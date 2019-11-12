<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible"
             :visible.sync="dialogVisible" style="padding-bottom: 40px"
             class="ph-dialog" @close='closeDialog' fullscreen>

    <el-row
      style="text-align:right; position:fixed; left:0; bottom: 0px; background-color:#FFF; padding: 5px 30px; z-index: 9999; width: 100%;">

      <router-link target="_blank" :to="'/warehouseAllocation/print?id='+primary.id">
        <el-button type="primary" size="small" icon="el-icon-printer"  @click="onPrint">打印调拨单</el-button>
      </router-link>

      <el-button type="success" size="small" icon="el-icon-s-claim"  @click="onComplete" v-if="primary.status === 3">确认发货</el-button>
      <el-button type="danger" size="small" icon="el-icon-s-opportunity" v-if="primary.status === 3" @click="onStatus">修改状态</el-button>

      <el-button size="small" @click="closeDialog">取 消</el-button>
    </el-row>

    <itemTable ref="itemTable" :primary="primary"></itemTable>
    <h4>附件</h4>
    <attachment ref="attachment" :primary="primary"></attachment>
    <saveDialog ref="saveDialog" @modifyCBEvent="modifyCBEvent"></saveDialog>
    <phStatus statusName="LinerShippingPlanItemStatus" @saveStatusCBEvent="saveStatusCBEvent" ref="phStatus"
              :objStatus="primary.status"></phStatus>
  </el-dialog>

</template>

<script>
  import itemTable from './detailTable'
  import attachment from './attachment'
  import saveDialog from './saveDialog'
  import phStatus from '@/components/PhStatus'


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
      }
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
            .get(`/exportAllocations/${this.primaryId}?relations=${JSON.stringify(["team", "linerShippingPlan","fromWarehouse", "toWarehouse"])}`)
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
      onConfirm() {
        this.global.axios.put(`/exportAllocations/linerShippedOrder/${this.primaryId}`)
          .then(resp => {
            this.$message.success("确认发货成功");
            this.loading = false;
            this.confirmLoading = false;
            this.dialogVisible = true;
            this.$refs.itemTable.getList();
            this.$emit("modifyCBEvent", resp.data);

          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
          })
      },

      //发货完成
      onComplete() {
        // 明细对象
        let details = this.$refs.itemTable.tableData;
        this.$refs.saveDialog.openDialog(this.primary, details);
      },

      //打印调拨单
      onPrint() {
        this.global.axios.get(`/attachments/warehouseAllocations/${this.primaryId}`)
          .then(resp => {
            this.$message.success("打印调拨单");
            this.loading = false;
            this.confirmLoading = false;
            this.dialogVisible = false;
            this.$emit("modifyCBEvent", resp.data);

          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
          })
      },
      onAll() {
        this.$refs.itemTable.onAll();
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

