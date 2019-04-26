<template>
  <el-row class="container">
    <ph-header></ph-header>
    <ph-logo></ph-logo>

    <el-container>

      <ph-menu></ph-menu>

      <section class="ph-body">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{$route.name}}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-container>

  </el-row>
</template>

<script>

  import ph_header from '@/components/header.vue';
  import ph_menu from '@/components/menu.vue';
  import ph_logo from '@/components/logo.vue';

  export default {
    name: 'HelloWorld',
    data() {
      return {}
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
  html {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

  body {
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

  .container {
    background-color: #f2f2f2;
  }

  .ph-body {
    margin-top: 60px;

  }


</style>
