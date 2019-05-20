const getters = {

  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  //TODO: 没有用
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,

  //错误日志
  errorLogs: state => state.errorLog.logs,

  //菜单
  menus: state => state.menu.routes,
  //动态路由
  asyncRoutes: state => state.menu.asyncRoutes,
  //用户信息
  userInfo: state => state.user.user,
  //权限控制
  rolePower: state => state.user.rolePower,

  //判断用户登陆状态
  isLogin: state => {

    if (!state.user.token || state.user.token == '') {
      //Token不存在，无效登陆
      return 0;
    }
    if (state.user.user == null || state.menu.asyncRoutes == null
      || state.menu.asyncRoutes.length == 0 || state.user.rolePower == null) {
      //Token存在，其它用户相关信息不存在，需要重新获取
      console.log(">>需要重新加载用户相关信息");
      return -1;
    }
    //登陆成功
    return 1;
  },

  //
  categories: state => state.app.categories,
  suppliers: state => state.app.suppliers,
  warehouses: state => state.app.warehouses, //仓库
  countries: state => state.app.countries,  //国家
  currencies: state => state.app.currencies, //货币
  cartonSpecs: state => state.app.cartonSpecs, //箱规
  harbours: state => state.app.harbours,   //港口
  merchants: state => state.app.merchants,   //销售渠道
  datadics: state => state.app.datadics, //数据字典
  shippingMethods: state => state.app.shippingMethods, //运输方式
  personnels: state => state.app.personnels, //人员

  //验证是否有该权限
  checkRolePower: (state, roleTxt) => {
    return false;
  }

}
export default getters
