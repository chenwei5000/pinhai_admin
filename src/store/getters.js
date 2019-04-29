const getters = {

  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,

  permission_routes: state => state.permission.routes,

  errorLogs: state => state.errorLog.logs,

  menus: state => state.user.menu,

  //判断用户登陆状态
  isLogin: state => {

    if (!state.user.token || state.user.token == '') {
      //Token不存在，无效登陆
      return 0;
    }
    if (state.user.user == null || state.user.menu == null || state.user.rolePower == null) {
      //Token存在，用户不存在。重新加载信息
      return -1;
    }

    //登陆成功
    return 1;
  },

  //验证是否有该权限
  rolePower: (state, roleTxt) => {
    return false;
  }

}
export default getters
