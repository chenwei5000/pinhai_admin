<template>
  <div class="ph-form">

    <aside style="font-size: 12px">
      为了保证本出口计划的执行，需要指派对应的物流负责人、跟单负责人，可多选。指派的相应负责人将会收到对应的邮件和系统消息提醒。
    </aside>

    <h5>出口计划负责人：</h5>

    <div class="tag-group">
      <el-tag type="success"
              :key="item.userId"
              v-for="item in primary.dataAuthories"
              closable
              :disable-transitions="false"
              @close="handleRemove(item)">
        {{item.user ? item.user.name : ''}}
      </el-tag>

      <el-button class="button-new-tag" size="small" @click="openPersonDialog">+ 添加负责人</el-button>
    </div>

    <phMembers ref="members" @saveCBEvent="saveCBEvent" title="选择采购负责人"></phMembers>
  </div>
</template>

<script>
  import {intArrToStrArr} from '@/utils'
  import phMembers from '@/components/PhMembers'

  export default {
    components: {
      phMembers
    },
    props: {
      primary: {
        type: [Object],
        default: {}
      }
    },
    computed: {},

    data() {
      return {
        loading: false,
        url: "/linerShippingPlans",
        relations: ["creator"],
        filters: [],
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
      },

      /********************* 操作按钮相关方法  ***************************/
      // 打开添加员工对话框
      openPersonDialog() {
        this.$refs.members.openDialog();
      },

      //指派一个用户
      assign(id) {
        let url = `${this.url}/assign/${this.primary.id}/${id}`;
        return this.global.axios.put(url)
          .then(resp => {
          })
          .catch(err => {
          })
      },

      // 添加负责人回调
      saveCBEvent(ids) {
        if (ids && this.primary) {

          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          let assignArr = [];
          ids.forEach(id => {
            assignArr.push(this.assign(id));
          });
          // 控制多个异步请求，保证所有请求全部完成
          Promise.all(assignArr).then(obj => {
            this.$refs.members.closeDialog();
            this.$message.info("操作成功!");
            loading.close();

            // 继续向父组件抛出事件 修改成功刷新列表
            this.$emit("modifiedInfoCBEvent");
          });
        }
      },
      // 删除负责人
      handleRemove(item) {
        if (item && item.userId) {
          this.$confirm('确认删除吗', '提示', {
            type: 'warning',
            beforeClose: (action, instance, done) => {
              if (action == 'confirm') {
                const loading = this.$loading({
                  lock: true,
                  text: 'Loading',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });

                let url = `${this.url}/cancelAssign/${this.primary.id}/${item.userId}`;
                this.global.axios.put(url)
                  .then(resp => {
                    done();
                    this.$message.info("操作成功!");
                    loading.close();
                    // 继续向父组件抛出事件 修改成功刷新列表
                    this.$emit("modifiedInfoCBEvent");
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
        }
      },
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

  .tag-group {
    .el-tag {
      margin-right: 10px;
    }
  }

</style>

