<template>
  <div class="app-container">
    <div class="ph-card">
      <div class="ph-card-body">
        <full-Calendar
          ref="fullCalendar"
          defaultView="dayGridMonth"
          locale="zh"
          selectable="true"
          editable="true"
          droppable="false"
          :header="calendarOptions.header"
          :buttonText="calendarOptions.buttonText"
          :eventRender="calendarOptions.eventRender"
          :plugins="calendarPlugins"
          :weekends="calendarWeekends"
          :events="calendarEvents"
          @dateClick="handleDateClick"
          @eventClick="handleEventClick"
          @datesRender="handleDatesRender"
        />
      </div>
    </div>

    <el-dialog title="创建计划" :visible.sync="planFormVisible" width="60%">
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
        <el-button @click="planFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createPlan">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import fullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dateFormat from "dateformat";

import harbourModel from "../../api/harbour";
import categoryModel from "../../api/category";
import userModel from "../../api/user";
import planModel from "../../api/linerShippingPlan";

// 所有的计划
export default {
  components: {
    fullCalendar: fullCalendar
  },
  name: "plan",
  data() {
    return {
      calendarPlugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      calendarOptions: {
        header: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek"
        },
        buttonText: {
          today: "今天",
          month: "月视图",
          week: "周视图",
          day: "日视图"
        },
        eventRender: function(event) {
          // console.log(event);
          // 事件显示
          event.el.innerHTML = event.event.title;
        }
      },
      calendarWeekends: true,
      calendarEvents: [],

      input: "",
      value: "",
      label: "",
      planFormVisible: false,
      formLabelWidth: "120px",

      fromWarehouses: [],
      toWarehouses: [],
      harbours: [],
      categorys: [],
      users: [],

      plan: {
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
          { required: true, message: "开船时间不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "运输方式不能为空", trigger: "blur" }
        ],
        portOfLoading: [
          { required: true, message: "发货港口不能为空", trigger: "blur" }
        ],
        fromWarehouseId: [
          { required: true, message: "发货仓库不能为空", trigger: "blur" }
        ],
        toWarehouseId: [
          { required: true, message: "收货仓库不能为空", trigger: "blur" }
        ],
        categoryId: [
          { required: true, message: "分类不能为空", trigger: "blur" }
        ],
        merchandiserId: [
          { required: true, message: "负责人不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleDatesRender(v) {
      let start = dateFormat(v.view.activeStart, "yyyy-mm-dd");
      let end = dateFormat(v.view.activeEnd, "yyyy-mm-dd");

      // 获得数据
      let planUrl = `/linerShippingPlans?relations=["fromWarehouse","toWarehouse","creator"]&startTime=${start}&endTime=${end}`;
      this.global.axios.get(planUrl).then(data => {
        if (data.status == 200) {
          this.calendarEvents = [];
          let events = data.data;
          for (let i = 0; i < events.length; i++) {
            let event = events[i];
            let title = planModel.generateEventTitle(event);
            this.addCalendarEvent(event, title);
          }
        }
      });
    },

    handleEventClick(event) {
      this.$message.info(event.event.id);
    },

    handleDateClick(day, jsEvent) {
      this.planFormVisible = true;
      day = day.dateStr;
      // 初始化变量
      let allPlanAttrName = [
        "etdTime",
        "code",
        "type",
        "portOfLoading",
        "fromWarehouseId",
        "toWarehouseId",
        "categoryId",
        "merchandiserId",
        "pallet",
        "oversize",
        "detail"
      ];
      allPlanAttrName.forEach(name => {
        if (name === "etdTime") {
          this.plan[name] = day;
        } else if (name === "categoryId" || name === "merchandiserId") {
          this.plan[name] = [];
          console.log(name, this.plan[name]);
        } else {
          this.plan[name] = "";
        }
      });

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
      this.$refs["planForm"].validate(valid => {
        if (valid) {
          this.plan.category = this.plan.categoryId.join(",");
          this.plan.merchandiser = this.plan.merchandiserId.join(",");

          this.global.axios
            .post("/linerShippingPlans", this.plan)
            .then(data => {
              // 添加新的计划
              if (data.status == 200) {
                let event = data.data;
                let title = planModel.generateEventTitle(event);
                this.addCalendarEvent(event, title);

              }

              // 关闭弹窗
              this.planFormVisible = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addCalendarEvent(event, title) {
      this.calendarEvents.push({
        id: event.id,
        start: event.formatEtdTime,
        title: title.title,
        className: title.className
      });
    }
  }
};
</script>

<style lang='scss'>
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";
@import "~@fullcalendar/timegrid/main.css";

.fc-day-grid-container {
  overflow: visible !important;
}

.fc-content-skeleton td {
  min-height: 200px !important;
}

.label-danger,
.badge-danger {
  background-color: #d15b47 !important;
}

.label-grey,
.badge-grey {
  background-color: #a0a0a0 !important;
}

.label-yellow,
.badge-yellow {
  background-color: #fee188 !important;
}

.label-info,
.badge-info {
  background-color: #3a87ad !important;
}

.label-danger,
.badge-danger {
  background-color: #d15b47 !important;
}

.label-inverse,
.badge-inverse {
  background-color: #333 !important;
}

.label-pink,
.badge-pink {
  background-color: #d6487e !important;
}

.label-success,
.badge-success {
  background-color: #82af6f !important;
}

.fc-header-toolbar {
  padding: 15px 15px 0 15px !important;
}
.fc-widget-header th {
  height: 30px !important;
  vertical-align: middle !important;
  background-color: #efefef;
}
</style>
