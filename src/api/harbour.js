import global from './global.js'


const harbourModel = {

    // 获取港口列表
    getHarbours: (pagesize = -1) => {
        const path = '/harbours';
        return global.searchResource(path, null, null, pagesize).then(data => data.rows);
    }
}

//设置发货港口关联查询
export let getSourceHarbours = function() {
        var _sourceHarbours = [];
        const loaddata = async function() {
            harbourModel.getHarbours().then(sourceHarbours => {
                sourceHarbours.forEach(sourceHarbour => {
                    _sourceHarbours.push({
                        label: sourceHarbour.name,
                        value: sourceHarbour.id
                    });
                });
                return _sourceHarbours;
            });
        };
        loaddata();
        return _sourceHarbours;
    }
    //设置目的港口关联查询
export let getDestinationHarbours = function() {
    var _destinationHarbours = [];
    const loaddata = async function() {
        harbourModel.getHarbours().then(destinationHarbours => {
            destinationHarbours.forEach(destinationHarbour => {
                _destinationHarbours.push({
                    label: destinationHarbour.name,
                    value: destinationHarbour.id
                });
            });
            return _destinationHarbours;
        });
    };
    loaddata();
    return _destinationHarbours;
}

export default harbourModel;