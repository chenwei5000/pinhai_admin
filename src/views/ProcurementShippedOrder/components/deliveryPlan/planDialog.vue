<template>
  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             class="ph-dialog"
             width="80%"
             top="10vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="ph-form">
      <!-- 编辑表单 TODO:-->
      <el-form :rules="rules" :model="detailItem" status-icon inline
               ref="detailItem" label-position="right"
               label-width="120px"
               v-loading="loading"
               inline-message
      >
        <el-row>
          <el-col :md="12">
            <el-form-item label="SKU" prop="skuCode" size="mini">
              <span style="font-size: 12px">{{detailItem.skuCode}}</span>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="产品名" prop="productName" size="mini">
              <span style="font-size: 12px">{{detailItem.productName}}</span>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="12">
            <el-form-item label="计划箱数" prop="cartonQty" size="mini">
              <span style="font-size: 12px">{{detailItem.cartonQty}}</span>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="已发货箱数" prop="shippedCartonQty" size="mini">
              <span style="font-size: 12px">{{detailItem.shippedCartonQty}}</span>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="12">
            <el-form-item label="箱规" prop="cartonSpecId" size="mini">

              <el-select filterable v-model="detailItem.cartonSpecId" placeholder="外箱包装材料规格,可筛选"
                         style="width: 220px">
                <el-option
                  v-for="(item,idx) in cartonspecSelectOptions"
                  :label="item.label" :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="产品外箱包装材料规格。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="装箱数" prop="numberOfCarton">

              <el-input-number v-model="detailItem.numberOfCarton"
                               size="mini"
                               style="width: 200px;"
                               :precision="0"
                               :min="1"
                               :step="1"
                               :max="1000" label="请填写装箱数">
              </el-input-number>

              <el-tooltip class="item" effect="light" content="一箱有多少个产品." placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="12">
            <el-form-item label="交货日期" prop="deliveryTime">
              <el-date-picker
                v-model="detailItem.deliveryTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                size="mini"
                placeholder="交货日期"></el-date-picker>

              <el-tooltip class="item" effect="light" content="交货日期" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="交货箱数" prop="cartonQty">
              <el-input-number v-model="detailItem.cartonQty"
                               size="mini"
                               style="width: 200px;"
                               :precision="3"
                               :min="1"
                               :step="1"
                               :max="1000000" label="请填写应发箱数">
              </el-input-number>


              <el-tooltip class="item" effect="light" content="应发箱数,支持3位小数。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>

            </el-form-item>
          </el-col>


          <el-col :md="14">
            <el-form-item label="交货件数" prop="qty">
              <span style="font-size: 12px">{{qty}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="false">
          <el-col :md="24">
            <el-form-item label="备注" prop="remark">
              <el-col :span="22">
                <el-input type="textarea" v-model="detailItem.remark"
                          maxlength="500"
                          show-word-limit
                          rows="3"
                          cols="80"
                ></el-input>
              </el-col>

              <el-col :span="2">

                <el-tooltip class="item" effect="light" placement="right">
                  <div slot="content">交货备注</div>
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>

              </el-col>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave" size="mini" :loading="confirmLoading">保 存</el-button>
      <el-button @click="closeDialog" size="mini">取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>
  import cartonspecModel from '@/api/cartonspec'
  import validRules from '@/components/validRules'

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
        if (this.hasAdd) {
          return "添加交货计划";
        }
        else {
          return "修改交货计划";
        }
      },
      hasAdd() {
        return (this.detailItemId == null);
      },
      procurementBoxQtyTitle() {
        return `采购数量(${this.unit})`;
      },
      qty() {
        return this.calQty();
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

        // 资源URL
        url: "/procurementDeliveryPlans",
        relations: ["product", "procurementOrderItem"],  // 关联对象
        //明细对象ID
        detailItemId: null,
        //明细对象
        detailItem: {},
        //采购单明细
        orderItem: {},

        cartonspecSelectOptions: [],

        unit: "箱",

        // 字段验证规则 TODO:
        rules: {
          skuCode: [],
          cartonSpecId: [
            validRules.required
          ],
          numberOfCarton: [
            validRules.required
          ],
          cartonQty: [
            validRules.required
          ],
          deliveryTime: [
            validRules.required
          ],
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
        //获取数据
        // 箱规
        this.cartonspecSelectOptions = cartonspecModel.getSelectOptions();

        // 明细数据
        if (this.detailItemId) {
          this.loading = true
          let url = `${this.url}/${this.detailItemId}`;
          if (this.relations && this.relations.length > 0) {
            url += "?relations=" + JSON.stringify(this.relations);
          }
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data
              let data = res || {}
              this.detailItem = data
              // 转字段
              this.detailItem.productName = data.product.name;
              this.detailItem.skuCode= data.product.skuCode;
              this.detailItem.cartonSpecId = data.cartonSpecId + '';
              this.detailItem.deliveryTime = data.formatDeliveryTime;

              console.log(this.detailItem);

              this.$forceUpdate();
              this.loading = false
            })
            .catch(err => {
              this.loading = false
            })
        }
        else {
          // 设置添加默认值
          this.detailItem = {
            skuCode: this.orderItem.skuCode,
            productName: this.orderItem.product.name,
            cartonSpecId: this.orderItem.cartonSpecId + '',
            numberOfCarton: this.orderItem.numberOfCarton,
            procurementOrderId: this.orderItem.procurementOrderId,
            procurementPlanId: this.orderItem.procurementPlanId,
            deliveryTime: this.orderItem.procurementOrder.formatOtdTime,
            supplierId: this.orderItem.procurementOrder.supplierId,
            cartonQty: this.orderItem.unOrderCartonQty
          }
        }
      },

      // 计算发货件数
      calQty() {
        if (this.detailItem.cartonQty && this.detailItem.numberOfCarton) {
          return (this.detailItem.cartonQty * this.detailItem.numberOfCarton).toFixed(0);
        }
        else {
          return 0;
        }
      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog(planId, orderItem) {
        this.detailItemId = planId;
        this.orderItem = orderItem;
        this.dialogVisible = true;
        this.initData();
      },

      closeDialog() {
        this.dialogVisible = false;
        this.loading = false;
        this.confirmLoading = false;
        this.detailItemId = null;
        this.detailItem = {};
        this.order = null;
        this.unit = "箱";
      },

      // 保存
      onSave() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }
          this.loading = true;
          this.confirmLoading = true;
          let method = 'post'
          let url = this.url + '';
          if (this.detailItemId && this.detailItemId > 0) {
            method = 'put';
            url = `${this.url}/${this.detailItemId}`;
          }

          //转义字段
          let _object = JSON.parse(JSON.stringify(this.detailItem));

          this.global.axios[method](url, _object)
            .then(resp => {
              this.$message.success("修改成功");
              this.loading = false;
              this.confirmLoading = false;
              this.dialogVisible = false;
              this.$emit("modifyCBEvent", resp.data);
            })
            .catch(err => {
              this.loading = false;
              this.confirmLoading = false;
            })
        })
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

