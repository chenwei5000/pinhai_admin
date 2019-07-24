import global from './global.js'
import store from '@/store'


const bankAccountModel = {

  // 获取银行账户列表
  getBankAccounts: (pagesize = -1) => {
    const path = '/bankAccounts';

    return global.searchResource(path, null, null, pagesize).then(data => data);
  },

  // 获取id:name格式下拉框选项
  getSelectOptions() {
    let _options = [];
    const _loadData = async function () {
      let list = store.getters.bankAccounts();
      if (list == null) {
        list = await store.dispatch('app/loadBankAccounts');
      }
      if (list) {
        list.forEach(obj => {
          _options.push({
            label: obj.name,
            value: obj.id + ''
          });
        });
      }
    }
    _loadData();
    return _options;
  }
}

export default bankAccountModel;
