<template>
  <div class="ph-form">

    <el-row>


    </el-row>

    <el-upload
      class="upload-demo"
      :action="uploadUrl"
      :on-preview="handlePreview"
      :before-remove="beforeRemove"
      :on-success="handleSuccess"
      multiple
      :file-list="attachments">
      <el-button slot="trigger" size="small">+ 添加附件</el-button>

      <el-button icon="el-icon-download" size="small" @click="downloadAmazonFeed">下载Amazon清单</el-button>

      <el-dropdown @command="downloadAmazonPackageLabels">
        <el-button icon="el-icon-download" size="small">下载Amazon箱贴</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="x1">一页一张</el-dropdown-item>
          <el-dropdown-item command="x6">一页六张</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown @command="downloadAmazonPalletLabels">
        <el-button icon="el-icon-download" size="small">下载Amazon托贴</el-button>
        <el-dropdown-menu slot="dropdown" @click="downloadAmazonPalletLabels">
          <el-dropdown-item command="x1">一页一张</el-dropdown-item>
          <el-dropdown-item command="x6">一页六张</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

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
        return `${this.global.generateUrl(this.url)}/uploadFiles/${this.primary.id}?accessToken=${this.$store.state.user.token}`;
      }
    },

    data() {
      return {
        url: "/attachments/linerShippingPlan",
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
              this.$message.info("附件删除成功!");
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
      },

      // 下载AmazonFeed
      downloadAmazonFeed() {
        let url = `${this.global.generateUrl('/linerShippingPlans/downloadAmazonFeed')}/${this.primary.id}?accessToken=${this.$store.state.user.token}`
        window.open(url, '_blank');
        return false;
      },
      // 下载箱贴
      downloadAmazonPackageLabels(command) {
        if (!this.primary.shipmentId) {
          this.$message.error("必须优先设置FBA ID");
          return false;
        }
        let url = `${this.global.generateUrl('/linerShippingPlans/downloadPackageLabels')}/${this.primary.id}?accessToken=${this.$store.state.user.token}`;
        if (command == 'x1') {
          url += '&pageType=PackageLabel_Plain_Paper';
        }
        else {
          url += '&pageType=PackageLabel_Letter_6';
        }
        window.open(url, '_blank');
        return false;
      },
      // 下载托贴
      downloadAmazonPalletLabels(command) {
        console.log(this.primary.shipmentId);
        if (!this.primary.shipmentId) {
          this.$message.error("必须优先设置FBA ID");
          return false;
        }

        let url = `${this.global.generateUrl('/linerShippingPlans/downloadPalletLabels')}/${this.primary.id}?accessToken=${this.$store.state.user.token}&numberOfPallets=40`;
        if (command == 'x1') {
          url += '&pageType=PackageLabel_Plain_Paper';
        }
        else {
          url += '&pageType=PackageLabel_Letter_6';
        }
        window.open(url, '_blank');
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

  .el-form-item {
    //margin-bottom: 7px;
  }

</style>

