/**
 * 用户状态信息
 */
import router, {resetRouter} from '@/router';

import systemMode from '@/api/system.js';

const ACCESS_TOKEN = "ACCESS_TOKEN";
const SESSION_USER = "SESSION_USER";
const SESSION_ROLE_POWER = "SESSION_ROLE_POWER";

//状态值
const state = {
  /*需要删除*/
  name: '',
  avatar: '',
  introduction: '',
  roles: [],

  //用户 token
  token: localStorage.getItem(ACCESS_TOKEN) ? localStorage.getItem(ACCESS_TOKEN) : '',
  //用户信息
  user: sessionStorage.getItem(SESSION_USER) ? JSON.parse(sessionStorage.getItem(SESSION_USER)) : null,
  //权限信息
  rolePower: sessionStorage.getItem(SESSION_ROLE_POWER) ? JSON.parse(sessionStorage.getItem(SESSION_ROLE_POWER)) : null
}

//状态修改方法
const mutations = {

  // 修改token，并将token存入localStorage
  setToken: (state, token) => {
    if (token && token != '') {
      state.token = token;
      localStorage.setItem(ACCESS_TOKEN, token);
    }
  },
  // 清除Token
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

  //清除用户信息
  clearUser: (state) => {
    state.user = null;
    sessionStorage.removeItem(SESSION_USER);
  },

  //设置用户权限
  setRolePower: (state, rolePower) => {
    if (rolePower) {
      state.rolePower = rolePower;
      sessionStorage.setItem(SESSION_ROLE_POWER, JSON.stringify(rolePower));
    }
  },

  //清除用户权限
  clearRolePower: (state) => {
    state.rolePower = null;
    sessionStorage.removeItem(SESSION_ROLE_POWER);
  }
}

//方法
const actions = {

  // user login
  login({commit}, userInfo) {
    const {username, password} = userInfo
    return new Promise((resolve, reject) => {
      systemMode.login({account: username.trim(), password: password}).then(response => {
        commit('setToken', response.data);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
