/**
 * 用户权限拦截器
 */

import router from './router'
import store from './store'
//加载进度条
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import systemMode from '@/api/system'

/* Layout */
import Layout from '@/layout'

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

    // 重新加载数据, 因为三个方法都是异步的ajax调用，需要构造一个方法保证，多个异步调用都能完成
    const reloadInfo = async function () {

      // 重新加载用户信息
      systemMode.getMine().then(user => {
        store.commit('user/setUser', user);
      });

      // 重新加载菜单信息
      systemMode.getMenu().then(menu => {

        const accessRoutes = generateRoutes(menu);
        console.log(accessRoutes);

        store.commit('user/setMenu', accessRoutes);

        //router.addRoutes(accessRoutes);
        next({...to, replace: true});
      });

      // 重新加载权限信息
      systemMode.getRolePower().then(rolePower => {
        store.commit('user/setRolePower', rolePower);
      });
    }

    // 重新加载数据
    reloadInfo();

    // store.commit 为异步处理，需要通过观察器来判断commit是否都执行完毕
    store.subscribe((mutation, state) => {
      if (state.user.menu && state.user.rolePower && state.user.user) {
        next();
      }
    })
  }
});

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

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
