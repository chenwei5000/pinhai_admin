<template>
  <div>
    <div class="tag-group">
      <el-tag
        :key="item"
        v-for="item in primary.dataAuthories"
        closable
        :disable-transitions="false"
        @close="handleRemove(item)">
        {{item.user.name}}
      </el-tag>

      <el-button class="button-new-tag" size="small" @click="openPersonDialog">+ 添加负责人</el-button>
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
        url: "/attachments/procurementPlan",
        relations: ["creator"],
        filters: [
          {"field": "relevanceId", "op": "eq", "data": this.primary.id}
        ],
        attachments: []
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

      /********************* 操作按钮相关方法  ***************************/
      // 打开添加员工对话框
      openPersonDialog() {

      },
      // 删除负责人
      handleRemove() {
        this.initData();
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

