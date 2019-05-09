import global from './global.js'


const currencyModel = {

  // 获取供货商列表
  getCurrencies: (pagesize = -1) => {
    const path = '/currencies';

    return global.searchResource(path, null, null, pagesize).then(data => data.rows);

  }
}

export default currencyModel;
