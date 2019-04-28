import Router from 'vue-router'

import Login from '../views/login'
import Home from '../views/home/home'
import store from "../store/userStore";
import systemMode from "../models/system";


const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    }]
});

export default router;

router.beforeEach((to, from, next) => {
  //忽略登陆
  if (to.path === '/login') {
    next();
  } else {
    //登陆成功
    if (store.getters.isLogin == 1) {
      getMenu();
      next();
    }
    //登陆失败
    else if (store.getters.isLogin == 0) {
      next('/login');
    }
    // Session失效
    else if (store.getters.isLogin == -1) {

      //重新加载数据, 因为三个方法都是异步的ajax调用，需要构造一个方法保证，多个异步调用都能完成
      const reloadInfo = async function () {
        //重新加载用户信息
        systemMode.getMine().then(user => {
          store.commit('setUser', user);
        });

        //重新加载菜单信息
        systemMode.getMenu().then(menu => {
          store.commit('setMenu', menu);
          if ((router.resolve({name: '基础资料'}).route.matched.length) == 0) {
            initMenu(menu);
          }
        });

        //重新加载权限信息
        systemMode.getRolePower().then(rolePower => {
          store.commit('setRolePower', rolePower);
        });
      }

      reloadInfo();

      // store.commit 为异步处理，需要通过观察器来判断commit是否都执行完毕
      store.subscribe((mutation, state) => {
        if (state.menu && state.rolePower && state.user) {
          next();
        }
      })
    }
  }
});

let getMenu = () => {
  if ((router.resolve({name: '基础资料'}).route.matched.length) == 0) {
    if (store.state.menu) {
      initMenu(store.state.menu);
    }
  }
}

let initMenu = (menu) => {
  if (menu.length === 0) {
    return
  }
  let menus = formatRoutes(menu);
  // 最后添加
  let unfound = {path: '*', redirect: '/404', hidden: true}
  menus.push(unfound)
  router.addRoutes(menus);
}

let formatRoutes = (aMenu) => {
  const aRouter = []

  aMenu.forEach(oMenu => {
    //一级菜单
    if (oMenu.level == 1 && oMenu.childMenu.length > 0) {
      let oRouter = {
        path: '/',
        name: oMenu.title,
        component: Home,
        children: formatRoutes(oMenu.childMenu)
      }
      aRouter.push(oRouter);
    }
    //二级以上菜单
    else if (oMenu.level > 1) {
      let oRouter = {
        path: oMenu.url.replace("/", "_"),
        name: oMenu.title,
        components: import('../views/' + oMenu.url + '.vue')
      }
      aRouter.push(oRouter);
    }
  })
  return aRouter
}
