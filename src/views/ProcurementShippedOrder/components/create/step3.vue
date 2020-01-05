<template>

  <div class="page-container">

    <aside style="font-size:12px;">
      为了保证本发货单的顺利执行，需要指派对应的仓管负责人，可多选。指派的负责人将会收到对应的邮件和系统消息提醒。
    </aside>

    <h5>负责人：</h5>

    <person @reloadCBEvent="reloadCBEvent" ref="person" :primary="primary" v-if="completed"></person>

    <el-row>
      <el-col :md="12">
        <el-row type="flex" justify="center">
          <el-button type="warning" style="margin-top: 40px" size="mini" @click="onBack">
            < 上一步
          </el-button>
        </el-row>
      </el-col>
      <el-col :md="12">
        <el-row type="flex" justify="center">
          <el-button type="primary" style="margin-top: 40px" size="mini"  @click="onNext">
            结束 >
          </el-button>
        </el-row>
      </el-col>
    </el-row>

  </div>

</template>

<script>
  import person from '../edit/person'

  export default {
    components: {
      person
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
          //获取采购单数据
          this.global.axios
            .get(`/procurementShippedOrders/${this.primaryId}`)
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
      onNext() {
        if(this.primary && this.primary.dataAuthories && this.primary.dataAuthories.length > 0){
          this.$emit("step3CBEvent", "close");
        }
        else{
          this.$message.error("必须选择至少一位负责人");
        }
      },
      onBack() {
        this.$emit("step3CBEvent", 1);
      },
      reloadCBEvent(){
        this.initData();
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>
  .page-container {
    padding: 30px;
  }

</style>
