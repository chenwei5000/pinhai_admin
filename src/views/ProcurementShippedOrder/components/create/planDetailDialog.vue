<template>

  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="70%"
             top="20vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="ph-form">
      <!-- 编辑表单 TODO:-->
      <el-form :rules="rules" :model="detailItem" status-icon inline
               ref="detailItem" label-position="right"
               label-width="120px"
               v-loading="loading"
      >
        <el-row>
          <el-col :md="10">
            <el-form-item label="SKU" style="font-size: 12px;">
              {{ detailItem.skuCode }}
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="产品名" style="font-size: 12px;">
              {{ detailItem.product.name }}
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="箱规" prop="cartonSpecId">

              <el-select filterable
                         v-model="detailItem.cartonSpecId"
                         placeholder="外箱包装材料规格,可筛选">
                <el-option
                  v-for="(item,idx) in cartonspecSelectOptions"
                  :label="item.label" :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="产品外箱包装材料规格。不输入使用产品上默认的箱规" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="装箱数" prop="numberOfCarton">

              <el-input-number v-model="detailItem.numberOfCarton"
                               :precision="0"
                               :min="1"
                               :step="1"
                               style="width: 150px;"
                               :max="100000" label="装箱数">
              </el-input-number>

              <el-tooltip class="item" effect="light" content="一箱有多少个产品." placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="发货箱数" prop="planCartonQty">

              <el-input-number v-model="detailItem.planCartonQty"
                               style="width: 175px;"
                               :precision="3"
                               :min="1"
                               :step="1"
                               :max="1000000" label="发货箱数">
              </el-input-number>

              <el-tooltip class="item" effect="light" content="发货箱数,支持3位小数。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="发货件数">
              {{orderQty}} 件
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="24">
            <el-form-item label="备注" prop="priorityNote">
              <el-col :span="22">
                <el-input type="textarea" v-model="detailItem.shippedNote"
                          maxlength="500"
                          show-word-limit
                          rows="3"
                          cols="80"
                ></el-input>
              </el-col>

              <el-col :span="2">

                <el-tooltip class="item" effect="light" placement="right">
                  <div slot="content">发货备注</div>
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>

              </el-col>

            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave" :loading="confirmLoading">保 存</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>
  import validRules from '@/components/validRules'
  import supplierModel from '@/api/supplier'
  import cartonspecModel from '@/api/cartonspec'
  import {currency, intArrToStrArr} from '@/utils'

  export default {
    components: {},
    props: {},
    filters: {
      currency: currency
    },
    computed: {
      orderQty() {
        return this.calOrderQty();
      },
      dialogTitle() {
        return "修改发货计划明细";
      },
      hasEdit() {
        return true;
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
        //明细对象
        detailItem: {},

        cartonspecSelectOptions: [],

        // 字段验证规则 TODO:
        rules: {
          cartonSpecId: [
            validRules.required
          ],
          numberOfCarton: [
            validRules.required,
            validRules.integer
          ],
          planCartonQty: [
            validRules.required,
            validRules.number
          ]
        },
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
      });
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        // 箱规
        this.cartonspecSelectOptions = cartonspecModel.getSelectOptions();
      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog(detailItem) {
        this.detailItem = detailItem;
        this.detailItem.cartonSpecId = detailItem.cartonSpecId + '';
        this.dialogVisible = true;
        this.initData();
      },

      closeDialog() {
        this.dialogVisible = false;
        this.loading = false;
        this.confirmLoading = false;
        this.detailItemId = null;
        this.detailItem = null;
        this.cartonspecSelectOptions = [];
      },

      // 计算下单件数
      calOrderQty() {
        return (this.detailItem.planCartonQty * this.detailItem.numberOfCarton).toFixed(0);
      },

      // 保存
      onSave() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }
          this.loading = true;
          this.confirmLoading = true;
          this.detailItem.planQty = this.calOrderQty();

          this.cartonspecSelectOptions.forEach(r => {
            if (r.value == this.detailItem.cartonSpecId + '') {
              this.detailItem.cartonSpecCode = r.label;
            }
          });

          this.$emit("modifyDetailCBEvent", this.detailItem);
          this.loading = false;
          this.confirmLoading = false;
          this.closeDialog();
        });
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

</style>
