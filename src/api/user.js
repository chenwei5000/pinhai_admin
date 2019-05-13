import global from './global.js'


const userModel = {

  // 登陆
  getUsers: (pageSize = -1) => {
    const path = '/users';
    return global.searchResource(path, null, null, pageSize).then(data => data.rows);
  },

  // 获取用户 id:name格式下拉框选项
  getSelectOptions() {
    var _options = [];

    const _loadData = async function () {
      userModel.getUsers().then(list => {
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

  // 获取用户 name:name格式下拉框选项
  getSelectNameOptions() {
    var _options = [];

    const _loadData = async function () {
      userModel.getUsers().then(list => {
        list.forEach(obj => {
          _options.push({
            label: obj.name,
            value: obj.name
          });
        });
      });
    };
    _loadData();
    return _options;
  }
}

export default userModel;
