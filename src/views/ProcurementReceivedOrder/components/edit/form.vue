<template>

  <!-- 编辑表单 TODO:-->
  <el-form :rules="rules" :model="editObject" status-icon inline
           ref="editObject" label-position="right"
           label-width="120px"
           v-loading="loading"
  >
    <el-col :md="14">
      <el-form-item label="编码" prop="code">
        <el-input v-model="editObject.code"
                  show-word-limit
                  style="width: 220px" placeholder="请填写编码" clearable></el-input>
      </el-form-item>
    </el-col>

    <el-row>
      <el-col :md="10">
        <el-form-item label="供货商" prop="supplierId">
          <el-select v-model="editObject.supplierId" style="width: 220px"  placeholder="请选择供货商">
            <el-option
              v-for="(item , idx)  in supplierSelectOptions"
              :label="item.label"
              :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>

        </el-form-item>
      </el-col>

      <el-col :md="14">
        <el-form-item label="收货仓库" prop="warehouseId">
          <el-select v-model="editObject.warehouseId" style="width: 220px"
                      placeholder="请选择收货仓库">
            <el-option
              v-for="(item , idx)  in warehouseSelectOptions"
              :label="item.label"
              :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="10">
        <el-form-item label="预计到货日期" prop="limitTime">
          <el-date-picker
            v-model="editObject.limitTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="预计到货日期"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="24">
        <el-form-item label="物流信息" prop="logisticsInformation">
          <el-col :span="22">
            <el-input type="textarea" v-model="editObject.logisticsInformation"
                      maxlength="500"
                      show-word-limit
                      rows="3"
                      cols="80"
                      show-word-limit></el-input>
          </el-col>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="24">
        <el-form-item label="备注" prop="note">
          <el-col :span="22">
            <el-input type="textarea" v-model="editObject.note"
                      maxlength="500"
                      show-word-limit
                      rows="3"
                      cols="80"
                      show-word-limit></el-input>
          </el-col>

          <el-col :span="2">
            <el-tooltip class="item" effect="light" content="备注信息。支持换行！" placement="right">
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>
          </el-col>

        </el-form-item>
      </el-col>
    </el-row>



  </el-form>

</template>

<script>

  import warehouseModel from '@/api/warehouse'
  import supplierModel from '@/api/supplier'
  import systemModel from '@/api/system'
  import {intArrToStrArr} from '@/utils'

  export default {
    components: {},
    props: {
      primary: {
        type: [Object],
        default: {}
      }
    },
    computed: {},

    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 选择框 TODO:
        supplierSelectOptions:[],
        warehouseSelectOptions: [],


        // 编辑对象 TODO
        editObject: {
          id: null,
          supplierId: null,
          warehouseId: null,
          limitTime: null,
          executeTime: null,
          note: null,
          code: null,
          logisticsInformation: null
        },

        // 字段验证规则 TODO:

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
        if (this.primary) {
          //获取计划数据
          this.editObject = this.primary;
          //转化时间
          this.editObject.limitTime = this.primary.formatLimitTime;
          this.editObject.executeTime = this.primary.formatExecuteTime;

          //转化仓库
          this.editObject.warehouseId = this.primary.warehouseId ? intArrToStrArr(this.primary.warehouseId.split(",")) : [];
          this.warehouseSelectOptions = warehouseModel.getSelectOptions();

          //转化供货商
          this.editObject.supplierId = this.primary.supplierId ? intArrToStrArr(this.primary.supplierId.split(",")) : [];
          this.supplierSelectOptions = supplierModel.getSelectOptions();

          //设置默认安全库存
          systemModel.getConfigInfos().then(data => {
            if (this.editObject.safetyStockWeek == null) {
              this.editObject.safetyStockWeek = data.safetyStockWeek;
            }
            if (this.editObject.vip1SafetyStockWeek == null) {
              this.editObject.vip1SafetyStockWeek = data.vip1SafetyStockWeek;
            }
            if (this.editObject.vip2SafetyStockWeek == null) {
              this.editObject.vip2SafetyStockWeek = data.vip2SafetyStockWeek;
            }
          });

          let flg = true;
          this.warehouseSelectOptions.forEach(obj => {
            if (obj.value == "-99") {
              flg = false;
            }
          });

          if (flg) {
            this.warehouseSelectOptions.unshift({label: '供货商库存', value: "-99"})
          }
          this.loading = false;
        }
        else {
          this.$message.error("无效的采购计划!");
          this.loading = false;
        }
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 保存对象 */

      // 创建计划

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

