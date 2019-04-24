<template>
  <el-row type="flex" justify="center">
    <el-form :model="user" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="user.pass" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-upload" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>

  import systemMode from '../models/system.js'

  export default {
    methods: {
      login() {
        var loginParams = {account: this.user.name, password: this.user.pass};

        console.log(loginParams);
        systemMode.login(loginParams).then(token => {
          this.$store.commit("setToken", token);
          this.$router.replace('/')
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
