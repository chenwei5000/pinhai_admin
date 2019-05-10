import global from './global.js'


const userModel = {

  // 登陆
  getUsers: (pageSize = -1) => {
    const path = '/users';
    return global.searchResource(path, null, null, pageSize).then(data => data.rows);
  },

  /**
   * 获取物流方式下拉选项
   * @param type  p-产品  m-原料
   * @param strFlg
   * @returns {Array}
   */
  getUserOptions(strFlg = true) {
    var _options = [];

    const loaddata = async function () {
      userModel.getUsers(type).then(list => {
        list.forEach(obj => {
          _options.push({
            label: obj.name,
            value: strFlg ? obj.id + '' : obj.id
          });
        });
        return _options;
      });
    };
    loaddata();
    return
  }
}

export default userModel;
