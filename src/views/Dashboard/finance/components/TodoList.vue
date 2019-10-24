<template>
  <div>
    <el-card class="todo-box-card">
      <div slot="header">
        <svg-icon icon-class="skill"/>
        <span style="margin-left:10px;">未处理任务</span>
      </div>

      <el-collapse>

        <el-collapse-item v-for="(todo, index) in filteredTodos"
                          :key="todo.id" :name="todo.id">

          <template slot="title">
            <div class="todo-title">
              <i class="header-icon el-icon-info" style="color: #f25542;margin-right: 5px;"></i>{{todo.notice.title}}
            </div>
          </template>

          <div class="todo-centent">

            <p v-html="br(todo.notice.content)">
            </p>

            <p style="text-align: right">
              <el-button size="mini" type="success" @click="completeTodo(todo)" icon="el-icon-success">已完成</el-button>
              <el-button size="mini" type="primary" @click="goTodo(todo)" icon="el-icon-edit">处理</el-button>
            </p>

          </div>

        </el-collapse-item>

      </el-collapse>


      <!-- footer -->
      <footer class="footer">
      <span>
        <strong>还有{{ remaining }}个任务未处理</strong>
      </span>
      </footer>

    </el-card>


    <!--编辑对话框-->
    <editPlanDialog @modifyCBEvent="modifyPlanCBEvent" ref="editPlanDialog">
    </editPlanDialog>

  </div>
</template>

<script>

  import editPlanDialog from '@/views/ProcurementPlan/components/edit/dialog';
  import {parseLineBreak} from '@/utils';

  const filters = {
    all: todos => todos,
    active: todos => todos.filter(todo => todo.isRead == 0),
    completed: todos => todos.filter(todo => todo.isRead == 1)
  }

  export default {
    components: {
      editPlanDialog
    },
    filters: {
      pluralize: (n, w) => n === 1 ? w : w + 's',
      capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
    },
    data() {
      return {
        url: '/userNotices',
        visibility: 'all',
        filters,
        todos: []
      }
    },
    computed: {
      filteredTodos() {
        return filters[this.visibility](this.todos);
      },
      remaining() {
        return this.todos.filter(todo => todo.isRead == 0).length
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },

    methods: {
      br(text) {
        return parseLineBreak(text);
      },
      initData() {
        let url = this.url;
        let filters = [];
        filters.push({
          'field': "isRead",
          op: 'eq',
          data: '0'
        })
        url += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});
        let relations = ["notice"];
        url += "&relations=" + JSON.stringify(relations);

        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data || [];
            this.todos = res || [];
          })
          .catch(err => {
          });
      },

      // 完成任务
      doComplete(val, instance, done) {
        if (val && val.id) {
          this.global.axios
            .put(this.url + '/read/' + val.id)
            .then(res => {
              instance.confirmButtonLoading = false;
              done();
              this.initData();
            })
            .catch(er => {
              instance.confirmButtonLoading = false
            })
        }
      },
      // 修改完成
      modifyPlanCBEvent() {

      },
      goTodo(val) {
        if (val && val.notice) {
          if (val.notice.targetType == "PROCUREMENT_PLAN") {
            this.$refs.editPlanDialog.openDialog(val.notice.target);
          }
        }
      },
      completeTodo(val) {
        this.$confirm('确认该任务已经完成了吗?', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              this.doComplete(val, instance, done);
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },
    }
  }
</script>

<style lang="scss">

  .todo-box-card {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 300;
    background: #fff;
    z-index: 1;
    position: relative;

  /deep/ .el-card__body {
    padding: 0;
  }

  /deep/ .el-card__header {
    border-bottom: none;
  }

  .todo-title {
    padding: 0 0 0 10px;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .todo-centent {
    padding: 5px 20px;
    font-size: 14px;

  p {
    max-height: 410px;
    overflow-y: hidden;
  }

  }

  .footer {
    color: #000;
    position: relative;
    padding: 10px 15px;
    font-size: 14px;
    height: 40px;
    text-align: center;
    min-width: 230px;
    max-width: 550px;
    margin: 0 auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 300;
    background: #fff;
    z-index: 1;
    position: relative;
  }

  }
</style>
