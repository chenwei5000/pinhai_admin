<template>
    <!-- 表格工具条 添加、导入、导出等 -->
  <div class="ph-table">
    <tableToolBar
      v-bind="toolbarConfig"
      @onToolBarAdd="onToolBarAdd"
      @onToolBarEdit="onToolBarEdit"
      @onToolBarDelete="onToolBarDelete"
      @onToolBarDownloadTpl="onToolBarDownloadTpl"
      @onToolBarDownloadData="onToolBarDownloadData"
      @onToolBarImportData="onToolBarImportData"
    >
    </tableToolBar>

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
      show-summary
      :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
      id="table"
    >
      <el-table-column prop="sortNum" label="序号" width="50"></el-table-column>

      <el-table-column prop="skuCode" label="SKU" sortable min-width="150">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="200" trigger="hover"
                      v-if="scope.row.product.skuCode && scope.row.product.skuCode.length > 30">
            <div v-html="scope.row.product.skuCode"></div>
            <span slot="reference">{{
              scope.row.product.skuCode ? scope.row.product.skuCode.length > 22 ? scope.row.product.skuCode.substr(0,20)+'..' : scope.row.product.skuCode : ''
              }}</span>
          </el-popover>
          <span v-else>
            {{ scope.row.skuCode }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="productName" label="名称" width="200">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="200" trigger="hover"
                      v-if="scope.row.product.name && scope.row.product.name.length > 17">
            <div v-html="scope.row.product.name"></div>
            <span slot="reference">{{
              scope.row.product.name ? scope.row.product.name.length > 17 ? scope.row.product.name.substr(0,15)+'..' : scope.row.product.name : ''
              }}</span>
          </el-popover>
          <span v-else>
            {{ scope.row.product.name }}
            </span>
        </template>
      </el-table-column>

      <el-table-column prop="cartonSpecId" label="箱规" min-width="120"></el-table-column>

      <el-table-column prop="numberOfCarton" label="装箱数" min-width="80"></el-table-column>
      <el-table-column prop="shippedCartonQty" label="调拨箱数" min-width="110"></el-table-column>
      <el-table-column prop="shippedQty" sortable :label="shippedQtyTitle" min-width="110"></el-table-column>

      <el-table-column prop="remark" label="备注" width="130">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="备注" width="250" trigger="hover"
                      v-if="scope.row.shippedNote && scope.row.shippedNote.length > 10">
            <div v-html="scope.row.formatShippedNote"></div>
            <span slot="reference">{{ scope.row.shippedNote ? scope.row.shippedNote.substr(0,8)+'..' : '' }}</span>
          </el-popover>
          <span v-else>
            {{ scope.row.shippedNote }}
          </span>
        </template>
      </el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation"
                       no-export="true"
                       width="120" fixed="right">
        <template slot-scope="scope">

          <el-button v-if="hasEdit" size="small" icon="el-icon-edit" circle
                     @click="onDefaultEdit(scope.row)" type="primary" id="ph-table-edit">
          </el-button>

          <el-button v-if="hasDelete" type="danger" size="mini"
                     id="ph-table-del" icon="el-icon-delete" circle
                     @click="onDefaultDelete(scope.row)">

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
  import tableToolBar from '@/components/PhTableToolBar'
  import itemDialog from './dialog'

  export default {
    components: {
      tableToolBar,
      itemDialog
    },
    props: {
      primary: {
        type: [Object],
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
    },
    filters: {
    },

    data() {
      return {
        // 选择项
        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,

        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        //操作按钮控制
        hasOperation: true,
        hasAdd: true,
        hasEdit: true,
        hasDelete: true,

        tableData: [
          {
            cartonSpecId: 1,
            numberOfCarton: 2,
            productName: 3,
            shippedCartonQty: 4,
            skuCode: 5,
            shippedQty: 6,
        },
        ],  // 前端表格显示的数据，本地搜索用
        // 表格加载效果
        loading: false,
        unit: "箱",

        // 表格工具条配置
        toolbarConfig: {
          hasEdit: false,
          hasDelete: false,
          hasAdd: true,
          hasExportTpl: false,
          hasExport: false,
          hasImport: false,
        }
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
      })
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 行修改功能 */
      onDefaultEdit(row) {
        this.$refs.itemDialog.openDialog(row.id);
      },

      /* 行删除功能 */
      onDefaultDelete(row) {
        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
            
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
      },

      /********************* 工具条按钮  ***************************/
      onToolBarAdd() {
        this.$refs.itemDialog.openDialog(null);
      },
      onToolBarEdit() {
      },
      onToolBarDelete() {
      },
      onToolBarDownloadTpl() {
      },
      onToolBarDownloadData() {
      },
      onToolBarImportData() {

      }
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
</style>

