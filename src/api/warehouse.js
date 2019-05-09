import global from './global.js'


const warehouseModel = {

  // 获取供货商列表
  getSuppliers: (pagesize = -1) => {
    const path = '/warehouses';

    return global.searchResource(path, null, null, pagesize).then(data => data.rows);

  }
}

export default warehouseModel;
