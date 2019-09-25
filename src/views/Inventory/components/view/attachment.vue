<template>
  <div>
    <el-upload
      class="upload-demo"
      action=""
      :on-preview="handlePreview"
      :before-remove="handleBeforeRemove"
      multiple
      :file-list="attachments">
    </el-upload>
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
        url: "/attachments/inventoryTask",
        relations: ["creator"],
        filters: [
          {"field": "inventoryId", "op": "eq", "data": this.primary.id}
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
              let data = res || [];
              this.attachments = [];
              data.forEach(obj => {
                this.attachments.push({
                  id: obj.id,
                  name: obj.fileName,
                  url: `${this.global.generateUrl(this.url)}/view/${obj.id}?accessToken=${this.$store.state.user.token}`
                });
              });
            })
            .catch(err => {
            });
        }
      },

      /********************* 操作按钮相关方法  ***************************/
      // 预览
      handlePreview(file) {
        window.open(file.url, '_blank');
      },
      handleBeforeRemove(file, fileList) {
        this.$message.error("无法删除");
        return false;
      }
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
</style>

