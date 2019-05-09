import global from './global.js'


const shippingMethodModel = {

  // 获取物流方式数据
  getShippingMethods: (pagesize = -1) => {
    const path = '/shippingMethods';
    return global.searchResource(path, null, null, pagesize).then(data => data.rows);
  },

  // 获取物流方式下拉选项
  getShippingMethodOptions() {
    var _shippingMethods = [];

    const loaddata = async function () {
      shippingMethodModel.getShippingMethods().then(shippingMethods => {
        shippingMethods.forEach(shippingMethod => {
          _shippingMethods.push({
            label: shippingMethod.name,
            value: shippingMethod.id + ''
          });
        });
        return _shippingMethods;
      });
    };
    loaddata();
    return _shippingMethods;
  }

}

export default shippingMethodModel;
