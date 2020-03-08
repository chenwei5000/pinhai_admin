<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title"
             class="ph-dialog"
             append-to-body
             v-if="dialogVisible"
             width="80%"
             top="5px"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="block" style="height: 490px;">
      <el-scrollbar style="height: 100%">

        <div class="ph-table">

          <!-- 编辑表单 TODO:-->
          <el-form :rules="rules" :model="primary" status-icon inline
                   ref="detailItem" label-position="right"
                   label-width="120px"
                   inline-message
                   v-if="initComplete"
                   @submit.native.prevent
                   v-loading="loading"
          >
            <fieldset class="panel-heading">
              <legend class="panel-title">需方
                <el-tooltip class="item" effect="light" size="mini" placement="right">
                  <div slot="content">
                    采购需求方。
                  </div>
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>
              </legend>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="联系人" prop="demanderLinkMan">
                    <el-input v-model.trim="primary.demanderLinkMan"
                              maxlength="20"
                              name="demanderLinkMan"
                              show-word-limit
                              @input="updateInput"
                              style="width: 200px" size="mini" placeholder="请填写需求方联系人" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="联系电话" prop="demanderLinkMethod">
                    <el-input v-model.trim="primary.demanderLinkMethod"
                              maxlength="20"
                              name="demanderLinkMethod"
                              show-word-limit
                              @input="updateInput"
                              style="width: 300px" size="mini" placeholder="请填写需求方联系电话" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="23">
                  <el-form-item label="收货地址" prop="demanderDeliveryAddress">
                    <el-input v-model.trim="primary.demanderDeliveryAddress"
                              maxlength="200"
                              name="demanderDeliveryAddress"
                              show-word-limit
                              @input="updateInput"
                              style="width: 300px" size="mini" placeholder="请填写需求收货地址" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </fieldset>

            <fieldset class="panel-heading">
              <legend class="panel-title">供方
                <el-tooltip class="item" effect="light" size="mini" placement="right">
                  <div slot="content">
                    采购提供方。
                  </div>
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>
              </legend>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="公司名称" prop="supplierName">
                    <el-input v-model.trim="primary.supplierName"
                              maxlength="100"
                              name="supplierName"
                              show-word-limit
                              @input="updateInput"
                              style="width: 200px" size="mini" placeholder="请填写供货方公司名称" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="公司地址" prop="supplierAddress">
                    <el-input v-model.trim="primary.supplierAddress"
                              maxlength="200"
                              name="supplierAddress"
                              show-word-limit
                              @input="updateInput"
                              style="width: 300px" size="mini" placeholder="请填写供货方公司地址" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="联系人" prop="supplierLinkMan">
                    <el-input v-model.trim="primary.supplierLinkMan"
                              maxlength="20"
                              name="supplierLinkMan"
                              show-word-limit
                              @input="updateInput"
                              style="width: 200px" size="mini" placeholder="请填写供货方联系人" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="联系电话" prop="supplierLinkMethod">
                    <el-input v-model.trim="primary.supplierLinkMethod"
                              maxlength="20"
                              name="supplierLinkMethod"
                              show-word-limit
                              @input="updateInput"
                              style="width: 300px" size="mini" placeholder="请填写供货方联系电话" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="10">
                  <el-form-item label="收款银行" prop="supplierBankName">
                    <el-input v-model.trim="primary.supplierBankName"
                              maxlength="20"
                              name="supplierBankName"
                              show-word-limit
                              @input="updateInput"
                              style="width: 200px" size="mini" placeholder="请填写供货方收款银行" clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :md="14">
                  <el-form-item label="收款户名" prop="supplierBankAccountName">
                    <el-input v-model.trim="primary.supplierBankAccountName"
                              maxlength="20"
                              name="supplierBankAccountName"
                              show-word-limit
                              @input="updateInput"
                              style="width: 300px" size="mini" placeholder="请填写供货方收款户名" clearable></el-input>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row>
                <el-col :md="24">
                  <el-form-item label="收款账号" prop="supplierBankAccount">
                    <el-input v-model.trim="primary.supplierBankAccount"
                              maxlength="20"
                              name="supplierBankAccount"
                              show-word-limit
                              @input="updateInput"
                              style="width: 300px" size="mini" placeholder="请填写供货方收款账号" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </fieldset>

            <fieldset class="panel-heading">
              <legend class="panel-title">要求
                <el-tooltip class="item" effect="light" size="mini" placement="right">
                  <div slot="content">
                    采购合同相关要求。
                  </div>
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>
              </legend>

              <el-row>
                <el-col :md="23">
                  <el-form-item label="签约地址" prop="signAddress">
                    <el-input v-model.trim="primary.signAddress"
                              maxlength="200"
                              name="signAddress"
                              show-word-limit
                              @input="updateInput"
                              style="width: 300px" size="mini" placeholder="请填写签约地址" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="24">
                  <el-form-item label="结算要求" prop="paymentRequirement">
                    <el-input v-model="primary.paymentRequirement" type="textarea" rows="4"
                              name="paymentRequirement"
                              @input="updateInput"
                              style="width: 800px" size="mini"
                              placeholder="发货后供方需按要求开具增值税专用发票给需方， 款项发货后60天结算"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :md="24">
                  <el-form-item label="质量要求" prop="qualityRequirement">
                    <el-input v-model="primary.qualityRequirement" type="textarea" rows="4"
                              name="qualityRequirement"
                              @input="updateInput"
                              style="width: 800px" size="mini" placeholder="默认为： 参考合同附页"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </fieldset>
          </el-form>

        </div>
      </el-scrollbar>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave" :loading="confirmLoading">保存</el-button>
      <el-button @click="closeDialog">关 闭</el-button>
    </div>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {parseTime} from '@/utils'

  export default {
    components: {},
    props: {},
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),
      title() {
        return `${this.supplier.name}采购合同模版`;
      }
    },

    data() {
      return {
        primary: {}, //主对象
        primaryId: null,
        supplier: {name: ''},
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
        this.initContractInfo();
      },

      /*获取合同信息*/
      initContractInfo() {
        let url = `/procurementContractTpls/${this.primaryId}`;

        // 请求开始
        this.loading = true;

        //获取数据
        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data
            this.primary = res || null;
            this.loading = false;
            this.initComplete = true;

            console.log(this.primary);
            console.log(this.supplier);

            if (this.primary == null) {
              this.primary = {};
              this.primary.demanderDeliveryAddress = '';
              this.primary.supplierName = this.supplier.companyName;
              this.primary.supplierAddress = this.supplier.address;
              this.primary.paymentRequirement = `发货后供方需按要求开具增值税专用发票给需方， 款项发货后60天结算`;
              this.primary.qualityRequirement = '参考合同附页';
            }
            else {
              if (this.primary.demanderDeliveryAddress == null) {
                this.primary.demanderDeliveryAddress == '';
              }
              if (this.primary.supplierName == null || this.primary.supplierName == '') {
                this.primary.supplierName = this.supplier.companyName;
              }
              if (this.primary.supplierAddress == null || this.primary.supplierAddress == '') {
                this.primary.supplierAddress = this.supplier.address;
              }
              if (this.primary.paymentRequirement == null || this.primary.paymentRequirement == '') {
                this.primary.paymentRequirement = `发货后供方需按要求开具增值税专用发票给需方， 款项发货后60天结算`;
              }
              if (this.primary.qualityRequirement == null || this.primary.qualityRequirement == '') {
                this.primary.qualityRequirement = '参考合同附页';
              }
            }
          })
          .catch(err => {
            this.loading = false
            this.initComplete = true;
          })
      },

      /* 开启弹出编辑框 需要传主键ID */
      openDialog(primaryId, supplier) {
        this.primaryId = primaryId
        this.supplier = supplier;
        this.initData();
        this.dialogVisible = true;
      },
      closeDialog() {
        this.primary = {};
        this.supplier = {name: ''};
        this.primaryId = null;
        this.dialogVisible = false;
      },

      /* 子组件编辑完成后相应事件 */
      onPaymentCBEvent(object) {
        this.$emit("paymentCBEvent", object);
      },
      /* 打印合同 */
      onSave() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }
          let url = `/procurementContractTpls/${this.primaryId}`;

          this.global.axios.post(url, this.primary)
            .then(resp => {
              let _newObject = resp.data;
              this.$message({type: 'success', message: '操作成功'});
              this.loading = false;
              this.confirmLoading = false;
              this.$emit("modifyCBEvent", _newObject);
              this.closeDialog();
            })
            .catch(err => {
              this.loading = false;
              this.confirmLoading = false;
            })
        });
      },
      updateInput(val) {
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

