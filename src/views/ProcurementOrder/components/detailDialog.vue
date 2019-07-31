<template>
  <el-dialog :title="'查看详情 '" v-if="formVisible" :visible.sync="formVisible" fullscreen>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
      class="demo-ruleForm"
      :inline="true"
      v-loading="loading"
      size="mini"
    >
      <el-form-item label="编码" prop="code">
        <el-input v-model="form.code" readonly placeholder="编码"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input v-model="form.statusName" readonly placeholder="状态"></el-input>
      </el-form-item>

      <el-form-item label="采购计划" prop="procurementPlan.name">
        <el-input v-model="form.procurementPlan.name" readonly placeholder="请选择" style="width: 100%;"></el-input>
      </el-form-item>

      <el-form-item label="供货商" prop="supplier.name">
        <el-input v-model="form.supplier.name" readonly placeholder="请选择" style="width: 100%;"></el-input>
      </el-form-item>

      <el-form-item label="跟单员" prop="merchandiser">
        <el-input v-model="form.merchandiser"readonly placeholder="跟单员"></el-input>
      </el-form-item>
      <el-form-item label="结算货币" prop="currency.name">
        <el-input v-model="form.currency.name"  readonly placeholder="请选择" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="收货仓库" prop="warehouse.name">
        <el-input v-model="form.warehouse.name" readonly placeholder="请选择" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="账期" prop="accountPeriod">
        <el-input v-model="form.accountPeriod_" readonly placeholder="请选择" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="结算方式" prop="settlementMethod">
        <el-input v-model="form.settlementMethod_" readonly placeholder="请选择" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="creator.name">
        <el-input v-model="form.creator.name" readonly placeholder="创建人"></el-input>
      </el-form-item>

      <el-form-item label="预计完成日期" prop="procurementPlan.formatCreateTime">
        <el-input
          v-model="form.procurementPlan.formatCreateTime"
          type="datetime"
          placeholder="预计完成日期时间"
          readonly
        ></el-input>
      </el-form-item>
    </el-form>

    <itemTable ref="itemTable"></itemTable>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import itemTable from './table2'


export default {
  props: {},
  components: {
    itemTable
  },

  data() {
    return {
      formVisible: false,
      loading: false,
      event_id: "",
      test: [],
      suppliers: [],
      currency: [],
      warehouse: [],
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
      this.loading = true;
      this.row = row;
      this.formVisible = true;

      // console.log('asdasd')

      let url = `/procurementOrders/${row.id}?relations=["user", "team", "procurementPlan","currency","supplier","warehouse", "creator"]`;
      this.global.axios.get(url).then(data => {
        if (data.status == 200) {
          let d = data.data;
          let mapped = {
            1: '货到付款',
            2: '款到发货',
            3: '预付定金'
          }

          if (!d.accountPeriod) {
            d.accountPeriod_ = '无';
          }
          d.settlementMethod_ = mapped[d.settlementMethod]
          this.form = d;
        }
        this.loading = false;
      });
    });
  }
};
</script>
<style>
</style>
