<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" class="ph-dialog"
             v-if="dialogVisible" :visible.sync="dialogVisible"
             @close='closeDialog' fullscreen>

    <el-row
      style="text-align:right; position:fixed; left:0; bottom: 0px; background-color:#FFF; padding: 5px 30px; z-index: 9999; width: 100%;" v-if="primaryComplete" >

      <el-button @click="closeDialog" size="small">取 消</el-button>

    </el-row>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" v-if="primaryComplete" @modifyCBEvent="modifyCBEvent" :primary="primary"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 产品详情</div>
        <itemTable ref="itemTable" v-if="primaryComplete" :primary="primary"></itemTable>
      </el-collapse-item>

      <el-collapse-item name="attachment" style="margin-top: 10px; padding-bottom: 5px;">
        <div slot="title" class="title">3. 附件</div>
        <attachment ref="attachment" v-if="primaryComplete" :primary="primary"></attachment>
      </el-collapse-item>

    </el-collapse>


  </el-dialog>

</template>

<script>
  import infoFrom from './form'
  import itemTable from './detailTable'
  import attachment from './attachment'

  export default {
    components: {
      infoFrom,
      itemTable,
      attachment
    },
    props: {},
    computed: {
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
        primaryComplete: false,
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
        this.activeNames = ['infoFrom', 'itemTable', 'attachment'];
      },

      closeDialog() {
        this.primaryId = null;
        this.primary = null;
        this.dialogVisible = false;
        this.activeNames = []; //折叠面板开启项
        this.primaryComplete = false;
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("modifyCBEvent", object);
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

