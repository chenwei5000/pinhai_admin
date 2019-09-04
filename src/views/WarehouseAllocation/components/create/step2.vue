<template>
  <div>
    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">
      <el-collapse-item name="attachment" style="margin-top: 10px">
        <div slot="title" class="title">3. 附件</div>
        <attachment ref="attachment" :primary="primary" v-if="completed"></attachment>
      </el-collapse-item>
    </el-collapse>

    <el-row>
      <el-col :md="24">
        <el-row type="flex" justify="center">
          <el-button type="primary" style="margin-top: 15px" @click="onNext">
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
      attachment,
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
        completed: true,
        primary: {}, //主对象
        activeNames: ["attachment"],   //折叠面板开启项
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
          //获取计划数据
          this.global.axios
            .get(`/warehouseAllocations/${this.primaryId}`)
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
        this.$emit("step2CBEvent", 2);
      },
      onBack() {
        this.$emit("step2CBEvent", 0);
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
      },
      /* 重新加载 */
      reloadCBEvent() {
        this.initData();
      }

    }
  }
</script>

<style type="text/less" lang="scss" scoped>
  .title {
    font-size: 14px;
    font-weight: bold;
  }
</style>

