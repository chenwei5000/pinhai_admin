/**
 * 缓存动态路由，防止刷新页面后动态路由丢失
 */
import {asyncRoutes, constantRoutes, resetRouter} from '@/router'
/* Layout */
import Layout from '@/layout'
import systemModel from "@/api/system";

const SESSION_MENU = "SESSION_MENU";

const state = {
  routes: [], // 全部路由
  asyncRoutes: [] // 动态路由
}

const mutations = {

  //设置动态路由信息
  setAccessedRoutes: (state, accessedRoutes) => {

    if (accessedRoutes) {
      //保存路由对象
      state.asyncRoutes = accessedRoutes;
    }

    state.routes = constantRoutes.concat(state.asyncRoutes);
  },

  //设置菜单信息
  setMenus: (state, menus) => {
    sessionStorage.setItem(SESSION_MENU, JSON.stringify(menus));
  },

  //清除用户菜单
  clearMenus: (state) => {
    state.routes = [];
    state.asyncRoutes = [];
    sessionStorage.removeItem(SESSION_MENU);
    resetRouter();
  },
}

const actions = {

  // 载入菜单信息
  loadMenus({commit}) {
    return new Promise((resolve, reject) => {
      //优先判断 Storage中是否存在菜单信息。
      let menus = (sessionStorage.getItem(SESSION_MENU)
        && sessionStorage.getItem(SESSION_MENU) != 'undefined')
        ? JSON.parse(sessionStorage.getItem(SESSION_MENU)) : false;
      if (menus) {
        console.log("从本地获取菜单信息");
        resolve(menus);
      }
      else {
        systemModel.getMenu().then(async menus => {
          console.log("从后端获取菜单信息");
          commit('setMenus', menus)
          //保存菜单信息
          resolve(menus);
        }).catch(error => {
          reject(error)
        });
      }
    })
  },

  //生成路由
  generateRoutes({commit}, menus) {
    return new Promise(resolve => {
      let accessedRoutes = menuToRoute(menus);
      commit('setAccessedRoutes', accessedRoutes);
      resolve(accessedRoutes);
    })
  }
}
/**
 * 菜单对象转路由对象
 * @param aMenu
 * @returns {Array}
 */
let menuToRoute = (menus) => {
  const aRouter = []

  menus.forEach(oMenu => {

    // 一级菜单 并且有子菜单，输出
    if (oMenu.level == 1 && oMenu.childMenu.length > 0) {
      let oRouter = {
        hidden: false, // //当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1 (默认 false)
        redirect: 'noredirect', //当设置 noredirect 的时候该路由在面包屑导航中不可被点击

        //当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
        //只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
        //若你想不管路由下面的 children 声明的个数都显示你的根路由
        //你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
        alwaysShow: true,
        name: oMenu.title, //设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题

        meta: {
          //roles: ['admin', 'editor'], //设置该路由进入的权限，支持多个权限叠加
          title: oMenu.title, //设置该路由在侧边栏和面包屑中展示的名字
          icon: oMenu.icon, //设置该路由的图标
          noCache: true, //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
          breadcrumb: true // 如果设置为false，则不会在breadcrumb面包屑中显示
        },

        path: '/' + oMenu.url,
        component: Layout,
        children: menuToRoute(oMenu.childMenu)
      }
      aRouter.push(oRouter);
    }
    // 二级以上菜单
    else if (oMenu.level > 1) {

      let oRouter = {
        hidden: false,
        alwaysShow: false,
        name: oMenu.title,
        meta: {
          //roles: ['admin', 'editor'], //设置该路由进入的权限，支持多个权限叠加
          title: oMenu.title, //设置该路由在侧边栏和面包屑中展示的名字
          icon: oMenu.icon, //设置该路由的图标
          noCache: false, //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
          breadcrumb: true // 如果设置为false，则不会在breadcrumb面包屑中显示
        },
        path: oMenu.url.replace("/", "_"),

        //TODO： vue的router组件component在import时不能使用变量, webpack 编译es6 动态引入 import() 时不能传入变量
        // https://webpack.docschina.org/concepts/
        // component: () => import('@/views/${oMenu.url}'), 各种错误
        //变量使用正确写法
        component: () => import (`@/views/${oMenu.url}`)
        //component: () => import('@/views/Harbour/index'),
      }
      aRouter.push(oRouter);

    }
  })
  return aRouter
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
