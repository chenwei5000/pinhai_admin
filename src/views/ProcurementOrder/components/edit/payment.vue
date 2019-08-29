<template>
  <div>
    <aside style="font-size: 12px">
      采购预付款是指与供货商约定在发货前的付款行为。例如：采购定金、采购打样费用 等等。<BR/>
      采购预付款会在之后采购单结算时，作为已付金额。<BR/>
      <hr/>
      <span style="margin-right: 30px">采购单编号：{{this.primary.code}} </span>
      <span style="margin-right: 30px">供货商：{{this.primary.supplier.name}} </span>
      <span style="margin-right: 30px">结算货币：{{this.primary.currency.name}} </span>
      <span style="margin-right: 30px"> 负责人：
        <template v-for="item in this.primary.dataAuthories">{{ item.user.name }} </template>
      </span>
      <BR/>
      <span style="margin-right: 30px">订单件数：{{this.orderAmount.orderQty}} 件</span>
      <span style="margin-right: 30px">订单箱数：{{this.orderAmount.orderCartonQty}} 箱</span>
      <span style="margin-right: 30px">总金额：
        {{this.orderAmount.orderAmount, this.primary.currency.symbolLeft | currency }}
      </span>
      <span style="margin-right: 30px">申请总金额：
        {{this.paymentAmount.payableAmount, this.primary.currency.symbolLeft | currency }}
      </span>
      <span style="margin-right: 30px">已付总金额：
        {{this.paymentAmount.paymentAmount, this.primary.currency.symbolLeft | currency }}
      </span>
      <hr/>
      预付款记录:<BR/>
      <div class="ph-table">
        <el-table
          :data="financeBills"
          cell-class-name="ph-cell"
          header-cell-class-name="ph-cell-header"
          style="width: 100%">
          <el-table-column
            prop="formatCreateTime"
            label="申请日期"
            width="180">
          </el-table-column>

          <el-table-column
            prop="creator.name"
            label="申请人"
            width="180">
          </el-table-column>

          <el-table-column
            prop="code"
            label="付款单号"
            width="180">
          </el-table-column>

          <el-table-column
            prop="payableAmount"
            label="申请金额"
            width="180">
            <template slot-scope="scope">
              {{scope.row.payableAmount ? scope.row.payableAmount : 0, primary.currency.symbolLeft | currency}}
            </template>
          </el-table-column>

          <el-table-column
            prop="address"
            label="付款金额">
            <template slot-scope="scope">
              {{scope.row.paymentAmount ? scope.row.paymentAmount : 0, primary.currency.symbolLeft | currency}}
            </template>
          </el-table-column>

          <el-table-column
            prop="address"
            label="状态">
            <template slot-scope="scope">
              <el-tag size="small"
                      :type="scope.row.status === 0 ? 'info' :
                      scope.row.status === 1 ? 'warning' : 'success' "
                      disable-transitions> {{ scope.row.status === 0 ? '已拒绝' : scope.row.status === 1 ? '未付款' : '已付款' }}
              </el-tag>
            </template>
          </el-table-column>

        </el-table>
      </div>

    </aside>

    <!-- 编辑表单 TODO:-->
    <el-form :rules="rules" :model="paymentObjet" status-icon inline
             ref="paymentFrom"
             label-position="right"
             label-width="120px"
             v-loading="loading"
    >
      <fieldset class="panel-heading" style="margin-top: 15px">
        <legend class="panel-title">申请付款
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              申请付款
            </div>
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </legend>
        <el-row>
          <el-col :md="8">
            <el-form-item label="申请付款金额" prop="payableAmount">

              <el-input-number v-model="paymentObjet.payableAmount"
                               @change="onPayableAmountChange"
                               :precision="2"
                               style="width: 155px"
                               :min="0"
                               :step="1"
                               :max="10000000" label="申请付款金额">
              </el-input-number>


              <el-tooltip class="item" effect="light" content="申请付款金额" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="8">
            <el-form-item label="最晚付款时间" prop="prepayTime">
              <el-date-picker
                v-model="paymentObjet.prepayTime"
                style="width: 155px"
                type="date"
                placeholder="选择日期">
              </el-date-picker>

              <el-tooltip class="item" effect="light" content="财务必须在该日期前付款" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="8">
            <el-form-item label="金额占比 %" prop="ratio">

              <el-input-number v-model="paymentObjet.ratio"
                               @change="onRatioChange"
                               :precision="2"
                               style="width: 155px"
                               :min="0"
                               :step="1"
                               :max="100" label="金额占比">
              </el-input-number>


              <el-tooltip class="item" effect="light" content="本次付款占总额的百分比。通过设置占比可以自动计算金额。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24">
            <el-row type="flex" justify="center">
              <el-button type="primary" style="margin-top: 40px" @click="onPayment">
                申请
              </el-button>
            </el-row>
          </el-col>
        </el-row>
      </fieldset>

    </el-form>

  </div>
