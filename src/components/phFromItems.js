import validrules from './validrules'
import datadicModel from '../api/datadic'

// 通用搜索
const phFromItems = {

  // 状态
  status(defaultVal = 1) {
    return {
      $type: 'radio-group',
      $id:
        'status',
      label:
        '状态',
      $el: {},
      $default: defaultVal + '',
      $options: [
        {
          label: '开启',
          value: '1'
        },
        {
          label: '禁用',
          value: '0'
        }
      ]
    }
  },

  // 是否
  yesOrNo(id, label, defaultVal = 0) {
    return {
      $type: 'radio-group',
      $id: id,
      label: label,
      $el: {},
      $default: defaultVal + '',
      $options: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '0'
        }
      ],
      rules: [
        validrules.required
      ],
    }
  },

  //名称
  name: {
    $type: 'input',
    $id: 'name',
    label: '名称',
    $el: {
      placeholder: '请输入名称'
    },
    rules: [
      validrules.required
    ]
  },

  //代码
  code: {
    $type: 'input',
    $id: 'code',
    label: '代码',
    $el: {
      placeholder: '请输入代码'
    },
    rules: [
      validrules.required
    ]
  },

  //数据字典
  datadic(type, label, defaultVal, id) {
    return {
      $type: 'select',
      $id: id,
      label: label,
      $default: defaultVal,
      $el: {
        placeholder: '请输入' + label
      },
      rules: [
        validrules.required
      ],
      $options: datadicModel.getSelectOptions(type)
    }
  },

}

export default phFromItems;
