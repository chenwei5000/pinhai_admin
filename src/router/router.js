import Vue from 'vue'
import Router from 'vue-router'

import Login from '../views/login'
import Home from '../views/home'


import store from '../store/userStore'
import systemMode from '../models/system'

Vue.use(Router)

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
    }
  ]
});

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  //忽略登陆
  if (to.path === '/login') {
    next();
  } else {
    //登陆成功
    if (store.getters.isLogin == 1) {
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
        });

        //重新加载权限信息
        systemMode.getRolePower().then(rolePower => {
          store.commit('setRolePower', rolePower);
        });
      }

      reloadInfo();

      next();
    }
  }
});


export default router;
