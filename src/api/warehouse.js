import global from './global.js'


const warehouseModel = {

  // 获取供货商列表
  getWarehouses: (pagesize = -1) => {
    const path = '/warehouses';

    return global.searchResource(path, null, null, pagesize).then(data => data.rows);

  },

  getWarehouseOptions(){
    var _names = []
    const loadData = async function () {
      warehouseModel.getWarehouses().then(warehouses => {
        warehouses.forEach(warehouse => {
          _names.push({
            label: warehouse.name,
            value: warehouse.id
          });
        });
        return _names;
      });
    };

    loadData();
    return _names;
  }

}

export default warehouseModel;
