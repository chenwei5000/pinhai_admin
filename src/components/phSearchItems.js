import categoryModel from "../api/category";
import datadicModel from "../api/datadic";
import warehouseModel from '../api/warehouse';
import phEnumModel from '../api/phEnum'

// 通用搜索
const phSearchItems = {

  // 名称搜索
  id: {
    $type: 'hidden',
    $id: 'id',
    label: 'id',
    $el: {
      op: 'eq'
    }
  },

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
    $options: phEnumModel.getSelectOptions('Status', {
      label: '全部',
      value: ''
    })
  },

  // 产品分类
  productCategories: {
    $type: 'select',
    $id: 'categoryId',
    label: '分类',
    $options: categoryModel.getMineSelectOptions('p'),
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
    $options: categoryModel.getMineSelectOptions('m'),
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
      $options: datadicModel.getSelectOptions(type)
    }
  },

  //仓库名称搜索
  warehouseId: {
    $type: 'select',
    $id: 'warehouseId',
    label: '仓库',
    $el: {
      op: 'eq',
      placeholder: '请选择仓库'
    },
    $options: warehouseModel.getSelectOptions,
  },

  //sku编码搜索
  skuCode: {
    $type: 'input',
    $id: 'skuCode',
    label: 'SKU编码',
    $el: {
      op: 'bw',
      placeholder: '请输入SKU编码'
    }
  },

}

export default phSearchItems;
