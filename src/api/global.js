import _axios from 'axios'
import store from '@/store'
import {Message} from 'element-ui'
import qs from 'qs'

const config = {
  NAME: process.env.VUE_APP_NAME,
  VERSION: process.env.VUE_APP_VERSION,
  ERP_SERVICE_URL: process.env.VUE_APP_ERP_SERVICE_URL,
  //ERP_SERVICE_URL: 'http://192.168.10.200/erp-service-v2/',
  TENANT_ID: process.env.VUE_APP_TENANT_ID
}

// 定义全局方法
const generateUrl = function (path) {
  return config.ERP_SERVICE_URL + path
}

/**
 * 搜索资源通用方法
 * @param path       资源url路径
 * @param filterRule 过滤规则
 * @param relations  关联加载
 * @param pagesize   页码
 */
const searchResource = function (path, filterRules,
                                 relations = null, pagesize = -1) {

  if (!path || path == '') {
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  }
  let _filters = null;
  let _relations = null;

  if (filterRules == null) {
    filterRules = [{"field": "status", "op": "eq", "data": "1"}]
  }

  if (filterRules && filterRules.length > 0) {
    _filters = {"groupOp": "AND", "rules": filterRules}
  }
  if (relations && relations.length > 0) {
    _relations = relations
  }

  let param = {
    pageSize: pagesize ? pagesize : -1,
    filters: _filters ? JSON.stringify(_filters) : '',
    relations: _relations ? _relations : ''
  };

  if (path.indexOf('?') > -1) {
    path += '&'
  }
  else {
    path += '?'
  }

  return axios.get(path + qs.stringify(param)).then(res => res.data);
}


const axios = _axios.create({
  baseURL: config.ERP_SERVICE_URL, // url = base url + request url
  timeout: 600000 // request timeout
})

// 设置默认Request的Header
axios.interceptors.request.use(
  config => {
    const token = store.state.user.token;
    // 判断是否存在token，如果存在的话，则每个http header都加上TK-Authorization
    if (token && token != '') {
      config.headers['TK-Authorization'] = token
    }
    // 拼接完整请求路径
    // if (config.url.indexOf('http') === -1) {
    //   config.url = generateUrl(config.url)
    // }

    return config
  },
  err => {
    Message.error({message: '请求超时!'})
    return Promise.resolve(err)
  }
)

// 默认服务器相应处理机制
axios.interceptors.response.use(data => {
  return data
}, err => {
  if (!err.response) {
    Message.error(err.message);
    return {};
  }
  else {
    if (err.response.data) {
      console.log(err.response)
      Message.error({
        message: '[' + (err.response.data.code ? err.response.data.code : err.response.status) + ']'
        + (err.response.data.description ? err.response.data.description.replace(/\n/g, '<br/>')
          : err.response.data.message)
      });
      throw err
    } else {
      if (err.response.status == 504 || err.response.status == 404) {
        Message.error({message: '服务器被吃了⊙﹏⊙∥'})
      } else if (err.response.status == 403) {
        Message.error({message: '权限不足,请联系管理员!'})
      } else {
        Message.error({message: '未知错误!'})
      }
      throw err
    }
  }
  throw err
});


// 暴露出这些属性和方法
export default {
  axios,
  generateUrl,
  searchResource,
  config
}
