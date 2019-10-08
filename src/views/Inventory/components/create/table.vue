<template>
  <!-- 表格工具条 添加、导入、导出等 -->
  <div class="ph-table">

    <el-row class="table-tool" type="flex" justify="space-between">
      <el-col :md="18">
        <el-button v-if="hasAdd" type="primary" icon="el-icon-circle-plus" @click="onDefaultAdd"
                   size="small">
          新增
        </el-button>
      </el-col>
    </el-row>

    <!--表格 TODO:根据实际情况调整 el-table-column  -->
    <el-table
      ref="table"
      style="width: 100%"
      stripe
      border
      highlight-current-row
      :max-height="tableMaxHeight"
      cell-class-name="ph-cell"
      header-cell-class-name="ph-cell-header"
      :data="tableData"
      v-loading="loading"
      :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
      id="table"
    >
      <el-table-column prop="skuCode" label="SKU" sortable min-width="150" fixed="left"></el-table-column>

      <el-table-column prop="productName" label="产品名" min-width="200">
      </el-table-column>

      <el-table-column prop="storageLocationCode" label="货位" min-width="120">DEFAULT</el-table-column>
      <el-table-column prop="price" label="价格" min-width="80"></el-table-column>

      <!--<el-table-column prop="warehouseStock.qty" label="系统库存(件)" width="130">-->
      <!--</el-table-column>-->

      <!--<el-table-column prop="checkedStock" label="实际库存" min-width="110"></el-table-column>-->
      <el-table-column prop="number" label="数量" min-width="110"></el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation"
                       no-export="true"
                       width="120" fixed="right">
        <template slot-scope="scope">

          <el-button size="small" icon="el-icon-edit" circle
                     @click="onDefaultEdit(scope.row)" type="primary" id="ph-table-edit">
          </el-button>

          <el-button type="danger" size="mini"
                     id="ph-table-del" icon="el-icon-delete" circle
                     @click="onDefaultDelete(scope.$index)">

          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑明细对话框 -->
    <itemDialog @modifyCBEvent="modifyCBEvent" ref="itemDialog">
    </itemDialog>

  </div>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'
  import itemDialog from './dialog'

  export default {
    components: {
      itemDialog
    },
    props: {},
    computed: {
      ...mapGetters([
        'device', 'rolePower'
      ]),
      hasAdd() {
        return true;
      }
    },
    filters: {},

    data() {
      return {
        // 选择项
        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,
        //操作按钮控制
        hasOperation: true,
        tableData: [],  // 前端表格显示的数据，本地搜索用
        // 表格加载效果
        loading: false,
      }
    },

    created() {
    },
    watch: {
      tableData(val) {
        console.log("tableData", val);
      }
    },

    mounted() {

      //全屏，表格高度处理
      window.onresize = () => {
        this.getTableHeight();
      };


      this.$nextTick(() => {
        this.getTableHeight();
      })
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
      },

      // 获取表格的高度
      getTableHeight() {
        if (this.device !== 'mobile') {
          //浏览器高度
          let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          //表格高度
          let tableHeight = windowHeight;
          tableHeight = tableHeight - 180;
          this.tableMaxHeight = tableHeight;
        }
        else {
          this.tableMaxHeight = 400;
        }
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 行修改功能 */
      onDefaultEdit(row) {
        this.$refs.itemDialog.openDialog(row);
      },

      /* 行删除功能 */
      onDefaultDelete(index) {
        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              this.tableData.splice(index, 1);
              done();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        let flag = true; //是否存在此SKU的产品
        let idx = null;
        let _tmp = JSON.parse(JSON.stringify(this.tableData));
        this.tableData.forEach((item, index, arr) => {
          if (item.skuCode === object.skuCode) {
            arr[index] = object;
            flag = false;
          }
        });
        if (flag) {
          this.tableData.push(object);
        }
        this.tableData.push({});
        this.tableData.pop();

      },

      /********************* 工具条按钮  ***************************/
      onDefaultAdd() {
        this.$refs.itemDialog.openDialog(null);
      },
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .panel-heading {
    color: #444;
    border: 1px #cfd9db solid;
    width: 100%;
  }

  .panel-title {
    display: table-cell;
    vertical-align: middle;
    padding: 0 10px;
  }

  .table-tool {
    background-color: #dfe6ec;
    position: relative;
    z-index: 890;
    width: 100%;
    min-height: 40px;
    line-height: 30px;
    padding: 5px 10px;
  }

  .excel-upload-input {
    display: none !important;
  }

</style>

