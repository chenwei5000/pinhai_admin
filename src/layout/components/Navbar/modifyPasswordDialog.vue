<template>
  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             class="ph-dialog"
             width="40%"
             top="10vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="ph-form">
      <!-- 编辑表单 TODO:-->
           <el-form
          ref="user"
          :model="user"
          :rules="loginRules"
          auto-complete="on"
          label-position="left"
          v-loading="loading"
          :inline-message="isInlineMessage"
        >
          <hr class="hr15">

          <el-tooltip v-model="capsTooltip" content="当前键盘为大写模式" placement="right" manual>
            <el-form-item prop="oldPass" label="原始密码" >
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'pass' ? 'eye' : 'eye-open'"/>
              </span>
              <el-input
                :key="passwordType"
                ref="oldPass"
                v-model="user.oldPass"
                :type="passwordType"
                :placeholder="$t('login.password')"
                name="oldPass"
                tabindex="2"
                auto-complete="off"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="login"
              />
            </el-form-item>
          </el-tooltip>

          <el-tooltip v-model="capsTooltip" content="当前键盘为大写模式" placement="right" manual>
            <el-form-item prop="newPass" label="新密码" >
              <el-input
                :key="passwordType"
                ref="newPass"
                v-model="user.newPass"
                :type="passwordType"
                :placeholder="$t('login.password')"
                name="newPass"
                tabindex="2"
                auto-complete="off"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="login"
              />
            </el-form-item>

          </el-tooltip>

          <el-tooltip v-model="capsTooltip" content="当前键盘为大写模式" placement="right" manual>
            <el-form-item prop="checkPass" label="确认密码">
              <el-input
                :key="passwordType"
                ref="checkPass"
                v-model="user.checkPass"
                :type="passwordType"
                :placeholder="$t('login.password')"
                name="checkPass"
                tabindex="2"
                auto-complete="off"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="login"
              />
            </el-form-item>
          </el-tooltip>
        </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :loading="confirmLoading">修 改</el-button>
    </div>

  </el-dialog>

</template>

<script>
  import validRules from '@/components/validRules'
  import global from '@/api/global.js'


  export default {
    components: {},
    props: {
    },
    computed: {
      dialogTitle() {
        return "修改密码";
      }
    },

    data() {
        const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.user.checkPass !== '') {
            this.$refs.user.validateField('checkPass');
          }
          callback();
        }
      };

      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.user.newPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      return {
        //Dialog 是否开启
        dialogVisible: false,
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,
         user: {
          oldPass: '',
          newPass: '',
          checkPass: ''
        },
        loginRules: {
          oldPass: [
            {min: 6, message: '密码至少6个字符', trigger: 'blur'},
            { validator: validatePass, trigger: 'blur' }
          ],
           newPass: [
            {min: 6, message: '密码至少6个字符', trigger: 'blur'},
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            {min: 6, message: '密码至少6个字符', trigger: 'blur'},
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        passwordType: 'password',
        capsTooltip: false,
        loading: false,
        redirect: undefined,
        isInlineMessage: true,
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
    },

    methods: {
      openDialog() {
      },
      closeDialog() {
      },
      // 保存
      checkCapslock({shiftKey, key} = {}) {
        if (key && key.length === 1) {
          if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
            this.capsTooltip = true
          } else {
            this.capsTooltip = false
          }
        }
        if (key === 'CapsLock' && this.capsTooltip === true) {
          this.capsTooltip = false
        }
      },

      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = 'text'
        } else {
          this.passwordType = 'password'
        }
      },

       submitForm() {
        this.$refs.user.validate((valid) => {
          if (valid) {
            var param = '?oldPass=' + this.user.oldPass + '&newPass=' + this.user.newPass;
            this.loading=true;
            global.axios.put('users/mine/password' + param).then(resp => {
              this.loading=false;
              this.$message({
                message: '修改成功！',
                type: 'success'
                });
              this.dialogVisible=false
            })
              .catch(err => {
              })
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

