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
