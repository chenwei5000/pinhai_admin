<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" class="ph-dialog" @close='closeDialog'
             width="80%"
             top="2vh">
    <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" :primary="primary"></infoFrom>
  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import infoFrom from './from'
  import {checkPermission} from "@/utils/permission";

  export default {
    components: {
      infoFrom
    },
    props: {},
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),

      hasEdit() {
        return checkPermission('ProductResource_update');
      },

      title() {
        return this.primaryId ? (this.hasEdit ? "编辑产品" : "查看产品") : "添加产品";
      }
    },

    data() {
      return {
        primaryId: null,  //主ID
        primary: {}, //主对象
        relations: ["category", "supplier", "cartonSpec", "currency", "declareConfig"],  // 关联对象
        primaryComplete: false,
        logComplete: false,
        dialogVisible: false, //Dialog 是否开启
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
          let url = `/products/${this.primaryId}`;
          if (this.relations && this.relations.length > 0) {
            url += "?relations=" + JSON.stringify(this.relations);
          }
          this.global.axios.get(url)
            .then(resp => {
              let res = resp.data;
              this.primary = res || {};
              this.primary.categoryId = res.categoryId + "";
              this.primary.cartonSpecId = res.cartonSpecId + "";
              this.primary.supplierId = res.supplierId + "";
              this.primary.vipLevel = res.vipLevel + "";
              this.dialogVisible = true;
              this.primaryComplete = true;
            })
            .catch(err => {
            })
        }
      },

      /* 开启弹出编辑框 需要传主键ID */
      openDialog(primaryId) {
        this.primaryId = primaryId;
        this.initData();
      },
      closeDialog() {
        this.primary = {};
        this.primaryId = null;
        this.dialogVisible = false;
        this.primaryComplete = false;
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.initData();
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

