<template>
  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             class="ph-dialog"
             width="80%"
             top="15vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="ph-form">
      <!-- 编辑表单 TODO:-->
      <el-form :rules="rules" :model="detailItem" status-icon inline
               ref="detailItem" label-position="right"
               label-width="120px"
               inline-message
               v-loading="loading"

      >
        <el-row>
          <el-col :md="10">
            <el-form-item label="SKU" prop="skuCode">
              <el-input v-model.trim="detailItem.skuCode" size="mini"
                        style="width: 200px" placeholder="请填写SKU" clearable>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="产品名" prop="productName">
              <span style="font-size: 12px">{{detailItem.product ? detailItem.product.name : ''}}</span>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="箱规" size="mini" prop="cartonSpecId">
              <el-col :span="20">
                <el-select filterable v-model="detailItem.cartonSpecId" placeholder="外箱包装材料规格,可筛选"
                           style="width: 200px">
                  <el-option
                    v-for="(item,idx) in cartonspecSelectOptions"
                    :label="item.label" :value="item.value"
                    :key="idx"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="装箱数" size="mini" prop="numberOfCarton">
                <el-input-number v-model="detailItem.numberOfCarton"
                                 :precision="0"
                                 :min="1"
                                 :step="1"
                                 style="width: 200px;"
                                 @change="onQtyChange"
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
            <el-form-item label="库存箱数" size="mini" prop="cartonQty">
              <el-input-number v-model="detailItem.cartonQty"
                               :precision="3"
                               :min="0"
                               :step="1"
                               style="width: 200px;"
                               @change="onQtyChange"
                               :max="100000" label="库存箱数">
              </el-input-number>

              <el-tooltip class="item" effect="light" content="一箱有多少个产品." placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="库存件数" prop="qty">
              <span style="font-size: 12px">{{detailItem.qty}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="warning" @click="onLoadProduct" size="mini" :loading="confirmLoading">获取产品默认信息</el-button>
      <el-button type="primary" @click="onSave" size="mini" :loading="confirmLoading">保 存</el-button>
      <el-button @click="closeDialog" size="mini" >取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>
  import validRules from '@/components/validRules'
  import cartonspecModel from '@/api/cartonspec'


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
        return this.detailItemId == null ? "添加" : "修复";
      },
      hasAdd() {
        return (this.detailItemId == null);
      },
      shippedQty() {
        return this.calShippedQty();
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
        url: "/supplierStocks",
        relations: ["product"],  // 关联对象
        //明细对象ID
        detailItemId: null,
        supplierId: -1,
        cartonspecSelectOptions: [],
        //明细对象
        detailItem: {},

        // 字段验证规则 TODO:
        rules: {
          skuCode: [
            validRules.required
          ],
          cartonQty: [
            validRules.required
          ],
          numberOfCarton: [
            validRules.required
          ],
          cartonSpecId: [
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
        // 明细数据
        this.cartonspecSelectOptions = cartonspecModel.getSelectIntegerOptions();

        if (this.detailItemId) {
          this.loading = true;
          let url = `${this.url}/${this.detailItemId}`;
          url += `?filters=${JSON.stringify({
            "groupOp": "AND",
            "rules": [
              {"field": "supplierId", "op": "eq", "data": this.supplierId}
            ]
          })}`;
          if (this.relations && this.relations.length > 0) {
            url += "&relations=" + JSON.stringify(this.relations);
          }
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data;
              let data = res || {};
              this.detailItem = data;
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
            skuCode: '',
          }
        }
      },

      // 计算发货件数
      calShippedQty() {
        if (this.detailItem.shippedCartonQty && this.detailItem.numberOfCarton) {
          return (this.detailItem.shippedCartonQty * this.detailItem.numberOfCarton).toFixed(0);
        }
        else {
          return 0;
        }
      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog(detailItemId, supplierId) {
        this.detailItemId = detailItemId;
        this.supplierId = supplierId;
        this.initData();
        this.dialogVisible = true;
      },

      closeDialog() {
        this.dialogVisible = false;
        this.loading = false;
        this.confirmLoading = false;
        this.detailItemId = null;
        this.supplierId = -1;
        this.detailItem = {};
        this.order = null;
        this.unit = "箱";
      },

      onLoadProduct() {
        if (!this.detailItem.skuCode) {
          this.$message.error("请输入产品SKU");
        }
        else {
          this.loading = true;
          this.confirmLoading = true;
          let url = `/products/sku?sku=${encodeURIComponent(this.detailItem.skuCode)}`;
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data;
              let data = res || {};

              // 转字段
              this.detailItem.product = data;
              this.detailItem.cartonSpecId = data.cartonSpecId;
              this.detailItem.numberOfCarton = data.numberOfCarton;
              this.confirmLoading = false;
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
              this.confirmLoading = false;
            })
        }
      },
      onQtyChange(val){
        if (this.detailItem) {
          // 总额 = 数量 * 单价
          let cartonQty = this.detailItem.cartonQty || 0;
          let numberOfCarton = this.detailItem.numberOfCarton || 0;
          this.detailItem.qty = (cartonQty * numberOfCarton).toFixed(0);
        }
      },
      // 保存
      onSave() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }
          this.detailItem.supplierId = this.supplierId;

          this.$emit("modifyCBEvent", this.detailItem);
          this.closeDialog();
        })
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>
