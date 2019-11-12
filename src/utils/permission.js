import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function checkPermission(value) {
  if (value && value.length > 0) {
    const roles = store.getters && store.getters.rolePower;
    if (roles) {
      return roles.hasOwnProperty(value);
    }
    return false;
  } else {
    return false
  }
}

export function checkRole(value) {
  if (value && value.length > 0) {
    const userInfo = store.getters && store.getters.userInfo;
    if (userInfo && userInfo.roles) {
      let flg = false;
      userInfo.roles.forEach(role => {
        if (role.name == '系统管理员') {
          flg = true;
        }
        if (role.name == '公司管理员') {
          flg = true;
        }
        if (role.name == value) {
          flg = true;
        }
      })
      return flg;
    }
    return false;
  } else {
    return false
  }
}


