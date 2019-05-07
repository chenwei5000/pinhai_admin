import global from './global.js'
import qs from 'qs'


const datadicModel = {

  // 登陆
  getByType: (type) => {
    const path = '/dataDicItems';

    let param = {
      pageSize: -1,
      filters: JSON.stringify({"groupOp": "AND", "rules": [{"field": "type", "op": "eq", "data": type}]})
    };

    return global.axios.get(path + "?" + qs.stringify(param)
    ).then(res => res.data.rows);
  }
}

export default datadicModel;
