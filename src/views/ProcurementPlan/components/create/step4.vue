<template>

  <div class="page-container">

    <aside v-if="completed">
      采购计划已经创建完毕，你可以提交上级审核了。如果不想马上提交审核，可放弃提交操作。
      之后你可以在编辑中的采购计划中，找到本次计划，可再次进行提交。
      您可以在计划说明中，添加本次计划的一些说明，可帮助上级更快的审核您的计划。<hr/>
      计划编号：{{this.primary.code}}<BR/>
      计划名称：{{this.primary.name}}<BR/>
        负责人：
      <template v-for="item in this.primary.dataAuthories">{{ item.user.name }} </template>
      <BR/>
      采购总件数：{{this.primary.qty.qty}} 件

    </aside>

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
            提交审核 >
          </el-button>
        </el-row>
      </el-col>
    </el-row>

    <auditing ref="auditing" @saveAuditCBEvent="saveAuditCBEvent"></auditing>

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
          //获取计划数据
          this.global.axios
            .get(`/procurementPlans/${this.primaryId}`)
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
      saveAuditCBEvent(note){

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
                  this.$message.info("提交成功,请耐心等待上级处理! 您还可以继续创建新的采购计划! ");
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
        this.$refs.auditing.openDialog('commit');
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

