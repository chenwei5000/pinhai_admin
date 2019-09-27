<template>

  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">

    <!--本地搜索 TODO: 更加实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam" ref="searchForm" id="filter-form"
             @submit.native.prevent>

      <el-form-item label="SKU">
        <el-input v-model="searchParam.skuCode"
                  size="mini"
                  placeholder="请输入SKU"
                  clearable></el-input>
      </el-form-item>

      <el-form-item label="分类">
        <el-input v-model="searchParam.category"
                  size="mini"
                  placeholder="请输入分类名称"
                  clearable></el-input>
      </el-form-item>

      <el-form-item label="款式">
        <el-input v-model="searchParam.groupName"
                  size="mini"
                  placeholder="请输入产品款式"
                  clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search" size="mini">查询</el-button>
        <el-button @click="resetSearch" size="mini">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格工具条 添加、导入、导出等 -->
    <tableToolBar :primary="primary" >
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
      </el-table-column>


      <el-table-column prop="product.imgUrl" label="图片" width="60">
        <template slot-scope="scope">
          <el-image
            :z-index="10000"
            style="width: 30px; height: 30px;margin-top: 5px"
            :src="scope.row.product.imgUrl"
            :preview-src-list="[scope.row.product.imgUrl.replace('_SL75_','_SL500_')]" lazy>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column prop="product.category.name" label="分类" width="100"></el-table-column>
      <el-table-column prop="product.groupName" label="款式" width="150">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="200" trigger="hover"
                      v-if="scope.row.product.groupName && scope.row.product.groupName.length > 12">
            <div v-html="scope.row.product.groupName"></div>
            <span slot="reference">{{
              scope.row.product.groupName ? scope.row.product.groupName.length > 12 ? scope.row.product.groupName.substr(0,10)+'..' : scope.row.product.groupName : ''
              }}</span>
          </el-popover>
          <span v-else>
            {{ scope.row.product.groupName }}
            </span>
        </template>
      </el-table-column>

      <el-table-column prop="cartonSpecCode" label="箱规" width="130"></el-table-column>
      <el-table-column prop="numberOfCarton" label="装箱数" width="80"></el-table-column>
      <el-table-column prop="product.name" label="名称" width="200">
      </el-table-column>
      <el-table-column prop="product.asin" label="ASIN" width="130"></el-table-column>
      <el-table-column prop="product.fnSku" label="FNSKU" width="130"></el-table-column>
      <el-table-column prop="product.grossWeight" label="产品重量(Kg)" width="130"></el-table-column>
      <el-table-column prop="cartonSpec.grossWeight" label="箱子重量(Kg)" width="130"></el-table-column>
      <el-table-column prop="cartonSpecSize" label="箱子尺寸" width="130"></el-table-column>
      <el-table-column prop="cartonSpecVolume" label="箱子体积(m³)" width="130"></el-table-column>
      <el-table-column prop="numberOfPallets" label="托盘装箱数" width="130"></el-table-column>
      <el-table-column prop="nwoneCartonSpecWeight" label="单箱净重(Kg)" width="130"></el-table-column>
      <el-table-column prop="gwoneCartonSpecWeight" label="单箱毛重(Kg)" width="130"></el-table-column>

      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="cartonQty" label="应发箱数" width="90"
                       fixed="right" align="center"></el-table-column>

      <el-table-column prop="qty" label="应发件数" width="90"
                       fixed="right" align="center"></el-table-column>

      <el-table-column prop="sumCartonSpecWeight" label="应发毛重(Kg)" width="100"
                       fixed="right" align="center">
        <template slot-scope="scope">
          {{ scope.row.sumCartonSpecWeight ? scope.row.sumCartonSpecWeight.toFixed(2) : '' }}
        </template>
      </el-table-column>

      <el-table-column prop="sumCartonVolume" label="应发体积(m³)" width="100"
                       fixed="right" align="center">
        <template slot-scope="scope">
          {{ scope.row.sumCartonVolume ? scope.row.sumCartonVolume.toFixed(2) : '' }}
        </template>
      </el-table-column>


      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation"
                       no-export="true"
                       width="100" fixed="right">
        <template slot-scope="scope">

          <el-button v-if="hasEdit" size="mini" icon="el-icon-edit" circle
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
    <!--itemDialog @modifyCBEvent="modifyCBEvent" ref="itemDialog" :primary="primary">
    </itemDialog-->
  </div>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'
  import tableToolBar from './toolBar'
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
        url: "/linerShippingPlanItems", // 资源URL
        downloadUrl: "", //下载Url
        searchParam: {
          skuCode: null,
          category: null,
          groupName: null,
        },
        filters: [
          {
            field: "linerShippingPlanId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ],   //搜索对象
        relations: ["cartonSpec", "product", "product.category"],  // 关联对象
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
        // 表格加载效果
        loading: false,

        // 记录修改的那一行
        row: {},
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
        this.getTableHeight();
        this.initData();
        this.getList();
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
          tableHeight = tableHeight - 240; //减框架头部高度
          this.tableMaxHeight = tableHeight;
        }
      },

      /********************* 表格相关方法  ***************************/
      //报警样式 TODO:根据实际情况调整
      dangerClassName({row, rowIndex}) {
        if (this.primary.oversize != row.product.oversize) {
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

          if (column.property == 'cartonQty') {
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
              sums[index] = `${sums[index].toFixed(2)} Kg`;
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
              sums[index] = `${sums[index].toFixed(2)} m³`;
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
        this.tableData = this.data;
        if (this.searchParam.category != null && this.searchParam.category != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.product && item.product.category &&
                item.product.category.name.indexOf(this.searchParam.category) !== -1) {
                return true;
              }
            });
        }
        if (this.searchParam.skuCode != null && this.searchParam.skuCode != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.product && item.product.skuCode.indexOf(this.searchParam.skuCode) !== -1) {
                return true;
              }
            });
        }
        if (this.searchParam.groupName != null && this.searchParam.groupName != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.product && item.product.groupName.indexOf(this.searchParam.groupName) !== -1) {
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
        this.searchParam.category = null;
        this.searchParam.groupName = null;

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

