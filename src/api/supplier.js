import global from './global.js'


const supplierModel = {

  // 获取供货商列表
  getSuppliers: (pagesize = -1) => {
    const path = '/suppliers';

    return global.searchResource(path, null, null, pagesize).then(data => data.rows);

  },

  getSuppilerOptions(){
    var _names = []
    const loadData = async function () {
      supplierModel.getSuppliers().then(suppliers => {
        suppliers.forEach(supplier => {
          _names.push({
            label: supplier.name,
            value: supplier.id
          });
        });
        return _names;
      });
    };
    loadData();
    return _names;
  }

}

export default supplierModel;
