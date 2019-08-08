import global from './global.js'
import store from '@/store'

const categoryModel = {
  // 获取自己能看见的分类列表
  getMineCategories: (type = 'p', pageSize = -1) => {
    let path = '/categories/permissions?sort=code&order=asc';

    if (type == 'p') {
      path = '/categories/permissions?sort=code&order=asc';
    } else if (type == 'm') {
      path = '/categories/permissionMaterials?sort=code&order=asc';
    }

    return global.searchResource(path, null, null, pageSize).then(data => data);
  },

  // 获取 分类id:name格式下拉框选项 原料+商品
  getMineSelectOptions() {
    let _options = [];
    let self = this;
    const _loadData = async () => {
      let tmp1 = this.getMineSelectProdcutOptions();
      let tmp2 = this.getMineSelectMaterialOptions();
      if(!tmp1){
        tmp1 = [];
      }
      if(!tmp2){
        tmp2 = [];
      }
      _options = tmp1.concat(tmp2);
    };

    _loadData();
    return _options;
  },

  /**
   * 获取产品分类管理下拉选项 id:name格式
   * @param type  p-产品  m-原料
   * @returns {Array}
   */
  getMineSelectProdcutOptions() {
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
  },

  /**
   * 获取产品分类管理下拉选项 name:name格式
   * @param type  p-产品  m-原料
   * @returns {Array}
   */
  getMineSelectProdcutNameOptions() {
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
            value: obj.name
          });
        });
      }
    }
    _loadData();

    return _options;
  },

  /**
   * 获取原料分类管理下拉选项 id:name格式
   * @param type  p-产品  m-原料
   * @returns {Array}
   */
  getMineSelectMaterialOptions() {
    let _options = [];
    let self = this;
    const _loadData = async () => {
      this.getMineCategories('m').then($res => {
        if ($res) {
          $res.forEach(obj => {
            _options.push({
              label: obj.name,
              value: obj.id + ''
            });
          });
        }
      })
    };

    _loadData();
    return _options;
  },

}

export default categoryModel;
