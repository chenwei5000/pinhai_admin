<template>
  <div class="ph-form">

    <el-upload
      class="upload-demo"
      :action="uploadUrl"
      :on-preview="handlePreview"
      :before-remove="beforeRemove"
      :on-success="handleSuccess"
      multiple
      :file-list="attachments">
      <el-button class="button-new-tag" slot="trigger" size="mini">+ 添加附件</el-button>

      <el-button icon="el-icon-view" type="primary" size="mini" @click="onInvoiceRecognition">发票内容识别</el-button>

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
    computed: {
      uploadUrl() {
        return `${this.global.generateUrl(this.url)}/uploadFiles/${-this.primary.id}?accessToken=${this.$store.state.user.token}`;
      }
    },

    data() {
      return {
        url: "/attachments/invoices",
        relations: ["creator"],
        filters: [
          {"field": "relevanceId", "op": "eq", "data": -this.primary.id}
        ],
        attachments: [],
        invoices: [],
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
                ///attachments/linerShippingPlan/view/8a2328796ab95c3f016b027628f1002c?accessToken=NDAzRDREQ0Y3OEMzRTZDMzczMjZFOTU4NEExM0FGQUIsMg==
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

      remove(file) {
        if (this.primary) {
          ///attachments/procurementPlan/ff8080816c2e2a89016c855d7be40001?accessToken=MUQ5RjMwRjcwMUE0NkUwRkUxNkUyMkNDNkZFNDNBOTEsMg==
          let url = `${this.global.generateUrl(this.url)}/${file.id}`;
          this.global.axios
            .delete(url)
            .then(resp => {
              this.$message.success("附件删除成功!");
              this.initData();
            })
            .catch(err => {
            });
        }
      },

      onInvoiceRecognition() {

        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.invoices = [];

        let promiseArr = [];
        this.attachments.forEach(r => {
          promiseArr.push(this.global.axios
            .get(`/baidu/invoiceRecognition/${r.id}`)
            .then(resp => {
              this.invoices.push(resp.data);
            }));
        });

        Promise.all(promiseArr).then(obj => {
          loading.close();
          this.$emit("invoiceRecognitionCB", this.invoices);
        }).catch(err => {
          loading.close();
          this.$emit("invoiceRecognitionCB", this.invoices);
        });
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

