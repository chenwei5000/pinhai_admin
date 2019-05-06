<template>
  <div>
    <svg-icon icon-class="reload" @click="click"/>
  </div>
</template>

<script>
  import systemMode from '@/api/system'
  import NProgress from 'nprogress' // progress bar
  import 'nprogress/nprogress.css' // progress bar style
  import {resetRouter} from '@/router'
  NProgress.configure({showSpinner: false}) // NProgress Configuration



  export default {
    name: 'Reload',
    mounted() {
    },
    methods: {
      click() {
        NProgress.start();

        resetRouter();

        systemMode.reloadMenu().then(res => {

          this.$message({
            message: '权限刷新成功!',
            type: 'success'
          });

          NProgress.done();
        });
      }
    }
  }
</script>
