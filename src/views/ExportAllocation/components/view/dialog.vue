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

      <el-button type="danger" size="small" icon="el-icon-s-opportunity" v-if="hasAdmin" @click="onStatus">
        修改状态
      </el-button>

      <el-button type="danger" size="small" icon="el-icon-s-opportunity" v-if="hasSettlement" @click="onSettlement">
        结算
      </el-button>

    </el-row>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" :primary="primary"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 产品详情</div>
        <itemTable ref="itemTable" :primary="primary"></itemTable>
      </el-collapse-item>

      <el-collapse-item name="attachment" style="margin-top: 10px; padding-bottom: 5px;">
        <div slot="title" class="title">3. 附件</div>
        <attachment ref="attachment" :primary="primary"></attachment>
      </el-collapse-item>

    </el-collapse>


    <phStatus statusName="WarehouseAllocationStatus" @saveStatusCBEvent="saveStatusCBEvent" ref="phStatus"
              :objStatus="primary.status"></phStatus>


  </el-dialog>

</template>

<script>
  import infoFrom from './form'
  import itemTable from './detailTable'
  import attachment from './attachment'
  import phStatus from '@/components/PhStatus'
  import {checkPermission} from "../../../../utils/permission";

  export default {
    components: {
      infoFrom,
      itemTable,
      attachment,
      phStatus
    },
    props: {},
    computed: {
      title() {
        return '出口调拨  ---  [' + this.primary.code + '] --- (' + this.primary.statusName + "状态)";
      },
      hasAdmin() {
        return checkPermission('WarehouseAllocationResource_updateStatus');
      },
      hasSettlement() {
        if ([4, 5, 6].indexOf(this.primary.status) === -1) {
          return false;
        }
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
            .get(`/exportAllocations/${this.primaryId}?relations=${JSON.stringify(["team", "linerShippingPlan", "fromWarehouse", "toWarehouse"])}`)
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
        this.activeNames = ['infoFrom', 'itemTable', 'attachment'];
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("modifyCBEvent", object);
      },

      closeDialog() {
        this.primaryId = null;
        this.primary = {};
        this.activeNames = [];
        this.dialogVisible = false;
      },

      onSettlement() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        let settlementBill = {};
        settlementBill.billingType = 'eout';
        settlementBill.code = this.primary.code;
        settlementBill.warehouseId = this.primary.fromWarehouseId;
        settlementBill.settleDate = this.primary.expectTime;
        settlementBill.jobStatus = '3';

        let url = `/settlementBills`;
        this.global.axios.post(url, settlementBill)
          .then(resp => {
            let a = resp.data.msg.split(",");
            this.$message.success('操作成功!'+  a[0] +'张结算单已经生成!');
            loading.close();
            this.initData();
            // 继续向父组件抛出事件 修改成功刷新列表
            this.$emit("modifyCBEvent");
          })
          .catch(err => {
            loading.close();
          });
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
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .title {
    font-size: 14px;
    font-weight: bold;
  }

</style>

