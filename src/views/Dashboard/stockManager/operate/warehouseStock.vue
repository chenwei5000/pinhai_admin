<template>

  <el-badge :value="count" type="primary">
    <div class="card-panel">

      <router-link to="/m3/WarehouseStock_index">
        <svg t="1571910141654" class="icon" viewBox="0 0 1316 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="37772" width="48" height="48"><path d="M1316.571429 511.634286c-109.714286-263.314286-343.771429-453.485714-658.285715-453.485715s-548.571429 190.171429-658.285714 453.485715c109.714286 263.314286 343.771429 453.485714 658.285714 453.485714s548.571429-190.171429 658.285715-453.485714z m-658.285715 299.885714c-168.228571 0-299.885714-138.971429-299.885714-299.885714s131.657143-299.885714 299.885714-299.885715 299.885714 138.971429 299.885715 299.885715-131.657143 299.885714-299.885715 299.885714z" p-id="37773" fill="#13227a"></path><path d="M475.428571 511.634286c0 102.4 80.457143 182.857143 182.857143 182.857143s182.857143-80.457143 182.857143-182.857143-80.457143-175.542857-182.857143-175.542857-182.857143 80.457143-182.857143 175.542857z" p-id="37774" fill="#13227a"></path></svg>
        <div class="card-panel-text">
          库存查看
        </div>
      </router-link>

    </div>
  </el-badge>

</template>

<script>
  export default {
    props: {
      mine: {
        type: Object,
      }
    },
    components: {},

    data() {
      return {
        count: null
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },

    methods: {
      initData() {

      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/css/operate.less";
</style>
