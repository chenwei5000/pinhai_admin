<template>
  <el-dialog title="采购单修改" :visible.sync="formVisible" width="70%">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
      class="demo-ruleForm"
      :inline="true"
      v-loading="loading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="编码" prop="code" width="100px">
            <el-input v-model="form.code" readonly placeholder="编码"></el-input>
          </el-form-item>

          <el-form-item label="采购计划" prop="procurementPlan.name">
            <el-select v-model="form.procurementPlan.name" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="(item, idx) in test"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="跟单员" prop="merchandiser" width="100px">
            <el-input v-model="form.merchandiser" placeholder="跟单员"></el-input>
          </el-form-item>

          <el-form-item label="收货仓库" prop="warehouse.name">
            <el-select v-model="form.warehouse.name" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="(item, idx) in test"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="结算方式" prop="settlementMethod">
            <el-select v-model="form.settlementMethod" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="(item, idx) in test"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="预计完成日期" prop="procurementPlan.formatCreateTime">
            <el-input v-model="form.procurementPlan.formatCreateTime" placeholder="预计完成日期"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-input v-model="form.status" placeholder="状态"></el-input>
          </el-form-item>
          <el-form-item label="跟单团队" prop="type">
            <el-select v-model="form.team.name" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="(item, idx) in test"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供货商" prop="supplier.name">
            <el-select v-model="form.supplier.name" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="(item, idx) in test"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算货币" prop="currency.name">
            <el-select v-model="form.currency.name" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="(item, idx) in test"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账期" prop="accountPeriod">
            <el-select v-model="form.accountPeriod" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="(item, idx) in test"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建人" prop="creator.name">
            <el-input v-model="form.creator.name" placeholder="创建人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
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
      formVisible: false,
      loading: false,
      event_id: "",
      test: [],

      form: {
        procurementPlan: {},
        warehouse: {},
        supplier: {},
        currency: {},
        creator: {},
        team: {}
      },
      rules: {}
    };
  },
  created() {},
  methods: {
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$confirm("确认修改？")
            .then(_ => {
              // 确定
            })
            .catch(_ => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted() {
    this.$on("openDialog", row => {
      this.formVisible = true;
      console.log("row ", row);
      // 数据库不完整 应该写成 this.form = row
      this.form.code = row.code;
      this.form.merchandiser = row.merchandiser;
    });
  }
};
</script>


<style>
</style>
