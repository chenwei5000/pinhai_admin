import global from './global.js'
import store from '@/store'


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
      let list = store.getters.suppliers;
      if (list == null) {
        list = await store.dispatch('app/loadSuppliers');
      }
      if (list) {
        list.forEach(obj => {
          _options.push({
            label: obj.name,
            value: obj.id + ''
          });
        });
      }
    }
    _loadData();
    return _options;
  },

  // 获取供货商下拉选项 id:code格式
  getSelectCodeOptions() {
    let _options = []
    const _loadData = async function () {
      let list = store.getters.suppliers;
      if (list == null) {
        list = await store.dispatch('app/loadSuppliers');
      }
      if (list) {
        list.forEach(obj => {
          _options.push({
            label: obj.code,
            value: obj.id + ''
          });
        });
      }
    }
    _loadData();
    return _options;
  }

}

export default supplierModel;
