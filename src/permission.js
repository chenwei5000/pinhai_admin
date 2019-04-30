/**
 * 用户权限拦截器
 */
import router from './router'

import store from './store'
//加载进度条
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import systemMode from '@/api/system'

NProgress.configure({showSpinner: false}) // NProgress Configuration

// 白名单,这个里面的请求，不进行权限验证
const whiteList = ['/login', '/auth-redirect']


router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title TODO:
  // document.title = getPageTitle(to.meta.title)

  // 用户没有Token信息
  if (store.getters.isLogin === 0) {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
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

    systemMode.reloadMenu().then(res => {
      next();
    });

  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
