<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" fullscreen>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" :primary="primary"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. {{typeName}}明细

        </div>
        <itemTable ref="itemTable" :primary="primary"></itemTable>
      </el-collapse-item>

    </el-collapse>
  </el-dialog>

</template>

<script>
  import infoFrom from './form'
  import itemTable from './detailTable'

  export default {
    components: {
      infoFrom,
      itemTable,
    },
    props: {},
    computed: {
      title() {
        return '[' + this.primary.warehouse.name + ' ' + this.primary.formatCreateTime +  ' ' + this.typeName+"]";
      },
       typeName(){
        if ( this.primary.type == "iin"){
          return "盘盈单";
        }
        if ( this.primary.type == "iout"){
          return "盘亏单";
        }
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
            .get(`/inventories/${this.primaryId}?relations=${JSON.stringify(["warehouseStock","storageLocation","warehouse"])}`)
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
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .title {
    font-size: 14px;
    font-weight: bold;
  }

</style>

