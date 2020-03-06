<template>
  <div>
    <el-card class="todo-box-card">
      <div slot="header">
        <svg-icon icon-class="skill"/>
        <span style="margin-left:10px;">未处理任务</span>
      </div>

      <el-collapse>

        <el-collapse-item v-for="(todo, index) in filteredTodos"
                          :key="todo.id" :name="todo.id">

          <template slot="title">
            <div class="todo-title">
              <i class="header-icon el-icon-info" style="color: #f25542;margin-right: 5px;"></i>{{todo.notice.title}}
            </div>
          </template>

          <div class="todo-centent">

            <p v-html="br(todo.notice.content)">
            </p>

            <p style="text-align: right">
              <el-button size="mini" type="success" @click="completeTodo(todo)" icon="el-icon-success">已完成</el-button>
              <el-button size="mini" type="primary" @click="goTodo(todo)" icon="el-icon-edit">处理</el-button>
            </p>

          </div>

        </el-collapse-item>

      </el-collapse>


      <!-- footer -->
      <footer class="footer">
      <span>
        <strong>还有{{ remaining }}个任务未处理</strong>
      </span>
      </footer>

    </el-card>


    <!--编辑采购计划对话框-->
    <editPlanDialog @modifyCBEvent="modifyCBEvent" ref="editPlanDialog">
    </editPlanDialog>

    <!--编辑采购创建对话框-->
    <procurementOrderCreateDialog @createCBEvent="modifyCBEvent" ref="procurementOrderCreateDialog">
    </procurementOrderCreateDialog>

    <!--采购入库待收货-发货计划-> 执行发货-> 消息给对应采购单创建人、指派人-编辑对话框-->
    <procurementReceivedOrderEditDialog @modifyCBEvent="modifyCBEvent" ref="procurementReceivedOrderEditDialog">
    </procurementReceivedOrderEditDialog>

    <!--查看采购入库完成状态对话框-->
    <procurementReceivedOrderViewDialog ref="procurementReceivedOrderViewDialog">
    </procurementReceivedOrderViewDialog>

    <!--调拨入库-待收货-确认收货对话框框 -->
    <allocationReceivedEditDialog @modifyCBEvent="modifyCBEvent" ref="allocationReceivedEditDialog">
    </allocationReceivedEditDialog>

    <!--弹窗:出口调拨-待发货-确认发货 -->
    <exportAllocationEditDialog @modifyCBEvent="modifyCBEvent" ref="exportAllocationEditDialog">
    </exportAllocationEditDialog>


    <!--预付款申请的编辑对话框-->
    <procurementOrderpaymentDialog ref="procurementOrderpaymentDialog">
    </procurementOrderpaymentDialog>

    <!--编辑对话框-->
    <paymentDialog ref="paymentDialog">
    </paymentDialog>

    <!--弹窗:确认采购付款单窗口-->
    <financeBillPaymentDialog ref="financeBillPaymentDialog">
    </financeBillPaymentDialog>
    <!--弹窗:采购单-待结算-窗口-->
    <settlementBillViewDialog ref="settlementBillViewDialog">
    </settlementBillViewDialog>
    <!--弹窗：物流付款单，财务确认付款-->
    <logisticPaymentBillPaymentDialog ref="logisticPaymentBillPaymentDialog">
    </logisticPaymentBillPaymentDialog>

  </div>
</template>

