<!--页面头部组件-->
<template>

  <el-col :span="24" class="header">
    <!--左侧功能条-->
    <ul :class="menuCollapseClass">

      <li class="header-nav-item first-child">
        <i :class="['ph-icon', menuCollapseIconClass]" @click="collapseMenu" title="菜单关闭"></i>
      </li>

      <li class="header-nav-item">
        <i class="ph-icon el-ph-icon-redo" @click="" title="刷新"></i>
      </li>
    </ul>
    <!-- 右侧功能条 -->
    <ul class="header-layout-right">
      <li class="header-nav-item">
        <img class="nav-user-photo" src="../assets/avatars/avatar4.png" alt=""/>

        <el-dropdown trigger="click" placement="top-start" @command="handleCommand">
          <div class="el-dropdown-link user-info">
            <small>欢迎光临,</small>
            {{mine.name}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-ph-icon-cog" command="editPass">修改密码</el-dropdown-item>
            <el-dropdown-item icon="el-ph-icon-account" command="editInfo">个人资料</el-dropdown-item>
            <el-dropdown-item icon="el-ph-icon-lightbulb" divided command="releaseLog">系统更新日志</el-dropdown-item>
            <el-dropdown-item icon="el-ph-icon-tuichu" command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
  </el-col>
</template>


<script>
  import systemMode from '../models/system.js'

  export default {
    data() {
      return {
      }
    },
    computed: {
      //store 的状态必须变成计算方法，只有这样state值修改之后，才会重新计算
      mine(){
        return this.$store.state.user;
      },
      menuCollapse() {
        return this.$store.state.menuCollapse;
      },
      menuCollapseClass(){
        if(this.menuCollapse){
          return 'header-layout-left-collapse';
        }
        else{
          return 'header-layout-left';
        }
      },
      menuCollapseIconClass(){
        if(this.menuCollapse){
          return 'el-ph-icon-indent';
        }
        else{
          return 'el-ph-icon-outdent';
        }
      }
    },
    methods: {
      collapseMenu() {
        if (this.menuCollapse) {
          this.$store.commit("setMenuCollapse", false);
        }
        else {
          this.$store.commit("setMenuCollapse", true);
        }
      },
      handleCommand(command) {
        if (command == 'logout') {
          systemMode.logout();
        }
        else {
          this.$message('click on item ' + command);
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .header {
    position: fixed;
    z-index: 1000;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom: none;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    font-size: 16px;
  }
  .header-layout-left {
    padding: 0 15px;
    transition: all .3s;
    -webkit-transition: all .3s;
    color: #fff;
    border-radius: 2px;
    font-size: 0;
    box-sizing: border-box;
    position: absolute !important;
    top: 0;
    left: 220px;
  }
  .header-layout-left-collapse{
    padding: 0 15px;
    transition: all .3s;
    -webkit-transition: all .3s;
    color: #fff;
    border-radius: 2px;
    font-size: 0;
    box-sizing: border-box;
    position: absolute !important;
    top: 0;
    left: 60px;
  }

  .header-layout-right {
    padding: 0 10px;
    transition: all .3s;
    -webkit-transition: all .3s;
    color: #fff;
    border-radius: 2px;
    font-size: 0;
    box-sizing: border-box;
    position: absolute !important;
    right: 15px;
    top: 0;
  }

  .header-nav-item {
    margin: 0 15px;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    height: 50px;
    line-height: 50px;
  }
  .first-child{
    margin: 0 15px 0 35px !important;
  }

  i.ph-icon {
    color: #333;
    cursor: pointer;
  }

  .header-nav-item {
    border-top: 2px solid #fff;
  }

  .header-nav-item:hover {
    border-top: 2px solid #333;
  }

  .nav-user-photo {
    margin: 0px 8px 0 0;
    border-radius: 100%;
    border: 2px solid #FFF;
    max-width: 40px;
  }

  .user-info {
    max-width: 180px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    vertical-align: top;
    line-height: 18px;
    position: relative;
    top: -8px;
    cursor: pointer;
  }

  .user-info small {
    display: block;
  }
</style>
