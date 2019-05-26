<template>
  <el-card class="todo-box-card">
    <div slot="header">
      <svg-icon icon-class="skill"/>
      <span style="margin-left:10px;">未处理任务</span>
    </div>

    <section class="todoapp">
      <!-- main section -->
      <section v-show="todos.length" class="main">
        <ul class="todo-list">
          <todo
            v-for="(todo, index) in filteredTodos"
            :key="index"
            :todo="todo"
            @completeTodo="completeTodo"
            @goTodo= "goTodo"
          />
        </ul>
      </section>

      <!-- footer -->
      <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize('item') }} left
      </span>
        <ul class="filters">
          <li v-for="(val, key) in filters" :key="key">
            <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ key | capitalize }}</a>
          </li>
        </ul>
      </footer>

    </section>
  </el-card>
</template>

<script>
  import Todo from './Todo.vue'

  const STORAGE_KEY = 'todos'

  const filters = {
    all: todos => todos,
    active: todos => todos.filter(todo => !todo.done),
    completed: todos => todos.filter(todo => todo.done)
  }

  const defalutList = [
    {text: '您的出口计划已经完成出库', done: false},
    {text: '有新的采购计划等待您审核', done: false},
    {text: '您的采购计划审核通过', done: false},
    {text: '您的采购计划被拒绝', done: false},
    {text: '有新的采购单等待您审核', done: false},
    {text: '您的出口计划已经确认船期,请及时完善发货明细', done: false},
    {text: '您的出口计划已经完成出库', done: false},
    {text: '有新的采购计划等待您审核', done: false},
    {text: '您的采购计划审核通过', done: false},
    {text: '您的采购计划被拒绝', done: false},
    {text: '有新的采购单等待您审核', done: false},
    {text: '您的出口计划已经确认船期,请及时完善发货明细', done: false},
    {text: '您的出口计划已经完成出库', done: false},
    {text: '有新的采购计划等待您审核', done: false},
    {text: '您的采购计划审核通过', done: false},
    {text: '您的采购计划被拒绝', done: false},
    {text: '有新的采购单等待您审核', done: false},
    {text: '您的出口计划已经确认船期,请及时完善发货明细', done: false},
  ]

  export default {
    components: {Todo},
    filters: {
      pluralize: (n, w) => n === 1 ? w : w + 's',
      capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
    },
    data() {
      return {
        visibility: 'all',
        filters,
        // todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || defalutList
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
      goTodo(val){
        this.$message.info("调整对应的单据!");
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
  @import './index.scss';

  .todo-box-card {
    /deep/ .el-card__body {
      padding: 0;
    }
    /deep/ .el-card__header{
      border-bottom: none;
    }
  }
</style>
