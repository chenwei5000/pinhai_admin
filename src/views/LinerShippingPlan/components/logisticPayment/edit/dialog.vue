<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible"
             :visible.sync="dialogVisible"
             append-to-body
             class="ph-dialog"
             @close='closeDialog'
             width="90%"
             top="2vh"
  >

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" v-if="primaryComplete" :primary="primary"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 付款项</div>
        <itemTable ref="itemTable" @modifyCBEvent="modifyCBEvent"  :primary="primary" :selCurrency="selCurrency" v-if="primaryComplete"></itemTable>
      </el-collapse-item>

      <el-collapse-item name="attachment" style="margin-top: 10px">
        <div slot="title" class="title">3. 发票上传</div>
        <attachment ref="attachment" @invoiceRecognitionCB="invoiceRecognitionCB" :primary="primary"
                    v-if="primaryComplete"></attachment>
      </el-collapse-item>

      <el-collapse-item name="billTable" style="margin-top: 10px">
        <div slot="title" class="title">4. 发票信息</div>
        <billTable ref="billTable" @modifyCBEvent="modifyCBEvent"  :primary="primary" :selCurrency="selCurrency" v-if="primaryComplete"></billTable>
      </el-collapse-item>

    </el-collapse>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import infoFrom from './form'
  import itemTable from './itemTable'
  import billTable from './billTable'
  import attachment from './attachment'

  export default {
    components: {
      infoFrom,
      itemTable,
      billTable,
      attachment
    },
    props: {
      plan: {
        type: [Object],
        default: null
      }
    },
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
        return `申请物流付款-编号[${this.plan.code}], 开船时间[${this.plan.formatEtdTime}], 发货港口[${this.plan.portOfLoading}]`;
      }
    },

    data() {
      return {
        primaryId: null,  //主ID
        primary: {}, //主对象
        selCurrency: {
          symbolLeft: "￥",
          id: 1
        },
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
          let relations = ["companyManagement", "currency"];
          //获取计划数据
          this.global.axios
            .get(`/logisticPaymentBills/${this.primaryId}?relations=${JSON.stringify(relations)}`)
            .then(resp => {
              let res = resp.data;
              this.primary = res || {};
              this.primary.linerShippingPlan = this.plan;
              this.selCurrency = res.currency;
              this.dialogVisible = true;
              this.primaryComplete = true;
            })
            .catch(err => {
            });
        }
        else {
          this.$message.error("无效的物流付款单")
          this.dialogVisible = true;
          this.primaryComplete = true;
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
        this.logs = [];
        this.dialogVisible = false;
        this.primaryComplete = false;
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        this.initData();
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("modifyCBEvent", object);
      }
      ,
      /* 重新加载 */
      reloadCBEvent() {
        this.initData();
      },

      invoiceRecognitionCB(_invoices) {
        let invoices = JSON.parse(JSON.stringify(_invoices));
        invoices.forEach(r => {
          this.$refs.billTable.addInvoice(r);
        });
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

