<template>
  <el-dialog class="ph-dialog"
             title="创建计划"
             :visible.sync="formVisible"
             v-if="formVisible"
             width="70%"
             top="10vh"
             @close='closeDialog'>

    <div class="ph-form">
      <el-form
        :model="plan"
        :rules="rules"
        ref="form"
        label-width="100px"
        inline-message
        :inline="true"
      >
        <el-row>
          <el-col :md="10">
            <el-form-item label="运输方式" prop="type">
              <el-select
                v-model="plan.type"
                size="mini"
                @input="updateInput"
                style="width: 200px"
                placeholder="请选择">
                <el-option label="海运" value="海运"></el-option>
                <el-option label="空运" value="空运"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item :label="plan.type=='空运'? '航班时间' : '开船时间'" prop="etdTime">
              <el-date-picker
                size="mini"
                v-model="plan.etdTime"
                type="datetime"
                @input="updateInput"
                style="width: 200px"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item :label="plan.type=='空运'? '发货机场' : '发货港口'" prop="portOfLoading">
              <el-select
                v-model="plan.portOfLoading"
                size="mini"
                style="width: 200px"
                @input="updateInput"
                placeholder="请选择">
                <el-option
                  v-for="(item, idx) in harbours"
                  :key="`${idx}-${item.value}`"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="分类" prop="categoryId">
              <el-select
                v-model="plan.categoryId"
                size="mini"
                style="width: 200px"
                @input="updateInput"
                multiple
                filterable
                placeholder="请选择">
                <el-option
                  v-for="(item , idx) in categorys"
                  :key="`${idx}-${item.value}`"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="发货仓库" prop="fromWarehouseId">
              <el-select
                v-model="plan.fromWarehouseId"
                size="mini"
                style="width: 200px"
                filterable
                @input="updateInput"
                placeholder="请选择发货仓库">
                <el-option
                  v-for="(item, idx) in fromWarehouses"
                  :key="`${idx}-${item.value}`"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="收货仓库" prop="toWarehouseId">
              <el-select
                v-model="plan.toWarehouseId"
                size="mini"
                style="width: 200px"
                filterable
                @change="loadOtdTime"
                placeholder="请选择">
                <el-option
                  v-for="(item, idx) in toWarehouses"
                  :key="`${idx}-${item.value}`"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="false">
          <el-col :md="24">
            <el-form-item label="负责人" prop="merchandiserId">
              <el-select
                v-model="plan.merchandiserId"
                size="mini"
                style="width: 200px"
                multiple filterable placeholder="请选择">
                <el-option
                  v-for="(item, idx) in users"
                  :key="`${idx}-${item.value}`"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="是否打托" prop="pallet">
              <el-radio-group
                v-model.number="plan.pallet"
                size="mini">
                <el-radio-button label="1" value="1">开启</el-radio-button>
                <el-radio-button label="0" value="0">关闭</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="Oversize" prop="oversize">
              <el-radio-group
                v-model.number="plan.oversize"
                size="mini">
                <el-radio-button label="1" value="1">是</el-radio-button>
                <el-radio-button label="0" value="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="12">
            <el-form-item label="下次发柜时间" prop="nextDeliveryTime" ref="nextDeliveryTime">
              <el-date-picker
                size="mini"
                v-model="plan.nextDeliveryTime"
                type="datetime"
                style="width: 200px"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :md="24">
            <el-form-item label="备注">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="plan.detail"
                style="width:500px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="createPlan">确 定</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import harbourModel from "../../../api/harbour";
  import categoryModel from "../../../api/category";
  import planModel from "../../../api/linerShippingPlan";
  // loading 组件
  import {Loading} from "element-ui";

  let loadingInstance = null;

  const showLoading = () => {
    loadingInstance = Loading.service({fullscreen: true});
  };
  const closeLoding = () => {
    if (loadingInstance) {
      loadingInstance.close();
    }
  };

  export default {
    props: {},

    computed: {
      hasCategory() {
        if (this.plan.categoryId == null || this.plan.categoryId.length == 0) {
          return true;
        }
        else {
          return false;
        }
      }
    },

    data() {
      return {
        fromWarehouses: [],
        toWarehouses: [],
        harbours: [],
        categorys: [],
        users: [],

        formVisible: false,

        plan: {
          pallet: 0,
          oversize: 0,
        },

        rules: {
          etdTime: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          type: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          portOfLoading: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          fromWarehouseId: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          toWarehouseId: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          categoryId: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          merchandiserId: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          oversize: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          pallet: [
            {required: true, message: "必填", trigger: "blur"}
          ]
        }
      };
    },

    mounted() {
    },
    methods: {
      initData() {
        // 仓库信息
        let warehousesUrl = `/warehouses?filters={"groupOp":"AND","rules":[{"field":"status","op":"eq","data":"1"}]}&sort=type asc,name`;
        this.global.axios(warehousesUrl).then(data => {
          if (data.status == 200) {
            this.fromWarehouses = [];
            this.toWarehouses = [];
            data.data.forEach(warehouse => {
              if (
                warehouse.type == "工厂仓" ||
                warehouse.type == "普通" ||
                warehouse.type == "虚拟仓"
              ) {
                this.fromWarehouses.push({
                  value: warehouse.id,
                  label: warehouse.name
                });
              } else if (warehouse.type == "海外仓") {
                this.toWarehouses.push({
                  value: warehouse.id,
                  label: warehouse.name
                });
              }
            });
          }
        });

        // 港口信息
        this.harbours = harbourModel.getSelectNameOptions();

        // 分类
        this.categorys = categoryModel.getMineSelectProdcutOptions();

        // 负责人
        //this.users = userModel.getSelectNameOptions();
      },

      openDialog(day) {
        this.formVisible = true;
        this.plan.etdTime = day;
        this.plan.pallet = 0;
        this.plan.oversize = 0;
        this.plan.type = '海运';
        this.initData();
      },

      closeDialog() {
        this.fromWarehouses = [];
        this.toWarehouses = [];
        this.harbours = [];
        this.categorys = [];
        this.users = [];
        this.formVisible = false;
        this.plan = {
          pallet: 0,
          oversize: 0,
        };
      },

      createPlan() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: '创建中...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });

            this.global.axios
              .post("/linerShippingPlans", this.plan)
              .then(data => {
                let event = data.data;
                let title = planModel.generateEventTitle(event);
                this.$emit("addCalendarEvent", event, title);
                loading.close();
                this.closeDialog();
              })
              .catch(err => {
                loading.close();
              })
          } else {
            return false;
          }
        });
      },
      updateInput(val) {
        this.$forceUpdate();
      }

    }
  };
</script>


<style>
</style>
