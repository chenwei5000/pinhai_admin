import global from './global.js'


const shippingMethodModel = {

    // 获取港口列表
    getshippingMethods: (pagesize = -1) => {
        const path = '/shippingMethods';
        return global.searchResource(path, null, null, pagesize).then(data => data.rows);
    }
}

//设置关联查询
export let getShippingMethods = function() {
    var _shippingMethods = [];
    const loaddata = async function() {
        shippingMethodModel.getshippingMethods().then(shippingMethods => {
            shippingMethods.forEach(shippingMethod => {
                _shippingMethods.push({
                    label: shippingMethod.name,
                    value: shippingMethod.id
                });
            });
            return _shippingMethods;
        });
    };
    loaddata();
    return _shippingMethods;
}

export default shippingMethodModel;