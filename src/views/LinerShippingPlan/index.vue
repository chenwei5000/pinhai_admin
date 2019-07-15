<template>
  <div class="app-container">

    <div class="ph-card">
      <div class="ph-card-body">


      </div>
    </div>
  </div>
</template>

<script>

  export default {
    components: {},

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
