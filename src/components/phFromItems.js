import validRules from '../components/validrules'

// 通用搜索
const phFromItems = {

  // 状态
  status: {
    $type: 'radio-group',
    $id:
      'status',
    label:
      '状态',
    $el: {},
    $default: 1,
    $options:
      [
        {
          label: '开启',
          value: 1
        },
        {
          label: '禁用',
          value: 0
        }
      ]
  },

  //名称
  name:{
    $type: 'input',
    $id: 'name',
    label: '名称',
    $el: {
      placeholder: '请输入名称'
    },
    rules: [
      validRules.required
    ]
  },

  //代码
  code:{
    $type: 'input',
    $id: 'code',
    label: '代码',
    $el: {
      placeholder: '请输入代码'
    },
    rules: [
      validRules.required
    ]
  },

}

export default phFromItems;
