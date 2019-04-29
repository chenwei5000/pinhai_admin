<template>
  <!-- 顶部导航条 -->
  <div class="navbar">

    <!--菜单收/展工具-->
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSideBar"/>

    <!--面包条-->
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>

    <!-- 右侧区块 -->
    <div class="right-menu">

      <template v-if="device!=='mobile'">

        <!--头部搜索功能 暂时关闭 --
        <search id="header-search" class="right-menu-item"/-->

        <!-- 错误信息列表 -->
        <error-log class="errLog-container right-menu-item hover-effect"/>

        <!--全屏工具-->
        <screenfull id="screenfull" class="right-menu-item hover-effect"/>

        <!-- 布局工具 --
        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect"/>
        </el-tooltip -->

      </template>

      <!-- 用户登陆信息条 -->
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" placement="top-start" @command="handleCommand">
        <div>
          <div class="avatar-wrapper">
            <img src="../../assets/avatars/avatar4.png" class="user-avatar">
          </div>

          <div class="user-info">
            <small>欢迎光临</small>
            {{mine.name}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
        </div>

        <!--下拉菜单项 -->
        <el-dropdown-menu slot="dropdown">

          <router-link to="/profile/index">
            <el-dropdown-item icon="el-ph-icon-cog">修改密码</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item icon="el-ph-icon-account" command="editInfo">个人资料</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item icon="el-ph-icon-lightbulb" divided command="releaseLog">系统更新日志</el-dropdown-item>
          </router-link>
          <el-dropdown-item icon="el-ph-icon-tuichu" command="logout">退出</el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import SizeSelect from '@/components/SizeSelect'
  import Search from '@/components/HeaderSearch'
  import systemMode from '@/api/system'

  export default {
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      SizeSelect,
      Search
    },
    computed: {
      //store 的状态必须变成计算方法，只有这样state值修改之后，才会重新计算
      mine() {
        return this.$store.state.user.user;
      },

      ...mapGetters([
        'sidebar',
        'device'
      ])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },

      async handleCommand(command) {
        if (command == 'logout') {
          await systemMode.logout();
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }
        else {
          this.$message('click on item ' + command);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>


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
    top: 8px;
    cursor: pointer;
    color: #222222;
    font-size: 14px;
  }

  .user-info small {
    display: block;
  }

  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

  &
  :hover {
    background: rgba(0, 0, 0, .025)
  }

  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

  &
  :focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

  &
  .hover-effect {
    cursor: pointer;
    transition: background .3s;

  &
  :hover {
    background: rgba(0, 0, 0, .025)
  }

  }
  }

  .avatar-container {
    margin-right: 30px;

  .avatar-wrapper {
    margin-top: 5px;
    position: relative;
    display: inline-flex;

  .user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .el-icon-caret-bottom {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
  }

  }
  }
  }
  }
</style>
