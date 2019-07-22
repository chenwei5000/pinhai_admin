<template>
  <!-- 日历组件 -->
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

    <!-- 创建 event -->
    <createEvent 
    ref="createEvent"
    @addCalendarEvent="addCalendarEvent"
    ></createEvent>

    <!-- 编辑 event -->
    <editEvent 
    ref="editEvent"
    @editCalendarEvent="editCalendarEvent"
    ></editEvent>

    <!-- 订船信息 -->
    <shipInfo
    ref="shipInfo"
    ></shipInfo>
  </div>
</template>

<script>
import fullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dateFormat from "dateformat";

import planModel from "../../api/linerShippingPlan";

// 创建 event dialog
import createEvent from "./components/createEvent";

// 
import editEvent from "./components/editEvent";

// 订船信息
import shipInfo from "./components/shipInfo";

export default {
  components: {
    fullCalendar: fullCalendar,
    createEvent: createEvent,
    editEvent: editEvent,
    shipInfo: shipInfo
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
      calendarEvents: []
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
      // this.$refs.editEvent.$emit("openDialog", event.event.id);
      this.$refs.shipInfo.$emit("openDialog", event.event.id);

    },

    handleDateClick(day, jsEvent) {
      // 开启弹窗
      this.$refs.createEvent.$emit("openDialog", day.dateStr);
    },
    moreClick(day, events, jsEvent) {
      // console.log('moreCLick', day, events, jsEvent)
    },
    addCalendarEvent(event, title) {
      this.calendarEvents.push({
        id: event.id,
        start: event.formatEtdTime,
        title: title.title,
        className: title.className
      });
    },
    editCalendarEvent(event, title) {
      for(let i = 0; i < this.calendarEvents.length; i++) {
        if(this.calendarEvents[i].id == event.id) {
          this.calendarEvents[i].start = event.formatEtdTime,
          this.calendarEvents[i].title = title.title,
          this.calendarEvents[i].className = title.className
        }
      }
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
