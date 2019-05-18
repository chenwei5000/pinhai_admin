import global from './global.js'


const warehouseModel = {

  // 获取供货商列表
  getWarehouses: (pagesize = -1) => {
    const path = '/warehouses';

    return global.searchResource(path, null, null, pagesize).then(data => data.rows);
  },


  // 获取仓库 id:name格式下拉框选项
  getSelectOptions() {
    var _options = []

    const _loadData = async function () {
      warehouseModel.getWarehouses().then(list => {
        list.forEach(obj => {
          _options.push({
            label: obj.name,
            value: obj.id + ''
          });
        });
      });
    };
    _loadData();
    return _options;
  },

}

export default warehouseModel;
