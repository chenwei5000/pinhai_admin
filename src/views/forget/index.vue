<template>

  <div class="login-bg">
    <div class="login">
      <div class="message">
        <img src="../../assets/logo-2.png">
        找回密码
      </div>
      <div id="darkbannerwrap"/>

      <el-form
        ref="user"
        :model="user"
        :rules="loginRules"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user"/>
          </span>

          <el-input
            ref="username"
            v-model="user.username"
            placeholder="请输入验证邮箱"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>
        <hr class="hr15">
        <el-button class="loginin" type="success" :disabled="user.flag" @click="verification">{{ user.buttonValue}}</el-button>  
        <hr class="hr20">
      </el-form>
      <router-link to="/login">返回登录</router-link>
       
    </div>
  </div>
</template>

<style type="text/less" lang="scss" scoped>
  .loginin{
    color: white;
    width: 340px;
    height: 50px;
    font-size: 18px;
  }

  body, html {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
  }

  .el-button--primary{
    float: right;
    margin-top: 20px;
  }

  .el-input {
    border: 1px solid #DCDEE0;
    vertical-align: middle;
    border-radius: 3px;
    height: 50px;
    padding: 0px 0px 0px 16px;
    font-size: 14px;
    color: #555555;
    outline: none;
    width: 100%;
    padding-left: 40px;
    box-sizing: border-box;

    /deep/ input {
      border: none;
      vertical-align: middle;
      border-radius: 0;
      height: 48px;
      padding: 0px 16px;
      font-size: 14px;
      color: #555555;
      background-color: #FDFDFD;
      outline: none;
      width: 100%;
      padding-left: 0px;
      box-sizing: border-box;
    }
  }

  .login-bg {
    /*background: #eeeeee 0 0 no-repeat;*/
    background: url(../../assets/images/bg.png) no-repeat center;
    background-size: cover;
    overflow: hidden;
    height: 100%;
    width: 100%;
  }

  .login {
    margin: 120px auto 0 auto;
    min-height: 420px;
    max-width: 420px;
    padding: 40px;
    background-color: #FDFDFD;
    margin-left: auto;
    margin-right: auto;
    border-radius: 10px;
    /* overflow-x: hidden; */
    box-sizing: border-box;
    a.logo {
      display: block;
      height: 58px;
      width: 167px;
      margin: 0 auto 30px auto;
      background-size: 167px 42px;
    }
    .message {
      margin: 10px 0 0 -88px;
      padding: 18px 10px 18px 20px;
      background: #189F92;
      position: relative;
      color: #fff;
      font-size: 22px;
    }
    .message img {
      height: 25px;
      vertical-align: middle;
      margin-right: 5px;
    }
    .message small {
      color: #FFB800;
    }
    #darkbannerwrap {
      background: url(../../assets/images/aiwrap.png);
      width: 18px;
      height: 10px;
      margin: 0 0 20px -58px;
      position: relative;
    }
    input[type=text]:focus,
    input[type=file]:focus,
    input[type=password]:focus,
    input[type=email]:focus,
    select:focus {
      border: 1px solid #27A9E3;
    }
    input[type=submit],
    input[type=button] {
      display: inline-block;
      vertical-align: middle;
      padding: 12px 24px;
      margin: 0px;
      font-size: 18px;
      line-height: 24px;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      color: #ffffff;
      background-color: #189F92;
      border-radius: 3px;
      border: none;
      -webkit-appearance: none;
      outline: none;
      width: 100%;
    }
    hr {
      background: #FDFDFD 0 0 no-repeat;
      &.hr15 {
        height: 15px;
        border: none;
        margin: 0px;
        padding: 0px;
        width: 100%;
      }
      &.hr20 {
        height: 20px;
        border: none;
        margin: 0px;
        padding: 0px;
        width: 100%;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    position: absolute;
    z-index: 10000px;
    top: 0;
    left: 0;
    color: #889aa4;
    vertical-align: middle;
    width: 36px;
    display: inline-block;
  }

  .show-pwd {
    padding: 6px 5px 6px 15px;
    position: absolute;
    top: 0;
    right: 0;
    color: #889aa4;
    vertical-align: middle;
    width: 36px;
    display: inline-block;
    cursor: pointer;
  }

  @media (max-width: 430px) {
    .login {
      margin: 50px auto 0 auto;
      min-height: 320px;
      max-width: 320px;

      .message {
        margin: 10px 0 0 -58px;
        padding: 18px 10px 18px 20px;
        background: #189F92;
        position: relative;
        color: #fff;
        font-size: 22px;
      }
      .message img {
        height: 25px;
        vertical-align: middle;
        margin-right: 5px;
      }
    }
  }

</style>

<script>
  import {validEmail} from '@/utils/validate'
  import global from '../../api/global.js'
  import { globalAgent } from 'http';
import { setInterval, clearInterval } from 'timers';
  export default {
    name: 'Login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validEmail(value)) {
          callback(new Error('账号为邮箱格式!'))
        } else {
          callback()
        }
      }
      return {
        user: {
          flag: false,
          buttonValue: "验证",
          resendTime: 60
        },
        loginRules: {
          username: [
            {required: true, message: '请输入验证账号', trigger: 'blur'},
            {required: true, trigger: 'blur', validator: validateUsername}
          ],
        },
        capsTooltip: false,
        loading: false,
        showDialog: false,
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created() {
    },
    mounted() {
      if (this.user.username === '') {
        this.$refs.username.focus()
      }
    },
    destroyed() {

    },
    methods: {
      verification() {
        this.$refs.user.validate(valid => {
           if(valid){
            global.axios.post("users/forgetPassword", this.user).then(resp => {
          //成功的回调
          var id = setInterval(() => {
             this.user.buttonValue = this.user.resendTime + "S 后可重新发送";
             this.user.resendTime --;
             if(this.user.resendTime <0 ){
               clearInterval(id);
               this.user.flag = false;
               this.user.buttonValue = "验证";
               this.user.resendTime = 60;
             }
          }, 1000);
          this.user.flag = true;
           this.$message({
          message: '发送成功！',
          type: 'success'
        });
        }).catch(err => {
          console.log(err)
        })
        }
        })
      }
    }
  }
</script>

