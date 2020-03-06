<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible"
             :visible.sync="dialogVisible" style="padding-bottom: 40px"
             class="ph-dialog" @close='closeDialog' fullscreen>

    <el-row
      style="text-align:right; position:fixed; left:0; bottom: 0px; background-color:#FFF; padding: 5px 30px; z-index: 9999; width: 100%;">

      <router-link target="_blank" :to="'/allocationReceived/print?id='+primary.id">
        <el-button v-if="hasPrint" type="primary" size="small" icon="el-icon-printer" @click="onPrint">打印收货单</el-button>
      </router-link>

      <el-button v-if="hasReceived" type="success" size="small" icon="el-icon-s-claim" @click="onComplete">确认收货
      </el-button>
      <el-button size="small" @click="closeDialog">取 消</el-button>
    </el-row>

    <itemTable ref="itemTable" :primary="primary"></itemTable>
    <h4>附件</h4>
    <attachment ref="attachment" :primary="primary"></attachment>
    <saveDialog ref="saveDialog" @modifyCBEvent="modifyCBEvent"></saveDialog>
  </el-dialog>

</template>

<script>
  import itemTable from './detailTable'
  import attachment from './attachment'
  import saveDialog from './saveDialog'
  import {checkPermission} from "../../../../utils/permission";

  export default {
    components: {
      itemTable,
      attachment,
      saveDialog
    },
    props: {},
    computed: {
      hasPrint() {
        return checkPermission('AllocationReceivedResource_print');
      },
      hasReceived() {
        return checkPermission('AllocationReceivedResource_received')
      },
      title() {
        return '调拨入库  ---  [' + this.primary.code + '] --- (' + this.primary.statusName + "状态)";
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
            .get(`/allocationReceiveds/${this.primaryId}?relations=${JSON.stringify(["fromWarehouse", "toWarehouse"])}`)
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

      //确认收货
      onConfirm() {
        this.global.axios.put(`/allocationReceiveds/confirmTask/${this.primaryId}`)
          .then(resp => {
            this.$message.success("确认收货成功");
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

      //收货完成
      onComplete() {
        // 明细对象
        let details = this.$refs.itemTable.tableData;
        let allQty = 0;

        details.forEach(r => {
          allQty += r.receivedQty;
        });

        if (allQty == 0) {
          this.$message.error("收货总数量不能为0!");
        } else {
          this.$refs.saveDialog.openDialog(this.primary, details);
        }
      },

      //打印收货单
      onPrint() {
        this.global.axios.get(`/attachments/allocationReceiveds/${this.primaryId}`)
          .then(resp => {
            this.$message.success("打印收货单");
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

