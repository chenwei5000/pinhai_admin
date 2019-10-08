<template>

  <!-- 编辑表单 TODO:-->
  <el-form :rules="rules" :model="editObject" status-icon inline
           ref="editObject" label-position="right"
           v-if="initComplete"
           label-width="120px"
           v-loading="loading"
  >
    <el-row>
      <el-col :md="8">
        <el-form-item label="编码" prop="code">
          <span style="font-size: 12px">{{editObject.code}}</span>
        </el-form-item>
      </el-col>
      <el-col :md="8">
        <el-form-item label="预计到货时间" prop="expectTime">
          <span style="font-size: 12px">{{editObject.formatExpectTime}}</span>
        </el-form-item>
      </el-col>
      <el-col :md="8">
        <el-form-item label="收货日期" prop="receivedTime">
          <span style="font-size: 12px">{{editObject.formatReceivedTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="8">
        <el-form-item label="发货仓库" prop="fromWarehouseId">
          <span style="font-size: 12px">{{editObject.fromWarehouse.name}}</span>
        </el-form-item>
      </el-col>

      <el-col :md="8">
        <el-form-item label="收货仓库" prop="toWarehouseId">
          <span style="font-size: 12px">{{editObject.toWarehouse.name}}</span>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="8">
        <el-form-item label="物流单号" prop="trackNumber">
          <span style="font-size: 12px">{{editObject.trackNumber?editObject.trackNumber : '无'}}</span>
        </el-form-item>
      </el-col>

      <el-col :md="8">
        <el-form-item label="物流公司" prop="channel">
          <span style="font-size: 12px">{{editObject.channel?editObject.channel : '无'}}</span>
        </el-form-item>
      </el-col>

      <el-col :md="8">
        <el-form-item label="车牌" prop="plateNumber">
          <span style="font-size: 12px">{{editObject.plateNumber?editObject.plateNumber : '无'}}</span>
        </el-form-item>
      </el-col>

    </el-row>
    <el-row>
      <el-col :md="8">
        <el-form-item label="联系人" prop="linkman">
          <span style="font-size: 12px">{{editObject.linkman?editObject.linkman : '无'}}</span>
        </el-form-item>
      </el-col>
      <el-col :md="8">
        <el-form-item label="电话" prop="tel">
          <span style="font-size: 12px">{{editObject.tel?editObject.tel : '无'}}</span>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="24">
        <el-form-item label="备注" prop="remark">
          <div style="font-size: 12px" v-html="editObject.formatRemark"></div>
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>

</template>

<script>

  import warehouseModel from '../../../../api/warehouse'
  import {intArrToStrArr} from '@/utils'
  import supplierModel from "../../../../api/supplier"

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
        if ([6].indexOf(this.primary.status) > -1) {
          return false;
        }
        else {
          return true;
        }

      },
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

