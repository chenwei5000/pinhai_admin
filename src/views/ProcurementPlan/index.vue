<template>
  <div class="app-container">

    <div class="ph-card">
      <div class="ph-card-body">
        <!-- 表格 -->
        <el-tabs v-model="activeStatus" type="border-card" @tab-click="handleTabClick">

          <el-tab-pane name="editing" class="fontColor" lazy>
            <span slot="label">
              <i class="el-icon-edit"></i> 编辑中
            </span>
            <keep-alive>
              <tab-pane type="editing"/>
            </keep-alive>
          </el-tab-pane>

          <el-tab-pane name="auditing" lazy>
            <span slot="label">
              <i class="el-icon-s-check"></i> 待审核
            </span>
            <keep-alive>
              <tab-pane type="auditing"/>
            </keep-alive>
          </el-tab-pane>

          <el-tab-pane name="executeing" lazy>
            <span slot="label">
              <i class="el-icon-s-order"></i> 执行中
            </span>
            <keep-alive>
              <tab-pane type="executeing"/>
            </keep-alive>
          </el-tab-pane>

          <el-tab-pane name="complete" lazy>
            <span slot="label">
              <i class="el-icon-s-claim"></i> 完成
            </span>
            <keep-alive>
              <tab-pane type="complete"/>
            </keep-alive>
          </el-tab-pane>


          <el-tab-pane name="create" lazy>
            <span slot="label">
              <i class="el-ph-icon-plus-circle"></i> 创建计划
            </span>
            <keep-alive>
              <createFrom></createFrom>
            </keep-alive>
          </el-tab-pane>

        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>
  import tabPane from './components/TabPane'
  import createFrom from './components/createFrom'

  const statusFlag = 's='

  export default {
    components: {tabPane, createFrom},

    data() {
      return {
        title: '产品管理', // 页面标题
        activeStatus: location.href.indexOf(statusFlag) > -1
          ? this.$route.query.s !== null ? this.$route.query.s : 'editing' : 'editing',
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
      handleTabClick(tab, event) {
      }
    },

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>
  .ph-table {
    padding: 10px 15px;
  }

</style>
