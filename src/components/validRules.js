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
    message: '数字',
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
    message: '整数',
    trigger: 'blur'
  },

  strMax(len) {
    return {
      max: len,
      whitespace: true, //处理空格
      message: '少于' + len + '位',
      trigger: 'blur'
    }
  },
}

export default validRules;
