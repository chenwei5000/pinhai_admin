import global from './global.js'
import store from '@/store'


const harbourModel = {

  // 获取港口列表
  getHarbours(pagesize = -1) {
    const path = '/harbours?sort=name&order=asc';
    return global.searchResource(path, null, null, pagesize).then(data => data);
  },

  /////////////////下拉列表选项/////////////////////////////////////
  // 获取发货港口下拉列表项 id:name格式
  getSelectOptions() {
    let _options = [];

    const _loadData = async function () {
      let list = store.getters.harbours;
      if (list == null) {
        list = await store.dispatch('app/loadHarbours');
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
  // 获取发货港口下拉列表项 name:name格式
  getSelectNameOptions() {
    let _options = [];

    const _loadData = async function () {
      let list = store.getters.harbours;
      if (list == null) {
        list = await store.dispatch('app/loadHarbours');
      }
      if (list) {
        list.forEach(obj => {
          _options.push({
            label: obj.name,
            value: obj.name
          });
        });
      }
    }
    _loadData();
    return _options;
  }
}


export default harbourModel;
