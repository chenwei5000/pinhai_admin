<template>
  <div :class='{"logo":true, "iscollapse": isCollapse}'>
    <img src="../assets/logo-s.png" />
    <span>ERP管理系统 v1.2.2.1</span>
  </div>
</template>


<style>
  body {
    margin: 0;
  }

  .logo {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1002;
    width: 240px;
    height: 50px;
    padding: 0 15px;
    box-sizing: border-box;
    overflow: hidden;
    font-weight: 300;
    line-height: 50px;
    text-align: center;
    background-color: #20222A;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .15);
  }
  .logo img{
    height: 30px;
    vertical-align: middle;
    margin-right: 5px;
  }

  .iscollapse {
    width: 64px !important;
  }
  .logo span{
    color: white;
    font-weight: bold;
    vertical-align: middle;
  }

</style>

<script>
  export default {
    data() {
      return {}
    },
    computed: {
      //store 的状态必须变成计算方法，只有这样state值修改之后，才会重新计算
      isCollapse() {
        return this.$store.state.menuCollapse;
      }
    },
    methods: {}
  }
</script>
