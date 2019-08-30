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
                   inline-message
                   v-if="initComplete"
                   @submit.native.prevent
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
                              name="demanderName"
                              @input="updateInput"
                              style="width: 200px" placeholder="请填写需求方公司名称" clearable>

                    </el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="公司地址" prop="demanderAddress">
                    <el-input v-model.trim="printObject.demanderAddress"
                              maxlength="200"
                              name="demanderAddress"
                              show-word-limit
                              @input="updateInput"
                              style="width: 300px" placeholder="请填写需求方公司地址" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="联系人" prop="demanderLinkMan">
                    <el-input v-model.trim="printObject.demanderLinkMan"
                              maxlength="20"
                              name="demanderLinkMan"
                              show-word-limit
                              @input="updateInput"
                              style="width: 200px" placeholder="请填写需求方联系人" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="联系电话" prop="demanderLinkMethod">
                    <el-input v-model.trim="printObject.demanderLinkMethod"
                              maxlength="20"
                              name="demanderLinkMethod"
                              show-word-limit
                              @input="updateInput"
                              style="width: 300px" placeholder="请填写需求方联系电话" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="23">
                  <el-form-item label="收货地址" prop="demanderDeliveryAddress">
                    <el-input v-model.trim="printObject.demanderDeliveryAddress"
                              maxlength="200"
                              name="demanderDeliveryAddress"
                              show-word-limit
                              @input="updateInput"
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
                              name="supplierName"
                              show-word-limit
                              @input="updateInput"
                              style="width: 200px" placeholder="请填写供货方公司名称" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="公司地址" prop="supplierAddress">
                    <el-input v-model.trim="printObject.supplierAddress"
                              maxlength="200"
                              name="supplierAddress"
                              show-word-limit
                              @input="updateInput"
                              style="width: 300px" placeholder="请填写供货方公司地址" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="联系人" prop="supplierLinkMan">
                    <el-input v-model.trim="printObject.supplierLinkMan"
                              maxlength="20"
                              name="supplierLinkMan"
                              show-word-limit
                              @input="updateInput"
                              style="width: 200px" placeholder="请填写供货方联系人" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="联系电话" prop="supplierLinkMethod">
                    <el-input v-model.trim="printObject.supplierLinkMethod"
                              maxlength="20"
                              name="supplierLinkMethod"
                              show-word-limit
                              @input="updateInput"
                              style="width: 300px" placeholder="请填写供货方联系电话" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="收款银行" prop="supplierBankName">
                    <el-input v-model.trim="printObject.supplierBankName"
                              maxlength="20"
                              name="supplierBankName"
                              show-word-limit
                              @input="updateInput"
                              style="width: 200px" placeholder="请填写供货方收款银行" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="收款户名" prop="supplierBankAccountName">
                    <el-input v-model.trim="printObject.supplierBankAccountName"
                              maxlength="20"
                              name="supplierBankAccountName"
                              show-word-limit
                              @input="updateInput"
                              style="width: 300px" placeholder="请填写供货方收款户名" clearable></el-input>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row>
                <el-col :md="24">
                  <el-form-item label="收款账号" prop="supplierBankAccount">
                    <el-input v-model.trim="printObject.supplierBankAccount"
                              maxlength="20"
                              name="supplierBankAccount"
                              show-word-limit
                              @input="updateInput"
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
                              name="categoryName"
                              show-word-limit
                              @input="updateInput"
                              style="width: 200px" placeholder="请填写采购品类" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="结算货币" prop="currency">
                    <el-input v-model.trim="printObject.currency"
                              maxlength="20"
                              name="currency"
                              show-word-limit
                              @input="updateInput"
                              style="width: 300px" placeholder="请填写结算货币" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="交货时间" prop="deliveryTime">
                    <el-date-picker
                      v-model="printObject.deliveryTime"
                      name="deliveryTime"
                      type="date"
                      size="small"
                      format="yyyy年M月d日"
                      placeholder="选择交货时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-input type="hidden" style="display: none" v-model="printObject.effectiveDateStart"
                            name="effectiveDateStart"></el-input>
                  <el-input type="hidden" style="display: none" v-model="printObject.effectiveDateEnd"
                            name="effectiveDateEnd"></el-input>
                  <el-form-item label="生效日期" prop="effectiveDate">
                    <el-date-picker
                      v-model="printObject.effectiveDate"
                      type="daterange"
                      size="small"
                      format="yyyy年M月d日"
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
                              name="signAddress"
                              show-word-limit
                              @input="updateInput"
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
      <el-button type="primary" @click="onPrint" :loading="confirmLoading">生成合同</el-button>
      <el-button @click="closeDialog">关 闭</el-button>
    </div>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {parseTime} from '@/utils'
  import validRules from '@/components/validRules'

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
        initComplete: false,
        confirmLoading: false,
        rules: {
          demanderName: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          demanderAddress: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          demanderLinkMan: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          demanderLinkMethod: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          supplierName: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          supplierAddress: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          supplierLinkMan: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          supplierLinkMethod: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          supplierBankName: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          supplierBankAccountName: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          supplierBankAccount: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          categoryName: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          currency: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          deliveryTime: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          effectiveDate: [
            {required: true, message: '*', trigger: 'blur'}
          ],
          signAddress: [
            {required: true, message: '*', trigger: 'blur'}
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
      initData() {
        this.initComplete = false;
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
        this.loading = true;

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
            this.initComplete = true;
          })
          .catch(err => {
            this.loading = false
            this.initComplete = true;
          })
      },


      /* 开启弹出编辑框 需要传主键ID */
      openDialog(primary) {
        this.primary = primary;
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
      /* 打印合同 */
      onPrint() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }
          // ajax获取合同数据
          if (this.printObject.effectiveDate) {
            this.printObject.effectiveDateStart = parseTime(this.printObject.effectiveDate[0], "{y}年{m}月{d}日");
            this.printObject.effectiveDateEnd = parseTime(this.printObject.effectiveDate[1], "{y}年{m}月{d}日");
          }
          let url = `${this.global.generateUrl("/pdfs/purchaseContract")}/${this.primary.id}?accessToken=${this.$store.state.user.token}`;
          let form = this.$refs.detailItem.$el;
          console.log(form);
          form.action = url;
          form.method = "POST";
          form.target = "_blank";
          this.$refs.detailItem.$el.submit();
        });
      },
      updateInput(val){
        this.$forceUpdate();
      }
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

