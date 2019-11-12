<template>
  <div>
    <el-upload
      class="upload-demo"
      :action="uploadUrl"
      :on-preview="handlePreview"
      :before-remove="beforeRemove"
      :on-success="handleSuccess"
      multiple
      :file-list="attachments">
      <el-button class="button-new-tag" v-if="hasEdit" size="mini">+ 添加附件</el-button>
    </el-upload>

  </div>
</template>

<script>
  import {intArrToStrArr} from '@/utils'
  import {checkPermission} from "../../../../utils/permission";

  export default {
    components: {},
    props: {
      primary: {
        type: [Object],
        default: {}
      }
    },
    computed: {
      hasEdit(){
        return checkPermission('ExportAllocationResource_update');
      },
      uploadUrl() {
        return `${this.global.generateUrl(this.url)}/uploadFiles/${this.primary.id}?accessToken=${this.$store.state.user.token}`;
      }
    },

    data() {
      return {
        url: "/attachments/warehouseAllocation",
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

      remove(file){
        if (this.primary) {
          ///attachments/procurementPlan/ff8080816c2e2a89016c855d7be40001?accessToken=MUQ5RjMwRjcwMUE0NkUwRkUxNkUyMkNDNkZFNDNBOTEsMg==
          let url = `${this.global.generateUrl(this.url)}/${file.id}`;
          this.global.axios
            .delete(url)
            .then(resp => {
              this.$message.success("附件删除成功!");
            })
            .catch(err => {
            });
        }
      },

      /********************* 操作按钮相关方法  ***************************/
      //上传成功
      handleSuccess() {
        this.initData();
      },
      // 预览
      handlePreview(file) {
        window.open(file.url, '_blank');
      },
      // 删除
      beforeRemove(file, fileList) {
        if(this.hasEdit == false){
          this.$message.error("无删除权限!");
          return false;
        }
        return this.$confirm(`确定移除 ${ file.name }？`, '提示', {//    type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              this.remove(file);
              done(true);
            } else {
              done(false);
            }
          }
        })
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

  .el-form-item {
    //margin-bottom: 7px;
  }

</style>
