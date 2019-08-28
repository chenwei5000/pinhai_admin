<template>

  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="80%"
             top="20px"
             @close='closeDialog'
             :visible.sync="dialogVisible">


    <div class="ph-form" style="margin-top: 15px">
      <!-- 编辑表单 TODO:-->
      <el-form :rules="rules" :model="detailItem" status-icon inline
               ref="detailItem" label-position="right"
               label-width="120px"
               v-loading="loading"
      >

        <el-row>
          <el-col :md="10">
            <el-form-item label="供货商">
              <span style="font-size: 12px">{{order.supplier.name}}</span>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="结算货币">
              <span style="font-size: 12px">{{ order.currency.name }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="SKU" prop="skuCode">
              <el-input v-model.trim="detailItem.skuCode"
                        maxlength="50"
                        show-word-limit
                        style="width: 200px" placeholder="请填写SKU" clearable></el-input>

              <el-tooltip class="item" effect="light" content="输入产品SKU编码" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="采购单价" prop="price">

              <el-input v-model.trim="detailItem.price"
                        style="width: 200px" placeholder="请填写采购单价" clearable></el-input>

              <el-tooltip class="item" effect="light" content="产品的采购价格。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="箱规" prop="cartonSpecId">

              <el-select filterable
                         v-model="detailItem.cartonSpecId"
                         style="width: 200px"
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

              <el-input v-model.trim="detailItem.numberOfCarton"
                        style="width: 200px" placeholder="请填写装箱数" clearable></el-input>

              <el-tooltip class="item" effect="light" content="一箱有多少个产品.不输入使用产品上默认的装箱数" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="采购箱数" prop="purchaseOrderCartonQty">
              <el-input-number v-model="detailItem.cartonQty"
                               @change="onCartonQtyChange"
                               size="small"
                               style="width: 200px;"
                               :precision="3"
                               :min="1"
                               :step="1"
                               :max="1000000" label="采购箱数">
              </el-input-number>

              <el-tooltip class="item" effect="light" content="采购箱数,支持3位小树。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="10">
            <el-form-item label="采购件数">
              <span style="font-size: 12px">{{detailItem.qty}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <hr/>

        <el-row style="text-align: right;font-size: 13px; font-weight: bold;">
          总额: {{detailItem.amount, order.currency.symbolLeft | currency}}
        </el-row>

      </el-form>
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
        if (this.detailItemId == null) {
          return "添加采购单明细";
        }
        else {
          return "修改采购单明细";
        }
      },
      hasEdit() {
        // 控制按钮
        if ([0, 8].indexOf(this.primary.status) > -1) {
          return false;
        }
        else {
          return true;
        }
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
        url: "/procurementOrderItems",
        relations: ["product"],  // 关联对象
        //明细对象ID
        detailItemId: null,
        //明细对象
        detailItem: {},
        // 采购单对象
        order: {},

        cartonspecSelectOptions: [],

        // 字段验证规则 TODO:
        rules: {
          skuCode: [
            validRules.required
          ],
          cartonQty: [
            validRules.required
          ],
          priority: [
            validRules.required
          ],
          numberOfCarton: [
            validRules.integer
          ],
          sevenSalesCount: [
            validRules.number
          ],
          amazonTotalStock: [
            validRules.number
          ],
          domesticStockQty: [
            validRules.number
          ],
          unfinishedPlanQty: [
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
              this.detailItem.cartonSpecId = data.cartonSpecId + '';

              this.loading = false
            })
        }
        else {
          // 设置添加默认值
          this.detailItem = {
            skuCode: null,
            price: null,
            cartonSpecId: null,
            cartonQty: 0,
            qty: 0,
            numberOfCarton: null,
            amount: null,
          }

        }
      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog(detailItemId, order) {
        this.detailItemId = detailItemId;
        this.order = order;
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

      onQtyChange(val) {
        if (this.detailItem) {
          //可售周数 = （亚马逊总库存 + 国内库存 + 未完成采购计划数 + 应备货件数） /（7日销量修正）
          let amazonTotalStock = this.detailItem.amazonTotalStock || 0;
          let domesticStockCartonQty = this.detailItem.domesticStockCartonQty || 0;
          let unfinishedPlanQty = this.detailItem.unfinishedPlanQty || 0;
          let numberOfCarton = this.detailItem.numberOfCarton || 1;
          let total = amazonTotalStock + domesticStockCartonQty + unfinishedPlanQty + (val * numberOfCarton);

          if (this.detailItem.sevenSalesCount) {
            this.detailItem.saleWeek = (total / this.detailItem.sevenSalesCount).toFixed(1);
          }
        }
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
          if (!this.detailItemId && this.detailItemId > 0) {
            method = 'put';
            url = `${this.url}/${this.detailItemId}`;
          }

          //转义字段
          let _object = JSON.parse(JSON.stringify(this.detailItem));

          this.global.axios[method](url, _object)
            .then(resp => {
              this.$message.info("修改成功");
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

