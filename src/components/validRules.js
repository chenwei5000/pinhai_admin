const validRules = {

  required: {
    required: true,
    message: '必填',
    trigger: 'blur'
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
    trigger: 'blur'
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
    trigger: 'blur'
  },

  strMax(len) {
    return {
      max: len,
      whitespace: true, //处理空格
      message: '长度不能超过' + len + '位',
      trigger: 'blur'
    }
  },
}

export default validRules;
