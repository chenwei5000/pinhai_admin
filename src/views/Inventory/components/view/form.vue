<template>

  <!-- 编辑表单 TODO:-->
  <el-form :rules="rules" :model="editObject" status-icon inline
           ref="editObject" label-position="right"
           v-if="initComplete"
           label-width="120px"
           v-loading="loading"
  >
    <el-row>
      <el-col :md="12">
        <el-form-item label="编码" prop="code">
          <span style="font-size: 12px">{{editObject.code}}</span>
        </el-form-item>
      </el-col>
      <el-col :md="12">
        <el-form-item label="类型" prop="type">
          <span style="font-size: 12px">{{typeName}}</span>
        </el-form-item>
      </el-col>

    </el-row>

    <el-row>
      <el-col :md="12">
        <el-form-item label="创建时间" prop="createTime">
          <span style="font-size: 12px">{{editObject.formatCreateTime}}</span>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="仓库" prop="warehouseId">
          <span style="font-size: 12px">{{editObject.warehouse.name}}</span>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="12">
        <el-form-item label="创建人" prop="creatorName">
          <span style="font-size: 12px">{{editObject.creator.name}}</span>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="24">
        <el-form-item label="备注" prop="comments">
          <div style="font-size: 12px" v-html="editObject.formatComments"></div>
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>

</template>

<script>

  import {intArrToStrArr} from '@/utils'

  export default {
    components: {},
    props: {
      primary: {
        type: [Object],
        default: {}
      }
    },
    computed: {
      typeName(){
        if ( this.editObject.type == "iin"){
          return "盘盈单";
        }
        if ( this.editObject.type == "iout"){
          return "盘亏单";
        }
      }
    },

    data() {
      return {
        disable: false,
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        initComplete: false,

        // 编辑对象 TODO
        editObject: {},

        // 字段验证规则 TODO:
        rules: {},
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },
    methods: {
      /********************* 基础方法  *****************************/
      /**
       * 初始化数据
       */
      initData() {
        this.loading = true;
        this.initComplete = false;
        if (this.primary) {
          //获取计划数据
          this.editObject = JSON.parse(JSON.stringify(this.primary));
          this.loading = false;
          this.initComplete = true;
        }
        else {
          this.$message.error("无效!");
          this.loading = false;
        }
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .panel-heading {
    color: #444;
    border: 1px #cfd9db solid;
  }

  .panel-title {
    display: table-cell;
    vertical-align: middle;
    padding: 0 10px;
  }

  .ph-table .el-form /deep/ .el-form-item {
    margin-bottom: 0 !important;
  }


</style>

