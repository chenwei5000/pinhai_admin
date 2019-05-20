<template>
  <div>
    <svg-icon icon-class="reload" @click="click"/>
  </div>
</template>

<script>
  import NProgress from 'nprogress' // progress bar
  import 'nprogress/nprogress.css' // progress bar style
  import router, {resetRouter} from '@/router'
  import store from '@/store'

  NProgress.configure({showSpinner: false}) // NProgress Configuration


  export default {
    name: 'Reload',
    mounted() {
    },
    methods: {
      click() {
        NProgress.start();

        store.commit('app/SET_CATEGORIES', null)
        store.commit('app/SET_SUPPLIERS', null)
        store.commit('app/SET_WAREHOUSES', null)
        store.commit('app/SET_CURRENCIES', null)
        store.commit('app/SET_CARTONSPECS', null)
        store.commit('app/SET_HARBOURS', null)
        store.commit('app/SET_DATADICS', null)
        store.commit('app/SET_SHIPPINGMETHODS', null)
        store.commit('app/SET_PERSONNELS', null)

        const _reloadMenu = async function () {
          sessionStorage.removeItem("SESSION_MENU");
          resetRouter();
          let menus = await store.dispatch('menu/loadMenus');
          let accessRoutes = await store.dispatch('menu/generateRoutes', menus);

          //重新添加动态路由
          await router.addRoutes(accessRoutes);
        }

        _reloadMenu();
        NProgress.done();
      }
    }
  }
</script>
