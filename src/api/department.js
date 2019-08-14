import global from './global.js'


const departmentModel = {

  // 获取职位列表
  getDepartments: (tenantId = null, pagesize = -1) => {
    let path = '/departments';
    if(tenantId){
      path += '?tenantId='+tenantId;
    }
    return global.searchResource(path, null, null, pagesize).then(data => data);
  },

  // 获取id:name格式下拉框选项
  getSelectOptions(tenantId = null) {
    let _options = [];
    const _loadData = async () => {
      this.getDepartments(tenantId).then($res => {
        if ($res) {
          $res.forEach(obj => {
            _options.push({
              label: obj.allName,
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

export default departmentModel;
