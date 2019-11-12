<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" style="padding-bottom: 40px"
             class="ph-dialog" @close='closeDialog' fullscreen>
    <el-row
      style="text-align:right; position:fixed; right: 20px;bottom: 0px; background-color:#FFF; padding: 5px; z-index: 9999; width: 100%;">
      <el-button type="primary" size="small" icon="el-icon-date" v-if="hasExecute" @click="onConfirmDate">确认交货日期</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </el-row>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" v-if="primaryComplete" :primary="primary"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 采购产品详情</div>
        <itemTable ref="itemTable" :primary="primary" v-if="primaryComplete"></itemTable>
      </el-collapse-item>

      <el-collapse-item name="person" style="margin-top: 10px">
        <div slot="title" class="title">3. 跟单负责人</div>
        <person @reloadCBEvent="reloadCBEvent" ref="person" v-if="primaryComplete" :primary="primary"></person>
      </el-collapse-item>

      <el-collapse-item name="logs" style="margin-top: 10px">
        <div slot="title" class="title">4. 日志</div>
        <logs @reloadCBEvent="reloadCBEvent" ref="logs" :logs="logs" v-if="logComplete"></logs>
      </el-collapse-item>
    </el-collapse>
    <!-- 弹窗框 -->
    <dateDialog ref="dateDialog" @modifyCBEvent="modifyCBEvent"></dateDialog>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import infoFrom from './form'
  import logs from './logs';
  import person from './person'
  import itemTable from './itemTable'
  import dateDialog from './dateDialog'

  import {currency, intArrToStrArr} from '@/utils'
  import {checkPermission} from "../../../../utils/permission";

  export default {
    components: {
      infoFrom,
      itemTable,
      person,
      logs,
      dateDialog
    },
    props: {},
    filters: {
      currency: currency
    },
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),
      hasExecute() {
        if ([3, 4, 5, 6, 7, 8, 9, 10].indexOf(this.primary.status) > -1) {
          if (!checkPermission('ProcurementOrderResource_confirmDate')) {
            return false;
          }
          return true;
        }
        else {
          return false;
        }
      },
      title() {
        return '采购单跟单 [' + this.primary.code + '] -- (' + this.primary.statusName + "状态)";
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
        url: '/procurementOrders',
        relations: ["procurementPlan", "currency", "warehouse", "supplier"],  // 关联对象
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
          let url = `${this.url}/${this.primaryId}`;
          url += "?relations=" + JSON.stringify(this.relations);

          this.primaryComplete = false;

          //获取计划数据
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

          // 获取日志数据
          let filters = [];
          let logUrl = '/procurementOrderLogs';
          let relations = ["creator"]
          this.logComplete = false;

          filters.push(
            {
              field: "procurementOrderId",
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
        this.activeNames = ['infoFrom', 'itemTable', 'person'];
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
        this.initData();
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("modifyCBEvent", object);
      },
      /* 重新加载 */
      reloadCBEvent() {
        this.initData();
      },
      onConfirmDate() {
        this.$refs.dateDialog.openDialog(this.primary);
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

