<template>

  <div class="ph-card-header" id="ph-card-header">

    {{title}}

    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">

    </el-button>

  </div>

</template>

<script>
  import Driver from 'driver.js' // import driver.js
  import 'driver.js/dist/driver.min.css' // import driver.js css
  import tablesteps from './tableSteps.js'

  export default {
    name: 'PhCardHeader',

    props: {
      /**
       * 标题
       */
      title: {
        type: String,
        default: ''
      },
      /**
       * 类型
       */
      type: {
        type: String,
        default: 'table'
      }
    },
    data() {
      return {
        driver: null
      }
    },
    watch: {},
    mounted() {
      this.driver = new Driver()
    },
    methods: {
      guide() {
        if (this.type === 'table') {
          this.driver.defineSteps(tablesteps)
        }
        else {
          this.driver.defineSteps(tablesteps)
        }
        this.driver.start()
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>
  .ph-card-header {
    position: relative;
    height: 42px;
    line-height: 42px;
    padding: 0 15px;
    border-bottom: 1px solid #f6f6f6;
    color: #333;
    border-radius: 2px 2px 0 0;
    font-size: 14px;
  }

  .ph-card-body {
    position: relative;
    padding: 10px 15px;
    line-height: 24px;
  }
</style>
