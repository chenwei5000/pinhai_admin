import global from './global.js'

const warehouseModel = {

  // 获取仓库列表
  getWarehouses: (permissions = false, pagesize = -1) => {
    if (permissions) {
      let path = '/warehouses/permissions?sort=name&order=asc';
      return global.searchResource(path, null, null, pagesize).then(data => data);
    }
    else {
      let path = '/warehouses?sort=name&order=asc';
      return global.searchResource(path, null, null, pagesize).then(data => data);
    }
  },

  // 获取仓库 id:name格式下拉框选项
  getSelectOptions(permissions = true) {
    var _options = []

    const _loadData = async function () {
      warehouseModel.getWarehouses(permissions).then(list => {
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

  // 获取国内仓库 id:name格式下拉框选项
  getSelectDomesticOptions(permissions = false) {
    var _options = []

    const _loadData = async function () {
      warehouseModel.getWarehouses(permissions).then(list => {
        list.forEach(obj => {
          if (
            obj.type == "工厂仓" || obj.type == "普通" || obj.type == "虚拟仓"
          ) {
            _options.push({
              label: obj.name,
              value: obj.id + ''
            });
          }
        });
      });
    };
    _loadData();
    return _options;
  },

  // 获取国内仓库 id:name格式下拉框选项
  getSelectMaterialOptions(permissions = false) {
    var _options = []
    _options.push({
      label: "采购中库存",
      value: "-99"
    });
    const _loadData = async function () {
      warehouseModel.getWarehouses(permissions).then(list => {
        list.forEach(obj => {
          if (
            obj.type == "原料仓"
          ) {
            _options.push({
              label: obj.name,
              value: obj.id + ''
            });

          }
        });
      });
    };

    _loadData();
    return _options;
  },

  // 获取国内仓库 id:name格式下拉框选项
  getSelectDomesticAndMaterialOptions(permissions = false) {
    var _options = []

    const _loadData = async function () {
      warehouseModel.getWarehouses(permissions).then(list => {
        list.forEach(obj => {
          if (
            obj.type == "工厂仓" || obj.type == "普通" || obj.type == "虚拟仓" || obj.type == "原料仓"
          ) {
            _options.push({
              label: obj.name,
              value: obj.id + ''
            });
          }
        });
      });
    };
    _loadData();
    return _options;
  },
}

export default warehouseModel;
