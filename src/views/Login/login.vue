<template>

  <div class="login-bg">
    <div class="login">
      <div class="message">
        <img src="../../assets/logo-2.png"/>
        {{global.config.NAME}}
        <small>{{global.config.VERSION}}</small>
      </div>
      <div id="darkbannerwrap"></div>

      <form method="post" :model="user" class="layui-form">

        <input name="username" v-model="user.name" placeholder="用户名" type="text" lay-verify="required|email"
               class="layui-input"/>

        <hr class="hr15">
        <input name="password" v-model="user.pass" lay-verify="required" placeholder="密码" type="password"
               class="layui-input"/>

        <hr class="hr15">

        <input class="loginin" value="登录" @click="login" lay-submit lay-filter="login" style="width:100%;"
               type="button"/>
        <hr class="hr20">
      </form>

    </div>
  </div>
</template>

<script>

  import systemMode from '../../models/system.js'

  layui.use(['form']);

  export default {
    methods: {
      login() {
        var _this = this;
        layui.use(['form'], function () {
          var form = layui.form;
          form.on('submit(login)', function (data) {
            var loginParams = {account: _this.user.name, password: _this.user.pass};
            systemMode.login(loginParams).then(token => {
              _this.$store.commit("setToken", token);
              _this.$router.replace('/');
            });
          });
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

<style type="text/less" lang="scss" scoped>

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
