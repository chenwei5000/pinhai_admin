<template>

  <div class="page-container">

    <payment ref="payment" :primary="primary" v-if="completed" @paymentCBEvent="paymentCBEvent"></payment>

    <el-row>
      <el-col :md="12">
        <el-row type="flex" justify="center">
          <el-button type="warning" style="margin-top: 40px" @click="onBack">
            < 上一步
          </el-button>
        </el-row>
      </el-col>
      <el-col :md="12">
        <el-row type="flex" justify="center">
          <el-button type="primary" style="margin-top: 40px" @click="onNext">
            完成
          </el-button>
        </el-row>
      </el-col>
    </el-row>


  </div>

</template>

<script>
  import payment from '../edit/payment'

  export default {
    components: {
      payment
    },
    props: {
      primaryId: {
        type: [Number, String],
        default: null
      }
    },
    computed: {},

    data() {
      return {
        completed: false,
        primary: {}, //主对象
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
      initData() {
        if (this.primaryId) {
          let url = `/procurementOrders/${this.primaryId}`;
          url += "?relations=" + JSON.stringify(["supplier","currency"]);
          //获取采购单数据
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data;
              this.primary = res || {};
              this.completed = true;
            })
            .catch(err => {
              this.completed = true;
            });
        }
      },
      // 提交审核
      saveAuditCBEvent(note) {

        this.$confirm("确认将该计划提交给上级审核吗?", '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });

              let url = `/procurementPlans/commit/${this.primaryId}`;
              this.global.axios.put(url, note)
                .then(resp => {
                  done();
                  this.$message.success("提交成功,请耐心等待上级处理! 您还可以继续创建新的采购计划! ");
                  this.$refs.auditing.closeDialog();
                  loading.close();
                  // 继续向父组件抛出事件 修改成功刷新列表
                  this.$emit("step4CBEvent", 0);
                })
                .catch(err => {
                  loading.close();
                });
              done();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },
      onNext() {
        this.$emit("step4CBEvent", 'close');
      },
      onBack() {
        this.$emit("step4CBEvent", 2);
      },
      reloadCBEvent() {
        this.initData();
      },
      paymentCBEvent(obj){

      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>
  .page-container {
    padding: 20px 0;
  }

</style>