</template>

<script>
  import {currency, intArrToStrArr} from '@/utils'
  import phMembers from '@/components/PhMembers'

  export default {
    components: {
      phMembers
    },
    props: {
      primary: {
        type: [Object],
        default: {}
      }
    },
    computed: {},

    filters: {
      currency: currency
    },

    data() {
      return {
        loading: false,
        url: "/financeBills",
        relations: ["creator"],
        filters: [
          {"field": "relevanceCode", "op": "eq", "data": this.primary.code}
        ],
        orderAmount: {},
        paymentAmount: {},
        financeBills: [],
        paymentObjet: {
          payableAmount: null,
          prepayTime: null,
          ratio: null
        },

        // 字段验证规则 TODO:
        rules: {
          payableAmount: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          prepayTime: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ]
        },
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },
    methods: {
      /********************* 基础方法  *****************************/
      /**
       * 初始化数据
       */
      initData() {
        //获取采购单金额数据
        this.global.axios
          .get(`/procurementOrders/amount/${this.primary.id}`)
          .then(resp => {
            let res = resp.data;
            this.orderAmount = res || {};
          })
          .catch(err => {
          });


        this.global.axios
          .get(`/financeBills/paymentAmount/${this.primary.code}`)
          .then(resp => {
            let res = resp.data;
            this.paymentAmount = res || {};
          })
          .catch(err => {
          });

        let url = this.url;
        if (this.filters && this.filters.length > 0) {
          url += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": this.filters});
        }
        if (this.relations && this.relations.length > 0) {
          url += "&relations=" + JSON.stringify(this.relations);
        }
        url += "&sort=id&dir=desc"

        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data;
            this.financeBills = res || {};
          })
          .catch(err => {
          });
      },

      /********************* 操作按钮相关方法  ***************************/
      onPayableAmountChange(val) {
        this.paymentObjet.ratio = ((val / this.orderAmount.orderAmount) * 100).toFixed(2);
        this.$forceUpdate();
      },

      onRatioChange(val) {
        this.paymentObjet.payableAmount = ((val / 100) * this.orderAmount.orderAmount).toFixed(2);
        this.$forceUpdate();
      },

      onPayment() {
        this.$refs.paymentFrom.validate(valid => {
          if (!valid) {
            return;
          }
          this.$confirm('您确定提交本次付款申请吗？', '提示', {
            type: 'warning',
            beforeClose: (action, instance, done) => {
              if (action == 'confirm') {
                done();
                this.paymentObject();
              } else done()
            }
          }).catch(er => {
            /*取消*/
          })
        });
      },
      paymentObject() {
        let _object = JSON.parse(JSON.stringify(this.paymentObjet));

        this.global.axios.post(`/procurementOrders/applyPayment/${this.primary.id}`, _object)
          .then(resp => {
              let _newObject = resp.data;
              this.loading = false;
              this.confirmLoading = false;
              this.paymentObjet.payableAmount = null;
              this.paymentObjet.prepayTime = null;
              this.paymentObjet.ratio = null;
              this.$refs.paymentFrom.resetFields();
              this.$message.success('操作成功');
              this.initData();
              this.$emit("modifyCBEvent", _newObject);
            }
          )
          .catch(err => {
            console.log(err);
            this.loading = false;
            this.confirmLoading = false;
          })
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .panel-heading {
    color: #444;
    border: 1px #cfd9db solid;
  }

  .panel-title {
    display: table-cell;
    vertical-align: middle;
    padding: 0 10px;
  }

  .el-form-item {
    //margin-bottom: 7px;
  }

  .tag-group {
    .el-tag {
      margin-right: 10px;
    }
  }

</style>

