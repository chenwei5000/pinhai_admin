import global from './global.js'


const positionModel = {

  // 获取职位列表
  getPositions: (tenantId = null, pagesize = -1) => {
    let path = '/positions';
    if(tenantId){
      path += '?tenantId='+tenantId;
    }
    return global.searchResource(path, null, null, pagesize).then(data => data);
  },

  // 获取id:name格式下拉框选项
  getSelectOptions(tenantId = null) {
    let _options = [];
    const _loadData = async () => {
      this.getPositions(tenantId).then($res => {
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

export default positionModel;
