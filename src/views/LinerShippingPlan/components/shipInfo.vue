<template>
  <el-dialog title :visible.sync="formVisible" width="65%">
    <fieldset class="panel-heading">
      <legend class="panel-title">订船信息</legend>
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
        :inline="true"
      >
        <el-form-item label="船运公司" prop="carrier">
          <el-input placeholder v-model="form.carrier"></el-input>
        </el-form-item>

        <el-form-item label="货代公司" prop="forwardingCompany">
          <el-input placeholder v-model="form.forwardingCompany"></el-input>
        </el-form-item>

        <el-form-item label="目的港口">
          <el-input placeholder v-model="form.portOfDestination"></el-input>
        </el-form-item>

        <el-form-item label="船名航次">
          <el-input placeholder v-model="form.vesselName"></el-input>
        </el-form-item>

        <el-form-item label="物流单号">
          <el-input placeholder v-model="form.so"></el-input>
        </el-form-item>

        <el-form-item label="提单号">
          <el-input placeholder v-model="form.ladingBillNumber"></el-input>
        </el-form-item>

        <el-form-item label="箱号">
          <el-input placeholder v-model="form.boxNumber"></el-input>
        </el-form-item>

        <el-form-item label="封条号">
          <el-input placeholder v-model="form.sealNumber"></el-input>
        </el-form-item>

        <el-form-item label="FBA ID">
          <el-input placeholder v-model="form.shipmentId" readonly></el-input>
        </el-form-item>

        <el-form-item label="Reference ID">
          <el-input placeholder v-model="form.referenceId" readonly></el-input>
        </el-form-item>
        <el-form-item label="开船时间" prop="etdTime">
          <el-date-picker v-model="form.etdTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>

        <el-form-item label="截单时间" prop="bookingClosingTime" label-width="120px">
          <el-date-picker v-model="form.bookingClosingTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="截港时间" prop="cyClosingTime" label-width="120px">
          <el-date-picker v-model="form.cyClosingTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="预计到港时间" prop="etaTime" label-width="120px">
          <el-date-picker v-model="form.etaTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>

        <el-form-item label="预约送仓时间" prop="bookingTime" label-width="120px">
          <el-date-picker v-model="form.bookingTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>

        <el-form-item label="订船备注">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="form.shipDetail"
            style="width:500px"
          ></el-input>
        </el-form-item>
      </el-form>
    </fieldset>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import harbourModel from "../../../api/harbour";
import categoryModel from "../../../api/category";
import userModel from "../../../api/user";
import planModel from "../../../api/linerShippingPlan";

// loading 组件
import { Loading } from "element-ui";

let loadingInstance = null;

const showLoading = () => {
  loadingInstance = Loading.service({ fullscreen: true });
};
const closeLoding = () => {
  if (loadingInstance) {
    loadingInstance.close();
  }
};

export default {
  props: {},

  data() {
    return {
      fromWarehouses: [],
      toWarehouses: [],
      harbours: [],
      categorys: [],
      users: [],
      formVisible: false,

      event_id: "",

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
          { required: true, message: "开船时间不能为空", trigger: "blur" }
        ],
        carrier: [
          { required: true, message: "船运公司不能为空", trigger: "blur" }
        ],
        forwardingCompany: [
          { required: true, message: "货代公司不能为空", trigger: "blur" }
        ],
        bookingClosingTime: [
          { required: true, message: "截单时间不能为空", trigger: "blur" }
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
          console.log("error submit!!");
          return false;
        }
      });
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
