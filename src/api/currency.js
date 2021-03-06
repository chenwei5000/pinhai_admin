import global from './global.js'
import store from '@/store'


const currencyModel = {

  // 获取货币列表
  getCurrencies: (pagesize = -1) => {
    const path = '/currencies';

    return global.searchResource(path, null, null, pagesize).then(data => data);
  },

  // 获取id:name格式下拉框选项
  getSelectOptions() {
    let _options = [];
    const _loadData = async function () {
      let list = store.getters.currencies;
      if (list == null) {
        list = await store.dispatch('app/loadCurrencies');
      }
      if (list) {
        list.forEach(obj => {
          _options.push({
            label: obj.name,
            value: obj.id + ''
          });
        });
      }
    };
    _loadData();
    return _options;
  }
}

export default currencyModel;
