<template>
  <li :class="{ completed: todo.done }" class="todo">
    <div class="view">
      <label @click="goTodo(todo)" v-text="todo.text" style="cursor: pointer"/>
      <button class="destroy" @click="completeTodo( todo )"/>
    </div>
  </li>
</template>

<script>
  export default {
    name: 'Todo',
    directives: {
      focus(el, {value}, {context}) {
        if (value) {
          context.$nextTick(() => {
            el.focus()
          })
        }
      }
    },
    props: {
      todo: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        editing: false
      }
    },
    methods: {
      goTodo(todo){
        this.$emit('goTodo', todo)
      },
      completeTodo(todo) {
        this.$emit('completeTodo', todo)
      }
    }
  }
</script>
