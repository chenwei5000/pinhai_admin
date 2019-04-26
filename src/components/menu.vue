<template>
  <el-aside>
      <el-menu class="side-menu-nav"
               background-color="#20222A"
               text-color="#fff"
               active-text-color="#fff"
               router
               unique-opened
               @open="handleopen"
               @close="handleclose"
               @select="handleselect"
               :collapse="isCollapse"
               :default-openeds="openedAll">

        <template v-for="menu in menus">

          <el-submenu :index="menu.id+''" v-if="menu.childMenu.length >0 ">
            <template slot="title">
              <i :class="menu.icon"></i>
              <span slot="title">{{menu.title}}</span>
            </template>

            <el-menu-item-group>
              <el-menu-item v-for="child in menu.childMenu" :index="child.url.replace('/','_')" :key="child.id">
                {{child.title}}
              </el-menu-item>
            </el-menu-item-group>

          </el-submenu>

        </template>

      </el-menu>

  </el-aside>
</template>


<style>
  body {
    margin: 0;
  }

  .side-menu-nav {
    margin-top: 50px;
    border-radius: 2px;
    box-shadow: 1px 0 2px 0 rgba(0, 0, 0, .05);
    min-height: 550px;
  }

  .side-menu-nav:not(.el-menu--collapse) {
    width: 240px;
  }

  .el-menu-item {
    border-left: 2px solid #20222A;
  }

  .el-menu-item:hover {
    border-left: 2px solid #009688;
  }

  .el-menu-item.is-active {
    background-color: #009688 !important;
  }

  .el-submenu i {
    color: white;
    margin-right: 10px;
  }

  .el-scrollbar__wrap.default-scrollbar__wrap {
    overflow-y: auto;
  }

</style>

<script>
  export default {
    data() {
      return {}
    },
    computed: {
      //store 的状态必须变成计算方法，只有这样state值修改之后，才会重新计算
      menus() {
        return this.$store.state.menu;
      },
      isCollapse() {
        return this.$store.state.menuCollapse;
      },
      openedAll() {
        let ids = [];
        return [];
        if (this.isCollapse) {
          return [];
        }
        this.menus.forEach(menu => {
          ids.push(menu.id + '');
        });

        return ids;
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },

      handleopen() {
        //console.log('handleopen');
      },
      handleclose() {

        //console.log('handleclose');
      },
      handleselect: function (a, b) {
      },
      //折叠导航栏
      collapse: function () {
        this.collapsed = !this.collapsed;
      }
    },
  }
</script>
