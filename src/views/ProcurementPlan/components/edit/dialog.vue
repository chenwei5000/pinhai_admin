<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" fullscreen>

    <el-row style="margin-bottom: 20px;">

      <el-button type="primary" icon="el-icon-s-check" v-if="primary.status == 1" @click="onCommit">提交审核</el-button>
      <el-button type="success" icon="el-icon-success" v-if="primary.status == 0" @click="onAgree">同意</el-button>
      <el-button type="warning" icon="el-icon-error" v-if="primary.status == 0"  @click="onRefuse">不同意</el-button>

      <el-button type="primary" icon="el-icon-refresh-left" v-if="primary.status != 1" @click="onWithdraw">撤回</el-button>
      <el-button type="success" icon="el-icon-s-claim" v-if="hasExecute" @click="onComplete">结束计划</el-button>

      <el-button type="primary" icon="el-icon-user-solid" v-if="hasExecute" @click="onWithdraw">指派处理人</el-button>
      <el-button type="primary" icon="el-icon-s-goods" v-if="hasExecute" @click="onWithdraw">交接工作</el-button>
      <el-button type="primary" icon="el-icon-share" v-if="hasExecute" @click="onWithdraw">分享</el-button>


    </el-row>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" :primary="primary"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 采购计划内容</div>
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
  import infoFrom from './from'
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
      hasExecute(){
        if([2,3,4,5,6,7].indexOf(this.primary.status) > -1){
          return true;
        }
        else{
          return false;
        }
      },
      title(){
        return '编辑采购计划 [' + this.primary.name + '] -- (' + this.primary.statusName + "状态)";
      }
    },

    data() {
      return {
        primaryId: null,  //主ID
        primary: {}, //主对象
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
          //获取计划数据
          this.global.axios
            .get(`/procurementPlans/${this.primaryId}`)
            .then(resp => {
              let res = resp.data;
              this.primary =  res || {};
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
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .title {
    font-size: 14px;
    font-weight: bold;
  }

</style>

