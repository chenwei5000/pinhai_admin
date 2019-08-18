<template>
  <el-dialog title="编辑计划" :visible.sync="formVisible" width="65%">
    <fieldset class="panel-heading">
      <legend class="panel-title">基本信息</legend>
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
        :inline="true"
      >
        <el-form-item label="开船时间" prop="etdTime">
          <el-date-picker v-model="form.etdTime" type="datetime" placeholder="选择日期时间" readonly></el-date-picker>
        </el-form-item>
        <el-form-item label="编号">
          <el-input placeholder v-model="form.code" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="运输方式" prop="type">
          <el-select v-model="form.type" placeholder="请选择" style="width: 100%;">
            <el-option label="海运" value="海运"></el-option>
            <el-option label="空运" value="空运"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发货港口" prop="portOfLoading">
          <el-select v-model="form.portOfLoading" placeholder="请选择">
            <el-option
              v-for="(item, idx) in harbours"
              :key="`${idx}-${item.value}`"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发货仓库" prop="fromWarehouseId">
          <el-select v-model="form.fromWarehouseId" filterable placeholder="请选择">
            <el-option
              v-for="(item, idx) in fromWarehouses"
              :key="`${idx}-${item.value}`"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收货仓库" prop="toWarehouseId">
          <el-select v-model="form.toWarehouseId" filterable placeholder="请选择">
            <el-option
              v-for="(item, idx) in toWarehouses"
              :key="`${idx}-${item.value}`"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="form.categoryId" multiple filterable placeholder="请选择">
            <el-option
              v-for="(item , idx) in categorys"
              :key="`${idx}-${item.value}`"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="负责人" prop="merchandiserId">
          <el-select v-model="form.merchandiserId" multiple filterable placeholder="请选择">
            <el-option
              v-for="(item, idx) in users"
              :key="`${idx}-${item.value}`"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="FBA ID">
          <el-input placeholder v-model="form.shipmentId" readonly></el-input>
        </el-form-item>

        <el-form-item label="Reference ID">
          <el-input placeholder v-model="form.referenceId" readonly></el-input>
        </el-form-item>


        <el-form-item label="是否打托：">
          <el-radio v-model="form.pallet" label="1" value="1">是</el-radio>
          <el-radio v-model="form.pallet" label="0" value="0">否</el-radio>
        </el-form-item>

        <el-form-item label="Oversize：" style="margin-left:150px;">
          <el-radio v-model="form.oversize" label="1" value="1">是</el-radio>
          <el-radio v-model="form.oversize" label="2" value="0">否</el-radio>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="form.detail"
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
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.category = this.form.categoryId.join(",");
          this.form.merchandiser = this.form.merchandiserId.join(",");
          showLoading();
          this.global.axios
            .put(`/linerShippingPlans/${this.event_id}`, this.form)
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
      this.event_id = id
      this.global.axios.get(`/linerShippingPlans/${id}`).then(data => {
        if (data.status === 200) {
          this.formVisible = true;
          this.form = data.data;
          this.form.etdTime = this.form.formatEtdTime;
          this.form.categoryId = this.form.categoryName.split(",");
          this.form.merchandiserId = this.form.merchandiserName.split(",");
          // 转化成字符串
          this.form.pallet = `${this.form.pallet}`;
          this.form.oversize = `${this.form.oversize}`;
        }
      });
      // 仓库信息
      let warehousesUrl = `/warehouses?filters={"groupOp":"AND","rules":[{"field":"status","op":"eq","data":"1"}]}&sort=type asc,name`;
      this.global.axios(warehousesUrl).then(data => {
        if (data.status == 200) {
          data.data.forEach(warehouse => {
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
      this.categorys = categoryModel.getMineSelectProdcutNameOptions();

      // 负责人
      this.users = userModel.getSelectNameOptions();
    });
  }
};
</script>


<style>
</style>
