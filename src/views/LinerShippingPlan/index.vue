<template>
  <!-- 日历组件 -->
  <div class="app-container">
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 18}" :xl="{span: 18}"
              style="padding-right:8px;margin-bottom:30px;">
        <el-card class="box-card" style="margin-top:10px;">
          <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
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
          </el-row>
        </el-card>

      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"
              style="margin-bottom:30px;">

        <el-card class="box-card" style="margin-top:10px;padding: 0px;">
          <div slot="header" class="clearfix">
            <svg-icon icon-class="search"/>
            <span style="margin-left:10px;">搜索</span>
          </div>
          <el-row>
            <div class="ph-form">
              <el-form :model="searchParam"
                       ref="searchForm"
                       id="filter-form"
                       inline-message
                       label-width="65px"
                       @submit.native.prevent>


                <el-form-item label="箱号">
                  <el-input size="mini" clearable v-model="searchParam.boxNumber.value" style="width: 120px"
                            placeholder="请输入箱号"></el-input>
                </el-form-item>

                <el-form-item label="提单号">
                  <el-input size="mini" clearable v-model="searchParam.ladingBillNumber.value" style="width: 120px"
                            placeholder="请输入提单号"></el-input>
                </el-form-item>

                <el-form-item label="FBA ID">
                  <el-input size="mini" clearable v-model="searchParam.shipmentId.value" style="width: 120px"
                            placeholder="请输入FBAID"></el-input>
                </el-form-item>

                <el-form-item label="FBA 仓库">
                  <el-input size="mini" clearable v-model="searchParam.destinationFulfillmentCenterId.value"
                            style="width: 120px"
                            placeholder="请输入FBA仓库ID"></el-input>
                </el-form-item>

                <el-form-item label="分类">
                  <el-select size="mini" v-model="searchParam.categoryName.value" style="width: 120px"
                             filterable
                             placeholder="请选择分类">
                    <el-option
                      v-for="(item , idx)  in categorySelectOptions"
                      :label="item.label"
                      :value="item.value"
                      :key="idx"
                    ></el-option>
                  </el-select>

                </el-form-item>

                <el-form-item label="港口">
                  <el-select size="mini" filterable v-model="searchParam.portOfLoading.value" style="width: 120px"
                             placeholder="请选择港口">
                    <el-option
                      v-for="(item,idx) in harbourSelectOptions"
                      :label="item.label" :value="item.value"
                      :key="idx"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-button native-type="submit" type="primary" @click="search" size="mini">查询</el-button>
                  <el-button @click="resetSearch" size="mini">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-row>
        </el-card>

        <el-card class="box-card" style="margin-top:10px;padding: 0px;">
          <div slot="header" class="clearfix">
            <svg-icon icon-class="help"/>
            <span style="margin-left:10px;">颜色说明</span>
          </div>
          <el-row>
            <div class="widget-main">
              <div>
                <div class="external-event label-grey" data-class="label-grey">
                  <i class="el-icon-ship"></i>
                  未确定的计划
                </div>

                <div class="external-event label-yellow" data-class="label-yellow">
                  <i class="el-icon-ship"></i>
                  销售已确定的计划
                </div>

                <div class="external-event label-success" data-class="label-success">
                  <i class="el-icon-ship"></i>
                  船务已确定的计划
                </div>

                <div class="external-event label-info" data-class="label-info">
                  <i class="el-icon-ship"></i>
                  已发货的计划
                </div>

                <div class="external-event label-danger" data-class="label-danger">
                  <i class="el-icon-ship"></i>
                  逾期的计划
                </div>

                <div class="external-event label-inverse" data-class="label-inverse">
                  <i class="el-icon-ship"></i>
                  完成的计划
                </div>

                <div class="external-event label-pink" data-class="label-pink">
                  <i class="el-icon-ship"></i>
                  异常的计划
                </div>

              </div>
            </div>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

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

  </div>
</template>

