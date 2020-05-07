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
        <el-form-item label="调拨单编码" prop="code">
          <span style="font-size: 12px">{{editObject.code}}</span>
        </el-form-item>
      </el-col>
      <el-col :md="8">
        <el-form-item label="发船日期" prop="linerShippingPlanFormatEtdTime">
          <span style="font-size: 12px">{{editObject.linerShippingPlan.formatEtdTime}}</span>
        </el-form-item>
      </el-col>
      <el-col :md="8">
        <el-form-item label="货柜编号" prop="linerShippingPlanCode">
          <span style="font-size: 12px">{{editObject.linerShippingPlan.code}}</span>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="8">
        <el-form-item label="FBA ID" prop="linerShippingPlanShipmentId">
          <span style="font-size: 12px">{{editObject.linerShippingPlan.shipmentId}}</span>
        </el-form-item>
      </el-col>

      <el-col :md="8">
        <el-form-item label="发船港口" prop="linerShippingPlanPortOfLoading">
          <span style="font-size: 12px">{{editObject.linerShippingPlan.portOfLoading}}</span>
        </el-form-item>
      </el-col>

      <el-col :md="8">
        <el-form-item label="出口品类" prop="linerShippingPlanCategoryName">
          <span style="font-size: 12px">{{editObject.linerShippingPlan.categoryName}}</span>
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

      <el-col :md="8">
        <el-form-item label="收货仓库标识" prop="linerShippingPlanDestinationFulfillmentCenterId">
          <span style="font-size: 12px">{{editObject.linerShippingPlan.destinationFulfillmentCenterId}}</span>
        </el-form-item>
      </el-col>

    </el-row>
    <el-row>
      <el-col :md="8">
        <el-form-item label="负责人" prop="linerShippingPlanMerchandiser">
          <span style="font-size: 12px">{{editObject.linerShippingPlan.merchandiser}}</span>
        </el-form-item>
      </el-col>
      <el-col :md="8">
        <el-form-item label="船运公司" prop="linerShippingPlanCarrier">
          <span style="font-size: 12px">{{editObject.linerShippingPlan.carrier?editObject.linerShippingPlan.carrier:'无'}}</span>
        </el-form-item>
      </el-col>
      <el-col :md="8">
        <el-form-item label="货代公司" prop="linerShippingPlanForwardingCompany">
          <span style="font-size: 12px">{{editObject.linerShippingPlan.forwardingCompany?editObject.linerShippingPlan.forwardingCompany:'无'}}</span>
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

