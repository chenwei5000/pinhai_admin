<template>
  <div>
    <el-popover
      placement="bottom"
      width="300"
      trigger="click">

      <div>
        <div>版本信息</div>
        <div>
          <p>系统名称：{{ global.config.NAME }}</p>
          <p>当前版本：{{ global.config.VERSION }}</p>
          <p>© 2018-2019 品海科技 版权所有</p>
        </div>
      </div>

      <svg-icon icon-class="more-v" slot="reference"/>
    </el-popover>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      };
    }
  };
</script>
