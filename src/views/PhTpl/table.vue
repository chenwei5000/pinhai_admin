<template>
  <div class="app-container">

    <div class="ph-card">

      <!-- title -->
      <ph-card-header :title = "title" type="table">

      </ph-card-header>

      <!-- 表格 -->
      <div class="ph-card-body">
        <!-- 说明  https://femessage.github.io/el-data-table/-->
        <ph-table
          :url="url"
          :columns="columns"
          :searchForm="searchForm"
          :form="form"
          :tableAttrs="tableAttrs"
        >
        </ph-table>
      </div>
    </div>


  </div>
</template>

<script>

  import {parseTime} from '@/utils'

  export default {
    /**********生命周期*******/
    // 1. beforeCreate 这个阶段主要是完成vue中关于生成周期以及事件的一些初始化工作。主要用于设置一些Vue相关的参数。不常用
    // data 无
    // el 无
    // message 无
    beforeCreate() {
    },
    // 2. created 这个阶段主要是初始化与依赖注入相关的操作，以及数据的动态绑定。 主要用于数据的初始化。常用。
    // data 有
    // el 无
    // message 有
    created() {
    },
    // 3. beforeMount 开始编译生成HTML时调用。这个时候页面的值还是占位符合。不常用。
    // data 有
    // el 有
    // message 有
    beforeMount() {
    },
    // 4. mounted  编译、渲染完成之后调用。主要用于对页面一些元素的调整。常用。
    // data 有
    // el 有 同时也有模版中的相关对象
    // message 有
    mounted() {
    },
    // 5. beforeUpdate  当vue发现data中的数据发生了改变，会触发对应组件的重新渲染。在重新渲染前调用。
    beforeUpdate() {
    },
    // 6. updated  当vue发现data中的数据发生了改变，会触发对应组件的重新渲染。在重新渲染后调用。
    updated() {
    },
    // 7. beforeDestroy 在实例销毁之前调用。
    beforeDestroy() {
    },
    // 8. destroyed 在实例销毁之后调用。 主要用于手工销毁数据。
    destroyed() {
    },
    /**********生命周期*******/

    /**********常用对象*******/
    // 数据对象，用于跟模版进行数据交互。
    // data属性的值，不会随赋值变量的改动而改动。如果要改变这个属性的值，则需要直接给data属性赋值，视图上对这个属性的显示才会变。
    // 主要用于直接跟页面进行数据交互时使用。
    data() {
      return {
        title: '国家列表', // 页面标题
        url: '/countries', // 资源URL

        //表格定义 具体可参考https://element.eleme.cn/#/zh-CN/component/table#table-attributes
        // https://femessage.github.io/el-data-table/
        tableAttrs: {
          stripe: true,
          border: true,
          "row-class-name": this.statusClassName
        },

        // 表格列定义, 具体可参考 https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes
        columns: [
          {prop: 'id', label: 'ID', sortable: 'custom'},
          {prop: 'name', label: '名称', sortable: 'custom'},
          {prop: 'enName', label: '英文名', sortable: 'custom'},
          {prop: 'isoCode2', label: '2位iso编码'},
          {prop: 'isoCode3', label: '3位iso编码'},
          {
            prop: 'status',
            label: '状态',
            formatter: row => (row.status === 1 ? '启用' : '禁用')
          }
        ],

        // 搜索区块定义, 具体可参考 https://github.com/FEMessage/el-form-renderer/blob/master/README.md
        searchForm: [
          {
            $type: 'input',
            $id: 'name',
            label: '国家名称',
            $el: {
              op: 'bw',
              placeholder: '请输入国家名称'
            }
          }
        ],
        //  弹窗表单, 用于新增与修改, 详情配置参考el-form-renderer
        // https://github.com/FEMessage/el-form-renderer/blob/master/README.md
        form: [
          {
            $type: 'input',
            $id: 'name',
            label: '国家名称',
            $el: {
              placeholder: '请输入国家名称'
            },
            rules: [
              {
                required: true,
                message: '请输入国家名称',
                trigger: 'blur'
              }
            ]
          }
        ]
      }
    },

    // 计算属性，用于跟模版进行数据交互。
    // computed属性，属于持续变化跟踪。在computed属性定义的时候，这个computed属性就与给它赋值的变量绑定了。
    // 改变这个赋值变量，computed属性值会随之改变。
    // 主要用于用过其它第三变量，间接跟页面进行数据交互时使用。
    computed: {},

    // 各种相关方法定义
    methods: {
      // 状态样式
      statusClassName({row, rowIndex}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      },
    },

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>


</style>
