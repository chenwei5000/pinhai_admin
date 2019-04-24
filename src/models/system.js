import global from './global.js';
import qs from 'qs';

const systemModel = {

  //登陆
  login: (param) => {
    let path = "/accessToken";
    param.tenantId = global.TENANT_ID;
    return global.axios.post(path, qs.stringify(param), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data);
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
