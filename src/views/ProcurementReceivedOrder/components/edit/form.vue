<template>

  <!-- 编辑表单 TODO:-->
  <el-form :rules="rules" :model="editObject" status-icon inline
           ref="editObject" label-position="right"
           label-width="120px"
           v-loading="loading"
  >

    <el-row>
      <el-col :md="10">
        <el-form-item label="编码" prop="code">
          <el-input v-model="editObject.code" style="width: 220px" :disabled="true"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="14">
        <el-form-item label="预计到货时间" prop="expectTime">
          <el-date-picker
            v-model="editObject.expectTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            :disabled="true"
            placeholder="预计到货时间">
          </el-date-picker>
        </el-form-item>
      </el-col>

    </el-row>

    <el-row>
      <el-col :md="14">
        <el-form-item label="收货日期" prop="receivedTime">
          <el-date-picker
            v-model="editObject.receivedTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择收货日期！！！！">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="10">
        <el-form-item label="供货商" prop="supplierId" >
          <el-select v-model="editObject.supplierId" style="width: 220px" :disabled="true">
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
          <el-select v-model="editObject.warehouseId" style="width: 220px" :disabled="true">
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
      <el-form-item label="物流单号" prop="trackNumber">
        <el-input v-model="editObject.trackNumber"
                  show-word-limit
                  style="width: 220px" placeholder="请填写单号" :disabled="true"></el-input>
      </el-form-item>
        </el-col>

      <el-col :md="14">
        <el-form-item label="物流公司" prop="channel">
          <el-input v-model="editObject.channel"
                    show-word-limit
                    style="width: 220px" :disabled="true"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="10">
        <el-form-item label="车牌" prop="plateNumber">
          <el-input v-model="editObject.plateNumber"
                    show-word-limit
                    style="width: 220px" :disabled="true"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="8">
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="editObject.linkman"
                    show-word-limit
                    style="width: 220px" :disabled="true"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="8">
        <el-form-item label="电话" prop="tel">
          <el-input v-model="editObject.tel"
                    show-word-limit
                    style="width: 220px" :disabled="true"></el-input>
        </el-form-item>
      </el-col>

    </el-row>

    <el-row>
      <el-col :md="24">
        <el-form-item label="备注" prop="remark">
          <el-col :span="22">
            <el-input type="textarea" v-model="editObject.remark"
                      maxlength="500"
                      show-word-limit
                      rows="3"
                      cols="80"
                      :disabled="true"
                      show-word-limit></el-input>
          </el-col>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="24">
        <el-row type="flex" justify="center">
          <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onSave" v-if="hasEdit">
            保存基本信息
          </el-button>
        </el-row>
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
        if ([0, 8].indexOf(this.primary.status) > -1) {
          return false;
        }
        else {
          return true;
        }
      },
    },

    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 选择框 TODO:

        warehouseSelectOptions: [],
        supplierSelectOptions: [],


        // 编辑对象 TODO
        editObject: {
          id: null,
          code: null,
          warehouseId: null,
          supplierId: null,
          remark: null,
          trackNumber: null,
          expectTime: null,
          linkman: null,
          receivedTime: null,
        },

        // 字段验证规则 TODO:
        rules: {

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
          this.editObject = this.primary;
          //转化时间
          this.editObject.expectTime = this.primary.formatExpectTime;
          this.editObject.receivedTime = this.primary.formatReceivedTime;


          //转化仓库
          this.editObject.warehouseId = this.editObject.warehouseId + '';
          this.editObject.supplierId = this.editObject.supplierId + '';

          this.warehouseSelectOptions = warehouseModel.getSelectDomesticOptions();
          this.supplierSelectOptions = supplierModel.getSelectOptions();

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
          this.$message.error("无效!");
          this.loading = false;
        }
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 保存对象 */
      onSave() {
        this.global.axios.put(`/procurementReceivedOrderItems/${this.primary}`,this.primary)
          .then(resp => {
            this.$message.info("保存成功");
            this.loading = false;
            this.confirmLoading = false;
            this.dialogVisible = false;
            this.$emit("modifyCBEvent", resp.data);

          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
          })
      },

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

