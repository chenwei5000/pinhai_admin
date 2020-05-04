/**
 * 这个应用相关设置状态。
 */
import Cookies from 'js-cookie'
import { getLanguage } from '@/lang/index'
import categoryModel from '@/api/category'
import supplierModel from '@/api/supplier'
import warehouseModel from '@/api/warehouse'
import cartonSpecModel from '@/api/cartonspec'
import currencyModel from '@/api/currency'
import harbourModel from '@/api/harbour'
import datadicModel from '@/api/datadic'
import shippingMethodModel from '@/api/shippingMethod'
import userModel from '@/api/user'
import enumModel from '@/api/phEnum'
import merchantModel from '@/api/merchant'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : false,
    withoutAnimation: false
  },
  device: 'desktop',
  language: getLanguage(),
  size: Cookies.get('size') || 'medium',

  categories: null, //分类
  suppliers: null,  //供货商
  warehouses: null, //仓库
  cartonSpecs: null, //箱规
  currencies: null, //货币
  bankAccounts: null,//银行账户
  harbours: null,   //港口
  datadics: null, //数据字典
  shippingMethods: null, //运输方式
  personnels: null,  //人员
  enums: null, //枚举
  merchants: null, //销售渠道


}

const mutations = {

  SET_CATEGORIES: (state, categories) => {
    state.categories = categories
  },
  SET_SUPPLIERS: (state, suppliers) => {
    state.suppliers = suppliers
  },
  SET_WAREHOUSES: (state, warehouses) => {
    state.warehouses = warehouses
  },
  SET_CURRENCIES: (state, currencies) => {
    state.currencies = currencies
  },
  SET_BANKACCOUNTS: (state, bankAccounts) => {
    state.bankAccounts = bankAccounts
  },
  SET_CARTONSPECS: (state, cartonSpecs) => {
    state.cartonSpecs = cartonSpecs
  },
  SET_HARBOURS: (state, harbours) => {
    state.harbours = harbours
  },
  SET_DATADICS: (state, datadics) => {
    state.datadics = datadics
  },
  SET_SHIPPINGMETHODS: (state, shippingMethods) => {
    state.shippingMethods = shippingMethods
  },
  SET_PERSONNELS: (state, personnels) => {
    state.personnels = personnels
  },
  SET_ENUMS: (state, enums) => {
    state.enums = enums
  },
  SET_MERCHANTS: (state, merchants) => {
    state.merchants = merchants
  },

  SET_CATEGORIES: (state, categories) => {
    state.categories = categories
  },


  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  }
}

const actions = {

  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },

  loadCategories({ commit }) {
    return new Promise((resolve, reject) => {
      categoryModel.getMineCategories('p').then(async list => {
        console.log("从后端获取分类信息");
        commit('SET_CATEGORIES', list);
        resolve(list);
      }).catch(error => {
        reject(error)
      });
    });
  },

  loadSuppliers({ commit }) {
    return new Promise((resolve, reject) => {
      supplierModel.getSuppliers().then(async list => {
        console.log("从后端获取供货商信息");
        commit('SET_SUPPLIERS', list);
        resolve(list);
      }).catch(error => {
        reject(error)
      });
    });
  },


  loadWarehouses({ commit }) {
    return new Promise((resolve, reject) => {
      warehouseModel.getWarehouses().then(async list => {
        console.log("从后端获取仓库信息");
        commit('SET_WAREHOUSES', list);
        resolve(list);
      }).catch(error => {
        reject(error)
      });
    });
  },

  loadCartonSpecs({ commit }) {
    return new Promise((resolve, reject) => {
      cartonSpecModel.getCartonspecs().then(async list => {
        console.log("从后端获取箱规信息");
        commit('SET_CARTONSPECS', list);
        resolve(list);
      }).catch(error => {
        reject(error)
      });
    });
  },

  loadCurrencies({ commit }) {
    return new Promise((resolve, reject) => {
      currencyModel.getCurrencies().then(async list => {
        console.log("从后端获取货币信息");
        commit('SET_CURRENCIES', list);
        resolve(list);
      }).catch(error => {
        reject(error)
      });
    });
  },

  loadBankAccounts({ commit }) {
    return new Promise((resolve, reject) => {
      bankAccountModel.getBankAccounts().then(async list => {
        console.log("从后端获取银行账户信息");
        commit('SET_BANKACCOUNTS', list);
        resolve(list);
      }).catch(error => {
        reject(error)
      });
    });
  },

  loadCompanyManagements({ commit }) {
    return new Promise((resolve, reject) => {
      companyManagementModel.getCompanyManagements().then(async list => {
        console.log("从后端获取公司信息");
        commit('SET_COMPANYMANAGEMENTS', list);
        resolve(list);
      }).catch(error => {
        reject(error)
      });
    });
  },

  loadHarbours({ commit }) {
    return new Promise((resolve, reject) => {
      harbourModel.getHarbours().then(async list => {
        console.log("从后端获取港口信息");
        commit('SET_HARBOURS', list);
        resolve(list);
      }).catch(error => {
        reject(error)
      });
    });
  },

  loadDatadics({ commit }) {
    return new Promise((resolve, reject) => {
      datadicModel.getDatadics().then(async list => {
        console.log("从后端获取字典信息");
        commit('SET_DATADICS', list);
        resolve(list);
      }).catch(error => {
        reject(error)
      });
    });
  },

  loadShippingMethods({ commit }) {
    return new Promise((resolve, reject) => {
      shippingMethodModel.getShippingMethods().then(async list => {
        console.log("从后端获取运输方式信息");
        commit('SET_SHIPPINGMETHODS', list);
        resolve(list);
      }).catch(error => {
        reject(error)
      });
    });
  },

  loadPersonnels({ commit }) {
    return new Promise((resolve, reject) => {
      userModel.getUsers().then(async list => {
        console.log("从后端获取员工信息");
        commit('SET_PERSONNELS', list);
        resolve(list);
      }).catch(error => {
        reject(error)
      });
    });
  },

  loadEnums({ commit }) {
    return new Promise((resolve, reject) => {
      enumModel.getEnums().then(async list => {
        console.log("从后端获取枚举信息");
        commit('SET_ENUMS', list);
        resolve(list);
      }).catch(error => {
        reject(error)
      });
    });
  },

  loadMerchants({ commit }) {
    return new Promise((resolve, reject) => {
      merchantModel.getMerchants().then(async list => {
        console.log("从后端获取渠道信息");
        commit('SET_MERCHANTS', list);
        resolve(list);
      }).catch(error => {
        reject(error)
      });
    });
  },


}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
