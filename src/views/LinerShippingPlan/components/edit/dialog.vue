<template>

  <el-dialog :title="dialogTitle"
             class="ph-dialog"
             :visible.sync="formVisible"
             v-if="formVisible"
             @close='closeDialog'
             fullscreen>

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
              <i class="el-icon-ship"></i> 物流信息
            </span>
            <keep-alive>
              <shipFrom @modifiedInfoCBEvent="onModifiedCBEvent" :primary="primary"></shipFrom>
            </keep-alive>
          </el-tab-pane>

          <!-- TODO: name 根据实际情况修改
          <el-tab-pane name="all" lazy>
            <span slot="label">
              <i class="el-icon-s-order"></i> 发货明细
            </span>
            <keep-alive>
              <phTab type="all"/>
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

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import infoForm from './infoForm';
  import shipFrom from './shipFrom';
  import person from './person';
  import attachment from './attachment';

  import planModel from "@/api/linerShippingPlan";

  export default {
    props: {},

    components: {
      infoForm,
      shipFrom,
      person,
      attachment
    },

    computed: {
      dialogTitle() {
        if (this.primary != null && this.primary.code) {
          return `编辑出口计划-编号[${this.primary.code}], 开船时间[${this.primary.formatEtdTime}], 发货港口[${this.primary.portOfLoading}], 品类[${this.primary.categoryName}], 发货仓库[${this.primary.fromWarehouse ? this.primary.fromWarehouse.name : ''}], 收货仓库[${this.primary.toWarehouse ? this.primary.toWarehouse.name : ''}]`;
        }
        else {
          return "编辑出口计划";
        }
      },
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
      }
    }
  };
</script>


<style>
</style>
