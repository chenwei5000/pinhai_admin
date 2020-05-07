<template>

  <div class="page-container">

    <aside v-if="completed" style="font-size: 12px">
      调拨单已经创建完毕<hr/>
      调拨单号：{{this.primary.code}}<BR/>
      负责人：
      <template v-for="item in this.primary.dataAuthories">{{ item.user.name }} </template>
      <BR/>
    </aside>

    <el-row>
      <el-col :md="12">
        <el-row type="flex" justify="center">
          <el-button type="warning" style="margin-top: 40px" @click="onBack" size="mini">
            < 上一步
          </el-button>
        </el-row>
      </el-col>
      <el-col :md="12">
        <el-row type="flex" justify="center">
          <el-button type="primary" style="margin-top: 40px" @click="onNext" size="mini">
            完成 >
          </el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  import person from '../edit/person'
  import auditing from '@/components/PhAuditing'

  export default {
    components: {
      person,
      auditing
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
         this.$emit("step4CBEvent", 4);
      },
      onBack() {
        this.$emit("step4CBEvent", 2);
      },
      reloadCBEvent(){
        this.initData();
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>
   .page-container {
     padding: 20px 0;
   }

</style>

