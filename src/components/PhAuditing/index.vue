<template>

  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="50%"
             top="20vh"
             :visible.sync="dialogVisible">

    <!-- 编辑表单 TODO:-->
    <el-form :rules="rules" status-icon
             ref="editObject" label-position="right"
             label-width="80px"
    >

      <el-form-item label="说明" prop="note">
        <div slot="label">
          <el-tooltip class="item" effect="light" content="说明信息。支持换行！" placement="right">
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
          说明:
        </div>
        <el-input type="textarea" v-model="note"
                  maxlength="500"
                  show-word-limit
                  rows="5"
                  cols="40"
                  show-word-limit></el-input>
      </el-form-item>


    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave" size="mini" :loading="confirmLoading">确 认</el-button>
      <el-button @click="dialogVisible = false" size="mini" >取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>

  export default {
    components: {},
    props: {},

    data() {
      return {
        type: "commit",
        //Dialog 是否开启
        dialogVisible: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,
        note: "", //选择的状态
        rules: {}
      }
    },

    created() {
    },

    computed: {
      dialogTitle() {
        if (this.type == 'commit') {
          return "提交审核";
        }
        else if (this.type == 'agree') {
          return "审核通过";
        }
        else if (this.type == 'refuse') {
          return "审核拒绝";
        }
      }
    },

    watch: {},

    mounted() {
      this.$nextTick(() => {
      });
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据
      initData() {

      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog(type) {
        this.dialogVisible = true;
        this.type = type;
        this.initData();
      },

      closeDialog() {
        this.dialogVisible = false;
        this.note = ' ';
      },

      // 保存
      onSave() {
        this.confirmLoading = true
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("saveAuditCBEvent", this.note ? this.note : " ", this.type);
        this.confirmLoading = false;
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>
  .el-scrollbar {
    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
</style>

