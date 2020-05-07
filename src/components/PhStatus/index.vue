<template>

  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="50%"
             top="20vh"
             :visible.sync="dialogVisible">

    <!-- 编辑表单 TODO:-->
    <el-form :rules="rules" status-icon inline
             ref="editObject" label-position="right"
             label-width="120px"
    >

      <el-form-item label="状态" prop="selStatus">
        <el-select v-model="selStatus" style="width: 220px"
                   filterable placeholder="请选择状态">
          <el-option
            v-for="(item , idx)  in status"
            :label="item.label"
            :value="item.value"
            :key="idx"
          ></el-option>
        </el-select>

      </el-form-item>


    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave" size="mini" :loading="confirmLoading">保 存</el-button>
      <el-button @click="dialogVisible = false" size="mini" >取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>
  import phEnumModel from '@/api/phEnum'

  export default {
    components: {},
    props: {
      dialogTitle: {
        type: String,
        default: "修改状态"
      },
      statusName: {
        type: String,
        default: ""
      },
      objStatus:{
        type: [Number,String],
        default: ""
      }
    },

    data() {
      return {
        status: [], // 状态列表
        //Dialog 是否开启
        dialogVisible: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,
        selStatus: null, //选择的状态
        rules: {
          selStatus: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
        }
      }
    },

    created() {
    },

    computed: {},

    watch: {},

    mounted() {
      this.$nextTick(() => {
      });
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据
      initData() {
        this.status = phEnumModel.getSelectOptions(this.statusName);
        this.selStatus = this.objStatus + '';
      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog() {
        this.dialogVisible = true;
        this.initData();
      },

      closeDialog() {
        this.dialogVisible = false;
      },

      // 保存
      onSave() {
        this.confirmLoading = true;
        if (!this.selStatus) {
          this.$message.error("请选择状态");
          return;
        }
        this.confirmLoading = false;
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("saveStatusCBEvent", this.selStatus);

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

