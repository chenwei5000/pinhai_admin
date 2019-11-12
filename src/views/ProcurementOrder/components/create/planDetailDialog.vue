<template>

  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="85%"
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
          <el-col :md="8">
            <el-form-item label="SKU" style="font-size: 12px;">
              {{ detailItem.skuCode }}
            </el-form-item>
          </el-col>

          <el-col :md="8">
            <el-form-item label="产品名" style="font-size: 12px;">
              {{ detailItem.product.name }}
            </el-form-item>
          </el-col>

          <el-col :md="8">
            <el-form-item label="结算货币" style="font-size: 12px;">
              {{ selCurrency.name }}
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="8">
            <el-form-item label="供货商" prop="supplierId" size="mini">

              <el-select filterable
                         v-model="detailItem.supplierId"
                         placeholder="请选择供货商,可筛选">
                <el-option
                  v-for="(item,idx) in supplierSelectOptions"
                  :label="item.label" :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="产品供货商，从哪个厂商采购。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="8">
            <el-form-item label="箱规" prop="cartonSpecId" size="mini">

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

          <el-col :md="8">
            <el-form-item label="装箱数" prop="numberOfCarton" size="mini">

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
          <el-col :md="8">
            <el-form-item label="采购单价" prop="price" size="mini">

              <el-input-number v-model="detailItem.product.price"
                               :precision="2"
                               :min="1"
                               :step="1"
                               style="width: 175px;"
                               :max="1000000" label="采购价">
              </el-input-number>

              <el-tooltip class="item" effect="light" content="产品的采购价格。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="8">
            <el-form-item label="采购箱数" prop="purchaseOrderCartonQty" size="mini">

              <el-input-number v-model="detailItem.purchaseOrderCartonQty"
                               style="width: 175px;"
                               :precision="3"
                               :min="1"
                               :step="1"
                               :max="1000000" label="采购箱数">
              </el-input-number>

              <el-tooltip class="item" effect="light" content="采购箱数,支持3位小数。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

          <el-col :md="8">
            <el-form-item label="采购件数">
              {{orderQty}} 件
            </el-form-item>
          </el-col>
        </el-row>

        <hr/>

        <el-row style="text-align: right;font-size: 13px; font-weight: bold;">
          总额: {{amount, selCurrency.symbolLeft | currency}}
        </el-row>

      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave" size="mini"  :loading="confirmLoading">确 定</el-button>
      <el-button @click="closeDialog" size="mini" >取 消</el-button>
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
      amount() {
        return this.calAmount();
      },
      dialogTitle() {
          return "修改采购单明细";
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
        selCurrency: {},

        supplierSelectOptions: [],
        cartonspecSelectOptions: [],

        // 字段验证规则 TODO:
        rules: {
          supplierId: [
            validRules.required
          ],
          cartonSpecId: [
            validRules.required
          ],
          price: [
            validRules.number
          ],
          numberOfCarton: [
            validRules.integer
          ],
          purchaseOrderCartonQty: [
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
        this.supplierSelectOptions = supplierModel.getSelectOptions();
        // 箱规
        this.cartonspecSelectOptions = cartonspecModel.getSelectOptions();
      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog(detailItem, selCurrency) {
        this.detailItem = detailItem;
        this.selCurrency = selCurrency;
        this.detailItem.supplierId = detailItem.supplierId + '';
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
        this.prioritySelectOptions = [];
      },

      // 计算下单件数
      calOrderQty() {
        return (this.detailItem.purchaseOrderCartonQty * this.detailItem.numberOfCarton).toFixed(0);
      },
      // 计算总额
      calAmount() {
        return (this.detailItem.product.price * this.calOrderQty()).toFixed(2);
      },

      // 保存
      onSave() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }
          this.loading = true;
          this.confirmLoading = true;

          this.detailItem.purchaseOrderQty = this.calOrderQty();
          this.detailItem.purchaseOrderAmount = this.calAmount();

          this.supplierSelectOptions.forEach(r => {
            if (r.value == this.detailItem.supplierId + '') {

              this.detailItem.supplierName = r.label
              if(this.detailItem.product.supplier != null){
                this.detailItem.product.supplier = {
                  name: r.label,
                  id: this.detailItem.supplierId
                };

              }
            }
          });
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
