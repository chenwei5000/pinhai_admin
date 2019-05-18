import global from './global.js'


const currencyModel = {

  // 获取货币列表
  getCurrencies: (pagesize = -1) => {
    const path = '/currencies';

    return global.searchResource(path, null, null, pagesize).then(data => data.rows);
  },

  // 获取id:name格式下拉框选项
  getSelectOptions() {
    let _options = [];

    const _loadData = async function () {
      currencyModel.getCurrencies().then(list => {
        if (list) {
          list.forEach(obj => {
            _options.push({
              label: obj.name,
              value: obj.id + ''
            });
          });
        }
      });
    };
    _loadData();
    return _options;
  },

  // 获取name:name格式下拉框选项
  getSelectNameOptions() {
    let _options = [];

    const _loadData = async function () {
      currencyModel.getCurrencies().then(list => {
        if (list) {
          list.forEach(obj => {
            _options.push({
              label: obj.name,
              value: obj.name
            });
          });
        }
      });
    };
    _loadData();
    return _options;
  },
}

export default currencyModel;
