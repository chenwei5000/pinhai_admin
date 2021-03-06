import global from './global.js'
import store from '@/store'


const enumModel = {

  // 获取箱规列表
  getEnums: (pagesize = -1) => {
    const path = '/enums';
    return global.searchResource(path, null, null, pagesize).then(data => data);
  },

// 获取枚举 id:name格式下拉框选项
  getSelectOptions(type) {
    let _options = [];
    if(type == 'Status'){
      _options.push({label: '开启', value: '1'});
      _options.push({label: '关闭', value: '0'});
      return _options;
    }
    if(type == 'YesOrNo'){
      _options.push({label: '是', value: '1'});
      _options.push({label: '否', value: '0'});
      return _options;
    }
    const _loadData = async function () {
      let list = store.getters.enums;
      if (list == null) {
        list = await store.dispatch('app/loadEnums');
      }
      if (list) {
        list = list[`${type}`];
        if (list) {
          list.forEach(obj => {
            _options.push({
              label: obj.name,
              value: obj.value + ''
            });
          });
        }
      }
    }
    _loadData();

    return _options;
  },

}

export default enumModel;
