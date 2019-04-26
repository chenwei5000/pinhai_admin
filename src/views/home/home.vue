<template>
  <el-row class="container">
    <ph-header></ph-header>
    <ph-logo></ph-logo>
    <ph-menu></ph-menu>
  </el-row>
</template>

<script>

  import ph_header from '@/components/header.vue';
  import ph_menu from '@/components/menu.vue';
  import ph_logo from '@/components/logo.vue';

  export default {
    name: 'HelloWorld',
    data() {
      return {
      }
    },
    components: {
      'ph-header': ph_header,
      'ph-menu': ph_menu,
      'ph-logo': ph_logo
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  html{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  body{
    margin: 0;
  }
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
  .container{
    background-color: #f2f2f2;
  }
</style>
