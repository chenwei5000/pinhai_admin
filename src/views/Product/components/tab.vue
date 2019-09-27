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
      <el-table-column prop="materialSkuCode" label="原料SKU" sortable min-width="150" fixed="left"></el-table-column>
      <el-table-column prop="material.name" label="原料名称" min-width="200">
      </el-table-column>
      <el-table-column prop="qty" label="数量" min-width="120"></el-table-column>
      <el-table-column prop="attritionRate" label="损耗率" min-width="80"></el-table-column>

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
    props: {
      productId: {
        type: Number,
        default: null
      }
    },
    computed: {
      ...mapGetters([
        'device', 'rolePower'
      ]),
      shippedQtyTitle() {
        return `调拨${this.unit == '箱' ? '件' : this.unit}数`;
      },
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
        unit: "箱",
      }
    },

    created() {
    },
    watch: {
      tableData(val) {
      }
    },

    mounted() {
      this.initData();
      this.$nextTick(() => {
        this.initData();
      })
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        console.log("=====>",this.productId);
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 行修改功能 */
      onDefaultEdit(row) {
        this.$refs.itemDialog.openDialog(row);
      },

      onSmart(row) {
        this.tableData[0].cartonSpecCode = "aaaa1";
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
        console.log("==>>", this.productId);

        if (this.productId) {
          object.productId = this.productId;
          this.global.axios.post(`/productToMaterials`, object)
            .then(resp => {
              this.$message({type: 'success', message: '原料编辑成功'});
              let flag = true; //是否存在此SKU的产品
              this.tableData.forEach((item, index, arr) => {
                if (item.materialSkuCode === object.materialSkuCode) {
                  arr[index] = object;
                  flag = false;
                }
              });
              if (flag) {
                this.tableData.push(object);
              }
              this.tableData.push({});
              this.tableData.pop();
            })
            .catch(err => {

            })
        }
        else {
          let flag = true; //是否存在此SKU的产品
          this.tableData.forEach((item, index, arr) => {
            if (item.materialSkuCode === object.materialSkuCode) {
              arr[index] = object;
              flag = false;
            }
          });
          if (flag) {
            this.tableData.push(object);
          }
          this.tableData.push({});
          this.tableData.pop();
        }

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

