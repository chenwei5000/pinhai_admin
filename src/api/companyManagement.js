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
      self.getCompanyManagements().then($res => {
        if ($res) {
          $res.forEach(obj => {
            _options.push({
              label: obj.abbreviation,
              value: obj.id + ''
            });
          });
        }
      })
    };

    _loadData();
    return _options;
  },

  // 获取id:name格式下拉框选项
  getSelectSelfOptions() {
    let _options = [];
    let self = this;
    const _loadData = async function () {
      self.getCompanyManagements().then($res => {
        if ($res) {
          $res.forEach(obj => {
            if (obj.type == 1) {
              _options.push({
                label: obj.abbreviation,
                value: obj.id + ''
              });
            }
          });
        }
      })
    };

    _loadData();
    return _options;
  }

}

export default companyManagementModel;
