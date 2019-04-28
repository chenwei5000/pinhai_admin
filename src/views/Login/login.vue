<template>

  <body class="login-bg">
  <div class="login">
    <div class="message">
      <img src="../../assets/logo-2.png"/>
      {{global.config.NAME}}
      <small>{{global.config.VERSION}}</small>
    </div>
    <div id="darkbannerwrap"></div>

    <form method="post" :model="user" class="layui-form">

      <input name="username" v-model="user.name" placeholder="用户名" type="text" lay-verify="required"
             class="layui-input"/>

      <hr class="hr15">
      <input name="password" v-model="user.pass" lay-verify="required" placeholder="密码" type="password"
             class="layui-input"/>

      <hr class="hr15">

      <input class="loginin" value="登录" @click="login" lay-filter="login" style="width:100%;" type="button"/>
      <hr class="hr20">
    </form>

  </div>
  </body>
</template>

<script>

  import systemMode from '../../models/system.js'

  export default {
    methods: {
      login() {
        var loginParams = {account: this.user.name, password: this.user.pass};
        systemMode.login(loginParams).then(token => {
          this.$store.commit("setToken", token);
          this.$router.replace('/');
        });
      }
    },
    data() {
      return {
        user: {}
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../assets/css/phadmin.less";

  .login .message img {
    height: 25px;
    vertical-align: middle;
    margin-right: 5px;
  }

  .login .message small {
    color: #FFB800;
  }
</style>
