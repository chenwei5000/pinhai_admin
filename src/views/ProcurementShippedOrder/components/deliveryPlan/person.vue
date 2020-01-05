<template>
  <div>
    <div class="tag-group">
      <el-tag type="success"
              :key="item.userId"
              v-for="item in primary.dataAuthories"
              :disable-transitions="false">
        {{item.user.name}}
      </el-tag>
    </div>
  </div>
</template>

<script>
  import {intArrToStrArr} from '@/utils'

  export default {
    components: {},
    props: {
      primary: {
        type: [Object],
        default: {}
      }
    },
    computed: {},

    data() {
      return {
        loading: false
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },
    methods: {
      /********************* 基础方法  *****************************/
      /**
       * 初始化数据
       */
      initData() {
      },
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .panel-heading {
    color: #444;
    border: 1px #cfd9db solid;
  }

  .panel-title {
    display: table-cell;
    vertical-align: middle;
    padding: 0 10px;
  }

  .el-form-item {
    //margin-bottom: 7px;
  }

  .tag-group {
    .el-tag {
      margin-right: 10px;
    }
  }

</style>

