import global from './global.js'



const companyManagementModel = {

  // 获取公司列表
  getCompanyManagements: (pagesize = -1) => {
    const path = '/companyManagements?sort=fullName&order=asc';

    return global.searchResource(path, null, null, pagesize).then(data => data);
  },

  // 获取id:name格式下拉框选项
  getSelectOptions() {
    let _options = [];
    let self = this;
    const _loadData = async function () {
      self.getCompanyManagements().then($res=>{
        if ($res) {
          $res.forEach(obj => {
            _options.push({
              label: obj.fullName,
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

export default companyManagementModel;
