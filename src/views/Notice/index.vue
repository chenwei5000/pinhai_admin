<template>
  <div class="app-container">
    <div class="ph-card">
      <ph-card-header :title="title" type="table">
      </ph-card-header>
      <div class="ph-card-body">
        <ph-table
          v-bind="tableConfig"
        >
        </ph-table>
      </div>
    </div>
  </div>
</template>

<script>
  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'

  export default {
    data() {
      return {
        title: '消息管理',
        tableConfig: {
          url: '/userNotices',
          relations: ["notice", "user"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //列表
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'notice.title', label: '标题', 'min-width': 120},
            {prop: 'notice.content', label: '内容', 'min-width': 250},
            {prop: 'notice.typeName', label: '类型', 'min-width': 50},
            {prop: 'notice.targetCode', label: '操作对象', 'min-width': 100},
            {prop: 'notice.targetType', label: '操作类型', 'min-width': 120},
            {prop: 'notice.senderId', label: '发送者', 'min-width': 100},
            {prop: 'isRead', label: '是否已读', 'min-width': 100},
            {prop: 'user.name', label: '接受者', 'min-width': 100},
          ],
          // 搜索
          searchForm: [
          
          ]
        }
      }
    },
    computed: {},
    methods: {
      statusClassName({row}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      },
    },
    watch: {}
  }
</script>

<style scoped>


</style>
