import _axios from 'axios'
import store from '@/store/index'
import {Message} from 'element-ui'

const config = {
  NAME: 'ERP管理系统登录',
  VERSION: 'V2.2.1',
  ERP_SERVICE_URL: 'http://192.168.10.200/erp-service',
  TENANT_ID: 'ff80808162fb6e100162fb6e213e0000'
}

// 定义全局方法
const generateUrl = function (path) {
  return config.ERP_SERVICE_URL + path
}

const axios = _axios.create({
  baseURL: config.ERP_SERVICE_URL, // url = base url + request url
  timeout: 5000 // request timeout
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
    Message.error(err.message)
  }
  else {
    if (err.response.data) {
      Message.error({message: '[' + err.response.data.code + ']' + err.response.data.description})
    } else {
      if (err.response.status == 504 || err.response.status == 404) {
        Message.error({message: '服务器被吃了⊙﹏⊙∥'})
      } else if (err.response.status == 403) {
        Message.error({message: '权限不足,请联系管理员!'})
      } else {
        Message.error({message: '未知错误!'})
      }
    }
  }
  throw err
});


// 暴露出这些属性和方法
export default {
  axios,
  generateUrl,
  config
}
