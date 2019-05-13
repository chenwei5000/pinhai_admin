const validRules = {

  required: {
    required: true,
    message: '该内容必须输入!',
    trigger: 'change'
  },

  number: {
    type: 'number',
    whitespace: true, //处理空格
    transform(value) {
      if (value) {
        return Number(value);
      }
    },
    message: '必须是数字!',
    trigger: 'change'
  },

  integer: {
    whitespace: true,
    type: 'integer',
    transform(value) {
      if (value) {
        return Number(value);
      }
    },
    message: '必须为正整数',
    trigger: 'change'
  },

  strMax(len) {
    return {
      max: len,
      whitespace: true, //处理空格
      message: '长度不能超过'+len+'位',
      trigger: 'change'
    }
  },
}

export default validRules;
