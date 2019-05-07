import global from './global.js'
import qs from 'qs'


const supplierModel = {

  // 登陆
  getById: (id) => {
    const path = '/suppliers';

    let param = {
      pageSize: -1,
      filters: JSON.stringify({"groupOp":"AND","rules":[{"field":"type","op":"eq","data":"id"}]})
    };

    return global.axios.get(path + "?" + qs.stringify(param)
    ).then(res => res.data.rows);
  }
}

export default supplierModel;
