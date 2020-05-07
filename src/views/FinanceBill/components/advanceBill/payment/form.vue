<template>

  <div class="ph-form">
    <!-- 编辑表单 TODO:-->
    <el-form :rules="rules" :model="editObject" status-icon inline
             ref="editObject"
             label-position="right"
             label-width="120px"
             v-loading="loading"
             v-if="initComplete"
             inline-message
    >

      <el-row>
        <el-col :md="12">
          <el-form-item label="本次实付金额" prop="paymentAmount">

            <el-input v-model.trim="editObject.paymentAmount"
                      size="mini"
                      style="width: 200px" placeholder="本次实付金额" clearable></el-input>

          </el-form-item>
        </el-col>


        <el-col :md="12">
          <el-form-item label="金额大写">
              <span style="font-size: 12px"  v-if="editObject.paymentAmount">
                  {{this.editObject.currency.name}} {{editObject.paymentAmount | money}}
              </span>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="付款说明">
            <el-input v-model="editObject.note" type="textarea"
                      :autosize="{minRows: 2, maxRows: 2}" style="width: 300px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>

</template>

<script>

  import {currency, money, intArrToStrArr, parseTime} from '@/utils'
  import validRules from '@/components/validRules'

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
    filters: {
      currency: currency,
      money: money
    },


    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        initComplete: false,

        accountSelectOptions: [],

        // 编辑对象 TODO
        editObject: {},

        // 字段验证规则 TODO:
        rules: {
          paymentAmount: [
            validRules.required,
            validRules.number
          ]
        },
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
          this.editObject = JSON.parse(JSON.stringify(this.primary));
          this.initComplete = true;
          this.loading = false;
        }
        else {
          this.$message.error("无效的采购预付款单!");
          this.loading = false;
        }
      },

      /********************* 操作按钮相关方法  ***************************/

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

