import global from './global.js'
import qs from 'qs'
import {Message} from 'element-ui'
import store from '@/store'
/* Layout */
import Layout from '@/layout'
import { asyncRoutes, constantRoutes } from '@/router'

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
  },

  reloadMenu: () => {

    return new Promise(resolve => {
      // 重新加载数据, 因为三个方法都是异步的ajax调用，需要构造一个方法保证，多个异步调用都能完成
      const reloadInfo = async function () {

        // 重新加载用户信息
        systemModel.getMine().then(user => {
          store.commit('user/setUser', user);
        });

        // 重新加载菜单信息
        systemModel.getMenu().then(menu => {

          const accessRoutes = generateRoutes(menu);

          console.log(accessRoutes);

          store.commit('user/setMenu', constantRoutes.concat(accessRoutes));
        });

        // 重新加载权限信息
        systemModel.getRolePower().then(rolePower => {
          store.commit('user/setRolePower', rolePower);
        });
      }

      // 重新加载数据
      reloadInfo();

      // store.commit 为异步处理，需要通过观察器来判断commit是否都执行完毕
      store.subscribe((mutation, state) => {
        if (state.user.menu && state.user.rolePower && state.user.user) {
          resolve(true);
        }
      });

      return false;
    });
  }
}

/**
 * 通过菜单信息生成路由
 * @param menu
 */
const generateRoutes = (menu) => {
  if (menu.length === 0) {
    return
  }
  let routes = menuToRoute(menu);
  return routes;
}

/**
 * 菜单转路由
 * @param aMenu
 * @returns {Array}
 */
const menuToRoute = (menu) => {
  const aRouter = []

  menu.forEach(oMenu => {
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
          title: oMenu.title,    //设置该路由在侧边栏和面包屑中展示的名字
          icon: oMenu.icon, //设置该路由的图标
          noCache: true,    //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
          breadcrumb: true // 如果设置为false，则不会在breadcrumb面包屑中显示
        },

        path: oMenu.url,
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
          title: oMenu.title,    //设置该路由在侧边栏和面包屑中展示的名字
          icon: oMenu.icon, //设置该路由的图标
          noCache: false,    //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
          breadcrumb: true // 如果设置为false，则不会在breadcrumb面包屑中显示
        },

        path: oMenu.url.replace("/", "_"),
        //components: () => import('@/views/' + oMenu.url),
        component: 'views/' + oMenu.url,
      }
      aRouter.push(oRouter);
    }
  })
  return aRouter
}


export default systemModel;
