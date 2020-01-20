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

      <el-table-column prop="product.skuCode" label="SKU编码" width="200" align="center"></el-table-column>
      <el-table-column prop="product.fnSku" label="FNSKU" width="100" align="center"></el-table-column>
      <el-table-column prop="product.name" label="产品名" min-width="200" align="center"></el-table-column>

      <el-table-column prop="cartonSpec.code" label="箱规" min-width="120" align="center"></el-table-column>

      <el-table-column prop="product.numberOfCarton" label="装箱数" min-width="100" align="center"></el-table-column>

      <el-table-column prop="cartonQty" label="实际盘点库存(箱数)" width="180" fixed="right" align="center">
        <template slot-scope="scope">
          {{ (scope.row.checkedStock / scope.row.numberOfCarton).toFixed(1) }}
        </template>
      </el-table-column>

      <el-table-column prop="checkedStock" label="实际盘点库存(件数)" width="180" fixed="right" align="center">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.checkedStock"
                           size="mini"
                           style="width: 120px;margin: 3px 0;"
                           :precision="0"
                           :min="0"
                           :step="1"
                           @change="onCheckedStock(scope.row)"
                           :max="1000000" label="请填实际库存">
          </el-input-number>

        </template>
      </el-table-column>
      <!--<el-table-column prop="number" label="库存误差" width="90" fixed="right">-->

      <!--</el-table-column>-->
    </el-table>

    <!-- 编辑明细对话框 -->
    <itemDialog @modifyCBEvent="modifyCBEvent" ref="itemDialog" :primary="primary">
    </itemDialog>


    <el-row>
      <el-col :md="12">
        <el-row type="flex" justify="center">
          <el-button type="warning" style="margin-top: 40px" size="small" @click="onBack">
            < 上一步
          </el-button>
        </el-row>
      </el-col>
      <el-col :md="12">
        <el-row type="flex" justify="center">
          <el-button type="primary" style="margin-top: 40px" size="small" @click="onNext">
            下一步 >
          </el-button>
        </el-row>
      </el-col>
    </el-row>

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

        maxUploadCount: 1,

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
        relations: ["product", "cartonSpec"],  // 关联对象
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
        // 表格加载效果
        loading: false,

        // 表格工具条配置
        toolbarConfig: {
          hasImport: true,
          hasAdd: false,
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
          tableHeight = tableHeight - 250;
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

          if (column.property == 'checkedStock') {
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

      onUpdateData(row) {
        //更新数据
        row.skuCode = row.product.skuCode;
        this.global.axios.put(`/inventoryTaskItems/${row.id}`, row).then(resp => {
          this.$message({
            type: "success",
            message: "数据更新成功！"
          })

        }).catch(err => {
          console.log("更新数据失败")
        })
      },

      onCheckedStock(row) {
        this.onUpdateData(row);
      },

      /*获取列表*/
      getList() {
        let url = this.url + `/taskId/${this.primary.id}`;
        let params = '';
        if (!url) {
          console.warn('url 为空, 不发送请求');
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

      /********************* 工具条按钮  ***************************/
      uploadPromise(res) {

      },

      onToolBarImportData(excelData) {
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

        // 导入数据
        let resData = [];

        // 创建提交列表
        excelData.results.forEach(obj => {
          let _res = {};
          _res.skuCode = obj["SKU编码"];
          _res.checkedStock = obj["库存件数"];
          _res.cartonSpecCode = obj["箱规"];
          _res.numberOfCarton = obj["装箱数"];
          resData.push(_res);
        });

        let url = `/inventoryTaskItems/importData/${this.primary.id}`;
        this.global.axios.post(url, resData)
          .then(resp => {
            loading.close();
            this.$message.success("导入成功");
            this.getList();
          })
          .catch(err => {
            loading.close();
          })
      },

      onToolBarAdd() {
        this.$refs.itemDialog.openDialog(this.primary.id);
      },

      onNext() {
        this.$emit("step2CBEvent", 2);
      },
      onBack() {
        this.$emit("step2CBEvent", 0);
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

