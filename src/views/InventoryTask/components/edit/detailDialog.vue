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
      >
        <el-row>
          <el-col :md="10">
            <el-form-item label="SKU" prop="skuCode" size="mini">
              <el-input  v-model.trim="detailItem.skuCode"
                        style="width: 200px" placeholder="请填写SKU" clearable>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="产品名" prop="productName" size="mini">
              <span style="font-size: 12px">{{detailItem.productName}}</span>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="货位" prop="storageLocation" size="mini">
              <span style="font-size: 12px">DEFAULT</span>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="价格" prop="productPrice" size="mini">
              <span style="font-size: 12px">{{detailItem.price}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="warning" @click="onLoadProduct" size="mini"  :loading="confirmLoading">获取产品默认信息</el-button>
      <el-button type="primary" @click="onSave" size="mini"  :loading="confirmLoading">保 存</el-button>
      <el-button @click="closeDialog" size="mini" >取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>
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
          return "添加盘点任务明细";
        }
        else {
          return "修改盘点任务明细";
        }
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
        url: "/inventoryTaskItems",
        relations: ["product","warehouseStock","inventoryTaskItem","inventoryTask","storageLocation"],  // 关联对象
        //明细对象ID
        detailItemId: null,
        //明细对象
        detailItem: {
            taskId: null,
            skuCode: null,
            productName: null,
            storageLocationCode: null,
            price: null,
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

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        //获取数据
        // 箱规

        // 明细数据
        if (this.detailItemId) {
          this.loading = true;
          let url = `${this.url}/${this.detailItemId}`;
          if (this.relations && this.relations.length > 0) {
            url += "?relations=" + JSON.stringify(this.relations);
          }
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data;
              let data = res || {};
              this.detailItem = data;
              // 转字段
              this.detailItem.productName = data.product.name;
              this.detailItem.productPrice = data.price;

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
      openDialog(detailItemId) {
        this.detailItemId = detailItemId;
        this.dialogVisible = true;
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
              let res = resp.data
              let data = res || {}

              // 转字段
              this.detailItem.productName = data.name;
              this.detailItem.price = data.price;

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
          this.loading = true;
          this.confirmLoading = true;
          let method = 'post';
          let url = this.url + '';
          if (this.detailItemId && this.detailItemId > 0) {
            method = 'put';
            url = `${this.url}/${this.detailItemId}`;
          }

          //转义字段
          this.detailItem.taskId = this.primary.id;
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

