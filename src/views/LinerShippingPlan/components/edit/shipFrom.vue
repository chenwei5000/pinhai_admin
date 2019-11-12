<template>

  <div class="ph-form">
    <el-form
      :rules="rules"
      :model="editObject"
      status-icon
      inline
      ref="editObject"
      label-position="right"
      label-width="120px"
      v-loading="loading"
      inline-message>
      <el-row>
        <el-col :md="8">
          <el-form-item :label="editObject.type=='空运'? '航空公司' : '船运公司'" prop="carrier">
            <el-input v-model="editObject.carrier"
                      maxlength="40"
                      show-word-limit
                      size="mini"
                      @input="updateInput"
                      style="width: 200px"
                      placeholder="请填写"
                      clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="货代公司" prop="forwardingCompany">
            <el-input v-model="editObject.forwardingCompany"
                      maxlength="40"
                      show-word-limit
                      size="mini"
                      @input="updateInput"
                      style="width: 200px"
                      placeholder="请填写"></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="截单时间" prop="bookingClosingTime" label-width="120px">
            <el-date-picker v-model="editObject.bookingClosingTime"
                            type="datetime"
                            size="mini"
                            @input="updateInput"
                            style="width: 200px"
                            placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>

        <el-col :md="8">
          <el-form-item label="目的港口">
            <el-input v-model="editObject.portOfDestination"
                      maxlength="40"
                      show-word-limit
                      size="mini"
                      @input="updateInput"
                      style="width: 200px"
                      placeholder="请填写"></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="船名航次">
            <el-input v-model="editObject.vesselName"
                      maxlength="40"
                      show-word-limit
                      size="mini"
                      @input="updateInput"
                      style="width: 200px"
                      placeholder="请填写"></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="物流单号">
            <el-input v-model="editObject.so"
                      maxlength="40"
                      show-word-limit
                      size="mini"
                      @input="updateInput"
                      style="width: 200px"
                      placeholder="请填写"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>

        <el-col :md="8">
          <el-form-item label="提单号">
            <el-input v-model="editObject.ladingBillNumber"
                      maxlength="40"
                      show-word-limit
                      size="mini"
                      @input="updateInput"
                      style="width: 200px"
                      placeholder="请填写"></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="箱号">
            <el-input v-model="editObject.boxNumber"
                      maxlength="40"
                      show-word-limit
                      size="mini"
                      @input="updateInput"
                      style="width: 200px"
                      placeholder="请填写"></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="封条号">
            <el-input v-model="editObject.sealNumber"
                      maxlength="40"
                      show-word-limit
                      size="mini"
                      @input="updateInput"
                      style="width: 200px"
                      placeholder="请填写"></el-input>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :md="8">
          <el-form-item label="截港时间" prop="cyClosingTime" label-width="120px">
            <el-date-picker v-model="editObject.cyClosingTime"
                            type="datetime"
                            size="mini"
                            @input="updateInput"
                            style="width: 200px"
                            placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="预计到港时间" prop="etaTime" label-width="120px">
            <el-date-picker v-model="editObject.etaTime"
                            type="datetime"
                            size="mini"
                            @input="updateInput"
                            style="width: 200px"
                            placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="预约送仓时间" prop="bookingTime" label-width="120px">
            <el-date-picker v-model="editObject.bookingTime"
                            type="datetime"
                            size="mini"
                            @input="updateInput"
                            style="width: 200px"
                            placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="物流备注">
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 4}"
          placeholder="请输入内容"
          size="mini"
          @input="updateInput"
          maxlength="200"
          show-word-limit
          v-model="editObject.shipDetail"
          style="width:500px"
        ></el-input>
      </el-form-item>

      <el-row>
        <el-col :md="24">
          <el-row type="flex" justify="center">
            <el-button type="primary" size="mini" style="margin-top: 20px" :loading="confirmLoading" @click="onSave"
                       v-if="hasEdit">
              保存物流信息
            </el-button>
          </el-row>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>


<script>

  import {checkPermission} from "../../../../utils/permission";

  export default {
    props: {
      primary: {
        type: [Object],
        default: {}
      }
    },
    computed: {
      hasEdit() {
        return checkPermission('LinerShippingPlanResource_shipDate');
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },

    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 编辑对象 TODO
        editObject: {},

        rules: {
          carrier: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          forwardingCompany: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          bookingClosingTime: [
            {required: true, message: "必填", trigger: "blur"}
          ]
        }
      };
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
          this.loading = false;
        }
        else {
          this.$message.error("无效的物流计划!");
          this.loading = false;
        }
      },

      updateInput(val) {
        this.$forceUpdate();
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 保存对象 */
      onSave() {
        this.$refs.editObject.validate(valid => {
          if (!valid) {
            return false;
          }
          this.modifyObject();
        });
      },

      // 修改采购单
      modifyObject() {
        let _object = JSON.parse(JSON.stringify(this.editObject));

        const loading = this.$loading({
          lock: true,
          text: '保存中..',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.global.axios.put(`/linerShippingPlans/shipDate/${this.editObject.id}`, _object)
          .then(resp => {
            let _newObject = resp.data;
            this.$message({type: 'success', message: '操作成功'});
            loading.close();
            // 回传消息
            this.$emit("modifiedInfoCBEvent", _newObject);
          })
          .catch(err => {
            loading.close();
          })
      }
    },
  };
</script>


<style>
</style>
