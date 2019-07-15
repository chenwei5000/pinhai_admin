import global from './global.js'
import store from '@/store'


const shippingMethodModel = {

  // 获取物流方式数据
  getShippingMethods: (pagesize = -1) => {
    const path = '/shippingMethods?sort=name&order=asc';
    return global.searchResource(path, null, null, pagesize).then(data => data.rows);
  },

  // 获取物流方式下拉选项 id:name格式
  getSelectOptions() {
    let _shippingMethods = [];

    const _loadData = async function () {
      let list = store.getters.shippingMethods;
      if (list == null) {
        list = await store.dispatch('app/loadShippingMethods');
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
    return _shippingMethods;
  }

}

export default shippingMethodModel;