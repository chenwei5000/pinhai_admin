<template>
  <div class="app-container">
    <div class="ph-card">
      <div class="ph-card-body">
        <full-calendar
          @changeMonth="changeMonth"
          @eventClick="eventClick"
          @dayClick="dayClick"
          @moreClick="moreClick"
          :events="fcEvents"
          locale="zh"
        >
          <template slot="fc-event-card" scope="p">
            <p>
              <i class="fa">sadfsd</i>
              {{ p.event.title }} test
            </p>
          </template>
        </full-calendar>
      </div>
    </div>

    <el-dialog title="创建计划" :visible.sync="dialogFormVisible" width="60%">
      <fieldset class="panel-heading">
        <legend class="panel-title">基本信息</legend>
        <el-form
          :model="plan"
          :rules="rules"
          ref="planForm"
          label-width="100px"
          class="demo-ruleForm"
          :inline="true"
        >
          <el-form-item label="开船时间" prop="etdTime">
            <el-date-picker v-model="plan.etdTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="编号">
            <el-input placeholder v-model="plan.code" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="运输方式" prop="type">
            <el-select v-model="plan.type" placeholder="请选择" style="width: 100%;">
              <el-option label="海运" value="海运"></el-option>
              <el-option label="空运" value="空运"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="发货港口" prop="portOfLoading">
            <el-select v-model="plan.portOfLoading" placeholder="请选择">
              <el-option
                v-for="(item, idx) in harbours"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="发货仓库" prop="fromWarehouseId">
            <el-select v-model="plan.fromWarehouseId" filterable placeholder="请选择">
              <el-option
                v-for="(item, idx) in fromWarehouses"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="收货仓库" prop="toWarehouseId">
            <el-select v-model="plan.toWarehouseId" filterable placeholder="请选择">
              <el-option
                v-for="(item, idx) in toWarehouses"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="分类" prop="categoryId">
            <el-select v-model="plan.categoryId" multiple filterable placeholder="请选择">
              <el-option
                v-for="(item , idx) in categorys"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="负责人" prop="merchandiserId">
            <el-select v-model="plan.merchandiserId" multiple filterable placeholder="请选择">
              <el-option
                v-for="(item, idx) in users"
                :key="`${idx}-${item.value}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否打托：">
            <el-radio v-model="plan.pallet" label="1" value="1">是</el-radio>
            <el-radio v-model="plan.pallet" label="0" value="0">否</el-radio>
          </el-form-item>

          <el-form-item label="Oversize：" style="margin-left:150px;">
            <el-radio v-model="plan.oversize" label="1" value="1">是</el-radio>
            <el-radio v-model="plan.oversize" label="2" value="0">否</el-radio>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="plan.detail"
              style="width:500px"
            ></el-input>
          </el-form-item>
        </el-form>
      </fieldset>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createPlan">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import fullCalendar from "vue-fullcalendar";
import harbourModel from "../../api/harbour";
import categoryModel from "../../api/category";
import userModel from "../../api/user";

// 所有的计划
let currentPlan = [];
export default {
  components: {
    fullCalendar: fullCalendar
  },
  name: "plan",
  data() {
    return {
      input: "",
      value: "",
      label: "",
      fcEvents: currentPlan,
      dialogFormVisible: false,
      formLabelWidth: "120px",

      fromWarehouses: [],
      toWarehouses: [],
      harbours: [],
      categorys: [],
      users: [],

      plan: {
        etdTime: '',
        code: '',
        type: '',
        portOfLoading: '',
        fromWarehouseId: '',
        toWarehouseId: '',
        category: [],
        merchandiser: [],
        pallet: '',
        oversize: '',
        detail: ''
      },

      rules: {
        etdTime: [{ required: true, message: '开船时间不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '运输方式不能为空', trigger: 'blur' }],
        portOfLoading: [{ required: true, message: '发货港口不能为空', trigger: 'blur' }],
        fromWarehouseId: [{ required: true, message: '发货仓库不能为空', trigger: 'blur' }],
        toWarehouseId: [{ required: true, message: '收货仓库不能为空', trigger: 'blur' }],
        categoryId: [{ required: true, message: '分类不能为空', trigger: 'blur' }],
        merchandiserId: [{ required: true, message: '负责人不能为空', trigger: 'blur' }]
      }
    };
  },
  methods: {
    changeMonth(start, end, current) {
      // 获得数据
      let planUrl = `/linerShippingPlans?relations=["fromWarehouse","toWarehouse","creator"]&startTime=${start}&endTime=${end}`;
      this.global.axios.get(planUrl).then(data => {
        if (data.status == 200) {
          let plans = data.data;
          for (let i = 0; i < plans.length; i++) {
            const e = plans[i];
            let title = "";
            this.fcEvents.push({
              start: e.formatEtaTime,
              end: e.formatEtaTime,
              title: `[${e.portOfLoading}]${e.categoryName}`,
              plan: e
            });
          }
        }
      });
    },
    eventClick(event, jsEvent, pos) {},
    dayClick(day, jsEvent) {
      this.dialogFormVisible = true;

      // 初始化变量
      let allPlanAttrName = ['etdTime', 'code', 'type', 'portOfLoading', 'fromWarehouseId', 'toWarehouseId', 'category', 'merchandiser', 'pallet', 'oversize', 'detail']
      allPlanAttrName.forEach(name => {
        if(name === 'etdTime') {
          this.plan[name] = day
        } else if(name === 'category' || name === 'merchandiser') {
          this.plan[name] = []
        }else {
          this.plan[name] = ''
        }
      })

      // 仓库信息
      let warehousesUrl = `/warehouses?filters={"groupOp":"AND","rules":[{"field":"status","op":"eq","data":"1"}]}&sort=type asc,name`;
      this.global.axios(warehousesUrl).then(data => {
        if (data.status == 200) {
          data.data.rows.forEach(warehouse => {
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
      console.log(
        "harbour.getSelectOptions()",
        harbourModel.getSelectOptions()
      );
      this.harbours = harbourModel.getSelectNameOptions();

      // 分类
      this.categorys = categoryModel.getMineSelectNameOptions();

      // 负责人
      this.users = userModel.getSelectNameOptions();
    },
    moreClick(day, events, jsEvent) {
      // console.log('moreCLick', day, events, jsEvent)
    },
    createPlan() {
      this.$refs['planForm'].validate((valid) => {
        if (valid) {
          this.plan.category = this.plan.categoryId.join(",");
          this.plan.merchandiser = this.plan.merchandiserId.join(",");

          console.log("plan:", this.plan)
          this.global.axios.post('/linerShippingPlans', this.plan).then(data => {
            console.log('post data', data)
            //关掉弹窗
            this.fcEvents.push(data.data);
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.ph-table {
  padding: 10px 15px;
}
</style>