<script>

  // 采购计划
  import editPlanDialog from '@/views/ProcurementPlan/components/edit/dialog';
  // 创建采购单
  import procurementOrderCreateDialog from '@/views/ProcurementOrder/components/create/dialog';
  // 采购收货
  import procurementReceivedOrderEditDialog from '@/views/ProcurementReceivedOrder/components/edit/dialog'
  // 采购收货查看
  import procurementReceivedOrderViewDialog from '@/views/ProcurementReceivedOrder/components/view/dialog'
  // 调拨收货
  import allocationReceivedEditDialog from '@/views/AllocationReceived/components/edit/dialog'
  // 出口调拨收货
  import exportAllocationEditDialog from '@/views/ExportAllocation/components/edit/dialog'
  // 采购预付款
  import procurementOrderpaymentDialog from '@/views/ProcurementOrder/components/edit/paymentDialog'
  import financeBillPaymentDialog from '@/views/FinanceBill/components/paymentBill/payment/dialog'
  import settlementBillViewDialog from '@/views/SettlementBill/components/view/dialog'
  import logisticPaymentBillPaymentDialog from '@/views/FinanceBill/components/logisticPaymentBill/payment/dialog'
  import paymentDialog from '@/views/FinanceBill/components/advanceBill/payment/dialog'


  import {parseLineBreak} from '@/utils';
  import {checkRole} from "../../../utils/permission";

  const filters = {
    all: todos => todos,
    active: todos => todos.filter(todo => todo.isRead == 0),
    completed: todos => todos.filter(todo => todo.isRead == 1)
  }

  export default {

    props: {
      // 面板类型
      panelType: {
        type: String,
        default: ''
      }
    },

    components: {
      editPlanDialog,
      procurementOrderCreateDialog,
      procurementOrderpaymentDialog,
      paymentDialog,
      procurementReceivedOrderEditDialog,
      procurementReceivedOrderViewDialog,
      allocationReceivedEditDialog,
      exportAllocationEditDialog,
      financeBillPaymentDialog,
      settlementBillViewDialog,
      logisticPaymentBillPaymentDialog
    },
    filters: {
      pluralize: (n, w) => n === 1 ? w : w + 's',
      capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
    },
    data() {
      return {
        url: '/userNotices',
        visibility: 'all',
        filters,
        selTodo: {},
        todos: []
      }
    },
    computed: {
      filteredTodos() {
        return filters[this.visibility](this.todos);
      },
      remaining() {
        return this.todos.filter(todo => todo.isRead == 0).length
      },
      hasPurchases() {
        return checkRole("采购");
      },
      hasDocumentary() {
        return checkRole("跟单");
      },
      hasSales() {
        return checkRole("销售");
      },
      hasStockManager() {
        return checkRole("库管");
      },
      hasFinance() {
        return checkRole("财务");
      },
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },

    methods: {
      br(text) {
        return parseLineBreak(text);
      },
      initData() {
        let url = this.url;
        let filters = [];
        filters.push({
          'field': "isRead",
          op: 'eq',
          data: '0'
        })
        url += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});
        let relations = ["notice"];
        url += "&relations=" + JSON.stringify(relations);
        if (this.$store.state.user.token) {
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data || [];
              this.todos = [];
              res.forEach(obj => {
                if (obj && obj.notice) {
                  if (this.panelType == '') {
                    //通用
                    this.todos.push(obj);
                  }
                  else if (this.panelType == 'sales') {
                    // 销售
                    if (obj.notice.targetType == "PROCUREMENT_PLAN" && obj.notice.action != "release") {
                      this.todos.push(obj);
                    }
                  }
                  else if (this.panelType == 'purchases') {
                    // 采购
                    if (
                      (obj.notice.targetType == "PROCUREMENT_PLAN" && obj.notice.action == "release") ||
                      (obj.notice.targetType == "PROCUREMENT_ORDER" && obj.notice.action != "release")
                    ) {
                      this.todos.push(obj);
                    }
                  }
                  else if (this.panelType == 'documentary') {
                    // 跟单
                    if (obj.notice.targetType == "PROCUREMENT_ORDER" ||
                      (obj.notice.targetType == "PROCUREMENT_SHIPPED_ORDER" && obj.notice.action == "received")
                    ) {
                      this.todos.push(obj);
                    }
                  }
                  else if (this.panelType == 'finance') {
                    // 财务
                    if (obj.notice.targetType == "FINANCE_ORDER" ||
                      obj.notice.targetType == "PROCUREMENT_ORDER_PAYMENT" ||
                      obj.notice.targetType == "LOGISTIC_PAYMENT"
                    ) {
                      this.todos.push(obj);
                    }
                  }
                  else if (this.panelType == 'stockManager') {
                    // 库管
                    if (
                      (obj.notice.targetType == "PROCUREMENT_SHIPPED_ORDER" && obj.notice.action == "shipped") ||
                      obj.notice.targetType == "WAREHOUSE_ALLOCATION" ||
                      obj.notice.targetType == "RETURN_ORDER" ||
                      obj.notice.targetType == "LINERSHIPPING_PLAN"
                    ) {
                      this.todos.push(obj);
                    }
                  }
                  else {


                    //obj.notice.targetType == "PROCUREMENT_ORDER_PAYMENT_APPLY" ||
                    // inventoryTask("INVENTORY_TASK", "盘点任务"),
                    // procurementShippedOrder("PROCUREMENT_SHIPPED_ORDER", "采购发货单"),
                    // warehouseAllocation("WAREHOUSE_ALLOCATION", "调拨单"),
                    // returnOrder("RETURN_ORDER", "退货单"),
                    // financeOrder("FINANCE_ORDER", "采购预付款账单"),
                    // financeOrderFlowOver("FINANCE_ORDER_FLOW_OVER", "采购预付款账单-完成付款"),
                    // dateConfirm("DATE_CONFIRM", "确认完成日期"),
                    // shippedPlanSuccess("SHIPPED_PLAN_SUCCESS", "创建发货计划成功"),
                    // shippedPlanImplement("SHIPPED_PLAN_IMPLEMENT","执行发货计划"),
                    // procurementWarehouseSuccess("PROCUREMENT_WAREHOUSE_SUCCESS","确认收货"),
                    // domesticAllocationConfirmShipped("DOMESTIC_ALLOCATION_CONFIRM","国内调拨执行发货"),
                    // logisticPaymentOrderApply("LOGISTIC_PAYMENT_ORDER_APPLY", "物流付款单申请待确认"),
                    // logisticPaymentOrderRefuse("LOGISTIC_PAYMENT_ORDER_REFUSE", "物流付款单申请拒绝"),
                    // logisticPaymentOrderAgree("LOGISTIC_PAYMENT_ORDER_AGREE", "物流付款单已付款");

                  }
                }
              });
            })
            .catch(err => {

            });
        }
      },

      // 完成任务
      doComplete(val, instance, done) {
        if (val && val.id) {
          this.global.axios
            .put(this.url + '/read/' + val.id)
            .then(res => {
              if (instance) {
                instance.confirmButtonLoading = false;
                done();
              }
              this.initData();
            })
            .catch(er => {
              if (instance) {
                instance.confirmButtonLoading = false;
              }
            })
        }
      },
      // 修改完成
      modifyCBEvent() {
        this.doComplete(this.selTodo);
      },
      // 处理任务
      goTodo(val) {
        this.selTodo = val;
        if (val && val.notice) {

          // 采购计划
          if (val.notice.targetType == "PROCUREMENT_PLAN") {

            // 采购面板，下采购单
            if (this.panelType == 'purchases') {
              this.$refs.procurementOrderCreateDialog.openDialog(val.notice.target);
              return false;
            }

            // 销售面板  审核采购、查看计划
            if (this.panelType == 'sales') {
              this.$refs.editPlanDialog.openDialog(val.notice.target);

              if (val.notice.action == "agree") {
                this.doComplete(val);
              }
              return false;
            }
          }

          //采购单
          if (val.notice.targetType == "PROCUREMENT_ORDER") {
            // 跟单面板
            if (this.panelType == 'documentary') {
              // 设置交期
              if (val.notice.action == "release") {
                var code = val.notice.content.match(/PO\d{14}/)[0];
                this.$router.push({
                  path: '/m2/ProcurementShippedOrder_index',
                  query: {q: `procurementOrder_code~${code},`}
                });
                this.doComplete(val);
              }
              return false;
            }
          }

          // 发货单
          if (val.notice.targetType == "PROCUREMENT_SHIPPED_ORDER") {
            // 库管面板
            if (this.panelType == 'stockManager') {
              // 采购入库
              if (val.notice.action == "shipped") {
                this.$refs.procurementReceivedOrderEditDialog.openDialog(val.notice.target);
              }
            }

            if (this.panelType == 'documentary') {
              // 入库完成
              if (val.notice.action == "received") {
                this.$refs.procurementReceivedOrderViewDialog.openDialog(val.notice.target);
                this.doComplete(val);
              }
              return false;
            }
          }

          // 国内调拨单
          if (val.notice.targetType == "WAREHOUSE_ALLOCATION") {
            // 库管面板
            if (this.panelType == 'stockManager') {
              // 调拨发货处理
              if (val.notice.action == "release") {
                this.$router.push({
                  path: '/m3/WarehouseAllocation_index'
                });
                this.doComplete(val);
              }
              // 调拨收货处理
              if (val.notice.action == "shipped") {
                this.$refs.allocationReceivedEditDialog.openDialog(val.notice.target);
              }
            }
          }

          // 物流计划
          if (val.notice.targetType == "LINERSHIPPING_PLAN") {
            // 库管面板
            if (this.panelType == 'stockManager') {
              // 调拨发货处理
              if (val.notice.action == "release" || val.notice.action == "update") {
                this.$refs.exportAllocationEditDialog.openDialog(val.notice.target);
              }
            }
            else{

            }
          }



          // 采购预付款申请
          if (val.notice.targetType == "FINANCE_ORDER") {
            // 财务付款
            this.$refs.paymentDialog.openDialog(val.notice.target);
            return;
          }

          if (val.notice.targetType == "FINANCE_ORDER_FLOW_OVER") {
            let relations = ["procurementOrder", "procurementOrder.supplier", "procurementOrder.currency", "procurementOrder.creator"]
            try {
              this.global.axios
                .get(`/financeBills/${val.notice.target}?relations=${JSON.stringify(relations)}`)
                .then(resp => {
                  //console.log("aaaa=>", resp.data);
                  if (resp.data && resp.data.procurementOrder) {
                    this.$refs.procurementOrderpaymentDialog.openDialog(resp.data.procurementOrder);
                  } else {
                    this.$message.error("无效付款单!");
                  }
                })
                .catch(err => {
                });
            } catch (e) {
              console.log(e);
            }
            return;
          }
          if (val.notice.targetType == "SHIPPED_PLAN_SUCCESS") {
            // 弹窗
            //this.$refs.procurementShippedOrderExecutingEditDialog.openDialog(val.notice.target);
            return;
          }
          //弹窗:采购入库 --- (完成状态)
          if (val.notice.targetType == "PROCUREMENT_WAREHOUSE_SUCCESS") {
            return;
          }
          //弹窗:调拨入库-确认收货
          if (val.notice.targetType == "DOMESTIC_ALLOCATION_CONFIRM") {
            return;
          }
          //弹窗:出口调拨-待发货-确认发货
          if (val.notice.targetType == "LINERSHIPPING_PLAN") {
            return;
          }
          //弹窗:确认采购付款单
          if (val.notice.targetType == "PROCUREMENT_ORDER_PAYMENT_APPLY") {
            this.$refs.financeBillPaymentDialog.openDialog(val.notice.target);
            return;
          }
          //弹窗:待结算 详情
          if (val.notice.targetType == "PROCUREMENT_ORDER_PAYMENT_REFUSE") {
            this.$refs.settlementBillViewDialog.openDialog(val.notice.target);
            return;
          }
          //弹窗：采购结算 详情
          if (val.notice.targetType == "PROCUREMENT_ORDER_PAYMENT_AGREE") {
            this.$refs.settlementBillViewDialog.openDialog(val.notice.target);
            return;
          }
          //弹窗：物流付款单，财务确认付款
          if (val.notice.targetType == "LOGISTIC_PAYMENT_ORDER_APPLY") {
            this.$refs.logisticPaymentBillPaymentDialog.openDialog(val.notice.target);
            return;
          }
          //弹窗：物流付款单，申请人查看是否通过
          // if(val.notice.targetType =="LOGISTIC_PAYMENT_ORDER_REFUSE"){

          // }
          //弹窗：物流付款单，申请人查看是否通过
          // if(val.notice.targetType =="LOGISTIC_PAYMENT_ORDER_AGREE"){

          // }

        }
      },
      completeTodo(val) {
        this.$confirm('确认该任务已经完成了吗?', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              this.doComplete(val, instance, done);
            } else {
              instance.confirmButtonLoading = false;
              done()
            }
          }
        }).catch(er => {
          /*取消*/
        })
      },
    }
  }
</script>

<style lang="scss">

  .todo-box-card {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 300;
    background: #fff;
    z-index: 1;
    position: relative;

  /deep/ .el-card__body {
    padding: 0;
  }

  /deep/ .el-card__header {
    border-bottom: none;
  }

  .todo-title {
    padding: 0 0 0 10px;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .todo-centent {
    padding: 5px 20px;
    font-size: 14px;

  p {
    max-height: 410px;
    overflow-y: hidden;
  }

  }

  .footer {
    color: #000;
    position: relative;
    padding: 10px 15px;
    font-size: 14px;
    height: 40px;
    text-align: center;
    min-width: 230px;
    max-width: 550px;
    margin: 0 auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 300;
    background: #fff;
    z-index: 1;
    position: relative;
  }

  }
</style>