<script>
  import fullCalendar from "@fullcalendar/vue";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import interactionPlugin from "@fullcalendar/interaction";
  import dateFormat from "dateformat";
  import {parseTime} from '@/utils';
  import qs from 'qs';
  import harbourModel from '@/api/harbour';
  import categoryModel from '@/api/category'

  import planModel from "../../api/linerShippingPlan";
  import createEvent from "./components/createEvent";
  import editEvent from "./components/edit/dialog";

  const valueSeparator = '~'
  const valueSeparatorPattern = new RegExp(valueSeparator, 'g')
  const paramSeparator = ','
  const equal = '='
  const equalPattern = /=/g
  const queryFlag = 'q='
  const queryPattern = new RegExp('q=.*' + paramSeparator)

  export default {
    components: {
      fullCalendar: fullCalendar,
      createEvent: createEvent,
      editEvent: editEvent
    },
    name: "plan",
    data() {
      return {
        calendarPlugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        calendarOptions: {
          header: {
            left: "today",
            center: "title",
            right: "prev,next"
          },
          buttonText: {
            today: "今天",
            month: "月视图",
            week: "周视图",
            day: "日视图"
          },
          eventRender: function (event) {
            // 事件显示
            event.el.innerHTML = event.event.title;
          }
        },
        calendarWeekends: true,
        calendarEvents: [],

        searchParam: {
          portOfLoading: {value: null, op: 'eq', id: 'portOfLoading'},
          shipmentId: {value: null, op: 'eq', id: 'shipmentId'},
          destinationFulfillmentCenterId: {value: null, op: 'eq', id: 'destinationFulfillmentCenterId'},
          categoryName: {value: null, op: 'bw', id: 'categoryName'},
          boxNumber: {value: null, op: 'eq', id: 'boxNumber'},
          ladingBillNumber: {value: null, op: 'eq', id: 'ladingBillNumber'},
        },
        startDate: null,
        endDate: null,
        searchFlg: false,

        url: '/linerShippingPlans',
        relations: ["fromWarehouse", "toWarehouse", "creator"], //搜索关系

        harbourSelectOptions: [],
        categorySelectOptions: [],

      };
    },

    mounted() {
      // 搜索区块，根据url恢复功能
      // 恢复查询条件
      {
        let matches = location.href.match(queryPattern)
        if (matches) {
          let query = matches[0].substr(2).replace(valueSeparatorPattern, equal);
          let params = qs.parse(query, {delimiter: paramSeparator});

          if (params.portOfLoading) {
            this.searchParam.portOfLoading.value = params.portOfLoading;
            this.searchFlg = true;
          }
          if (params.shipmentId) {
            this.searchParam.shipmentId.value = params.shipmentId;
            this.searchFlg = true;
          }
          if (params.destinationFulfillmentCenterId) {
            this.searchParam.destinationFulfillmentCenterId.value = params.destinationFulfillmentCenterId;
            this.searchFlg = true;
          }
          if (params.categoryName) {
            this.searchParam.categoryName.value = params.categoryName;
            this.searchFlg = true;
          }
          if (params.boxNumber) {
            this.searchParam.boxNumber.value = params.boxNumber;
            this.searchFlg = true;
          }
          if (params.ladingBillNumber) {
            this.searchParam.ladingBillNumber.value = params.ladingBillNumber;
            this.searchFlg = true;
          }
        }
      }

      // 渲染完毕，控件加载完毕后执行
      this.$nextTick(() => {
        this.initData();
        if (this.searchFlg) {
          this.loadData();
        }
      })
    },

    methods: {
      initData() {
        this.harbourSelectOptions = harbourModel.getSelectNameOptions();
        this.categorySelectOptions = categoryModel.getMineSelectProdcutNameOptions();
      },

      loadData(shouldStoreQuery) {
        let url = this.url
        let params = '';
        let searchParams = '';

        if (!url) {
          return
        }
        params += "?relations=" + JSON.stringify(this.relations) + "&sort=etdTime&dir=desc";
        // 处理查询
        let filters = [];
        Object.keys(this.searchParam).filter(k => {
          return this.searchParam[k] && this.searchParam[k].value !== ''
            && this.searchParam[k].value !== null && this.searchParam[k].value !== undefined
        }).forEach(param => {
          filters.push({
            'field': param,
            op: this.searchParam[param].op ? this.searchParam[param].op : 'eq',
            data: this.searchParam[param].value ? encodeURIComponent(this.searchParam[param].value.toString().trim()) : ''
          })
        });

        filters.forEach((param, k) => {
          searchParams += "&" + param.field + "=" + encodeURIComponent(param.data ? param.data.toString().trim() : '')
        })

        if (!this.searchFlg) { //设置时间
          let time = `${this.startDate}, ${this.endDate}`;
          filters.push({'field': 'etdTime', op: 'timeRange', data: time});
        }

        if (filters && filters.length > 0) {
          params += "&filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});
        }

        // 请求开始
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        //获取数据
        this.global.axios
          .get(url + params)
          .then(resp => {
            let res = resp.data
            let events = res || []
            this.calendarEvents = [];
            for (let i = 0; i < events.length; i++) {
              let event = events[i];
              let title = planModel.generateEventTitle(event);
              this.addCalendarEvent(event, title);
            }
            loading.close();

            if (this.searchFlg) {
              if (res.length > 0) {
                try {
                  let calendarApi = this.$refs.fullCalendar.getApi();
                  let time = parseTime(events[0].etdTime, '{y}-{m}-{d}');
                  calendarApi.gotoDate(time);
                }
                catch (e) {
                  console.log(e);
                }
              }
              else {
                this.$message.success("无数据");
              }
            }
          })
          .catch(err => {
            loading.close();
          })

        // 存储query记录, 便于后面恢复
        if (shouldStoreQuery > 0) {

          let newUrl = ''
          let searchQuery = queryFlag + (searchParams)
            .replace(/&/g, paramSeparator)
            .replace(equalPattern, valueSeparator) + paramSeparator

          // 非第一次查询
          if (location.href.indexOf(queryFlag) > -1) {
            newUrl = location.href.replace(queryPattern, searchQuery)
          } else {
            let search = location.href.indexOf('?') > -1 ? `&${searchQuery}` : `?${searchQuery}`
            newUrl = location.origin + location.pathname + location.search + location.hash + search
          }
          history.pushState(history.state, 'LinerShippingPlan  search', newUrl)
        }
      },

      handleDatesRender(v) {
        let searchFlg = this.searchFlg || location.href.match(queryPattern);
        if (v) {
          this.startDate = dateFormat(v.view.activeStart, "yyyy-mm-dd");
          this.endDate = dateFormat(v.view.activeEnd, "yyyy-mm-dd");
        }
        if (!searchFlg) {
          this.loadData();
        }
      },

      // 修改
      handleEventClick(event) {
        this.$refs.editEvent.openDialog(event.event.id);
        //this.$refs.shipInfo.$emit("openDialog", event.event.id);

      },
      // 添加
      handleDateClick(day, jsEvent) {
        // 开启弹窗
        this.$refs.createEvent.openDialog(day.dateStr);
      },

      moreClick(day, events, jsEvent) {
        // console.log('moreCLick', day, events, jsEvent)
      },
      addCalendarEvent(event, title) {
        this.calendarEvents.push({
          id: event.id,
          start: parseTime(event.etdTime, '{y}-{m}-{d}'),
          title: title.title,
          className: title.className
        });
      },
      editCalendarEvent(event, title) {
        for (let i = 0; i < this.calendarEvents.length; i++) {
          if (this.calendarEvents[i].id == event.id) {
              this.calendarEvents[i].start = event.formatEtdTime;
              this.calendarEvents[i].title = title.title;
              this.calendarEvents[i].className = title.className;
              break;
          }
        }
      },
      search() {
        this.$refs.searchForm.validate(valid => {
          if (!valid) {
            return
          }
          this.searchFlg = true;
          this.loadData(true);
        })
      },
      /*搜索重置*/
      resetSearch() {
        this.$refs.searchForm.resetFields();

        this.searchParam.portOfLoading.value = null;
        this.searchParam.shipmentId.value = null;
        this.searchParam.destinationFulfillmentCenterId.value = null;
        this.searchParam.categoryName.value = null;
        this.searchParam.boxNumber.value = null;
        this.searchParam.ladingBillNumber.value = null;

        // 重置url
        history.replaceState(history.state, '', location.href.replace(queryPattern, ''))
        this.searchFlg = false;

        this.$nextTick(() => {
          this.loadData()
        });
      },
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
    min-height: 100px !important;
  }

  .fc-day-grid-container {
    overflow: visible !important;
    height: 100% !important;
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
    padding: 5px 15px 0 15px !important;
    margin-bottom: 5px !important;
  }

  .fc-header-toolbar h2 {
    font-size: 20px;
  }

  .fc-button {
    font-size: 12px !important;
  }

  .fc-widget-header th {
    vertical-align: middle !important;
    background-color: #efefef;
  }

  .fc-day-header {
    font-size: 12px !important;
    padding: 5px 0 !important;
  }

  .fc-sun {
    color: red;
  }

  .fc-sat {
    color: green;
  }

  .fc-week {
    font-size: 12px !important;
  }

  .external-event {
    margin: 6px 0;
    padding: 0;
    cursor: default;
    display: block;
    color: #FFF;
    background-color: #abbac3;
    font-size: 13px;
    line-height: 28px;
  }

  .external-event > [class*="icon-"]:first-child {
    display: inline-block;
    height: 32px;
    width: 32px;
    text-align: center;
    line-height: 30px;
    margin-right: 5px;
    font-size: 15px;
    border-right: 1px solid #FFF;
  }
</style>
