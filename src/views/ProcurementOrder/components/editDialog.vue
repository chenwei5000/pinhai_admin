<template>
  <el-dialog :title="'采购单修改 '" v-if="formVisible" :visible.sync="formVisible" width="70%">
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
                v-for="(item, idx) in warehouse"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="结算方式" prop="settlementMethod">
            <el-select v-model="form.settlementMethod" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="(item, idx) in settlementMethods"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="预计完成日期" prop="procurementPlan.formatCreateTime">
            <el-date-picker
              v-model="form.procurementPlan.formatCreateTime"
              type="datetime"
              placeholder="预计完成日期时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <!-- 要修改 -->
            <el-input v-model="form.statusName" readonly label="asd" placeholder="状态"></el-input>
          </el-form-item>

          <el-form-item label="供货商" prop="supplier.name">
            <el-select
              v-model="form.supplier.name"
              filterable
              placeholder="请选择"
              style="width: 100%;"
            >
              <el-option
                v-for="(item, idx) in suppliers"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算货币" prop="currency.name">
            <el-select v-model="form.currency.name" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="(item, idx) in currency"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账期" prop="accountPeriod">
            <!-- 提交的时候要修改 -->
            <el-select v-model="form.accountPeriod" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="(item, idx) in accountPeriod"
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
import supplierModel from "../../../api/supplier";
import currencyModel from "../../../api/currency";
import warehouseModel from "../../../api/warehouse";

export default {
  props: {},

  data() {
    let settlementMethods = [
      {
        label: "无",
        value: -1
      },
      {
        label: "货到付款",
        value: 1
      },
      {
        label: "款到发货",
        value: 2
      },
      {
        label: "预付定金",
        value: 3
      }
    ];
    return {
      formVisible: false,
      loading: false,
      event_id: "",
      test: [],
      suppliers: [],
      currency: [],
      warehouse: [],
      accountPeriod: [
        {
          label: "无",
          value: -1
        },
        {
          label: "30天",
          value: 30
        },
        {
          label: "45天",
          value: 45
        },
        {
          label: "60天",
          value: 60
        },
        {
          label: "90天",
          value: 90
        }
      ],
      settlementMethods: settlementMethods,
      form: {
        procurementPlan: {},
        warehouse: {},
        supplier: {},
        currency: {},
        creator: {}
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
              this.loading = true;

              let url = `procurementOrders/${this.row.id}`;
              this.global.axios
                .put(url, this.form)
                .then(data => {
                  if (data.status == 200) {
                    this.$message.info("修改成功");
                    console.log("data ", data);
                  }
                  this.loading = false;

                  this.$emit("refresh");
                })
                .catch(_ => {
                  this.$message.info("修改失败");
                  this.loading = false
                  this.formVisible = false
                });
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
      this.loading = true
      this.row = row;
      this.formVisible = true;
      this.suppliers = supplierModel.getSelectOptions();
      this.currency = currencyModel.getSelectOptions();
      this.warehouse = warehouseModel.getSelectOptions();

      let url = `/procurementOrders/${row.id}?relations=["user", "team", "procurementPlan","currency","supplier","warehouse", "creator"]`;
      this.global.axios.get(url).then(data => {
        if (data.status == 200) {
          let d = data.data;

          if (!d.accountPeriod) {
            d.accountPeriod = -1;
          }
          this.form = d;
        }
        this.loading = false
      });
    });
  }
};
</script>


<style>
</style>
