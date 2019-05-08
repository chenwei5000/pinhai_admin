import global from './global.js'


const supplierModel = {

  // 登陆
  getSuppliers: (pagesize = -1) => {
    const path = '/suppliers';

    let filterRules = [];

    //状态有效
    filterRules.push({"field": "status", "op": "eq", "data": "1"});

    return global.searchResource(path, filterRules, null, pagesize).then(data => data.rows);

  }
}

export default supplierModel;
