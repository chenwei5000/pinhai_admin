import global from './global.js'


const supplierModel = {

  // 获取供货商列表
  getSuppliers: (pagesize = -1) => {
    const path = '/suppliers';

    return global.searchResource(path, null, null, pagesize).then(data => data.rows);
  },

  // 获取供货商下拉选项 id:name格式
  getSelectOptions() {
    let _options = []
    const _loadData = async function () {
      supplierModel.getSuppliers().then(list => {
        list.forEach(obj => {
          _options.push({
            label: obj.name,
            value: obj.id + ''
          });
        });
      });
    };
    _loadData();
    return _names;
  },

  // 获取供货商下拉选项 name:name格式
  getSelectNameOptions() {
    let _options = []
    const _loadData = async function () {
      supplierModel.getSuppliers().then(list => {
        list.forEach(obj => {
          _options.push({
            label: obj.name,
            value: obj.name
          });
        });
      });
    };
    _loadData();
    return _options;
  }

}

export default supplierModel;
