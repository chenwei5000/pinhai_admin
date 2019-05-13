import global from './global.js'


const cartonspecModel = {

  // 获取箱规列表
  getCartonspecs: (pagesize = -1) => {
    const path = '/cartonSpecs';

    return global.searchResource(path, null, null, pagesize).then(data => data.rows);

  },

  // 获取id:name格式下拉框选项
  getSelectOptions() {
    let _options = [];

    const _loadData = async function () {
      cartonspecModel.getCartonspecs().then(list => {
        list.forEach(obj => {
          _options.push({
            label: obj.name,
            value: obj.id + ''
          });
        });
      });
    };
    _loadData();
    return _options;
  },

}

export default cartonspecModel;
