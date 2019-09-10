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
                      maxlength="20"
                      show-word-limit
                      size="mini"
                      style="width: 200px"
                      placeholder="请填写"
                      clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="货代公司" prop="forwardingCompany">
            <el-input v-model="editObject.forwardingCompany"
                      maxlength="20"
                      show-word-limit
                      size="mini"
                      style="width: 200px"
                      placeholder="请填写"></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="目的港口">
            <el-input v-model="editObject.portOfDestination"
                      maxlength="20"
                      show-word-limit
                      size="mini"
                      style="width: 200px"
                      placeholder="请填写"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>

        <el-col :md="8">
          <el-form-item label="船名航次">
            <el-input placeholder v-model="editObject.vesselName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="物流单号">
            <el-input placeholder v-model="editObject.so"></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="提单号">
            <el-input placeholder v-model="editObject.ladingBillNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="箱号">
        <el-input placeholder v-model="editObject.boxNumber"></el-input>
      </el-form-item>

      <el-form-item label="封条号">
        <el-input placeholder v-model="editObject.sealNumber"></el-input>
      </el-form-item>

      <el-form-item label="FBA ID">
        <el-input placeholder v-model="editObject.shipmentId" readonly></el-input>
      </el-form-item>

      <el-form-item label="Reference ID">
        <el-input placeholder v-model="editObject.referenceId" readonly></el-input>
      </el-form-item>
      <el-form-item label="开船时间" prop="etdTime">
        <el-date-picker v-model="editObject.etdTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>

      <el-form-item label="截单时间" prop="bookingClosingTime" label-width="120px">
        <el-date-picker v-model="editObject.bookingClosingTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="截港时间" prop="cyClosingTime" label-width="120px">
        <el-date-picker v-model="editObject.cyClosingTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="预计到港时间" prop="etaTime" label-width="120px">
        <el-date-picker v-model="editObject.etaTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>

      <el-form-item label="预约送仓时间" prop="bookingTime" label-width="120px">
        <el-date-picker v-model="editObject.bookingTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>

      <el-form-item label="订船备注">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="editObject.shipDetail"
          style="width:500px"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
  import planModel from "@/api/linerShippingPlan";
  // loading 组件
  import {Loading} from "element-ui";

  let loadingInstance = null;

  const showLoading = () => {
    loadingInstance = Loading.service({fullscreen: true});
  };
  const closeLoding = () => {
    if (loadingInstance) {
      loadingInstance.close();
    }
  };

  export default {
    props: {
      primary: {
        type: [Object],
        default: {}
      }
    },
    computed: {
      hasEdit() {
        return true;
      }
    },
    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 选择框 TODO:
        fromWarehouses: [],
        toWarehouses: [],
        harbours: [],
        categorys: [],
        users: [],

        // 编辑对象 TODO
        editObject: {},

        form: {
          carrier: "",
          forwardingCompany: "",
          portOfDestination: "",
          vesselName: "",
          so: "",
          etdTime: "",
          ladingBillNumber: "",
          boxNumber: "",
          sealNumber: "",
          bookingClosingTime: "",
          cyClosingTime: "",
          etaTime: "",
          bookingTime: "",
          shipmentId: "",
          referenceId: ""
        },
        rules: {
          etdTime: [
            {required: true, message: "开船时间不能为空", trigger: "blur"}
          ],
          carrier: [
            {required: true, message: "船运公司不能为空", trigger: "blur"}
          ],
          forwardingCompany: [
            {required: true, message: "货代公司不能为空", trigger: "blur"}
          ],
          bookingClosingTime: [
            {required: true, message: "截单时间不能为空", trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      // 保存修改
      save() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            showLoading();
            this.global.axios
              .put(`/linerShippingPlans/shipDate/${this.event_id}`, this.form)
              .then(data => {
                // 添加新的计划
                if (data.status == 200) {
                  let event = data.data;
                  let title = planModel.generateEventTitle(event);
                  this.$emit("editCalendarEvent", event, title);
                  closeLoding();
                  this.formVisible = false;
                }
              });
          } else {
            return false;
          }
        });
      },
      navigateTo() {
        console.log("跳转");
        this.$router.push({path: "/dashboard"});
      }
    },
    mounted() {
      this.$on("openDialog", id => {
        this.event_id = id;
        this.global.axios.get(`/linerShippingPlans/${id}`).then(data => {
          if (data.status === 200) {
            this.formVisible = true;
            this.form = data.data;
            this.form.etdTime = this.form.formatEtdTime;
            this.form.bookingClosingTime = this.form.formatBookingClosingTime;
            this.form.cyClosingTime = this.form.formatCyClosformatCyClosingTimeingTime;
            this.form.etaTime = this.form.formatEtaTime;
            this.form.bookingTime = this.form.formatBookingTime;
          }
        });
      });
    }
  };
</script>


<style>
</style>
