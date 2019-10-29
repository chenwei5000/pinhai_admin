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


    <!--编辑对话框-->
    <editPlanDialog @modifyCBEvent="modifyPlanCBEvent" ref="editPlanDialog">
    </editPlanDialog>

    <!--预付款申请的编辑对话框-->
    <ProcurementOrderpaymentDialog ref="procurementOrderpaymentDialog">
    </ProcurementOrderpaymentDialog>

    <!--编辑对话框-->
    <paymentDialog ref="paymentDialog">
    </paymentDialog>

    <!--编辑对话框-->
    <ProcurementShippedOrderEditDialog ref="procurementShippedOrderEditDialog">
    </ProcurementShippedOrderEditDialog>

    <!--采购单待发货->创建发货计划-编辑对话框-->
    <ProcurementShippedOrderExecutingDialog ref="procurementShippedOrderExecutingDialog">
    </ProcurementShippedOrderExecutingDialog>

    <!--发货单待执行界面 创建发货计划-编辑对话框-->
    <ProcurementShippedOrderExecutingEditDialog ref="procurementShippedOrderExecutingEditDialog">
    </ProcurementShippedOrderExecutingEditDialog>

    <!--采购入库待收货-发货计划-> 执行发货-> 消息给对应采购单创建人、指派人-编辑对话框-->
    <ProcurementReceivedOrderEditDialog ref="procurementReceivedOrderEditDialog">
    </ProcurementReceivedOrderEditDialog>
    <!--查看采购入库完成状态对话框-->
    <procurementReceivedOrderViewDialog ref="procurementReceivedOrderViewDialog">
    </procurementReceivedOrderViewDialog>
    <!--调拨入库-待收货-确认收货对话框框 -->
    <allocationReceivedEditDialog ref="allocationReceivedEditDialog">
    </allocationReceivedEditDialog>

  </div>
</template>

<script>

  import editPlanDialog from '@/views/ProcurementPlan/components/edit/dialog';
  import paymentDialog from '@/views/FinanceBill/components/advanceBill/payment/dialog'
  import procurementOrderpaymentDialog from '@/views/ProcurementOrder/components/edit/paymentDialog'
  import procurementShippedOrderEditDialog from '@/views/ProcurementShippedOrder/components/order/dialog'
  import procurementShippedOrderExecutingDialog from '@/views/ProcurementShippedOrder/components/create/dialog'
  import procurementShippedOrderExecutingEditDialog from '@/views/ProcurementShippedOrder/components/edit/dialog'
  import procurementReceivedOrderEditDialog from '@/views/ProcurementReceivedOrder/components/edit/dialog'
  import procurementReceivedOrderViewDialog from '@/views/ProcurementReceivedOrder/components/view/dialog'
  import allocationReceivedEditDialog from '@/views/AllocationReceived/components/edit/dialog'

  import {parseLineBreak} from '@/utils';

  const filters = {
    all: todos => todos,
    active: todos => todos.filter(todo => todo.isRead == 0),
    completed: todos => todos.filter(todo => todo.isRead == 1)
  }

  export default {
    components: {
      editPlanDialog,
      procurementOrderpaymentDialog,
      paymentDialog,
      procurementShippedOrderEditDialog,
      procurementShippedOrderExecutingDialog,
      procurementShippedOrderExecutingEditDialog,
      procurementReceivedOrderEditDialog,
      procurementReceivedOrderViewDialog,
      allocationReceivedEditDialog
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
        todos: []
      }
    },
    computed: {
      filteredTodos() {
        return filters[this.visibility](this.todos);
      },
      remaining() {
        return this.todos.filter(todo => todo.isRead == 0).length
      }
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

        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data || [];
            this.todos = res || [];
          })
          .catch(err => {
          });
      },

      // 完成任务
      doComplete(val, instance, done) {
        if (val && val.id) {
          this.global.axios
            .put(this.url + '/read/' + val.id)
            .then(res => {
              instance.confirmButtonLoading = false;
              done();
              this.initData();
            })
            .catch(er => {
              instance.confirmButtonLoading = false
            })
        }
      },
      // 修改完成
      modifyPlanCBEvent() {

      },
      goTodo(val) {

        if (val && val.notice) {

          if (val.notice.targetType == "PROCUREMENT_PLAN") {
            this.$refs.editPlanDialog.openDialog(val.notice.target);
          }
          //采购单 -> 发布-> 发消息给 对应采购计划的创建人、指派人
          if(val.notice.targetType == "PROCUREMENT_ORDER"){
            this.$refs.procurementShippedOrderEditDialog.openDialog(val.notice.target);
          }

          if (val.notice.targetType == "FINANCE_ORDER") {
            this.$refs.paymentDialog.openDialog(val.notice.target);
          }

          if (val.notice.targetType == "FINANCE_ORDER_FLOW_OVER") {
            let relations = ["procurementOrder","procurementOrder.supplier", "procurementOrder.currency", "procurementOrder.creator"]
            try{
            this.global.axios
              .get(`/financeBills/${val.notice.target}?relations=${JSON.stringify(relations)}`)
              .then(resp => {
                //console.log("aaaa=>", resp.data);
                if(resp.data && resp.data.procurementOrder){
                  this.$refs.procurementOrderpaymentDialog.openDialog(resp.data.procurementOrder);
                }
                else{
                  this.$message.error("无效付款单!");
                }
              })
              .catch(err => {
              });
            }
            catch (e) {
              console.log(e);
            }
          }
          if (val.notice.targetType == "DATE_CONFIRM") {
            // 弹窗
            this.$refs.procurementShippedOrderExecutingDialog.openDialog(val.notice.target);
          }
          if (val.notice.targetType == "SHIPPED_PLAN_SUCCESS") {
            // 弹窗
            this.$refs.procurementShippedOrderExecutingEditDialog.openDialog(val.notice.target);
          }
          if (val.notice.targetType == "SHIPPED_PLAN_IMPLEMENT") {
            // 弹窗
            this.$refs.procurementReceivedOrderEditDialog.openDialog(val.notice.target);
          }
          //弹窗:采购入库 --- (完成状态)
          if(val.notice.targetType =="PROCUREMENT_WAREHOUSE_SUCCESS"){
            this.$refs.procurementReceivedOrderViewDialog.openDialog(val.notice.target);
          }
          //弹窗:调拨入库-确认收货
          if(val.notice.targetType =="DOMESTIC_ALLOCATION_CONFIRM"){
            this.$refs.allocationReceivedEditDialog.openDialog(val.notice.target);
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
            } else done()
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
