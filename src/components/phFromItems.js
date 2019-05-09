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
  }

}

export default phFromItems;
