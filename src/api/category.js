import global from './global.js'
import store from '@/store'

const categoryModel = {
  // 获取自己能看见的分类列表
  getMineCategories: (type = 'p', pageSize = -1) => {
    let path = '/categories/permissions?sort=code&order=asc';

    if (type == 'p') {
      path = '/categories/permissions?sort=code&order=asc';
    }
    else if (type == 'm') {
      path = '/categories/permissionMaterials?sort=code&order=asc';
    }

    return global.searchResource(path, null, null, pageSize).then(data => data);
  },

  /**
   * 获取分类管理下拉选项 id:name格式
   * @param type  p-产品  m-原料
   * @returns {Array}
   */
  getMineSelectOptions(type = 'p') {
    let _options = [];
    const _loadData = async function () {
      let list = store.getters.categories;
      if (list == null) {
        list = await store.dispatch('app/loadCategories');
      }
      if (list) {
        list.forEach(obj => {
          _options.push({
            label: obj.name,
            value: obj.id + ''
          });
        });
      }
    }
    _loadData();

    return _options;
  }
}

export default categoryModel;
