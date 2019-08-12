import global from './global.js'
import store from '@/store'


const cartonspecModel = {

  // 获取箱规列表
  getCartonspecs: (pagesize = -1) => {
    const path = '/cartonSpecs?sort=groupCode&order=asc';
    return global.searchResource(path, null, null, pagesize).then(data => data);
  },

  // 获取id:name格式下拉框选项
  getSelectOptions() {
    let _options = [];

    const _loadData = async function () {
      let list = store.getters.cartonSpecs;
      if (list == null) {
        list = await store.dispatch('app/loadCartonSpecs');
      }
      if (list) {
        list.forEach(obj => {
          _options.push({
            label: `[${obj.groupCode}]${obj.code}`,
            value: obj.id + ''
          });
        });
      }
    }

    _loadData();
    return _options;
  },

}

export default cartonspecModel;
