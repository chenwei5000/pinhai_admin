<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" fullscreen>
    <el-row style="margin-bottom: 20px;">
      <el-button type="primary" icon="el-icon-refresh-left" v-if="primary.status == 4" @click="onWithdraw">撤回
      </el-button>
      <el-button type="success" icon="el-icon-s-claim" v-if="primary.status == 3" @click="onComplete">确认发货</el-button>
      <el-button type="primary" icon="el-icon-s-goods" v-if="primary.status == 3" @click="onPrint">打印发货单</el-button>
    </el-row>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" :primary="primary"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 发货计划内容</div>
        <itemTable ref="itemTable" :primary="primary"></itemTable>
      </el-collapse-item>

      <el-collapse-item name="attachment" style="margin-top: 10px">
        <div slot="title" class="title">3. 附件</div>

        <attachment ref="attachment" :primary="primary"></attachment>

      </el-collapse-item>


    </el-collapse>

  </el-dialog>

</template>

<script>
  import infoFrom from './form'
  import itemTable from '../detail/table'
  import attachment from './attachment'

  export default {
    components: {
      infoFrom,
      itemTable,
      attachment
    },
    props: {},
    computed: {
      hasExecute() {
        if ([2, 3, 4, 5, 6, 7].indexOf(this.primary.status) > -1) {
          return true;
        }
        else {
          return false;
        }
      },
      title() {
        return this.action + '发货计划 [' + this.primary.code + '] -- (' + this.primary.statusName + "状态)";
      }
    },

    data() {
      return {
        primaryId: null,  //主ID
        primary: {}, //主对象
        dialogVisible: false, //Dialog 是否开启
        activeNames: ['infoFrom', 'itemTable', 'attachment'],   //折叠面板开启项
        relations: ["supplier", "warehouse"],
        url: "/procurementShippedOrders",
        action: "", //不同状态的动作显示 像 编辑 查看 ...
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
      });
    },
    updated(){
     this.primary.status === 3 ||  this.primary.status === 1?this.action = "编辑": this.action = "查看";
    },
    methods: {
      initData() {
        if (this.primaryId) {
          //获取计划数据
        let url = `${this.url}/${this.primaryId}`;
          if (this.relations && this.relations.length > 0) {
            url += "?relations=" + JSON.stringify(this.relations);
          }
          this.global.axios
            .get(url)
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
        // 默认展开所有折叠面板
        //this.activeNames = ['infoFrom', 'itemTable'];
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("modifyCBEvent", object);
      },
      //打印发货单
      onPrint() {
        console.log("打印了发货单")
      },
      //撤回
      onWithdraw() {
          this.global.axios.put(`/procurementShippedOrders/withdraw/${this.primary.id}`)
          .then(resp => {
            this.$message({type: 'success', message: '操作成功'});
            this.initData();
            this.loading = false;
            this.confirmLoading = false;
            // 回传消息
              this.$emit("modifyCBEvent", 3);
          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
          })
      },
      //确认发货
      onComplete() {
          this.global.axios.put(`/procurementShippedOrders/shippedOrderConfirm/${this.primary.id}`)
          .then(resp => {
            this.$message({type: 'success', message: '操作成功'});
            this.initData();
            this.loading = false;
            this.confirmLoading = false;
            // 回传消息
            this.formVisible = false;
              this.$emit("modifyCBEvent",4);
          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
          })


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

