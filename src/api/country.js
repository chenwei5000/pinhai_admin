import global from './global.js'


const countryModel = {

  // 获取国家列表
  getCountries: (pagesize = -1) => {
    const path = '/countries';
    return global.searchResource(path, null, null, pagesize).then(data => data);
  },

  // 获取id:name格式下拉框选项
  getSelectOptions() {
    let _options = [];
    const _loadData = async () => {
      this.getCountries().then($res => {
        if ($res) {
          $res.forEach(obj => {
            _options.push({
              label: obj.name,
              value: obj.id + ''
            });
          });
        }
      })
    };
    _loadData();
    return _options;
  }
}

export default countryModel;
