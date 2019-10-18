<template>
  <div class="app-container">

    <div class="ph-card">
      <div class="ph-card-body">
        <!-- 表格 -->
        <el-tabs v-model="activeStatus" type="border-card" @tab-click="handleTabClick">

          <el-tab-pane name="valid" lazy>
          <span slot="label" style="color: #67C23A;">
            <i class="el-ph-icon-check-circle"></i> 有效的产品
          </span>
            <keep-alive>
              <tab-pane type="valid"/>
            </keep-alive>
          </el-tab-pane>

          <el-tab-pane name="invalid" lazy>
          <span slot="label">
            <i class="el-ph-icon-times-circle"></i> 关闭的产品
          </span>
            <keep-alive>
              <tab-pane type="invalid"/>
            </keep-alive>
          </el-tab-pane>

          <el-tab-pane name="unfinished" lazy>
            <span slot="label" style="color: #F56C6C;">
              <i class="el-ph-icon-exclamation-circle"></i> 信息不全的产品
            </span>
            <keep-alive>
              <tab-pane type="unfinished"/>
            </keep-alive>
          </el-tab-pane>

          <el-tab-pane name="create" lazy v-if="hasNew">
            <span slot="label" style="color: #409EFF;">
              <i class="el-ph-icon-plus-circle"></i> 添加商品
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
  import {checkPermission} from "@/utils/permission";
  const statusFlag = 's='

  export default {
    components: {tabPane, createFrom},

    data() {
      return {
        title: '产品管理', // 页面标题
        activeStatus: location.href.indexOf(statusFlag) > -1
          ? this.$route.query.s !== null ? this.$route.query.s : 'valid' : 'valid',
      }
    },

    // 计算属性，用于跟模版进行数据交互。
    // computed属性，属于持续变化跟踪。在computed属性定义的时候，这个computed属性就与给它赋值的变量绑定了。
    // 改变这个赋值变量，computed属性值会随之改变。
    // 主要用于用过其它第三变量，间接跟页面进行数据交互时使用。
    computed: {
      hasNew(){
         return checkPermission('ProductResource_create');
      }
    },

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
