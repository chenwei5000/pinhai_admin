<template>

  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">
    <!--本地搜索 TODO: 更加实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam" ref="searchForm" id="filter-form"
             @submit.native.prevent>
      <el-form-item label="SKU">
        <el-input v-model="searchParam.skuCode" placeholder="请输入SKU" size="mini" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search" size="mini">查询</el-button>
        <el-button @click="resetSearch" size="mini">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格工具条 添加、导入、导出等 -->
    <tableToolBar
      :hasExportTpl="hasExportTpl"
      :hasExport="hasExport"
      :hasImport="hasImport"
      :hasAdd="hasAdd"
      :hasDelete="hasDelete"

      @onToolBarAdd="onToolBarAdd"
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

      <el-table-column
        v-if="hasDelete"
        type="selection"
        width="30" align="center">
      </el-table-column>


      <el-table-column prop="sortNum" label="序号" width="50" align="center" fixed="left"></el-table-column>

      <el-table-column prop="product.skuCode" label="SKU" sortable min-width="150" fixed="left">
      </el-table-column>

      <el-table-column prop="product.imgUrl" label="图片" width="40">
        <template slot-scope="scope" v-if="scope.row.product.imgUrl">
          <el-image
            :z-index="10000"
            style="width: 30px; height: 30px;margin-top: 5px"
            :src="scope.row.product.imgUrl"
            :preview-src-list="[scope.row.product.imgUrl.replace('_SL75_','_SL500_')]" lazy>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column prop="product.name" label="名称" width="200">
      </el-table-column>

      <el-table-column prop="cartonSpecCode" label="箱规" min-width="120"></el-table-column>
      <el-table-column prop="numberOfCarton" label="装箱数" min-width="80" align="center"></el-table-column>
      <el-table-column prop="stock" label="当前库存" min-width="90" align="center"></el-table-column>

      <el-table-column prop="sumCartonSpecWeight" label="应发重量(Kg)" min-width="110" align="center"></el-table-column>
      <el-table-column prop="sumCartonVolume" label="应发体积(Cm³)" min-width="110" align="center"></el-table-column>


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

      <el-table-column prop="shippedCartonQty" label="调拨箱数" min-width="90" align="center" fixed="right"></el-table-column>
      <el-table-column prop="shippedQty" sortable label="调拨件数" min-width="90" align="center" fixed="right"></el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation"
                       no-export="true"
                       width="80" fixed="right">
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
  import {parseTime} from "../../../../utils";

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
      hasStock() {
        if (this.primary.status == 1 || this.primary.status == 3) {
          return true;
        }
        return false;
      },
      hasAdd() {
        if ([1, 3].indexOf(this.primary.status) === -1) {
          return false;
        }
        if (!checkPermission('WarehouseAllocationItemResource_create')) {
          return false;
        }
        else {
          return true;
        }
      },
      hasEdit() {
        if ([1, 3].indexOf(this.primary.status) === -1) {
          return false;
        }
        if (!checkPermission('WarehouseAllocationItemResource_update')) {
          return false;
        }
        else {
          return true;
        }
      },
      hasDelete() {
        if ([1, 3].indexOf(this.primary.status) === -1) {
          return false;
        }
        if (!checkPermission('WarehouseAllocationItemResource_remove')) {
          return false;
        }
        else {
          return true;
        }
      },
      hasOperation() {
        return this.hasEdit || this.hasDelete;
      },
      hasExportTpl() {
        return checkPermission('WarehouseAllocationItemResource_export');
      },
      hasExport() {
        return checkPermission('WarehouseAllocationItemResource_export');
      },
      hasImport() {
        if ([1, 3].indexOf(this.primary.status) === -1) {
          return false;
        }
        if (!checkPermission('WarehouseAllocationItemResource_import')) {
          return false;
        }
        else {
          return true;
        }
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

        exportFileName: '国内调拨产品明细',
        tplNoExportProps: ['序号', '图片', '名称', '箱规', '装箱数', '调拨件数'],
        maxUploadCount: 20,

        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,

        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        //操作按钮控制
        unit: "箱",

        // 多选记录对象
        selected: [],

        //数据 TODO: 根据实际情况调整
        url: "/warehouseAllocationItems", // 资源URL
        searchParam: {
          skuCode: null
        },
        filters: [
          {
            field: "warehouseAllocationId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ],   //搜索对象
        relations: ["product", "cartonSpec", "product.currency", "product.category", "warehouseAllocation"],  // 关联对象
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

      /********************* 表格相关方法  ***************************/
      //报警样式 TODO:根据实际情况调整
      dangerClassName({row}) {
        if (row.shippedQty == 0 || row.shippedQty > row.stock) { //库存不足
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

          if (column.property == 'shippedCartonQty') {
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

          if (column.property == 'shippedQty') {
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

      onToolBarDelete() {
        let ids = [];
        this.selected.forEach(data => {
          ids.push(data.id);
        });
        this.loading = true;
        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {

              let url = `${this.url}/${ids.join(",")}`;
              this.global.axios.delete(url)
                .then(resp => {
                  this.$message({type: 'success', message: '删除成功'});
                  let obj = resp.data;
                  this.loading = false;
                  this.getList();
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

      onToolBarDownloadTpl() {
        //获取数据
        let table = this.$refs.table;
        let downloadUrl = this.downloadUrl;

        import('@/vendor/Export2Excel').then(excel => {
          excel.export_el_table_to_excel({
            table: table,
            downloadUrl: downloadUrl,
            filename: `${this.exportFileName}-模版-${parseTime(new Date(), '{y}-{m}-{d}')}"`,
            noExportProps: this.tplNoExportProps,
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
            filename: `${this.primary.code}国内调拨产品明细`,
            noExportProps: ['图片'],
            params: params
          });
          this.loading = false;
        })
      },

      uploadPromise(res) {
        let url = this.url + '';
        return this.global.axios.post(url, res)
          .then(resp => {
          })
          .catch(err => {
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

        // 导入数据
        let promiseArr = [];
        let resData = [];

        // 创建提交列表
        excelData.results.forEach(obj => {
          let _res = {};
          _res.warehouseAllocationId = this.primary.id;
          _res.skuCode = obj["SKU"];
          _res.shippedCartonQty = obj["调拨箱数"];
          _res.cartonSpecName = obj["箱规"];
          _res.numberOfCarton = obj["装箱数"];
          _res.shippedNote = obj["备注"];
          resData.push(_res);
        });

        for (var i = 0; i < resData.length; i++) {
          promiseArr.push(this.uploadPromise(resData[i]));
          if (promiseArr.length >= this.maxUploadCount) {
            await Promise.all(promiseArr).then(obj => {
              loading.text = "共[" + resData.length + "]条数据, 已经上传[" + (i + 1) + "]条";
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
        this.$message.success("导入成功");
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

