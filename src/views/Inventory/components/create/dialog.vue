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
              <el-input v-model.trim="detailItem.skuCode"
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
            <el-form-item label="货位" prop="storageLocation">
              <span style="font-size: 12px">DEFAULT</span>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="价格" prop="productPrice">
              <span style="font-size: 12px" v-model="detailItem.productPrice">{{detailItem.productPrice}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="14">
            <el-form-item label="实际库存" prop="checkedStock">
              <span style="font-size: 12px" v-model="detailItem.checkedStock">{{detailItem.checkedStock}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="14">
            <el-form-item label="差量" prop="number">
              <span style="font-size: 12px" v-model="detailItem.number">{{number}}</span>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="warning" @click="onLoadProduct" v-if="hasAdd" :loading="confirmLoading">获取产品默认信息</el-button>
      <el-button type="primary" @click="onSave" :loading="confirmLoading">保 存</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>
  import validRules from '@/components/validRules'

  export default {
    components: {},
    props: {
    },
    computed: {
      dialogTitle() {
          return "添加";
      },
      hasAdd() {
        return (this.detailItemId == null);
      },
      number() {
        return this.calNumber();
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
          productName: null,
          skuCode: null,
          productPrice: null,
          checkedStock: null,
          number: null,
          warehouseStockQty: null,
        },

        // 字段验证规则 TODO:
        rules: {
          skuCode: [
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
    updated(){
    },
    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        //获取数据
        // 箱规

      },

      // 计算差量
      calNumber() {
        if (this.detailItem.warehouseStockQty && this.detailItem.checkedStock) {
          return (this.detailItem.checkedStock - this.detailItem.warehouseStockQty).toFixed(2);
        }
        else {
          return 0;
        }
      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog(row) {
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
      },

      onLoadProduct() {
        if (!this.detailItem.skuCode) {
          this.$message.error("请输入产品SKU");
        }
        else {
          this.loading = true;
          this.confirmLoading = true;
          let url = `/products/sku/${this.detailItem.skuCode}`+ "?relations=" + JSON.stringify(["cartonSpec", "category","warehouseStock"]);;
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data;
              let data = res || {};
              this.detailItem.productName = data.name;
              this.detailItem.productPrice = data.price;
              this.detailItem.warehouseStockQty = data.qty;
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
         this.detailItem.number = this.calNumber();
         console.log("即将保存的对象 ", this.detailItem);
         this.$emit("modifyCBEvent", this.detailItem);
         this.closeDialog();
        })
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

