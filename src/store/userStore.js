/**
 * 用户存储，用于保存用户登陆信息
 */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const ACCESS_TOKEN = "ACCESS_TOKEN";
const SESSION_USER = "SESSION_USER";
const SESSION_MENU = "SESSION_MENU";
const SESSION_ROLE_POWER = "SESSION_ROLE_POWER";
const MENU_COLLAPSE = "MENU_COLLAPSE";

/**
 * 定义存储对象
 * @type {Store}
 */
const store = new Vuex.Store({

  //状态定义
  state: {
    //用户 token
    token: localStorage.getItem(ACCESS_TOKEN) ? localStorage.getItem(ACCESS_TOKEN) : '',
    //用户信息
    user: sessionStorage.getItem(SESSION_USER) ? JSON.parse(sessionStorage.getItem(SESSION_USER)) : null,
    //菜单信息
    menu: sessionStorage.getItem(SESSION_MENU) ? JSON.parse(sessionStorage.getItem(SESSION_MENU)) : null,
    //权限信息
    rolePower: sessionStorage.getItem(SESSION_ROLE_POWER) ? JSON.parse(sessionStorage.getItem(SESSION_ROLE_POWER)) : null,
    //菜单收起状态
    menuCollapse: localStorage.getItem(MENU_COLLAPSE) && localStorage.getItem(MENU_COLLAPSE) == 'true' ? true : false,
  },

  //getter方法，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算
  getters: {
    //判断用户登陆状态
    isLogin: (state) => {
      if (state.token == '') {
        //Token不存在，无效登陆
        return 0;
      }
      if (state.user == null || state.menu == null || state.rolePower == null) {
        //Token存在，用户不存在。重新加载信息
        return -1;
      }

      //登陆成功
      return 1;
    },

    //验证是否有该权限
    rolePower: (state, roleTxt) => {
      return false;
    }
  },

  //setter方法
  mutations: {
    // 修改token，并将token存入localStorage
    setToken: (state, token) => {
      if (token && token != '') {
        state.token = token;
        localStorage.setItem(ACCESS_TOKEN, token);
      }
    },

    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem(ACCESS_TOKEN);
    },

    // 修改用户，并将用户存入 session中
    setUser: (state, user) => {
      if (user) {
        state.user = user;
        sessionStorage.setItem(SESSION_USER, JSON.stringify(user));
      }
    },
    clearUser: (state) => {
      state.user = null;
      sessionStorage.removeItem(SESSION_USER);
    },
    setMenu: (state, menu) => {
      if (menu) {
        state.menu = menu;
        sessionStorage.setItem(SESSION_MENU, JSON.stringify(menu));
      }
    },
    clearMenu: (state) => {
      state.menu = null;
      sessionStorage.removeItem(SESSION_MENU);
    },
    setRolePower: (state, rolePower) => {
      if (rolePower) {
        state.rolePower = rolePower;
        sessionStorage.setItem(SESSION_ROLE_POWER, JSON.stringify(rolePower));
      }
    },
    clearRolePower: (state) => {
      state.rolePower = null;
      sessionStorage.removeItem(SESSION_ROLE_POWER);
    },

    setMenuCollapse: (state, menuCollapse) => {
      if (menuCollapse) {
        state.menuCollapse = true;
      }
      else {
        state.menuCollapse = false;
      }
      localStorage.setItem(MENU_COLLAPSE, state.menuCollapse);
    }
  }
});

//导出对象
export default store;
