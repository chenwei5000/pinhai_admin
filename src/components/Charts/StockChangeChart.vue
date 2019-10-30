<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    primary: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      chart: null,
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
     let option = {
          title: {
              text: '最近20周库存统计',
              subtext: ''
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data:['库存量','在途量']
          },
          toolbox: {
              show: true,
              feature: {
                  dataZoom: {
                      yAxisIndex: 'none'
                  },
                  dataView: {readOnly: false},
                  magicType: {type: ['line', 'bar']},
                  restore: {},
                  saveAsImage: {}
              }
          },
          xAxis:  {
              type: 'category',
              boundaryGap: false,
              data: this.primary.xAxisData
          },
           yAxis: [{
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }],
          series: [
              {
                  name:'库存量',
                  type:'line',
                  data: this.primary.yAxisData1,
                  markPoint: {
                      data: [
                          {type: 'max', name: '最大值'},
                          {type: 'min', name: '最小值'}
                      ]
                  },
                  markLine: {
                      data: [
                          {type: 'average', name: '平均值'}
                      ]
                  }
              },
              {
                  name:'在途量',
                  type:'line',
                  data: this.primary.yAxisData2,
                  markPoint: {
                      data: [
                          {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                      ]
                  },
                  markLine: {
                      data: [
                          {type: 'average', name: '平均值'},
                          [{
                              symbol: 'none',
                              x: '90%',
                              yAxis: 'max'
                          }, {
                              symbol: 'circle',
                              label: {
                                  normal: {
                                      position: 'start',
                                      formatter: '最大值'
                                  }
                              },
                              type: 'max',
                              name: '最高点'
                          }]
                      ]
                  }
              }
          ]
      };
    this.chart.setOption(option)
    }
  }
}
</script>
