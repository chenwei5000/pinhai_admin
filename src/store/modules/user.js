/**
 * 用户状态信息
 */
import router, {resetRouter} from '@/router';

import systemMode from '@/api/system.js';

const ACCESS_TOKEN = "ACCESS_TOKEN";
const SESSION_USER = "SESSION_USER";
const SESSION_MENU = "SESSION_MENU";
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
  //用户菜单信息
  menu: sessionStorage.getItem(SESSION_MENU) ? JSON.parse(sessionStorage.getItem(SESSION_MENU)) : null,
  //权限信息
  rolePower: sessionStorage.getItem(SESSION_ROLE_POWER) ? JSON.parse(sessionStorage.getItem(SESSION_ROLE_POWER)) : null
}

//状态修改方法
const mutations = {

  //TODO:删除
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },

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

  //设置用户菜单
  setMenu: (state, menu) => {
    if (menu) {
      state.menu = menu;
      sessionStorage.setItem(SESSION_MENU, JSON.stringify(menu));
    }
  },

  //清除用户菜单
  clearMenu: (state) => {
    state.menu = null;
    sessionStorage.removeItem(SESSION_MENU);
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
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {data} = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const {roles, name, avatar, introduction} = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // Dynamically modify permissions
  changeRoles({commit, dispatch}, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const {roles} = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {root: true})

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
