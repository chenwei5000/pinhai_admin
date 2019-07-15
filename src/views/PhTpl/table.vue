<template>
  <div class="app-container">

    <div class="ph-card">

      <!-- title -->
      <ph-card-header :title="title" type="table">

      </ph-card-header>

      <!-- 表格 -->
      <div class="ph-card-body">
        <!-- 说明  https://femessage.github.io/el-data-table/-->
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
  import phFormItems from '../../components/phFromItems'

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

        tableConfig: { //品海表格配置
          url: '/countries', // 资源URL
          relations: ["creator"],//关联查询对象

          //表格定义 具体可参考https://element.eleme.cn/#/zh-CN/component/table#table-attributes
          // https://femessage.github.io/el-data-table/
          tableAttrs: {
            "default-sort": {prop: 'name', order: 'descending'}, //设置默认排序
            "row-class-name": this.statusClassName, //设置特殊样式
          },

          // 表格列定义, 具体可参考 https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes
          columns: [
            {type: 'selection'}, //多选
            {prop: 'id', label: 'ID', sortable: 'custom', hidden: true},
            {prop: 'name', label: '名称', sortable: 'custom', 'min-width': 150},
            {prop: 'enName', label: '英文名', sortable: 'custom', 'min-width': 200},
            {prop: 'isoCode2', label: '2位iso编码', 'min-width': 100, 'label-class-name': 'ph-header-small'},
            {prop: 'isoCode3', label: '3位iso编码', 'min-width': 120, 'label-class-name': 'ph-header-small'},
            phColumns.creator,
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义, 具体可参考 https://github.com/FEMessage/el-form-renderer/blob/master/README.md
          searchForm: [
            phSearchItems.name,
            phSearchItems.status()
          ],
          //  弹窗表单, 用于新增与修改, 详情配置参考el-form-renderer
          // https://github.com/FEMessage/el-form-renderer/blob/master/README.md
          form: [
            {
              $type: 'input',
              $id: 'name',
              label: '国家名称',
              $el: {
                placeholder: '请输入国家名称',
                //type: ''  输入框可以设置类型，类型支持所有h5自带类型 https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types
              },
              rules: [
                //必填验证
                validRules.required,
                //数字验证
                //validRules.number,
                //长度验证
                validRules.strMax(6)
              ]
            },
            phFormItems.status()
          ]
        }
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
      statusClassName({row}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      }
    },

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>


</style>
