<template>
<el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" fullscreen>
  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">
  

    <!-- 表格工具条 添加、导入、导出等 -->
    <tableToolBar
      v-bind="toolbarConfig"
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
      :default-sort="{prop: 'skuCode', order: 'ascending'}"
      id="table"
    >
      <!--el-table-column prop="sortNum" type="index" label="序号" width="50" fixed="left"></el-table-column-->
      <el-table-column prop="skuCode" label="SKU编码" width="200">

      </el-table-column>

      <el-table-column prop="product.name" label="产品名" min-width="200">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="200" trigger="hover"
                      v-if="scope.row.product.name && scope.row.product.name.length > 18">
            <div v-html="scope.row.product.name"></div>
            <span slot="reference">{{
              scope.row.product ? scope.row.product.name.length > 18 ? scope.row.product.name.substr(0,16)+'..' : scope.row.product.name : ''
              }}</span>
          </el-popover>
          <span v-else>
            {{ scope.row.product.name }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="cartonSpecName" label="箱规" min-width="100"></el-table-column>
      <el-table-column prop="numberOfCarton" label="装箱数" width="140">
         <template slot-scope="scope">
          <el-input-number v-model="scope.row.numberOfCarton"
                           size="mini"
                           style="width: 120px;margin: 3px 0;"
                           :precision="3"
                           :min="0"
                           :step="1"
                           @change="onCalcQty(scope.row)"
                           :max="1000000" label="请填装箱数">
          </el-input-number>
        </template>
      </el-table-column>

      <el-table-column prop="cartonQty" label="库存箱数" width="140">
         <template slot-scope="scope">
          <el-input-number v-model="scope.row.cartonQty"
                           size="mini"
                           style="width: 120px;margin: 3px 0;"
                           :precision="3"
                           :min="0"
                           :step="1"
                           @change="onCalcQty(scope.row)"
                           :max="1000000" label="请填库存箱数">
          </el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="库存件数" min-width="100"></el-table-column>
      <!-- <el-table-column prop="creator.name" label="更新人" min-width="100"></el-table-column>
      <el-table-column prop="formatLastModified" label="更新时间" min-width="100"></el-table-column> -->

    </el-table>
  </div>
 </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'
  import tableToolBar from '@/components/PhTableToolBar'


  export default {
    components: {
      tableToolBar
    },
    props: {
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
        title: "库存查看",
        // 表格最大高度
        tableMaxHeight: 40000000,

        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        //数据 TODO: 根据实际情况调整
        url: "/warehouseTempStocks", // 资源URL
        downloadUrl: '',
        primaryId: '',
        filters: [
          {
            field: "warehouseId",
            op: 'eq',
            data: this.warehouseId != null?this.warehouseId : -1
          }
        ],   //搜索对象
        relations: ["cartonSpec", "creator"],  // 关联对象
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
        // 表格加载效果
        loading: false,
        dialogVisible: false,
          // 表格工具条配置
        toolbarConfig: {
          hasEdit: true,
          hasDelete: false,
          hasAdd: false,
          hasExportTpl: true,
          hasExport: true,
          hasImport: true,
        },
        pageSize: -1,
        currentPage: 1,
      }
    },

    created() {
    },

    mounted() {
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        this.getList();
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

          if (column.property == 'shippedCartonQty' || column.property == 'receivedCartonQty') {
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
          if (column.property == 'shippedQty' || column.property == 'receivedQty') {
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
        this.filters =  [
          {
            field: "warehouseId",
            op: 'eq',
            data: this.primaryId != null? this.primaryId : -1
          }
        ];
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
        this.loading = true;

        //获取数据
        this.global.axios
          .get(url + params)
          .then(resp => {
            let res = resp.data;
            let data = res || [];

            this.data = data;
            this.search();

            this.total = res.length || 0;
            this.loading = false;
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
            this.$emit('error', err);
            this.loading = false
          })
      },

      /********************* 搜索相关方法  ***************************/
      /*本地搜索*/
      openDialog(primaryId) {
        console.log("IDyoumieyou", primaryId)
        this.primaryId = primaryId;
        this.dialogVisible = true;
        this.initData();
      },

      search() {
        this.tableData = this.data;
      },

      onAll() {
        this.tableData.forEach((item, index, arr) => {
          arr[index].receivedCartonQty = item.shippedCartonQty;
          arr[index].receivedQty = item.shippedQty;
        });
      },
      onClear() {
        this.tableData.forEach((item, index, arr) => {
          arr[index].receivedCartonQty = 0;
          arr[index].receivedQty = 0;
        });
      },

      onUpdateData(row){
         //更新数据
        row.id=null;
        this.global.axios.post(this.url, row).then(resp => {
          this.$message({
            type: "success",
            message: "数据更新成功！"
          })

        }).catch(err => {
           console.log("更新数据失败")
        })
      },

      onCalcQty(row) {
        row.qty = (row.cartonQty * row.numberOfCarton).toFixed(0);
        this.onUpdateData(row);
      },

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
            filename: "供货商库存-模版",
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
            filename: "仓库临时库存",
            noExportProps: ['更新人', '更新时间'],
            params: params
          })
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
          //TODO warehouseId
          resData[i].warehouseId = this.primaryId;
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

