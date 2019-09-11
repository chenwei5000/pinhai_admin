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
          :rules="rules"
          auto-complete="on"
          label-position="left"
          v-loading="loading"
        >
            <el-form-item prop="name" label="姓名" >
              <el-input
                ref="name"
                v-model="user.name"
                name="name"
                tabindex="2"
                auto-complete="off"
              />
            </el-form-item>

             <el-form-item prop="tel" label="联系电话" >
              <el-input
                ref="tel"
                v-model="user.tel"
                name="tel"
                tabindex="2"
                auto-complete="off"
              />
            </el-form-item>
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
        return "修改个人资料";
      }
    },

    data() {
      return {
        //Dialog 是否开启
        dialogVisible: false,
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,
        url: '/users',
        user: {
          name: '',
          tel: ''
        },
        rules: {
        },
      }
    },
    created() {
      this.initData();
    },
    methods: {
      initData(){
        this.global.axios.get(this.url + "/mine").then(resp => {
          let data = resp.data;
          this.user.name = data.name;
          this.user.tel = data.phoneNo;
        })
      },
      openDialog() {
      },
      closeDialog() {
      },
       submitForm() {
        this.$refs.user.validate((valid) => {
          if (valid) {
            var param = '?name=' + this.user.name + '&phone=' + this.user.tel;
            this.loading=true;
            global.axios.put('users/mine' + param).then(resp => {
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

