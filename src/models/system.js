import global from './global.js';
import qs from 'qs';
import store from '../store/userStore.js';
import router from '../router/router.js';
import {Message} from 'element-ui'

const systemModel = {
  //登陆
  login: (param) => {
    let path = "/accessToken";
    param.tenantId = global.config.TENANT_ID;
    return global.axios.post(path, qs.stringify(param), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data);
  },

  //退出
  logout: () => {

    //清空缓存
    store.commit("clearToken");
    store.commit("clearUser");
    store.commit("clearMenu");
    store.commit("clearRolePower");

    Message.info({message: '退出成功!'});

    //调整到登陆页
    router.push({
      path: '/login'
    })
  },

  //通过token获取用户信息
  getMine: () => {
    let path = "/users/mine";

    return global.axios.get(path).then(res => res.data);
  },

  //通过token获取菜单信息
  getMenu: () => {
    let path = "/menus/mine";
    return global.axios.get(path).then(res => res.data);
  },

  //通过token获取菜单信息
  getRolePower: () => {
    let path = "/rolePowers/mine";
    return global.axios.get(path).then(res => res.data);
  }
}


export default systemModel;
