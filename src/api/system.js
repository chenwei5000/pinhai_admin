import global from './global.js'
import qs from 'qs'
import {Message} from 'element-ui'
import store from '@/store'

import router, {resetRouter, asyncRoutes, constantRoutes} from '@/router'

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
    store.commit('menu/clearMenus')
    store.commit('user/clearRolePower')

    //重置路由
    resetRouter()

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
  },

  // 重新加载菜单和路由
  reloadMenu: () => {

    return new Promise(resolve => {
      // 重新加载数据, 因为三个方法都是异步的ajax调用，需要构造一个方法保证，多个异步调用都能完成
      const reloadInfo = async function () {

        // 重新加载用户信息
        systemModel.getMine().then(async user => {
          store.commit('user/setUser', user);
        });

        // 重新加载菜单信息
        systemModel.getMenu().then(async menus => {
          //保存菜单信息
          await store.commit('menu/setMenus', menus);
        });

        // 重新加载权限信息
        systemModel.getRolePower().then(async rolePower => {
          await store.commit('user/setRolePower', rolePower);
        });
      }

      // 重新加载数据
      reloadInfo();

      // store.commit 为异步处理，需要通过观察器来判断commit是否都执行完毕
      store.subscribe((mutation, state) => {
        if (state.menu.asyncRoutes && state.user.rolePower && state.user.user) {
          resolve(true);
        }
      });
    });
  }
}

export default systemModel;
