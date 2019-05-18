import global from './global.js'


const shippingMethodModel = {

  // 获取物流方式数据
  getShippingMethods: (pagesize = -1) => {
    const path = '/shippingMethods';
    return global.searchResource(path, null, null, pagesize).then(data => data.rows);
  },

  // 获取物流方式下拉选项 id:name格式
  getSelectOptions() {
    let _shippingMethods = [];

    const _loadData = async function () {
      shippingMethodModel.getShippingMethods().then(list => {
        if (list) {
          list.forEach(obj => {
            _shippingMethods.push({
              label: obj.name,
              value: obj.id + ''
            });
          });
        }
      });
    };
    _loadData();
    return _shippingMethods;
  }

}

export default shippingMethodModel;
