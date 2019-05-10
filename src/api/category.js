import global from './global.js'


const categoryModel = {

  // 分类
  getMineCategories: (type = 'p', pageSize = -1) => {
    let path = '/categories/permissions';

    if (type == 'p') {
      path = '/categories/permissions';
    }
    else if (type == 'm') {
      path = '/categories/permissionMaterials';
    }

    return global.searchResource(path, null, null, pageSize).then(data => data);
  },
  /**
   * 获取分类管理下拉选项
   * @param type  p-产品  m-原料
   * @param strFlg
   * @returns {Array}
   */
  getMineCategoriesOptions(type = 'p', strFlg = true) {
    var _options = [];

    const loaddata = async function () {
      categoryModel.getMineCategories(type).then(list => {
        list.forEach(obj => {
          _options.push({
            label: obj.name,
            value: strFlg ? obj.id + '' : obj.id
          });
        });
        return _options;
      });
    };
    loaddata();
    console.log(_options);
    return _options;
  }
}

export default categoryModel;
