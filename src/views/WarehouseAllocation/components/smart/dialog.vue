<template>
  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             class="ph-dialog"
             width="70%"
             top="10vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="ph-form">
      <!-- 编辑表单 TODO:-->
      <el-form :rules="rules" :model="detailItem" status-icon inline
               ref="detailItem" label-position="right"
               label-width="120px"
               v-loading="loading"
               :data="detailItem"
      >
        <el-row>
          <el-col :md="10">
            <el-form-item label="SKU" prop="skuCode">
              <el-input  size="mini" v-model.trim="detailItem.skuCode"
                        style="width: 200px" placeholder="请填写SKU" clearable>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="产品名" prop="productName">
              <span style="font-size: 12px" v-model="detailItem.productName">{{detailItem.productName}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="箱规" prop="cartonSpecId">
              <el-select  size="mini" filterable v-model="detailItem.cartonSpecId" placeholder="外箱包装材料规格,可筛选"
                         style="width: 200px">
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

          <el-col :md="14">
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
          <el-col :md="10">
            <el-form-item label="应发箱数" prop="shippedCartonQty">
              <el-input-number v-model="detailItem.shippedCartonQty"
                               size="mini"
                               style="width: 200px;"
                               :precision="3"
                               :min="1"
                               :step="1"
                               :max="1000000" label="请填写应发箱数">
              </el-input-number>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item :label="shippedQtyTitle" prop="shippedQty">
              <span style="font-size: 12px" v-model="detailItem.shippedQty">{{shippedQty}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="24">
            <el-form-item label="备注" prop="priorityNote">
              <el-col :span="22">
                <el-input type="textarea" v-model="detailItem.remark"
                          maxlength="500"
                          show-word-limit
                          rows="3"
                          cols="80"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="warning" size="mini" @click="onLoadProduct" v-if="hasAdd" :loading="confirmLoading">获取产品默认信息</el-button>
      <el-button type="primary" size="mini"  @click="onSave" :loading="confirmLoading">保 存</el-button>
      <el-button @click="closeDialog" size="mini" >取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>
  import cartonspecModel from '@/api/cartonspec'
  import validRules from '@/components/validRules'

  export default {
    components: {},
    props: {
    },
    computed: {
      dialogTitle() {
          return "添加国内调拨明细";
      },
      hasAdd() {
        return (this.detailItemId == null);
      },
      shippedQtyTitle() {
        return `应发${this.unit == '箱' ? '件' : this.unit}数`;
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
        //明细对象
        detailItem: {
            cartonSpecId: null,
            numberOfCarton: null,
            productName: null,
            shippedCartonQty: null,
            skuCode: null,
            shippedQty: null,
            cartonSpecCode: null,
        },
        cartonspecSelectOptions: [],
        unit: "箱",

        // 字段验证规则 TODO:
        rules: {
          skuCode: [
            validRules.required
          ],
          cartonSpecId: [
            validRules.required
          ],
          numberOfCarton: [
            validRules.required
          ],
          shippedCartonQty: [
            validRules.required
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
    updated(){
    },
    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        //获取数据
        // 箱规

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
      openDialog(row) {
        this.cartonspecSelectOptions = cartonspecModel.getSelectOptions();
        this.dialogVisible = true;
        if(row != null){
           this.detailItem =  JSON.parse(JSON.stringify(row));
        }
      },

      closeDialog() {
        this.dialogVisible = false;
        this.loading = false;
        this.confirmLoading = false;
        this.detailItem = {};
        this.unit = "箱";
      },

      onLoadProduct() {
        if (!this.detailItem.skuCode) {
          this.$message.error("请输入产品SKU");
        }
        else {
          this.loading = true;
          this.confirmLoading = true;
          let url = `/products/sku/${this.detailItem.skuCode}`+ "?relations=" + JSON.stringify(["cartonSpec", "category"]);
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data
              let data = res || {}

              this.detailItem.cartonSpecId = data.cartonSpecId + '';
              this.detailItem.numberOfCarton = data.numberOfCarton;
              this.detailItem.cartonSpecCode = data.cartonSpecCode;
              // 转字段
              this.detailItem.productName = data.name;
              if (data.cartonSpecId == -3) { //原料采购
                this.unit = data.unit;
              }
              this.confirmLoading = false;
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
              this.confirmLoading = false;
            })
        }
      },
      // 保存
      onSave() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }
         this.detailItem.shippedQty = this.calShippedQty();
         this.$emit("modifyCBEvent", this.detailItem);
         this.closeDialog();
        })
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

