import validRules from './validRules'
import datadicModel from '../api/datadic'
import phEnumModel from '../api/phEnum'

// 通用搜索
const phFromItems = {

  // 状态
  status: (defaultVal = 1) => {
    return {
      $type: 'radio-button',
      $id:
        'status',
      label:
        '状态',
      $el: {
        size:"mini",
      },
      $default: defaultVal + '',
      $options: phEnumModel.getSelectOptions('Status')
    }
  },

  // 是否
  yesOrNo: (id, label, defaultVal = 0, el = {}) => {
    return {
      $type: 'radio-button',
      $id: id,
      label: label,
      $el: {
        size:"mini",
      },
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
        validRules.required
      ],
    }
  },

  //名称
  name: (maxlength = 20) => {
    return {
      $type: 'input',
      $id: 'name',
      label: '名称',
      $el: {
        size:"mini",
        placeholder: '请输入名称',
        clearable: true,
        maxlength: maxlength + '',
        "show-word-limit": true,
      },
      rules: [
        validRules.required
      ]
    }
  },

  //代码
  code: {
    $type: 'input',
    $id: 'code',
    label: '代码',
    $el: {
      size:"mini",
      placeholder: '请输入代码,最好使用全英文,空格用-号代替。如：gymmat-104'
    },
    rules: [
      validRules.required
    ]
  },

  //数据字典 id:name
  datadic: (type, label, defaultVal, id) => {
    return {
      $type: 'select',
      $id: id,
      label: label,
      $default: defaultVal,
      $el: {
      size:"mini",
        placeholder: '请输入' + label
      },
      rules: [
        validRules.required
      ],
      $options: datadicModel.getSelectOptions(type)
    }
  },

  //数据字典 name:name
  datadicName: (type, label, defaultVal, id) => {
    return {
      $type: 'select',
      $id: id,
      label: label,
      $default: defaultVal,
      $el: {
        size:"mini",
        placeholder: '请输入' + label
      },
      rules: [
        validRules.required
      ],
      $options: datadicModel.getSelectNameOptions(type)
    }
  },

}

export default phFromItems;
