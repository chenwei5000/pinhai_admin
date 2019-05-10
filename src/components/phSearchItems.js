import categoryModel from "../api/category";
import datadicModel from "../api/datadic";

// 通用搜索
const phSearchItems = {

  // 编码搜索
  code: {
    $type: 'input',
    $id: 'code',
    label: '编码',
    $el: {
      op: 'bw',
      placeholder: '请输入编码'
    }
  },

  // 名称搜索
  name: {
    $type: 'input',
    $id: 'name',
    label: '名称',
    $el: {
      op: 'bw',
      placeholder: '请输入名称'
    }
  },

  // 状态搜索
  status: {
    $type: 'select',
    $id: 'status',
    label: '状态',
    $el: {
      op: 'eq',
      placeholder: '请选择状态'
    },
    $options: [
      {
        label: '全部',
        value: ''
      },
      {
        label: '开启',
        value: '1'
      },
      {
        label: '禁用',
        value: '0'
      }
    ]
  },

  // 产品分类
  productCategories: {
    $type: 'select',
    $id: 'categoryId',
    label: '分类',
    $options: categoryModel.getMineCategoryOptions('p', true),
    $el: {
      op: 'eq',
      placeholder: '请选择分类'
    }
  },

  // 原料分类
  materialCategories: {
    $type: 'select',
    $id: 'categoryId',
    label: '分类',
    $options: categoryModel.getMineCategoryOptions('m', true),
    $el: {
      op: 'eq',
      placeholder: '请选择分类'
    }
  },

  // 字典搜索
  datadic(type, label, id) {
    return {
      $type: 'select',
      $id: id,
      label: label,
      $el: {
        op: 'eq',
        placeholder: '请选择' + label
      },
      $options: datadicModel.getDatadicOptions(type)
    }
  }

}

export default phSearchItems;
