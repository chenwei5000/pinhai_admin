<template>
  <div class="register-bg">
    <div class="register">
      <div class="message">
        <img src="../../assets/logo-2.png" />
        {{ global.config.NAME }}
        <small>{{ global.config.VERSION }}</small>
      </div>
      <div id="darkbannerwrap" />

      <el-form
        ref="user"
        :model="user"
        :rules="registerRules"
        label-position="left"
        v-loading="loading"
      >
        <el-form-item prop="account">
          <span class="svg-container">
            <svg-icon icon-class="email" />
          </span>

          <el-input v-model="user.account" placeholder="请输入邮箱" type="text" tabindex="1" />
        </el-form-item>

        <el-form-item prop="name">
          <span class="svg-container">
            <svg-icon icon-class="peoples" />
          </span>

          <el-input
            ref="name"
            v-model="user.name"
            placeholder="请输入姓名"
            name="name"
            type="text"
            tabindex="1"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="当前键盘为大写模式" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container svg-password">
              <svg-icon icon-class="password" />
            </span>

            <el-input
              :key="passwordType"
              ref="password"
              v-model="user.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="register"
            />

            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-tooltip v-model="capsTooltip" content="当前键盘为大写模式" placement="right" manual>
          <el-form-item prop="repeat">
            <span class="svg-container svg-password">
              <svg-icon icon-class="repeat" />
            </span>

            <el-input
              :key="repeatType"
              v-model="user.repeatPassword"
              :type="repeatType"
              placeholder="请再输入密码"
              name="repeat"
              tabindex="2"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="register"
            />

            <span class="show-pwd" @click="showRepeatPwd">
              <svg-icon :icon-class="repeatType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-form-item prop="position">
          <span class="svg-container">
            <svg-icon icon-class="position" />
          </span>

          <el-input
            ref="position"
            v-model="user.job"
            placeholder="请输入职位"
            name="position"
            type="text"
            tabindex="1"
          />
        </el-form-item>

        <hr class="hr15" />
        <input class="registerin" value="注册" type="button" @click="register" />
        <hr class="hr20" />
      </el-form>
    </div>
  </div>
</template>


<script>
import { validEmail } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error("账号为邮箱格式!"));
      } else {
        callback();
      }
    };
    const validateRepeate = (rule, value, callback) => {
      if (this.user.password != this.user.repeatPassword) {
        callback(new Error("两次密码不一致"));
      }
      callback();
    };
    return {
      user: {
        tenantId: this.global.TENANT_ID,
        account: "",
        job: "",
        name: "",
        password: "",
        phoneNo: "",
        repeatPassword: "",
        tenantId: ""
      },
      registerRules: {
        account: [
          { required: true, message: "必须提供邮箱", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ min: 6, message: "密码至少6个字符", trigger: "blur" }],
        repeat: [
          { required: true, trigger: "blur", validator: validateRepeate }
        ]
      },
      passwordType: "password",
      repeatType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {},
  mounted() {
    if (this.user.username === "") {
      this.$refs.username.focus();
    } else if (this.user.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {},
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= "a" && key <= "z")) ||
          (!shiftKey && (key >= "A" && key <= "Z"))
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },

    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "text";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },

    showRepeatPwd() {
      if (this.repeatType === "password") {
        this.repeatType = "text";
      } else {
        this.repeatType = "password";
      }
      this.$nextTick(() => {
        this.$refs.repeat.focus();
      });
    },

    register() {
      this.$refs.user.validate(valid => {
        if (valid) {
          this.loading = true;
          let url = `/users/register`;
          this.global.axios.post(url, this.user).then(data => {
            if (data.status == 200) {
              this.$message.info("注册成功");
              this.$router.push({
                path: "/login"
              });
              this.loading = false;
              return;
            }
            this.loading = false;
            this.$message.info("注册失败");
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style type="text/less" lang="scss" scoped>
body,
html {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

.el-button--primary {
  float: right;
  margin-top: 20px;
}

.el-input {
  border: 1px solid #dcdee0;
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
    background-color: #fdfdfd;
    outline: none;
    width: 100%;
    padding-left: 0px;
    box-sizing: border-box;
  }
}

.register-bg {
  /*background: #eeeeee 0 0 no-repeat;*/
  background: url(../../assets/images/bg.png) no-repeat center;
  background-size: cover;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.register {
  margin: 120px auto 0 auto;
  min-height: 420px;
  max-width: 420px;
  padding: 40px;
  background-color: #fdfdfd;
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
    background: #189f92;
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
    color: #ffb800;
  }
  #darkbannerwrap {
    background: url(../../assets/images/aiwrap.png);
    width: 18px;
    height: 10px;
    margin: 0 0 20px -58px;
    position: relative;
  }
  input[type="text"]:focus,
  input[type="file"]:focus,
  input[type="password"]:focus,
  input[type="email"]:focus,
  select:focus {
    border: 1px solid #27a9e3;
  }
  input[type="submit"],
  input[type="button"] {
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
    background-color: #189f92;
    border-radius: 3px;
    border: none;
    -webkit-appearance: none;
    outline: none;
    width: 100%;
  }
  hr {
    background: #fdfdfd 0 0 no-repeat;
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
  .register {
    margin: 50px auto 0 auto;
    min-height: 320px;
    max-width: 320px;

    .message {
      margin: 10px 0 0 -58px;
      padding: 18px 10px 18px 20px;
      background: #189f92;
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
