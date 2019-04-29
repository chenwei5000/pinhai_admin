import global from './global.js'
import qs from 'qs'
import store from '../store/index.js'
import router from '../router/index.js'
import {Message} from 'element-ui'

const systemModel = {

  // 登陆
  login: (param) => {
    const path = '/accessToken';
    param.tenantId = global.config.TENANT_ID;
    return global.axios.post(path,
      qs.stringify(param),
      {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    ).then(res => res);
  },

  // 退出
  logout: () => {
    // 清空缓存
    store.commit('user/clearToken')
    store.commit('user/clearUser')
    store.commit('user/clearMenu')
    store.commit('user/clearRolePower')

    Message.info({message: '退出成功!'})

  },

  // 通过token获取用户信息
  getMine: () => {
    const path = '/users/mine'
    return global.axios.get(path).then(res => res.data)
  },

  // 通过token获取菜单信息
  getMenu: () => {
    const path = '/menus/mine'
    return global.axios.get(path).then(res => res.data)
  },

  // 通过token获取菜单信息
  getRolePower: () => {
    const path = '/rolePowers/mine'
    return global.axios.get(path).then(res => res.data)
  }
}

export default systemModel;
