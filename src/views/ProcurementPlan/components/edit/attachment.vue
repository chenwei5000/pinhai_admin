<template>


  <el-button class="button-new-tag" @click="onUpload">+ 添加附件</el-button>

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
        if (this.primary) {
          let url = this.url;
          if (this.filters && this.filters.length > 0) {
            url += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": this.filters});
          }
          // 处理关联加载
          if (this.relations && this.relations.length > 0) {
            url += "&relations=" + JSON.stringify(this.relations);
          }
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data;
              this.attachments =  res || [];
            })
            .catch(err => {
            });
        }
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 保存对象 */
      onUpload() {

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

</style>

