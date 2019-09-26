import global from './global.js'
import store from '@/store'

const declareConfigModel = {

  // 获取报关码列表
  getDeclareConfigs: (pagesize = -1) => {
    const path = '/declareConfigs';

    return global.searchResource(path, null, null, pagesize).then(data => data);
  },

  // 获取报关码下拉选项 id:name格式
  getSelectOptions() {
    let _options = []
    const _loadData = async  ()=> {
      declareConfigModel.getDeclareConfigs().then(list => {
        list.forEach(obj => {
          _options.push({
            label: `[${obj.name}]${obj.id}`,
            value: obj.id + ''
          });
        });
    })
  }
    _loadData();
    return _options;
  },
}

export default declareConfigModel;
