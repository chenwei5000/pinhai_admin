import global from './global.js'
import store from '@/store'


const datadicModel = {

  //获取所有数据字典
  getDatadics: (pagesize = -1) => {
    const path = '/dataDicItems?sort=valueName&order=asc';

    return global.searchResource(path, null, null, pagesize).then(data => data.rows);
  },

  // 通过字典类型获取字典列表
  getByType: (type) => {
    const path = '/dataDicItems';

    let rules = [];
    //通过类型搜索
    rules.push({field: "type", op: "eq", data: type});
    //状态有效
    rules.push({field: "status", op: "eq", data: "1"});

    return global.searchResource(path, rules).then(data => data.rows);
  },

  // 获取字典id:name格式下拉框选项
  getSelectOptions(type) {
    let _options = [];

    const _loadData = async function () {
      let list = store.getters.datadics;
      if (list == null) {
        list = await store.dispatch('app/loadDatadics');
      }
      if (list) {
        list.forEach(obj => {
          if (obj.type && obj.type == type) {
            _options.push({
              label: obj.valueName,
              value: obj.valueId + ''
            });
          }
        });
      }
    }
    _loadData();
    return _options;
  },

  // 获取字典name:name格式下拉框选项
  getSelectNameOptions(type) {
    let _options = [];

    const _loadData = async function () {
      let list = store.getters.datadics;
      if (list == null) {
        list = await store.dispatch('app/loadDatadics');
      }
      if (list) {
        list.forEach(obj => {
          if (obj.type && obj.type === type) {
            _options.push({
              label: obj.valueName,
              value: obj.valueName
            });
          }
        });
      }
    }
    _loadData();
    return _options;
  }
}

export default datadicModel;
