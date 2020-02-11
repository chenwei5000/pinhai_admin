<template>

  <el-dialog :title="dialogTitle"
             class="ph-dialog"
             :visible.sync="formVisible"
             v-if="formVisible"
             @close='closeDialog'
             fullscreen>

    <el-row
      style="text-align:right; position:fixed; left:0; bottom: 0px; background-color:#FFF; padding: 5px 30px; z-index: 9999; width: 100%;">

      <el-button type="primary" icon="el-icon-truck" @click="onCompleteAllocation" v-if="hasCommit"
                 size="small">
        发布计划
      </el-button>

      <el-button type="danger" size="small" icon="el-icon-delete" v-if="hasDelete" @click="onDelete">
        删除
      </el-button>


      <el-button size="small" @click="closeDialog">取 消</el-button>

    </el-row>

    <div class="ph-card">
      <div class="ph-card-body">

        <el-tabs v-model="activeStatus" type="border-card">

          <!-- TODO: name 根据实际情况修改  -->
          <el-tab-pane name="info" lazy>
            <span slot="label">
              <i class="el-icon-date"></i> 基本信息
            </span>
            <keep-alive>
              <infoForm @modifiedInfoCBEvent="onModifiedCBEvent" :primary="primary"></infoForm>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改 -->
          <el-tab-pane name="ship" class="fontColor" lazy>
            <span slot="label">
              <i class="el-icon-truck"></i> 物流信息
            </span>
            <keep-alive>
              <shipFrom @modifiedInfoCBEvent="onModifiedCBEvent" :primary="primary"></shipFrom>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改 -->
          <el-tab-pane name="all" lazy>
            <span slot="label">
              <i class="el-icon-s-order"></i> 产品明细
            </span>
            <keep-alive>
              <detail :primary="primary" @modifiedInfoCBEvent="onModifiedCBEvent"></detail>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改 -->
          <el-tab-pane name="logisticPayment" lazy v-if="hasPayment">
            <span slot="label">
              <i class="el-icon-money"></i> 物流付款
            </span>
            <keep-alive>
              <logisticPayment @modifiedInfoCBEvent="onModifiedCBEvent" :primary="primary"></logisticPayment>
            </keep-alive>
          </el-tab-pane>


          <!-- TODO: name 根据实际情况修改 -->
          <el-tab-pane name="executing" lazy>
            <span slot="label">
              <i class="el-icon-s-custom"></i> 指派负责人
            </span>
            <keep-alive>
              <person @modifiedInfoCBEvent="onModifiedCBEvent" :primary="primary"></person>
            </keep-alive>
          </el-tab-pane>


          <!-- TODO: name 根据实际情况修改 -->
          <el-tab-pane name="complete" lazy>
            <span slot="label">
              <i class="el-icon-paperclip"></i> 附件
            </span>
            <keep-alive>
              <attachment :primary="primary"></attachment>
            </keep-alive>
          </el-tab-pane>

        </el-tabs>
      </div>
    </div>


    <allocationDialog ref="allocationDialog">
    </allocationDialog>

  </el-dialog>
</template>

<script>
  import infoForm from './infoForm';
  import shipFrom from './shipFrom';
  import person from './person';
  import attachment from './attachment';
  import detail from './table';
  import logisticPayment from '../logisticPayment/table'
  import planModel from "@/api/linerShippingPlan";
  import allocationDialog from './allocationDialog';
  import {checkPermission} from "../../../../utils/permission";

  export default {
    props: {},

    components: {
      infoForm,
      shipFrom,
      person,
      attachment,
      detail,
      logisticPayment,
      allocationDialog
    },

    computed: {
      dialogTitle() {
        if (this.primary != null && this.primary.code) {
          return `编辑物流计划-编号[${this.primary.code}], 开船时间[${this.primary.formatEtdTime}], 发货港口[${this.primary.portOfLoading}], 品类[${this.primary.categoryName}], 发货仓库[${this.primary.fromWarehouse ? this.primary.fromWarehouse.name : ''}], 收货仓库[${this.primary.toWarehouse ? this.primary.toWarehouse.name : ''}]`;
        }
        else {
          return "编辑物流计划";
        }
      },
      hasCommit() {
        if ([1, 2, 3, 4].indexOf(this.primary.status) === -1) {
          return false;
        }

        return checkPermission('LinerShippingPlanResource_postPlan');
      },

      hasDelete() {
        if ([1, 12].indexOf(this.primary.status) > -1) {
          return true;
        }
        return checkPermission('LinerShippingPlanResource_delete');
      },

      hasPayment() {
        return checkPermission('LogisticPaymentBillResource_list');
      }
    },
    mounted() {
    },
    data() {
      return {
        formVisible: false,
        primaryId: null,
        primary: {},
        activeStatus: "info",

        // 资源URL
        url: "/linerShippingPlans",
        relations: ["toWarehouse", "fromWarehouse", "creator"],  // 关联对象

        fromWarehouses: [],
        toWarehouses: [],
        harbours: [],
        categorys: [],
        users: [],
        form: {
          etdTime: "",
          code: "",
          type: "",
          portOfLoading: "",
          fromWarehouseId: "",
          toWarehouseId: "",
          categoryId: [],
          merchandiserId: [],
          pallet: "",
          oversize: "",
          detail: ""
        },
        rules: {
          etdTime: [
            {required: true, message: "开船时间不能为空", trigger: "blur"}
          ],
          type: [
            {required: true, message: "运输方式不能为空", trigger: "blur"}
          ],
          portOfLoading: [
            {required: true, message: "发货港口不能为空", trigger: "blur"}
          ],
          fromWarehouseId: [
            {required: true, message: "发货仓库不能为空", trigger: "blur"}
          ],
          toWarehouseId: [
            {required: true, message: "收货仓库不能为空", trigger: "blur"}
          ],
          categoryId: [
            {required: true, message: "分类不能为空", trigger: "blur"}
          ],
          merchandiserId: [
            {required: true, message: "负责人不能为空", trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      initData() {
        if (this.primaryId) {
          let url = `${this.url}/${this.primaryId}`;
          url += "?relations=" + JSON.stringify(this.relations);
          this.global.axios.get(url)
            .then(data => {
              this.formVisible = true;
              this.primary = data.data || {};
            })
            .catch(err => {
              this.formVisible = false;
              this.closeDialog();
            })
        }
      },

      openDialog(primaryId, activeStatus) {
        this.primaryId = primaryId;
        if (activeStatus) {
          this.activeStatus = activeStatus;
        }
        this.initData();
      },

      closeDialog() {
        this.formVisible = false;
        this.primaryId = null;
        this.primary = {};
      },

      onModifiedCBEvent(obj) {
        this.initData();
        this.$emit("modifiedInfoCBEvent", obj);
        let title = planModel.generateEventTitle(obj);
        this.$emit("editCalendarEvent", obj, title);
      },

      onCompleteAllocation() {
        this.$refs.allocationDialog.openDialog(this.primary);
      },

      onDelete() {
        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              let url = `${this.url}/${this.primaryId}`;
              this.global.axios.delete(url).then(resp => {
                this.$message({type: 'success', message: '删除成功'});
                this.$emit("deleteCalendarEvent", this.primaryId);
                this.closeDialog();
              })
              .catch(err => {
              })
              done();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },
    }
  };
</script>


<style>
</style>
