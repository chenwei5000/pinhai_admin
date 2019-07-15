<template>
  <el-card class="todo-box-card">
    <div slot="header">
      <svg-icon icon-class="skill"/>
      <span style="margin-left:10px;">未处理任务</span>
    </div>

    <el-collapse>

      <el-collapse-item v-for="(todo, index) in filteredTodos"
                        :key="index"
                        :title="todo.text" :name="index">

        <template slot="title">
          <div class="todo-title">
            <i class="header-icon el-icon-info" style="color: #f25542;margin-right: 5px;"></i> {{todo.text}}
          </div>
        </template>

        <div class="todo-centent">

          <p>
            {{todo.centent}}
          </p>

          <p style="text-align: right">
            <el-button size="mini" type="success" @click="completeTodo(todo)" icon="el-icon-success">已完成</el-button>
            <el-button size="mini" type="primary" @click="goTodo(todo)" icon="el-icon-edit">去处理</el-button>
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
</template>

<script>

  const STORAGE_KEY = 'todos'

  const filters = {
    all: todos => todos,
    active: todos => todos.filter(todo => !todo.done),
    completed: todos => todos.filter(todo => todo.done)
  }

  const defalutList = [
    {
      text: '您的出口计划已经完成出库', done: false, centent: '您好！\n' +
      '以下34款产品存在采购价格、重量、供货商、箱规、装箱数信息不全，请完善：\n' +
      'bllinen4063p2White,双层仿麻打环帘40*63（4063双件）白色,窗帘\n' +
      'bllinen4084p2White,双层仿麻打环帘40*84（4084双件）白色,窗帘\n' +
      'blackoutlinerring-2780P2-White,带环遮光内衬27*80（双件）白色,窗帘\n' +
      'bllinen10096White,十字麻双层bllinen10096White,窗帘\n' +
      'kalinen5063p2Beige,双层仿麻阳离子配植绒内衬50*63（5063）米色,窗帘\n' +
      'kalinen5084p2Beige,双层仿麻阳离子配植绒内衬50*84（5084）米色,窗帘\n' +
      'kalinen5096p2Beige,双层仿麻阳离子配植绒内衬50*96（5096）米色,窗帘\n' +
      'tpulinen5063p2Beige,双层仿麻阳离子配TPU内衬50*63（5063）米色,窗帘'
    },
    {
      text: '有新的采购计划等待您审核', done: false, centent: '尊敬的用户：\n' +
      '\n' +
      '您好！有新的采购计划已经发布，请登陆品海ERP系统处理！\n' +
      '\n' +
      '采购计划信息如下：\n' +
      '名称：     艾伦新品采购计划\n' +
      '下单截止日：2019-05-10\n' +
      '交货截止日：2019-06-25'
    },
    {text: '您的采购计划审核通过', done: false, centent: ''},
    {text: '您的采购计划被拒绝', done: false, centent: ''},
    {text: '有新的采购单等待您审核', done: false, centent: ''},
    {text: '您的出口计划已经确认船期,请及时完善发货明细', done: false, centent: ''},
    {text: '您的出口计划已经完成出库', done: false, centent: ''},
    {text: '有新的采购计划等待您审核', done: false, centent: ''},
    {text: '您的采购计划审核通过', done: false, centent: ''},
    {text: '您的采购计划被拒绝', done: false, centent: ''},
    {text: '有新的采购单等待您审核', done: false, centent: ''},
    {text: '您的出口计划已经确认船期,请及时完善发货明细', done: false, centent: ''},
    {text: '您的出口计划已经完成出库', done: false, centent: ''},
    {text: '有新的采购计划等待您审核', done: false, centent: ''},
    {text: '您的采购计划审核通过', done: false, centent: ''},
    {text: '您的采购计划被拒绝', done: false, centent: ''},
    {text: '有新的采购单等待您审核', done: false, centent: ''},
    {text: '您的出口计划已经确认船期,请及时完善发货明细', done: false, centent: ''},
  ]

  export default {
    components: {},
    filters: {
      pluralize: (n, w) => n === 1 ? w : w + 's',
      capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
    },
    data() {
      return {
        visibility: 'all',
        filters,
        todos: defalutList
      }
    },
    computed: {
      allChecked() {
        return this.todos.every(todo => todo.done)
      },
      filteredTodos() {
        return filters[this.visibility](this.todos)
      },
      remaining() {
        return this.todos.filter(todo => !todo.done).length
      }
    },
    methods: {
      setLocalStorage() {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
      },
      goTodo(val) {
        this.$message.info("跳转对应的单据!");
      },
      completeTodo(val) {
        this.$confirm('确认该任务已经完成了吗?', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true

              val.done = !val.done
              this.setLocalStorage()

              if (this.onDelete) {
                this.onDelete(
                  this.hasSelect
                    ? !this.single
                    ? this.selected
                    : this.selected[0]
                    : row
                )
                  .then(resp => {
                    this.showMessage(true)
                    done()
                    this.getList()
                  })
                  .catch(e => {
                  })
                  .finally(e => {
                    instance.confirmButtonLoading = false
                  })
                return
              }

              // 默认删除逻辑
              // 单个删除
              if (!this.hasSelect) {
                this.global.axios
                  .delete(this.url + '/' + row[this.id])
                  .then(resp => {
                    instance.confirmButtonLoading = false
                    done()
                    this.showMessage(true)
                    this.getList()
                  })
                  .catch(er => {
                    instance.confirmButtonLoading = false
                  })
              } else {
                // 多选模式
                let ids = this.selected.map(v => v[this.id]).toString();
                if (!ids && ids == '') {
                  ids = row[this.id];
                }

                this.global.axios
                  .delete(this.url + '/' + ids)
                  .then(resp => {
                    instance.confirmButtonLoading = false
                    done()
                    this.showMessage(true)
                    this.getList()
                  })
                  .catch(er => {
                    instance.confirmButtonLoading = false
                  })
              }
              this.afterConfirm();
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

    p{
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
