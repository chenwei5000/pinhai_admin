<template>

  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">
    <el-form inline
             ref="editObject"
             label-position="right"
             label-width="120px"
    >
      <el-row>
        <el-col :md="8">
          <el-form-item label="编码:" prop="code">
            <span style="font-size: 12px">{{primary.code}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="仓库:" prop="warehouseId">
            <span style="font-size: 12px">{{primary.warehouse.name}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="截止时间:" prop="formatLimitTime">
            <span style="font-size: 12px">{{primary.formatLimitTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 表格工具条 添加、导入、导出等 -->
    <tableToolBar
      v-bind="toolbarConfig"

      @onToolBarAdd="onToolBarAdd"
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
      :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
      id="table"
    >

      <el-table-column prop="product.skuCode" label="SKU编码" width="200"></el-table-column>

      <el-table-column prop="product.name" label="产品名" min-width="200">

      </el-table-column>

      <el-table-column prop="storageLocation.code" label="货位" width="100">DEFAULT</el-table-column>
      <el-table-column prop="price" label="价格" width="80"></el-table-column>
      <!--<el-table-column prop="warehouseStock.qty" label="系统库存(件数)" width="130"></el-table-column>-->
      <el-table-column prop="checkedStock" label="实际盘点库存(件数)" width="180" fixed="right" align="center">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.checkedStock"
                           size="mini"
                           style="width: 120px;margin: 3px 0;"
                           :precision="3"
                           :min="0"
                           :step="1"
                           @change="onReceivedCheckedStock(scope.row)"
                           :max="1000000" label="请填实际库存">
          </el-input-number>

        </template>
      </el-table-column>
      <!--<el-table-column prop="stockError" label="库存误差" width="90" fixed="right">-->

      <!--</el-table-column>-->
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
  import itemDialog from './detailDialog'


  export default {
    components: {
      itemDialog,
      tableToolBar
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
      ])
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

        //数据 TODO: 根据实际情况调整
        url: "/inventoryTasks", // 资源URL
        downloadUrl: '', //下载Url
        primaryId: '',
        filters: [
          {
            field: "relevanceId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ],   //搜索对象
        relations: ["product", "warehouseStock", "inventoryTaskItem","inventoryTask", "storageLocation"],  // 关联对象
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
        // 表格加载效果
        loading: false,

        // 表格工具条配置
        toolbarConfig: {
          hasExportTpl: true,
          hasExport: true,
          hasImport: true,
          hasAdd: true,
        }
      }
    },

    created() {
    },

    mounted() {

      //全屏，表格高度处理
      window.onresize = () => {
        this.getTableHeight();
      }


      this.$nextTick(() => {
        this.initData();
        this.getTableHeight();
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
          tableHeight = tableHeight - 180;
          this.tableMaxHeight = tableHeight;
        }
        else {
          this.tableMaxHeight = 400;
        }
      },

      /********************* 表格相关方法  ***************************/
      //报警样式 TODO:根据实际情况调整
      dangerClassName({row}) {
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

          if (column.property == 'warehouseStock.qty' || column.property == 'checkedStock' || column.property == 'stockError') {
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
        });

        return sums;
      },

      /*获取列表*/
      getList() {
        let url = this.url + `/taskId/${this.primary.id}`;
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

            this.data = data;
            this.search();
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
      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.getList();
      },
      /********************* 搜索相关方法  ***************************/
      /*本地搜索*/
      search() {
        this.tableData = this.data;
      },
      onAll() {
        this.tableData.forEach((item, index, arr) => {
          arr[index].checkedStock = item.warehouseStockQty;
          arr[index].stockError = item.stockError;
        });
      },
      onClear() {
        this.tableData.forEach((item, index, arr) => {
          arr[index].checkedStock = 0;
          arr[index].stockError = 0;
        });
      },
      onReceivedCheckedStock(row) {
        row.stockError = (row.checkedStock - row.warehouseStockQty).toFixed(2);
        console.log(row.stockError+"="+row.checkedStock+"*"+ row.warehouseStockQty)
      },

      /********************* 工具条按钮  ***************************/
      uploadPromise(res) {
        let url = this.url + '';
        return this.global.axios.post(url, res)
          .then(resp => {
          })
          .catch(err => {
          })
      },

      onToolBarDownloadTpl() {
        //获取数据
        let table = this.$refs.table;
        let downloadUrl = this.url + '/' +this.primaryId + "?pageSize=" + this.pageSize + "&currentPage=" + this.currentPage + "&relations=" + this.relations;
        import('@/vendor/Export2Excel').then(excel => {
          excel.export_el_table_to_excel({
            table: table,
            downloadUrl: downloadUrl,
            filename: "盘点任务-模版",
            noExportProps: ['更新人', '更新时间'],
            tpl: true,
          })
        })
      },
      onToolBarDownloadData() {
        //获取数据
        let table = this.$refs.table;
        let params = '';

        let downloadUrl = this.url

        if (!downloadUrl) {
          console.warn('url 为空, 导出数据失败！')
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
        import('@/vendor/Export2Excel').then(excel => {
          this.loading = true;
          excel.export_el_table_to_excel({
            table: table,
            downloadUrl: downloadUrl,
            filename: "盘点任务",
            noExportProps: ['更新人', '更新时间'],
            params: params
          });
          this.loading = false;
        })
      },
      async onToolBarImportData(excelData) {
        if (!excelData) {
          this.$message.error("导入失败!");
          return false;
        }
        let loading = this.$loading({
          lock: true,
          text: '导入数据中',
          spinner: 'el-icon-upload',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        let table = this.$refs.table;
        let columns = (table && table.columns) ? table.columns : [];
        let header = [];
        // 处理头部映射
        excelData.header.forEach(_head => {
          columns.forEach(_col => {
            if (_head == _col.label) {
              header[_head] = _col.property;
            }
          });
        });

        // 导入数据
        let promiseArr = [];
        let resData = [];

        // 创建提交列表
        excelData.results.forEach(obj => {
          let _res = {};
          excelData.header.forEach(_head => {

            let prop = header[_head];
            if (prop) {
              if (prop.indexOf('.') !== false) {
                let tmps = prop.split('.');
                for (var i = 0; i < tmps.length; i++) {
                  if (i === 0) {
                    prop = tmps[0];
                  }
                  else {
                    prop += tmps[1].charAt(0).toUpperCase() + tmps[1].slice(1);
                  }
                }
              }
              _res[prop] = obj[_head];
            }
          });
          resData.push(_res);
        });
        for (var i = 0; i < resData.length; i++) {
          //TODO 后台需要判断inventoryTaskItemId
          resData[i].inventoryTaskItemId = this.primaryId;
          promiseArr.push(this.uploadPromise(resData[i]));
          if (promiseArr.length >= this.maxUploadCount) {
            await Promise.all(promiseArr).then(obj => {
              loading.text = "共[" + resData.length + "]条数据, 已经上传[" + (i+1) + "]条";
              promiseArr = [];
            });
            promiseArr = [];
          }
        }
        if (promiseArr.length > 0) {
          await Promise.all(promiseArr).then(obj => {
            loading.text = "共[" + resData.length + "]条数据, 已经上传[" + resData.length + "]条";
          });
        }
        loading.close();
        this.$message.info("导入成功");
        this.getList();
      },

      onToolBarAdd() {
        this.$refs.itemDialog.openDialog(this.primary.id);
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
</style>

