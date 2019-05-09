import global from './global.js'


const harbourModel = {

  // 获取港口列表
  getHarbours(pagesize = -1) {
    const path = '/harbours';
    return global.searchResource(path, null, null, pagesize).then(data => data.rows);
  },

  /////////////////下拉列表选项/////////////////////////////////////
  // 获取发货港口下拉列表项
  getSourceHarbourOptions() {
    var _sourceHarbours = [];

    const loaddata = async function () {
      harbourModel.getHarbours().then(sourceHarbours => {
        sourceHarbours.forEach(sourceHarbour => {
          _sourceHarbours.push({
            label: sourceHarbour.name,
            value: sourceHarbour.id +''
          });
        });
        return _sourceHarbours;
      });
    };
    loaddata();
    return _sourceHarbours;
  },

  // 获取目的港口下拉列表项
  getDestinationHarbourOptions() {
    var _destinationHarbours = [];
    const loaddata = async function () {
      harbourModel.getHarbours().then(destinationHarbours => {
        destinationHarbours.forEach(destinationHarbour => {
          _destinationHarbours.push({
            label: destinationHarbour.name,
            value: destinationHarbour.id + ''
          });
        });
        return _destinationHarbours;
      });
    };
    loaddata();
    return _destinationHarbours;
  }

}


export default harbourModel;
