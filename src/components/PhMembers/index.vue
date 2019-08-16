<template>

  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="80%"
             top="20px"
             :visible.sync="dialogVisible">

    <div class="custom-tree-container">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>

      <div class="block" style="height: 400px;">
        <el-scrollbar style="height: 100%">
          <!-- 成员树 -->
          <el-tree
            :data="data"
            show-checkbox
            ref="tree"
            node-key="id"
            icon-class="el-icon-s-home"
            :default-expanded-keys="expandedNodes"
            :default-expand-all="false"
            :filter-node-method="filterNode"
            :check-on-click-node="true"
            v-loading="loading">
          </el-tree>
        </el-scrollbar>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave" :loading="confirmLoading" >保 存</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>

  export default {
    components: {},
    props: {
      dialogTitle: {
        type: String,
        default: "选择成员"
      }
    },

    data() {
      return {
        filterText: '',
        //Dialog 是否开启
        dialogVisible: false,
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,
        // 资源URL
        url: "/departments/members",
        relations: null,  // 关联对象
        userId: [], //用户ID
        data: [], //数据
      }
    },

    created() {
    },


    computed: {
      expandedNodes() {
        if (this.data && this.data.length > 0) {
          let arr = [];
          arr.push(this.data[0].id);
          return arr;
        }
      }
    },

    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },

    mounted() {
      this.$nextTick(() => {
      });
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据
      initData() {

        this.loading = true
        //获取数据
        this.global.axios
          .get(this.url)
          .then(resp => {
            let res = resp.data
            let data = res || []
            this.data = data
            this.loading = false
          })

      },

      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
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
        let checkedNodes = this.$refs.tree.getCheckedNodes();
        if (checkedNodes == null || checkedNodes.length <= 0) {
          this.$message.error("请选择人员");
          return;
        }
        let ids = [];
        checkedNodes.forEach(node => {
          ids.push(node.id);
        });
        this.confirmLoading = false;
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("saveCBEvent", ids);

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

