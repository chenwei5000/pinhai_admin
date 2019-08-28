<template>

  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">

    <!--本地搜索 TODO: 更加实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam" ref="searchForm" id="filter-form"
             @submit.native.prevent>

      <el-form-item label="SKU">
        <el-input v-model="searchParam.skuCode" placeholder="请输入SKU" clearable></el-input>
      </el-form-item>

      <el-form-item label="状态">
        <el-select filterable v-model="searchParam.status" placeholder="请选择状态">
          <el-option
            v-for="(item,idx) in statusSelectOptions"
            :label="item.label" :value="item.value"
            :key="idx"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search" size="small">查询</el-button>
        <el-button @click="resetSearch" size="small">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格工具条 添加、导入、导出等 -->
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
      :row-class-name="dangerClassName"
      cell-class-name="ph-cell"
      header-cell-class-name="ph-cell-header"
      :data="tableData"
      v-loading="loading"
      show-summary
      :summary-method="getSummaries"
      @selection-change="handleSelectionChange"
      :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
      id="table"
    >
      <el-table-column prop="product.skuCode" label="SKU" sortable width="150" fixed="left">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="200" trigger="hover"
                      v-if="scope.row.product.skuCode && scope.row.product.skuCode.length > 22">
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
      <el-table-column prop="id" label="ID" width="80"></el-table-column>

      <el-table-column prop="statusName" label="状态" width="90">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1
            ? 'warning' : scope.row.status === 0
            ? 'danger' : scope.row.status === 2
            ? 'primary' : scope.row.status === 10
            ? 'info' : 'success'"
            disable-transitions>{{ scope.row.statusName }}
          </el-tag>
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

      <el-table-column prop="numberOfCarton" label="装箱数" width="80"></el-table-column>
      <el-table-column prop="cartonSpecCode" label="箱规" width="120"></el-table-column>

      <el-table-column prop="procurementPlanItem.cartonQty" label="计划箱数" width="110"></el-table-column>
      <el-table-column prop="shippedQty" label="发货箱数" width="110"></el-table-column>
      <el-table-column prop="receivedQty" label="收货箱数" width="110"></el-table-column>

      <el-table-column prop="cartonQty" label="采购箱数" width="80"
                       fixed="right"></el-table-column>

      <el-table-column prop="qty" label="采购件数" width="80"
                       fixed="right"></el-table-column>

      <el-table-column prop="price" label="单价" width="80"
                       fixed="right">
        <template slot-scope="scope">
          {{scope.row.price ? scope.row.price : 0, primary.currency ? primary.currency.symbolLeft : '' | currency}}
        </template>
      </el-table-column>

      <el-table-column prop="amount" label="总额" width="100"
                       fixed="right">
        <template slot-scope="scope">
          {{scope.row.amount ? scope.row.amount : 0, primary.currency ? primary.currency.symbolLeft : '' | currency}}
        </template>
      </el-table-column>


      <!--默认操作列-->
      <el-table-column label="操作"
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
    <itemDialog @modifyCBEvent="modifyCBEvent" ref="itemDialog" :primary="primary">
    </itemDialog>
  </div>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'
  import tableToolBar from '@/components/PhTableToolBar'
  import phEnumModel from '@/api/phEnum'
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
        'device',
        'rolePower'
      ]),
      hasExecute() {
        if ([2, 3, 4, 5, 6, 7, 8].indexOf(this.primary.status) > -1) {
          return true;
        }
        else {
          return false;
        }
      },
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

        //操作按钮控制
        hasOperation: true,
        hasAdd: true,
        hasEdit: true,
        hasDelete: true,

        // 多选记录对象
        selected: [],

        //数据 TODO: 根据实际情况调整
        url: "/procurementOrderItems", // 资源URL
        downloadUrl: "", //下载Url
        searchParam: {
          skuCode: null,
          status: null,
        },
        filters: [
          {
            field: "procurementOrderId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ],   //搜索对象
        relations: ["cartonSpec", "product", "procurementPlanItem"],  // 关联对象
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
        // 表格加载效果
        loading: false,

        // 记录修改的那一行
        row: {},

        // 表格工具条配置
        toolbarConfig: {
          hasEdit: true,
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
        this.initData();
        this.getList();
      })
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        this.loading = true;

        this.statusSelectOptions = phEnumModel.getSelectOptions('ProcurementOrderStatus');

        // 设置下载链接
        this.downloadUrl = this.url;
        if (this.filters && this.filters.length > 0) {
          this.downloadUrl += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": this.filters});
        }

        // 处理关联加载
        if (this.relations && this.relations.length > 0) {
          this.downloadUrl += "&relations=" + JSON.stringify(this.relations);
        }

        // 控制按钮
        if ([0, 10, 100].indexOf(this.primary.status) > -1) {
          this.hasDelete = false;
          this.toolbarConfig.hasAdd = false;
          this.toolbarConfig.hasImport = false;
        }
      },

      /********************* 表格相关方法  ***************************/
      //报警样式 TODO:根据实际情况调整
      dangerClassName({row, rowIndex}) {
        // 无价格
        if (!row.price) {
          return 'danger-row';
        }
        // 产品无装箱数
        if (!row.numberOfCarton) {
          return 'danger-row';
        }
        // 产品无箱规
        if (!row.cartonSpecId || row.cartonSpecId == -1) {
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

          if (column.property == 'cartonQty'
            || column.property == 'noPurchaseOrderCartonQty'
            || column.property == 'purchaseOrderCartonQty') {
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

          if (column.property == 'qty') {
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
              sums[index] = currency(sums[index], this.primary.currency ? this.primary.currency.symbolLeft : null);
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
        this.tableData = JSON.parse(JSON.stringify(this.data));

        if (this.searchParam.skuCode != null && this.searchParam.skuCode != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.product && item.product.skuCode.indexOf(this.searchParam.skuCode) !== -1) {
                return true;
              }
            });
        }
        if (this.searchParam.status != null && this.searchParam.status != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.status == this.searchParam.status) {
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
        this.searchParam.status = null;

        this.search();
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 行修改功能 */
      onDefaultEdit(row) {
        this.$refs.itemDialog.openDialog(row.id, this.primary);
      },

      /* 行删除功能 */
      onDefaultDelete(row) {
        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              let url = `${this.url}/${row.id}`;
              this.global.axios.delete(url).then(resp => {
                this.$message({type: 'success', message: '删除成功'});
                let obj = resp.data;
                this.getList();
              })
                .catch(err => {
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
        this.$refs.itemDialog.openDialog(null, this.primary);
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
            filename: "采购计划内容-模版",
            noExportProps: ['操作', '金额', 'ID', '下单件数', '发货件数', '收货件数'],
            tpl: true,
          })
        })
      },
      onToolBarDownloadData() {
        //获取数据
        let table = this.$refs.table;
        let downloadUrl = this.downloadUrl;

        import('@/vendor/Export2Excel').then(excel => {
          this.loading = true;
          excel.export_el_table_to_excel({
            table: table,
            downloadUrl: downloadUrl,
            filename: "采购计划内容",
            noExportProps: ['操作', '金额', 'ID']
          })
          this.loading = false;
        })
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

