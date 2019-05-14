<template>
  <div class="app-container">

    <div class="ph-card">
      <!-- 表格 -->
      <el-tabs v-model="activeStatus" type="border-card" @tab-click="handleTabClick">

        <el-tab-pane name="1" lazy>
          <span slot="label" style="color: #67C23A;">
            <i class="el-ph-icon-check-circle"></i> 有效的产品
          </span>
          <keep-alive>
            <tab-pane type="1"/>
          </keep-alive>

        </el-tab-pane>

        <el-tab-pane name="0" lazy>
          <span slot="label">
            <i class="el-ph-icon-times-circle"></i> 关闭的产品
          </span>

          <keep-alive>
            <tab-pane type="0"/>
          </keep-alive>

        </el-tab-pane>

        <el-tab-pane name="2" lazy>
          <span slot="label" style="color: #F56C6C;">
            <i class="el-ph-icon-exclamation-circle"></i> 信息不全的产品
          </span>
          <keep-alive>
            <tab-pane type="2"/>
          </keep-alive>
        </el-tab-pane>

      </el-tabs>
    </div>


  </div>
</template>

<script>
  import tabPane from './components/TabPane'

  const statusFlag = 's='
  const statusPattern = new RegExp('s=.*')

  export default {
    components: {tabPane},

    data() {
      return {
        categoryNames: [],
        specs: [],
        tabMapOptions: [
          {label: 'China', key: 'CN'},
          {label: 'USA', key: 'US'},
          {label: 'Japan', key: 'JP'},
          {label: 'Eurozone', key: 'EU'}
        ],
        title: '产品管理', // 页面标题
        activeStatus: location.href.indexOf(statusFlag) > -1 ? this.$route.query.s !== null ? this.$route.query.s : '1' : '1',
      }
    },

    // 计算属性，用于跟模版进行数据交互。
    // computed属性，属于持续变化跟踪。在computed属性定义的时候，这个computed属性就与给它赋值的变量绑定了。
    // 改变这个赋值变量，computed属性值会随之改变。
    // 主要用于用过其它第三变量，间接跟页面进行数据交互时使用。
    computed: {},

    // 各种相关方法定义
    methods: {
      // 状态样式
      statusClasscategoryId({row, rowIndex}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      },
      handleTabClick(tab, event) {
        let newUrl;
        let searchQuery = statusFlag + (this.activeStatus)
        if (location.href.indexOf(statusFlag) > -1) {
          newUrl = location.href.replace(statusPattern, searchQuery)
        } else {
          newUrl = location.href + (location.href.indexOf('?') > -1 ? `&${searchQuery}` : `?${searchQuery}`);
        }
        history.pushState(history.state, 'ph-table status', newUrl)
      }
    },

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>


</style>
