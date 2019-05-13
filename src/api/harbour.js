import global from './global.js'


const harbourModel = {

  // 获取港口列表
  getHarbours(pagesize = -1) {
    const path = '/harbours';
    return global.searchResource(path, null, null, pagesize).then(data => data.rows);
  },

  /////////////////下拉列表选项/////////////////////////////////////
  // 获取发货港口下拉列表项 id:name格式
  getSelectOptions() {
    let _sourceHarbours = [];

    const _loadData = async function () {
      harbourModel.getHarbours().then(list => {
        list.forEach(obj => {
          _sourceHarbours.push({
            label: obj.name,
            value: obj.id + ''
          });
        });
      });
    };
    _loadData();
    return _sourceHarbours;
  },

  //TODO:
  // 获取目的港口下拉列表项
  getDestinationHarbourOptions() {
    let _destinationHarbours = [];
    const _loadData = async function () {
      harbourModel.getHarbours().then(destinationHarbours => {
        destinationHarbours.forEach(destinationHarbour => {
          _destinationHarbours.push({
            label: destinationHarbour.name,
            value: destinationHarbour.id + ''
          });
        });
      });
    };
    _loadData();
    return _destinationHarbours;
  }

}


export default harbourModel;
