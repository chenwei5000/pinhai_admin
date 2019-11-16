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
        <legend class="panel-title">采购单相关信息
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              采购单相关信息
            </div>
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </legend>

        <el-row>
          <el-col :md="7">
            <el-form-item label="期望交货日期">
              <b style="font-size: 12px;color: blue">
                {{ editObject.formatOtdTime ? editObject.formatOtdTime : '无'}}
              </b>
              <el-tooltip class="item" effect="light" placement="right">
                <div slot="content">
                  采购期望该商品能全部交完货的日期
                </div>
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="7">
            <el-form-item label="采购单编号">
              <span style="font-size: 12px">{{editObject.code}}</span>
            </el-form-item>
          </el-col>

          <el-col :md="10">
            <el-form-item label="采购单名称" prop="name">
              <span style="font-size: 12px">{{ editObject.name}}</span>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="7">
            <el-form-item label="供货商" prop="supplierId">
              <span style="font-size: 12px">{{editObject.supplier.name}}</span>
            </el-form-item>
          </el-col>

          <el-col :md="7">
            <el-form-item label="收货仓库" prop="warehouseId">
              <span style="font-size: 12px">{{ editObject.warehouse.name}}</span>
            </el-form-item>
          </el-col>

          <el-col :md="10">
            <el-form-item label="结算方式">
              <span style="font-size: 12px">{{ editObject.settlementMethodName}}</span>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="7">
            <el-form-item label="SKU">
              <span style="font-size: 12px">{{orderItem.product.skuCode}}</span>
            </el-form-item>
          </el-col>

          <el-col :md="7">
            <el-form-item label="图片">
              <el-image
                v-if="orderItem.product.imgUrl"
                :z-index="10000"
                style="width: 30px; height: 30px;margin-top: 5px"
                :src="orderItem.product.imgUrl"
                :preview-src-list="[orderItem.product.imgUrl.replace('_SL75_','_SL500_')]" lazy>
              </el-image>
            </el-form-item>
          </el-col>

          <el-col :md="10">
            <el-form-item label="产品名" prop="warehouseId">
              <span style="font-size: 12px">{{orderItem.product.name}}<</span>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :md="7">
            <el-form-item label="未确认箱数">
              <b style="font-size: 12px;color: blue;">{{ orderItem.unOrderCartonQty}}</b>
            </el-form-item>
          </el-col>
          <el-col :md="7">
            <el-form-item label="采购箱数" prop="supplierId">
              <span style="font-size: 12px">{{orderItem.cartonQty}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="10">
            <el-form-item label="已确认箱数" prop="warehouseId">
              <span style="font-size: 12px">{{ orderItem.orderCartonQty}}</span>
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
      },
      orderItem: {
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
            this.editObject = this.primary;
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

