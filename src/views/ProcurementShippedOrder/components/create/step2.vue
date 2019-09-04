<template>

  <div class="page-container">

    <aside style="font-size: 12px">
      您可以在这里上传一些跟本次发货相关的文件。方便以后查询。
    </aside>

    <h5>附件: </h5>

    <attachment ref="attachment" :primary="primary" v-if="completed"></attachment>

    <el-row>
      <el-col :md="24">
        <el-row type="flex" justify="center">
          <el-button type="primary" style="margin-top: 40px" @click="onNext">
            下一步 >
          </el-button>
        </el-row>
      </el-col>
    </el-row>

  </div>

</template>

<script>
  import attachment from '../edit/attachment'

  export default {
    components: {
      attachment
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
          //获取数据
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
        this.$emit("step2CBEvent", 3);
      },
      reloadCBEvent() {
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

