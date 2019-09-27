<template>

  <div class="ph-form">
    <!-- 编辑表单 TODO:-->
    <el-form :rules="rules" :model="editObject" status-icon inline
             ref="editObject"
             label-position="right"
             label-width="120px"
             v-loading="loading"
             inline-message
             v-if="initComplete"
    >


      <fieldset class="panel-heading">
        <legend class="panel-title">交货要求
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              销售对采购计划的要求
            </div>
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </legend>

        <el-row v-html="primary.procurementPlan.formatNote" v-if="primary.procurementPlan.note">
        </el-row>
        <el-row v-else>
          无
        </el-row>
      </fieldset>

      <fieldset class="panel-heading">
        <legend class="panel-title">预计完成日期
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              采购单预计的完成日期，由跟单确认
            </div>
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </legend>

        <el-row>
          <span style="font-size: 12px">{{ editObject.formatOtdTime ? editObject.formatOtdTime : '无'}}</span>
        </el-row>
      </fieldset>

      <fieldset class="panel-heading" style="margin-top: 15px">
        <legend class="panel-title">采购单信息
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              采购单相关信息
            </div>
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </legend>

        <el-row>
          <el-col :md="8">
            <el-form-item label="供货商" prop="supplierId">
              <span style="font-size: 12px">{{editObject.supplier.name}}</span>
            </el-form-item>
          </el-col>

          <el-col :md="8">
            <el-form-item label="收货仓库" prop="warehouseId">
              <span style="font-size: 12px">{{ editObject.warehouse.name}}</span>
            </el-form-item>
          </el-col>

          <el-col :md="8">
            <el-form-item label="名称" prop="name">
              <span style="font-size: 12px">{{ editObject.name}}</span>
            </el-form-item>
          </el-col>
        </el-row>

      </fieldset>

    </el-form>
  </div>

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
      hasEdit() {
        // 控制按钮
        if ([0, 8].indexOf(this.primary.status) > -1) {
          return false;
        }
        else {
          return true;
        }
      },
      hasCategory() {
        if (this.editObject.categoryId == null || this.editObject.categoryId.length == 0) {
          return true;
        }
        else {
          return false;
        }
      }
    },

    data() {
      return {
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
        try {
          if (this.primary) {
            //获取计划数据
            this.editObject = JSON.parse(JSON.stringify(this.primary));
            console.log(this.editObject);
            this.initComplete = true;
            this.loading = false;
          }
          else {
            this.$message.error("无效的采购计划!");
            this.loading = false;
          }
        }
        catch (e) {
          console.log(e);
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

  .el-form-item {
    //margin-bottom: 7px;
  }

</style>

