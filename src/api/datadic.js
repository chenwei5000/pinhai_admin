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
  }
}

export default datadicModel;
