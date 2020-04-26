<template>
  <div class="app-container">

    <div class="ph-card">
      <div class="ph-card-body">
        <!-- 表格 -->
        <el-tabs v-model="activeStatus" type="border-card" @tab-click="handleTabClick">

          <el-tab-pane name="material" lazy>
          <span slot="label" style="color: #67C23A;">
            <i class="el-icon-scissors"></i> 原料管理
          </span>
            <keep-alive>
              <materialPane/>
            </keep-alive>
          </el-tab-pane>

          <el-tab-pane name="productToMaterial" lazy>
          <span slot="label" style="color: #409EFF;">
            <i class="el-icon-takeaway-box"></i> 产品原料关系
          </span>
            <keep-alive>
              <productToMaterial/>
            </keep-alive>
          </el-tab-pane>

          <el-tab-pane name="unfinished" lazy>
            <span slot="label" style="color: #F56C6C;">
              <i class="el-ph-icon-exclamation-circle"></i> 未设置原料的产品
            </span>
            <keep-alive>
              <unfinishedMaterial/>
            </keep-alive>
          </el-tab-pane>

        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>
  import materialPane from './components/materials'
  import productToMaterial from './components/productToMaterial'
  import unfinishedMaterial from './components/unfinishedMaterial'
  import {checkPermission} from "@/utils/permission";

  const statusFlag = 's='

  export default {
    name: 'MaterialResource_menu',
    components: {
      materialPane,
      productToMaterial,
      unfinishedMaterial
    },

    data() {
      return {
        title: '原料管理', // 页面标题
        activeStatus: location.href.indexOf(statusFlag) > -1
          ? this.$route.query.s !== null ? this.$route.query.s : 'material' : 'material',
      }
    },

    // 计算属性，用于跟模版进行数据交互。
    // computed属性，属于持续变化跟踪。在computed属性定义的时候，这个computed属性就与给它赋值的变量绑定了。
    // 改变这个赋值变量，computed属性值会随之改变。
    // 主要用于用过其它第三变量，间接跟页面进行数据交互时使用。
    computed: {},

    // 各种相关方法定义
    methods: {
      /* 点击Tag相应事件 */
      // TODO: 通过URL记录点击Tab，方便刷新后不会切换视图
      handleTabClick(tab, event) {
        const queryFlag = '?s=';
        const queryPath = '/m2/Material_index';
        let newUrl = location.origin + "/#" + queryPath + queryFlag + this.activeStatus;
        history.pushState(history.state, 'ph-table search', newUrl);
      },
    },

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

