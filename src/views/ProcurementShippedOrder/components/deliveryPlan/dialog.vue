<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" style="padding-bottom: 40px"
             class="ph-dialog" @close='closeDialog' fullscreen>
    <el-row
      style="text-align:right; position:fixed; right: 20px;bottom: 0px; background-color:#FFF; padding: 5px; z-index: 9999; width: 100%;">
      <el-button @click="closeDialog">关 闭</el-button>
    </el-row>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom"
                  @modifyCBEvent="modifyCBEvent"
                  v-if="primaryComplete && itemComplete"
                  :primary="primary"
                  :orderItem="orderItem">

        </infoFrom>
      </el-collapse-item>

      <el-collapse-item name="person" style="margin-top: 10px">
        <div slot="title" class="title">2. 跟单负责人</div>
        <person @reloadCBEvent="reloadCBEvent" ref="person" v-if="primaryComplete" :primary="primary"></person>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">3. 交货计划</div>
        <itemTable ref="itemTable" :primary="orderItem" v-if="primaryComplete"></itemTable>
      </el-collapse-item>

    </el-collapse>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import infoFrom from './form'
  import person from './person'
  import itemTable from './itemTable'

  import {currency, intArrToStrArr} from '@/utils'

  export default {
    components: {
      infoFrom,
      itemTable,
      person
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
      title() {
        return `确认交货日期 [${this.primary ? this.primary.code : ''}-${this.orderItem.product ? this.orderItem.product.skuCode : ''}]`;
      }
    },

    data() {
      return {
        primaryId: null,  //主ID
        primary: {}, //主对象
        itemId: null,
        orderItem: {},
        primaryComplete: false,
        itemComplete: false,
        dialogVisible: false, //Dialog 是否开启
        activeNames: [],   //折叠面板开启项
        url: '/procurementOrders',
        relations: ["procurementPlan", "warehouse", "supplier"],  // 关联对象
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

          let itemUrl = `/procurementOrderItems/${this.itemId}`;
          let relations = ["product"];
          itemUrl += "?relations=" + JSON.stringify(relations);
          this.itemComplete = false;
          this.global.axios
            .get(itemUrl)
            .then(resp => {
              let res = resp.data;
              this.orderItem = res || {};
              console.log(this.orderItem);
              this.dialogVisible = true;
              this.itemComplete = true;
            })
            .catch(err => {
            });
        }
      },

      /* 开启弹出编辑框 需要传主键ID */
      openDialog(row) {
        this.primaryId = row.procurementOrderId;
        this.itemId = row.id;
        this.initData();

        // 默认展开所有折叠面板
        this.activeNames = ['infoFrom', 'itemTable', 'person'];
      },
      closeDialog() {
        this.primary = {};
        this.primaryId = null;
        this.itemId = null;
        this.orderItem = {};
        this.dialogVisible = false;
        this.primaryComplete = false;
        this.itemComplete = false;
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

