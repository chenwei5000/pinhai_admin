<template>
  <el-dialog title="创建计划" :visible.sync="formVisible" width="60%">
    <fieldset class="panel-heading">
      <legend class="panel-title">订船信息</legend>
      <el-form
        :model="plan"
        :rules="rules"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
        :inline="true"
      >
        <el-form-item label="开船时间" prop="etdTime">
          <el-date-picker v-model="plan.etdTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>

        <el-form-item label="船运公司">
          <el-input placeholder v-model="plan.code"></el-input>
        </el-form-item>

        <el-form-item label="货代公司">
          <el-input placeholder v-model="plan.code"></el-input>
        </el-form-item>
        
        <el-form-item label="目的港口">
          <el-input placeholder v-model="plan.code"></el-input>
        </el-form-item>

        <el-form-item label="船名航次">
          <el-input placeholder v-model="plan.code"></el-input>
        </el-form-item>
        
        <el-form-item label="物流单号">
          <el-input placeholder v-model="plan.code"></el-input>
        </el-form-item>

        <el-form-item label="提单号">
          <el-input placeholder v-model="plan.code"></el-input>
        </el-form-item>

        <el-form-item label="箱号">
          <el-input placeholder v-model="plan.code"></el-input>
        </el-form-item>

        <el-form-item label="封条号">
          <el-input placeholder v-model="plan.code"></el-input>
        </el-form-item>


      </el-form>
    </fieldset>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formVisible = false">取 消</el-button>
      <el-button type="primary" @click="createPlan">确 定</el-button>
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

      plan: {
        etdTime: "",
        code: "",
        type: "",
        portOfLoading: "",
        fromWarehouseId: "",
        toWarehouseId: "",
        categoryId: [],
        merchandiserId: [],
        pallet: "",
        oversize: "",
        detail: ""
      },
      rules: {
        etdTime: [
          { required: true, message: "开船时间不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "运输方式不能为空", trigger: "blur" }
        ],
        portOfLoading: [
          { required: true, message: "发货港口不能为空", trigger: "blur" }
        ],
        fromWarehouseId: [
          { required: true, message: "发货仓库不能为空", trigger: "blur" }
        ],
        toWarehouseId: [
          { required: true, message: "收货仓库不能为空", trigger: "blur" }
        ],
        categoryId: [
          { required: true, message: "分类不能为空", trigger: "blur" }
        ],
        merchandiserId: [
          { required: true, message: "负责人不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    createPlan() {
      this.$refs["planForm"].validate(valid => {
        if (valid) {
          this.plan.category = this.plan.categoryId.join(",");
          this.plan.merchandiser = this.plan.merchandiserId.join(",");
          showLoading();
          this.global.axios
            .post("/linerShippingPlans", this.plan)
            .then(data => {
              // 添加新的计划
              if (data.status == 200) {
                let event = data.data;
                let title = planModel.generateEventTitle(event);
                this.$emit("addCalendarEvent", event, title);
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
      this.global.axios.get(`/linerShippingPlans/${id}`).then(data => {
        if (data.status === 200) {
          this.formVisible = true;
          this.plan = data.data;
          this.plan.etdTime = this.plan.formatEtdTime;
          this.plan.categoryId = this.plan.categoryName.split(",");
          this.plan.merchandiserId = this.plan.merchandiserName.split(",");
        }
      });
      // 仓库信息
      let warehousesUrl = `/warehouses?filters={"groupOp":"AND","rules":[{"field":"status","op":"eq","data":"1"}]}&sort=type asc,name`;
      this.global.axios(warehousesUrl).then(data => {
        if (data.status == 200) {
          data.data.rows.forEach(warehouse => {
            if (
              warehouse.type == "工厂仓" ||
              warehouse.type == "普通" ||
              warehouse.type == "虚拟仓"
            ) {
              this.fromWarehouses.push({
                value: warehouse.id,
                label: warehouse.name
              });
            } else if (warehouse.type == "海外仓") {
              this.toWarehouses.push({
                value: warehouse.id,
                label: warehouse.name
              });
            }
          });
        }
      });

      // 港口信息
      this.harbours = harbourModel.getSelectNameOptions();

      // 分类
      this.categorys = categoryModel.getMineSelectNameOptions();

      // 负责人
      this.users = userModel.getSelectNameOptions();
    });
  }
};
</script>


<style>
</style>
