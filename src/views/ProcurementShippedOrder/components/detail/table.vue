<template>

  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">
    <!--本地搜索 TODO: 更加实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam" ref="searchForm" id="filter-form"
             @submit.native.prevent>
      <el-form-item label="SKU">
        <el-input v-model="searchParam.skuCode"  size="mini" placeholder="请输入SKU" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search" size="mini">查询</el-button>
        <el-button @click="resetSearch" size="mini">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格工具条 添加、导入、导出等 -->
    <tableToolBar
      v-bind="toolbarConfig"
      :hasAdd="hasAdd"
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
      :row-class-name="dangerClassName"
      cell-class-name="ph-cell"
      header-cell-class-name="ph-cell-header"
      :data="tableData"
      v-loading="loading"
      show-summary
      :summary-method="getSummaries"
      @selection-change="handleSelectionChange"
      @cell-dblclick="handleDblclick"
      :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
      id="table"
    >
      <el-table-column prop="sortNum" label="序号" min-width="50" align="center"></el-table-column>

      <el-table-column prop="product.skuCode" label="SKU" sortable width="150" fixed="left" align="center">
      </el-table-column>

      <el-table-column prop="product.imgUrl" label="图片" width="40" align="center">
        <template slot-scope="scope" v-if="scope.row.product.imgUrl">
          <el-image
            :z-index="10000"
            style="width: 30px; height: 30px;margin-top: 5px"
            :src="scope.row.product.imgUrl"
            :preview-src-list="[scope.row.product.imgUrl.replace('_SL75_','_SL500_')]" lazy>
          </el-image>
        </template>
      </el-table-column>


      <el-table-column prop="product.name" label="名称" width="200" align="center">
      </el-table-column>

      <el-table-column prop="procurementOrder.code" label="采购单编码" width="120" align="center">
      </el-table-column>


      <el-table-column prop="numberOfCarton" label="装箱数" width="80" align="center"></el-table-column>

      <el-table-column prop="cartonSpecCode" label="箱规" width="120" align="center"></el-table-column>

      <el-table-column prop="procurementBoxQty" sortable :label="procurementBoxQtyTitle"
                       min-width="110" align="center"></el-table-column>

      <el-table-column prop="remark" label="备注" width="130" align="center">
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

      <el-table-column prop="sumCartonSpecWeight" label="应发重量(Kg)" min-width="110" align="center"></el-table-column>
      <el-table-column prop="sumCartonVolume" label="应发体积(Cm³)" min-width="110" align="center"></el-table-column>

      <el-table-column prop="shippedCartonQty" label="应发箱数" min-width="110" align="center" fixed="right"></el-table-column>
      <el-table-column prop="shippedQty" sortable :label="shippedQtyTitle" min-width="110" align="center" fixed="right"></el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation" width="100" fixed="right">
        <template slot-scope="scope">

          <el-button v-if="hasEdit" size="mini" icon="el-icon-edit" circle
                     @click="onDefaultEdit(scope.row)" type="primary" id="ph-table-edit">
          </el-button>

          <el-button v-if="hasView" size="mini" icon="el-icon-view" circle
                     @click="onDefaultEdit(scope.row)" type="primary" id="ph-table-view">
          </el-button>

          <el-button v-if="hasDelete" type="danger" size="mini"
                     id="ph-table-del" icon="el-icon-delete" circle
                     @click="onDefaultDelete(scope.row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑明细对话框 -->
    <itemDialog @modifyCBEvent="modifyCBEvent" ref="itemDialog" :primary="primary">
    </itemDialog>
  </div>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'
  import tableToolBar from '@/components/PhTableToolBar'
  import itemDialog from './dialog'
  import {checkPermission} from "../../../../utils/permission";
  import {getObjectValueByArr} from "../../../../utils";

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
      hasAdd() {
        return false;
        // if ([0, 8].indexOf(this.primary.status) > -1) {
        //   return false;
        // }
        // return checkPermission('ProcurementShippedOrderItemResource_create');
      },
      //操作按钮控制
      hasOperation(){
        return this.hasEdit || this.hasDelete || this.hasView;
      },
      hasView(){
        return !this.hasEdit;
      },
      hasEdit(){
        return checkPermission('ProcurementShippedOrderResource_update');
      },
      hasDelete:{
        get(){
          return checkPermission('ProcurementShippedOrderResource_remove');
        },
        set(newValue){
          return newValue;
        }
      },

      ...mapGetters([
        'device', 'rolePower'
      ]),
      procurementBoxQtyTitle() {
        return `采购数量(${this.unit})`;
      },
      shippedQtyTitle() {
        return `应发${this.unit == '箱' ? '件' : this.unit}数`;
      }
    },
    filters: {
      currency: currency
    },

    data() {
      return {
        // 选择项
        statusSelectOptions: [],
        prioritySelectOptions: [],

        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,

        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        unit: "箱",

        // 多选记录对象
        selected: [],

        //数据 TODO: 根据实际情况调整
        url: "/procurementShippedOrderItems", // 资源URL
        searchParam: {
          skuCode: null
        },
        filters: [
          {
            field: "procurementShippedOrderId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ],   //搜索对象
        relations: ["cartonSpec", "product", "procurementOrder", "procurementOrderItem"],  // 关联对象
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
        // 表格加载效果
        loading: false,

        // 记录修改的那一行
        row: {},

        // 表格工具条配置
        toolbarConfig: {
          hasEdit: false,
          hasDelete: false,
          hasAdd: [1, 3].indexOf(this.primary.status) != -1,
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
        this.initData();
        this.getList();
      })
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        this.loading = true;
      },

      handleDblclick(row, column, cell, event) {
        let val = getObjectValueByArr(row, column.property);
        if (val) {
          this.$copyText(val)
            .then(res => {
                this.$message.success("单元格内容已成功复制，可直接去粘贴");
              },
              err => {
                this.$message.error("复制失败");
              })
        }
      },

      /********************* 表格相关方法  ***************************/
      //报警样式 TODO:根据实际情况调整
      dangerClassName({row}) {
        if (row.saleWeek == 0 || row.safetyStockWeek - row.saleWeek > 2) { //可售周数不足
          return 'warning-row';
        }
        else if (row.saleWeek - row.safetyStockWeek > 2) { //可售周数超2周
          return 'danger-row';
        }
        return '';
      },

      /*汇总数据*/
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];

        columns.forEach((column, index) => {
          if (column.property == 'product.skuCode') {
            const values = data.map(item => item[column.property]);
            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);
            sums[index] = '合计: ' + sums[index] + ' 行';
          }

          if (column.property == 'cartonQty' || column.property =='shippedCartonQty') {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 箱';
            } else {
              sums[index] = 'N/A';
            }
          }

          if (column.property =='shippedQty') {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 件';
            } else {
              sums[index] = 'N/A';
            }
          }

          if (column.property == 'amount') {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] = currency(sums[index]);
            } else {
              sums[index] = 'N/A';
            }
          }

          if (column.property == 'sumCartonSpecWeight') {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] = currency(sums[index]) + ' Kg';
            } else {
              sums[index] = 'N/A';
            }
          }

          if (column.property == 'sumCartonVolume') {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] = currency(sums[index]) + ' Cm³';
            } else {
              sums[index] = 'N/A';
            }
          }

        });

        return sums;
      },

      /*获取列表*/
      getList() {
        let url = this.url;
        let params = '';

        if (!url) {
          console.warn('url 为空, 不发送请求')
          return
        }

        // 处理查询
        if (this.filters && this.filters.length > 0) {
          params += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": this.filters});
        }

        // 处理关联加载
        if (this.relations && this.relations.length > 0) {
          params += "&relations=" + JSON.stringify(this.relations);
        }

        // 请求开始
        this.loading = true

        //获取数据
        this.global.axios
          .get(url + params)
          .then(resp => {
            let res = resp.data
            let data = res || []

            data.forEach(r => {
              if (r.cartonSpecId == -3) { //原料采购
                this.unit = r.product.unit;
              }
            });
            this.data = data
            this.search()

            this.total = res.length || 0
            this.loading = false
            /**
             * 请求返回, 数据更新后触发, 返回(data, resp) data是渲染table的数据, resp是请求返回的完整response
             * @event update
             */
            this.$emit('update', data, res)
          })
          .catch(err => {
            /**
             * 请求数据失败，返回err对象
             * @event error
             */
            this.$emit('error', err)
            this.loading = false
          })
      },

      /* 多选功能 */
      handleSelectionChange(val) {
        this.selected = val
      },

      /********************* 搜索相关方法  ***************************/
      /*本地搜索*/
      search() {
        this.tableData = this.data;
        if (this.searchParam.skuCode != null && this.searchParam.skuCode != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.product && item.product.skuCode.indexOf(this.searchParam.skuCode) !== -1) {
                return true;
              }
            });
        }
      },

      /*本地重置搜索*/
      resetSearch() {
        this.$refs.searchForm.resetFields();

        //TODO:根据实际情况调整
        this.searchParam.skuCode = null;

        this.search();
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
              this.loading = true;

              let url = `${this.url}/${row.id}`;
              this.global.axios.delete(url).then(resp => {
                this.$message({type: 'success', message: '删除成功'});
                let obj = resp.data;
                this.getList();

                this.loading = false;
              })
                .catch(err => {
                  this.loading = false;
                })
              done();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.getList();
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
        //获取数据
        let table = this.$refs.table;
        let downloadUrl = this.downloadUrl;

        import('@/vendor/Export2Excel').then(excel => {
          excel.export_el_table_to_excel({
            table: table,
            downloadUrl: downloadUrl,
            filename: "fa计划内容-模版",
            noExportProps: ['操作', '金额', 'ID', '下单件数', '发货件数', '收货件数'],
            tpl: true,
          })
        })
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

