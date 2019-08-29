<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title"
             class="ph-dialog"
             append-to-body
             v-if="dialogVisible"
             width="80%"
             top="3vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="block" style="height: 420px;">
      <el-scrollbar style="height: 100%">

        <div class="ph-table">

          <!-- 编辑表单 TODO:-->
          <el-form :rules="rules" :model="printObject" status-icon inline
                   ref="detailItem" label-position="right"
                   label-width="120px"
                   v-loading="loading"
          >
            <fieldset class="panel-heading">
              <legend class="panel-title">需方
                <el-tooltip class="item" effect="light" placement="right">
                  <div slot="content">
                    采购需求方。
                  </div>
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>
              </legend>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="公司名称" prop="demanderName">
                    <el-input v-model.trim="printObject.demanderName"
                              maxlength="100"
                              show-word-limit
                              style="width: 200px" placeholder="请填写需求方公司名称" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="公司地址" prop="demanderAddress">
                    <el-input v-model.trim="printObject.demanderAddress"
                              maxlength="200"
                              show-word-limit
                              style="width: 300px" placeholder="请填写需求方公司地址" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="联系人" prop="demanderLinkMan">
                    <el-input v-model.trim="printObject.demanderLinkMan"
                              maxlength="20"
                              show-word-limit
                              style="width: 200px" placeholder="请填写需求方联系人" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="联系电话" prop="demanderLinkMethod">
                    <el-input v-model.trim="printObject.demanderLinkMethod"
                              maxlength="20"
                              show-word-limit
                              style="width: 300px" placeholder="请填写需求方联系电话" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="23">
                  <el-form-item label="收货地址" prop="demanderDeliveryAddress">
                    <el-input v-model.trim="printObject.demanderDeliveryAddress"
                              maxlength="200"
                              show-word-limit
                              style="width: 300px" placeholder="请填写需求收货地址" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </fieldset>

            <fieldset class="panel-heading">
              <legend class="panel-title">供方
                <el-tooltip class="item" effect="light" placement="right">
                  <div slot="content">
                    采购提供方。
                  </div>
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>
              </legend>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="公司名称" prop="supplierName">
                    <el-input v-model.trim="printObject.supplierName"
                              maxlength="100"
                              show-word-limit
                              style="width: 200px" placeholder="请填写供货方公司名称" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="公司地址" prop="supplierAddress">
                    <el-input v-model.trim="printObject.supplierAddress"
                              maxlength="200"
                              show-word-limit
                              style="width: 300px" placeholder="请填写供货方公司地址" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="联系人" prop="supplierLinkMan">
                    <el-input v-model.trim="printObject.supplierLinkMan"
                              maxlength="20"
                              show-word-limit
                              style="width: 200px" placeholder="请填写供货方联系人" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="联系电话" prop="supplierLinkMethod">
                    <el-input v-model.trim="printObject.supplierLinkMethod"
                              maxlength="20"
                              show-word-limit
                              style="width: 300px" placeholder="请填写供货方联系电话" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="收款银行" prop="supplierBankName">
                    <el-input v-model.trim="printObject.supplierBankName"
                              maxlength="20"
                              show-word-limit
                              style="width: 200px" placeholder="请填写供货方收款银行" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="收款户名" prop="supplierBankAccountName">
                    <el-input v-model.trim="printObject.supplierBankAccountName"
                              maxlength="20"
                              show-word-limit
                              style="width: 300px" placeholder="请填写供货方收款户名" clearable></el-input>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row>
                <el-col :md="24">
                  <el-form-item label="收款账号" prop="supplierBankAccount">
                    <el-input v-model.trim="printObject.supplierBankAccount"
                              maxlength="20"
                              show-word-limit
                              style="width: 300px" placeholder="请填写供货方收款账号" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </fieldset>

            <fieldset class="panel-heading">
              <legend class="panel-title">要求
                <el-tooltip class="item" effect="light" placement="right">
                  <div slot="content">
                    采购合同相关要求。
                  </div>
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>
              </legend>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="采购品类" prop="categoryName">
                    <el-input v-model.trim="printObject.categoryName"
                              maxlength="20"
                              show-word-limit
                              style="width: 200px" placeholder="请填写采购品类" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="结算货币" prop="currency">
                    <el-input v-model.trim="printObject.currency"
                              maxlength="20"
                              show-word-limit
                              style="width: 300px" placeholder="请填写结算货币" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="交货时间" prop="deliveryTime">
                    <el-input v-model.trim="printObject.deliveryTime"
                              maxlength="20"
                              show-word-limit
                              style="width: 200px" placeholder="请填写交货时间" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="生效日期" prop="effectiveDate">

                    <el-date-picker
                      v-model="printObject.effectiveDate"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>

                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="23">
                  <el-form-item label="签约地址" prop="signAddress">
                    <el-input v-model.trim="printObject.signAddress"
                              maxlength="200"
                              show-word-limit
                              style="width: 300px" placeholder="请填写签约地址" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

            </fieldset>

          </el-form>

        </div>
      </el-scrollbar>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">关 闭</el-button>
    </div>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'

  export default {
    components: {},
    props: {},
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),
      title() {
        return '打印采购合同';
      }
    },

    data() {
      return {
        primary: {}, //主对象
        printObject: {},
        dialogVisible: false, //Dialog 是否开启
        loading: false,
        rules: {},
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
      });
    },
    methods: {
      initData() {
        this.printObject.demanderName = '深圳市品海电⼦商务有限公司';
        this.printObject.demanderAddress = '深圳市龙岗区坂田街道永香路江南大厦二楼212室';
        this.printObject.demanderDeliveryAddress = this.primary.warehouse.address;
        this.printObject.supplierName = this.primary.supplier.companyName;
        this.printObject.supplierAddress = this.primary.supplier.address;
        this.printObject.supplierLinkMan = this.primary.supplier.linkman;
        this.printObject.supplierLinkMethod = this.primary.supplier.tel;
        this.printObject.currency = this.primary.currency.name;
        this.initCategoryName();
      },

      /*获取明细列表*/
      initCategoryName() {
        let url = "/procurementOrderItems";
        let filters = [
          {
            field: "procurementOrderId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ]
        url += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});
        let relations = ["product", "product.category"]
        url += "&relations=" + JSON.stringify(relations);

        // 请求开始
        this.loading = true

        console.log(url);
        //获取数据
        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data
            let data = res || []
            let cates = [];

            data.forEach(r => {
              if (cates.indexOf(r.product.category.name) === -1) {
                cates.push(r.product.category.name);
              }
            });
            this.printObject.categoryName = cates.join(",");

            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
      },


      /* 开启弹出编辑框 需要传主键ID */
      openDialog(primary) {
        this.primary = primary;
        console.log(this.primary);
        this.initData();
        this.dialogVisible = true;
      },
      closeDialog() {
        this.primary = {};
        this.printObject = {};
        this.dialogVisible = false;
      },

      /* 子组件编辑完成后相应事件 */
      onPaymentCBEvent(object) {
        this.$emit("paymentCBEvent", object);
      },
    }
  }
</script>

<style type="text/less" lang="scss" scoped>
  .title {
    font-size: 14px;
    font-weight: bold;
  }

  .panel-heading {
    color: #444;
    border: 1px #cfd9db solid;
  }

  .panel-title {
    display: table-cell;
    vertical-align: middle;
    padding: 0 10px;
  }

</style>

