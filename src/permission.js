/**
 * 用户权限拦截器
 */
import router, {resetRouter} from '@/router'

import store from './store'
//加载进度条
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({showSpinner: false}) // NProgress Configuration

// 白名单,这个里面的请求，不进行权限验证
const whiteList = ['/login', '/auth-redirect', '/register', '/forget', '/reset-password']

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  if(to.path == '/login'){
    next()
    return;
  }

  let list = store.getters.enums;
  if (list == null) {
    await store.dispatch('app/loadEnums');
  }

  // set page title TODO:
  // document.title = getPageTitle(to.meta.title)
  // 用户没有Token信息
  if (store.getters.isLogin === 0) {
    if (whiteList.indexOf(to.path) !== -1) {
      //白名单忽略
      next()
    } else {
      //调整到登陆页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
  // 用户登陆成功,用户、权限、菜单信息都存在
  else if (store.getters.isLogin == 1) {
    // 登陆成功自动跳转首页
    if (to.path === '/login') {
      next({path: '/'});
      NProgress.done();
    } else {
      next();
    }
  }
  // 存在Token信息，但是要加载其它信息
  else if (store.getters.isLogin == -1) {
    //用户信息不存在，需要重新加载
    if (!store.getters.userInfo) {
      console.log("重新加载用户信息");
      await store.dispatch('user/loadUser')
    }
    //权限信息不存在，需要重新加载
    if (!store.getters.rolePower) {
      console.log("重新加载权限信息");
      await store.dispatch('user/loadRolePower')
    }

    //菜单信息不存在，需要重新加载
    if (!store.getters.asyncRoutes || store.getters.asyncRoutes.length == 0) {
      console.log("重新加载菜单信息");
      //重置动态路由 TODO: 可能存在问题
      //await resetRouter();

      let menus = await store.dispatch('menu/loadMenus');
      let accessRoutes = await store.dispatch('menu/generateRoutes', menus);
      accessRoutes.push(
        {
          path: '*', // 页面不存在的情况下会跳到404页面
          redirect: '/401',
          name: 'notFound',
          hidden: true
        });

      //重新添加动态路由
      await router.addRoutes(accessRoutes);
      //菜单权限更新完成,重新进一次当前路由
      next({...to, replace: true});
    }
    else {
      next();
    }
  }

});

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
