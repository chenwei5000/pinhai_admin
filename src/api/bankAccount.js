import global from './global.js'



const bankAccountModel = {

  // 获取银行账户列表
  getBankAccounts: (pagesize = -1) => {
    const path = `/bankAccounts?sort=accountName&order=asc&relations=${JSON.stringify(["currency"])}`;

    return global.searchResource(path, null, null, pagesize).then(data => data);
  },

  // 获取id:name格式下拉框选项
  getSelectOptions() {
    let _options = [];
    let self = this;
    const _loadData = async function () {
      self.getBankAccounts().then($res=>{
        if ($res) {
          $res.forEach(obj => {
            _options.push({
              label: obj.accountName + "-" + (obj.currency ? obj.currency.name : ''),
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

export default bankAccountModel;
