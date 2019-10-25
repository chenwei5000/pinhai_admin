<template>

  <el-badge :value="count" type="primary">
    <div class="card-panel">

      <router-link to="/m9/ExportAllocation_index?s=executing">
        <svg t="1571909801946" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31359" width="48" height="48"><path d="M0 170.666667m341.333333 0l341.333334 0q341.333333 0 341.333333 341.333333l0 0q0 341.333333-341.333333 341.333333l-341.333334 0q-341.333333 0-341.333333-341.333333l0 0q0-341.333333 341.333333-341.333333Z" fill="#FC6133" p-id="31360"></path><path d="M421.12 433.493333V321.28h44.8v154.88H336.213333v143.36h106.24V508.16h44.8v173.226667h-44.8v-18.773334H183.893333v18.773334H139.093333V508.16h44.8v111.36H290.133333V476.16H160.426667V321.28h44.8v112.213333H290.133333V289.28h46.08v144.213333h84.906667z m466.261333-97.28v341.333334h-45.226666v-23.04h-232.106667v23.04h-44.8v-341.333334h322.133333z m-277.333333 274.773334h232.106667V379.733333h-232.106667v231.253334z" fill="#FFFFFF" p-id="31361"></path></svg>
        <div class="card-panel-text">
        出口发货
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
