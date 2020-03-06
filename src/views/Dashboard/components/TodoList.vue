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

    <!--采购预付款 付款 对话框-->
    <advancePaymentDialog @modifyCBEvent="modifyCBEvent" ref="advancePaymentDialog">
    </advancePaymentDialog>

    <!--采购预付款 编辑 对话框-->
    <advancePaymentEditDialog @modifyCBEvent="modifyCBEvent" ref="advancePaymentEditDialog">
    </advancePaymentEditDialog>

    <!--采购付款 付款 对话框-->
    <financeBillPaymentDialog @modifyCBEvent="modifyCBEvent" ref="financeBillPaymentDialog">
    </financeBillPaymentDialog>

    <!--物流付款 付款 对话框 -->
    <logisticPaymentBillPaymentDialog @modifyCBEvent="modifyCBEvent" ref="logisticPaymentBillPaymentDialog">
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
  // 采购预付款 付款
  import advancePaymentDialog from '@/views/FinanceBill/components/advanceBill/payment/dialog'
  // 采购预付款 编辑
  import advancePaymentEditDialog from '@/views/ProcurementOrder/components/edit/paymentDialog'
  // 采购付款 付款
  import financeBillPaymentDialog from '@/views/FinanceBill/components/paymentBill/payment/dialog'
  // 物流付款 付款
  import logisticPaymentBillPaymentDialog from '@/views/FinanceBill/components/logisticPaymentBill/payment/dialog'


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
      advancePaymentEditDialog,
      advancePaymentDialog,
      procurementReceivedOrderEditDialog,
      procurementReceivedOrderViewDialog,
      allocationReceivedEditDialog,
      exportAllocationEditDialog,
      financeBillPaymentDialog,
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
                      (obj.notice.targetType == "FINANCE_ORDER" && obj.notice.action == "agree") ||
                      (obj.notice.targetType == "FINANCE_ORDER" && obj.notice.action == "refuse") ||
                      (obj.notice.targetType == "PROCUREMENT_ORDER_PAYMENT" && obj.notice.action == "agree") ||
                      (obj.notice.targetType == "PROCUREMENT_ORDER_PAYMENT" && obj.notice.action == "refuse") ||
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
                    if (
                      (obj.notice.targetType == "FINANCE_ORDER" && obj.notice.action == "commit") ||
                      (obj.notice.targetType == "PROCUREMENT_ORDER_PAYMENT" && obj.notice.action == "commit") ||
                      (obj.notice.targetType == "LOGISTIC_PAYMENT" && obj.notice.action == "commit")
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
            else {

            }
          }

          // 采购预付款申请
          if (val.notice.targetType == "FINANCE_ORDER") {

            if (this.panelType == 'finance') {
              // 财务付款
              this.$refs.advancePaymentDialog.openDialog(val.notice.target);
              return false;
            }
            // 采购面板，下采购单
            if (this.panelType == 'purchases') {
              if (val.notice.action == 'refuse') {
                let relations = ["procurementOrder", "procurementOrder.supplier", "procurementOrder.currency", "procurementOrder.creator"]
                try {
                  this.global.axios
                    .get(`/financeBills/${val.notice.target}?relations=${JSON.stringify(relations)}`)
                    .then(resp => {
                      if (resp.data && resp.data.procurementOrder) {
                        this.$refs.advancePaymentEditDialog.openDialog(resp.data.procurementOrder);
                      } else {
                        this.$message.error("无效付款单!");
                      }
                    })
                    .catch(err => {
                    });
                } catch (e) {
                  console.log(e);
                }
                return false;
              }
              else if (val.notice.action == 'agree') {
                let relations = ["procurementOrder", "procurementOrder.supplier", "procurementOrder.currency", "procurementOrder.creator"]
                try {
                  this.global.axios
                    .get(`/financeBills/${val.notice.target}?relations=${JSON.stringify(relations)}`)
                    .then(resp => {
                      if (resp.data && resp.data.procurementOrder) {
                        this.$refs.advancePaymentEditDialog.openDialog(resp.data.procurementOrder);
                      } else {
                        this.$message.error("无效付款单!");
                      }
                    })
                    .catch(err => {
                    });
                } catch (e) {
                  console.log(e);
                }
                this.doComplete(val);
                return false;
              }
            }
          }

          // 采购付款申请
          if (val.notice.targetType == "PROCUREMENT_ORDER_PAYMENT") {

            if (this.panelType == 'finance') {
              // 财务付款
              this.$refs.financeBillPaymentDialog.openDialog(val.notice.target);
              return false;
            }
            // 采购面板，查看付款请款
            if (this.panelType == 'purchases') {
              if (val.notice.action == 'refuse' || val.notice.action == 'agree') {
                try {
                  let relations = ["settlementBill"];
                  //this.doComplete(val);
                  this.global.axios
                    .get(`/procurementPaymentOrders/${val.notice.target}?relations=${JSON.stringify(relations)}`)
                    .then(resp => {
                      if (resp.data && resp.data.settlementBill) {

                        let code = resp.data.settlementBill.code;
                        this.$router.push({
                          path: '/m2/SettlementBill_index',
                          query: {s:'all', q: `code~${code},`}
                        });
                        this.doComplete(val);

                      } else {
                        this.$message.error("无效付款单!");
                      }
                    })
                    .catch(err => {
                    });
                } catch (e) {
                  console.log(e);
                }
                return false;
              }
            }
          }

          // 物流付款申请
          if (val.notice.targetType == "PROCUREMENT_ORDER_PAYMENT") {

            if (this.panelType == 'finance') {
              // 财务付款
              this.$refs.logisticPaymentBillPaymentDialog.openDialog(val.notice.target);
              return false;
            }
          }
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
