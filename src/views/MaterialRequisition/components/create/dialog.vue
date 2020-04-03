<template>
  <el-dialog
    :title="dialogTitle"
    append-to-body
    v-if="dialogVisible"
    class="ph-dialog"
    width="70%"
    top="10vh"
    @close="closeDialog"
    :visible.sync="dialogVisible"
  >
    <div class="ph-form">
      <!-- 编辑表单 TODO:-->
      <el-form
        :rules="rules"
        :model="detailItem"
        status-icon
        inline
        ref="detailItem"
        label-position="right"
        label-width="120px"
        v-loading="loading"
      >
        <el-row>
          <el-col :md="10">
            <el-form-item label="SKU" prop="skuCode">
              <el-input
                size="mini"
                v-model.trim="detailItem.skuCode"
                style="width: 200px"
                placeholder="请填写原料SKU"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="原料名" prop="productName">
              <span style="font-size: 12px">{{detailItem.productName}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="箱规" prop="cartonSpecId">
              <el-select
                size="mini"
                filterable
                v-model="detailItem.cartonSpecId"
                placeholder="外箱包装材料规格,可筛选"
                style="width: 200px"
              >
                <el-option
                  v-for="(item,idx) in cartonspecSelectOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="产品外箱包装材料规格。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="装箱数" prop="numberOfCarton">
              <el-input-number
                v-model="detailItem.numberOfCarton"
                size="mini"
                style="width: 200px;"
                :precision="0"
                :min="1"
                :step="1"
                :max="1000"
                label="请填写装箱数"
              ></el-input-number>

              <el-tooltip class="item" effect="light" content="一箱有多少个产品." placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item :label="'米数'" prop="number">
              <el-input-number
                v-model="detailItem.number"
                size="mini"
                style="width: 200px;"
                :precision="3"
                :min="1"
                :step="1"
                :max="1000000"
                label="请填写米数"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button
        type="warning"
        @click="onLoadProduct"
        size="mini"
        :loading="confirmLoading"
      >获取原料默认信息</el-button>
      <el-button type="primary" @click="onSave" size="mini" :loading="confirmLoading">保 存</el-button>
      <el-button @click="closeDialog" size="mini">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import validRules from "@/components/validRules";
import cartonspecModel from "../../../../api/cartonspec";

export default {
  components: {},
  props: {
    primary: {
      type: [Object],
      default: null
    }
  },
  computed: {
    dialogTitle() {
      if (this.detailItemId == null) {
        return "添加领料单明细";
      } else {
        return "修改领料单明细";
      }
    },
    typeName() {
      return "领料单";
    },
    hasAdd() {
      return this.detailItemId == null;
    }
  },

  data() {
    return {
      //Dialog 是否开启
      dialogVisible: false,
      // 表单加载状态
      loading: false,
      // 点击按钮之后，按钮锁定不可在点
      confirmLoading: false,

      cartonspecSelectOptions: [],

      relations: [], // 关联对象
      //明细对象ID
      detailItemId: null,
      //明细对象
      detailItem: {},

      // 字段验证规则 TODO:
      rules: {
        skuCode: [validRules.required],
        cartonSpecId: [validRules.required],
        numberOfCarton: [validRules.required]
      }
    };
  },

  created() {},

  mounted() {
    this.$nextTick(() => {});
  },

  methods: {
    /********************* 基础方法  *****************************/
    //初始化加载数据 TODO:根据实际情况调整
    initData() {
      this.cartonspecSelectOptions = cartonspecModel.getSelectOptions();
    },

    /* 开启弹出编辑框 需要传明细ID */
    openDialog(detailItem) {
      if (detailItem) {
        this.detailItemId = detailItem.id;
        this.detailItem = detailItem;
      }
      this.dialogVisible = true;
      this.initData();
    },

    closeDialog() {
      this.dialogVisible = false;
      this.loading = false;
      this.confirmLoading = false;
      this.detailItemId = null;
      this.detailItem = {};
    },

    onLoadProduct() {
      if (!this.detailItem.skuCode) {
        this.$message.error("请输入原料SKU");
      } else {
        this.loading = true;
        this.confirmLoading = true;
        let url = `/products/sku?sku=${encodeURIComponent(
          this.detailItem.skuCode
        )}&relations=${JSON.stringify(["cartonSpec", "category"])}`;
        this.global.axios
          .get(url)
          .then(resp => {
            console.log(resp);
            let res = resp.data;
            let data = res || {};
            if (data.material !== 1) {
              this.$message.error("只能选择原料sku!");
              this.loading = false;
              this.confirmLoading = false;
              return;
            }

            this.detailItem.cartonSpecId = data.cartonSpecId + "";
            this.detailItem.numberOfCarton = data.numberOfCarton;
            this.detailItem.cartonSpecCode = data.cartonSpecCode;
            this.detailItem.imgUrl = data.imgUrl;

            // 转字段
            this.detailItem.productName = data.name;
            this.confirmLoading = false;
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
          });
      }
    },
    // 保存
    onSave() {
      this.$refs.detailItem.validate(valid => {
        if (!valid) {
          return false;
        }
        this.$emit("modifyCBEvent", this.detailItem);
        this.closeDialog();
      });
    }
  }
};
</script>

<style type="text/less" lang="scss" scoped>
</style>

