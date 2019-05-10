import global from './global.js'


const datadicModel = {

  // 通过字典类型或者字典列表
  getByType: (type) => {
    const path = '/dataDicItems';

    let rules = [];
    //通过类型搜索
    rules.push({field: "type", op: "eq", data: type});
    //状态有效
    rules.push({field: "status", op: "eq", data: "1"});

    return global.searchResource(path, rules).then(data => data.rows);
  },

  getDatadicOptions(type, strFlg = true) {
    var _options = [];

    const loaddata = async function () {
      datadicModel.getByType(type).then(list => {
        console.log(list);
        list.forEach(obj => {
          _options.push({
            label: obj.valueName,
            value: strFlg ? obj.valueId + '' : obj.valueId
          });
        });
        return _options;
      });
    };
    loaddata();
    return _options;
  }
}

export default datadicModel;
