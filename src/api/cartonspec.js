import global from './global.js'


const cartonspecModel = {

  // 获取供货商列表
  getCartonspecs: (pagesize = -1) => {
    const path = '/cartonSpecs';

    return global.searchResource(path, null, null, pagesize).then(data => data.rows);

  }
}

export default cartonspecModel;
