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
            <el-form-item label="原料SKU" prop="materialSkuCode"
                          size="mini">
              <el-input v-model.trim="detailItem.materialSkuCode"
                        style="width: 200px" placeholder="请填写SKU" clearable>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="原料名称" prop="materialName">
              <span style="font-size: 12px" v-model="detailItem.materialName">{{detailItem.materialName}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="数量" prop="qty">
              <el-input-number v-model="detailItem.qty"
                               size="mini"
                               style="width: 200px;"
                               :precision="0"
                               :min="1"
                               :step="1"
                               :max="1000" label="请填写数量">
              </el-input-number>

              <el-tooltip class="item" effect="light" content="一个产品对应多少原料." placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="损耗率" prop="attritionRate">
              <el-input-number v-model="detailItem.attritionRate"
                               size="mini"
                               style="width: 200px;"
                               :precision="1"
                               :min="1"
                               :step="1"
                               :max="100" label="请填写损耗率">
              </el-input-number>

              <i >%</i>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="warning" @click="onLoadMaterial" size="mini" v-if="hasAdd" :loading="confirmLoading">获取原料默认信息</el-button>
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
    },
    computed: {
      dialogTitle() {
          return "添加材料明细";
      },
      hasAdd() {
        return (this.detailItemId == null);
      },

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
          materialName: null,
          qty: 1,
          materialSkuCode: null,
          attritionRate: 3,
        },
         unit: "件",

        // 字段验证规则 TODO:
        rules: {
          materialSkuCode: [
            validRules.required
          ],
          qty: [
            validRules.required
          ],
          attritionRate: [
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
        this.detailItem = {
          materialName: null,
          qty: 1,
          materialSkuCode: null,
          attritionRate: 3
        };
        this.unit = "件";
      },

      onLoadMaterial() {
        if (!this.detailItem.materialSkuCode) {
          this.$message.error("请输入原料SKU");
        }
        else {
          this.loading = true;
          this.confirmLoading = true;
          let url = `/products/sku/${this.detailItem.materialSkuCode}`;
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data
              let data = res || {}

              // 转字段
              this.detailItem.materialName = data.name;
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
         this.$emit("modifyCBEvent", this.detailItem);
         this.closeDialog();
        })
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

