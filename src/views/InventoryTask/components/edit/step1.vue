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
      @onToolBarDownloadData="onToolBarDownloadData"
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
      @cell-dblclick="handleDblclick"
      show-summary
      :summary-method="getSummaries"
      :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
      id="table"
    >
      <el-table-column prop="skuCode" label="SKU编码" width="200" align="center"></el-table-column>
      <el-table-column prop="fnSku" label="FNSKU" width="100" align="center"></el-table-column>
      <el-table-column prop="productName" label="产品名" min-width="200" align="center"></el-table-column>
      <el-table-column prop="cartonSpecCode" label="箱规" min-width="120" align="center"></el-table-column>
      <el-table-column prop="numberOfCarton" label="装箱数" min-width="100" align="center"></el-table-column>
      <el-table-column prop="cartonQty" label="库存箱数" width="180" fixed="right" align="center"></el-table-column>
      <el-table-column prop="qty" label="库存件数" width="180" fixed="right" align="center"></el-table-column>

    </el-table>

    <el-row>
      <el-col :md="24">
        <el-row type="flex" justify="center">
          <el-button type="primary" style="margin-top: 15px"
                     size="small"
                     :loading="confirmLoading" @click="onNext">
            下一步
          </el-button>
        </el-row>
      </el-col>
    </el-row>

  </div>


</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency,parseTime} from '@/utils'
  import tableToolBar from '@/components/PhTableToolBar'
  import {getObjectValueByArr} from "../../../../utils";


  export default {
    components: {
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
        url: '/warehouseStocks/stocks', // 资源URL
        filters: [
          {
            field: "warehouseId",
            op: 'eq',
            data: this.primary ? this.primary.warehouseId : -1
          }
        ],   //搜索对象
        relations: null,  // 关联对象
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
        // 表格加载效果
        loading: false,

        // 表格工具条配置
        toolbarConfig: {
          hasExport: true
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
          tableHeight = tableHeight - 230;
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

      /*汇总数据*/
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];

        columns.forEach((column, index) => {
          if (column.property == 'skuCode') {
            const values = data.map(item => item[column.property]);
            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);
            sums[index] = '合计: ' + sums[index] + ' 行';
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
        });

        return sums;
      },

      /*获取列表*/
      getList() {
        let url = this.url;
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

      onNext() {
        this.$emit("step1CBEvent", null);
      },

      /********************* 工具条按钮  ***************************/
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
            filename: `${this.primary.warehouse.name}-当前库存-${parseTime(new Date(), '{y}-{m}-{d}')}`,
            noExportProps: ['更新人', '更新时间'],
            params: params
          });
          this.loading = false;
        })
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

