<template>
  <el-dialog class="ph-dialog"
             :title="title" v-if="dialogVisible"
             :visible.sync="dialogVisible"
             @close='closeDialog'
             fullscreen>
    <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
    <div class="ph-table">

      <!--本地搜索 TODO: 更加实际情况调整 el-form-item -->
      <el-form :inline="true" :model="searchParam" ref="searchForm" id="filter-form"
               @submit.native.prevent>

        <el-form-item label="SKU">
          <el-input v-model="searchParam.skuCode" size="mini" placeholder="请输入SKU" clearable></el-input>
        </el-form-item>

        <el-form-item label="产品名称">
          <el-input v-model="searchParam.name" size="mini" placeholder="请输入产品名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="箱规">
          <el-select filterable v-model="searchParam.cartonSpecId" size="mini" placeholder="请选择箱规">
            <el-option
              v-for="(item,idx) in cartonspecSelectOptions"
              :label="item.label" :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select filterable v-model="searchParam.status" style="width: 120px;" size="mini" placeholder="请选择状态">
            <el-option
              v-for="(item,idx) in statusSelectOptions"
              :label="item.label" :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="有库存">
          <el-select filterable v-model="searchParam.hasQty" style="width: 120px;" size="mini" placeholder="请选择状态">
            <el-option
              v-for="(item,idx) in hasQtySelectOptions"
              :label="item.label" :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button native-type="submit" type="primary" @click="search" size="mini">查询</el-button>
          <el-button @click="resetSearch" size="mini">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格工具条 添加、导入、导出等 -->
      <tableToolBar
        :hasExport="hasExport"
        :hasImport="hasImport"
        :hasAdd="hasAdd"
        :hasDelete="hasDelete"
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
        :default-sort="{prop: 'skuCode', order: 'ascending'}"
        id="table"
      >
        <el-table-column prop="skuCode" label="SKU编码" width="190">

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

        <el-table-column prop="status" label="状态" width="60">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.product.status === 1 ? 'success' : 'info'"
              disable-transitions>{{ scope.row.product.status === 1 ? '开启' : '关闭' }}
            </el-tag>
          </template>
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

        <el-table-column prop="cartonSpecName" label="箱规" min-width="100">
        </el-table-column>

        <el-table-column prop="numberOfCarton" label="装箱数" width="100">
        </el-table-column>

        <el-table-column prop="cartonQty" label="库存箱数" width="100">
        </el-table-column>

        <el-table-column prop="qty" label="库存件数" min-width="100"></el-table-column>
        <el-table-column prop="creator.name" label="更新人" min-width="100"></el-table-column>
        <el-table-column prop="formatLastModified" label="更新时间" min-width="120"></el-table-column>
        <!--默认操作列-->
        <el-table-column label="操作" v-if="hasOperation"
                         no-export="true"
                         width="50" fixed="right">
          <template slot-scope="scope">

            <el-button size="mini" icon="el-icon-edit" circle
                       @click="onDefaultEdit(scope.row)" type="primary" v-if="hasEdit">
            </el-button>

            <el-button type="danger" size="mini"
                       id="ph-table-del" icon="el-icon-delete" circle
                       @click="onDefaultDelete(scope.$index)" v-if="hasDelete">

            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <editDialog ref="editDialog" @modifyCBEvent="modifyCBEvent"></editDialog>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'
  import cartonspecModel from '@/api/cartonspec'
  import phEnumModel from '@/api/phEnum'
  import tableToolBar from '@/components/PhTableToolBar'
  import {checkPermission} from "@/utils/permission";
  import editDialog from './editDialog';
  import moment from 'moment';


  export default {
    components: {
      tableToolBar,
      editDialog
    },
    props: {},
    computed: {
      ...mapGetters([
        'device', 'rolePower'
      ]),
      hasOperation() {
        return this.hasEdit || this.hasDelete;
      },
      hasEdit() {
        return checkPermission('SupplierStockResource_update');
      },
      hasExport() {
        return checkPermission('SupplierStockResource_export');
      },
      hasAdd() {
        return checkPermission('SupplierStockResource_create');
      },
      hasDelete() {
        return false;
      },
      hasImport() {
        return checkPermission('SupplierStockResource_importStock');
      }

    },
    filters: {
      currency: currency
    },

    data() {
      return {
        title: "供货商库存管理",
        // 表格最大高度
        tableMaxHeight: 40000000,

        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        //数据 TODO: 根据实际情况调整
        url: "/supplierStocks", // 资源URL
        downloadUrl: '',
        primaryId: '',
        primaryName: '',
        statusSelectOptions: [],
        cartonspecSelectOptions: [],
        hasQtySelectOptions: [{label: '全部', value: null}, {label: '有库存', value: 1}, {label: '无库存', value: 2}],
        filters: [
          {
            field: "supplierId",
            op: 'eq',
            data: this.primaryId != null ? this.primaryId : -1
          }
        ],   //搜索对象
        relations: ["cartonSpec", "creator"],  // 关联对象
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
        // 表格加载效果
        loading: false,
        dialogVisible: false,
        pageSize: -1,
        currentPage: 1,
        searchParam: {
          skuCode: null,
          name: null,
          status: '1',
          cartonSpecId: null,
          hasQty: null
        },
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
        this.cartonspecSelectOptions = cartonspecModel.getSelectIntegerOptions();
        this.statusSelectOptions = phEnumModel.getSelectOptions('Status');
        this.statusSelectOptions.unshift({label: '全部', value: null});

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
          if (column.property == 'skuCode') {
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
        });

        return sums;
      },

      /*获取列表*/
      getList() {
        this.filters = [
          {
            field: "supplierId",
            op: 'eq',
            data: this.primaryId != null ? this.primaryId : -1
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
      openDialog(primaryId, primaryName) {
        this.primaryId = primaryId;
        this.primaryName = primaryName;
        this.title = `供货商${primaryName}库存管理`;
        this.dialogVisible = true;
        this.initData();
      },
      closeDialog() {
        this.primaryId = null;
        this.data = [];
        this.search();
      },

      search() {
        this.tableData = this.data;
        if (this.searchParam.name != null && this.searchParam.name != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.product && item.product.name &&
                item.product.name.indexOf(this.searchParam.name) !== -1) {
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
        if (this.searchParam.status != null && this.searchParam.status != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.product && item.product.status + '' == this.searchParam.status) {
                return true;
              }
            });
        }
        if (this.searchParam.cartonSpecId != null && this.searchParam.cartonSpecId != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.cartonSpecId == this.searchParam.cartonSpecId) {
                return true;
              }
            });
        }
        if (this.searchParam.hasQty != null && this.searchParam.hasQty != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (this.searchParam.hasQty === 1 && item.qty > 0) {
                return true;
              }
              if (this.searchParam.hasQty === 2 && item.qty <= 0) {
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
        this.searchParam.name = null;
        this.searchParam.cartonSpecId = null;
        this.searchParam.status = "1";
        this.searchParam.hasQty = null;

        this.search();
      },

      modifyCBEvent(row) {
        //更新数据
        row.id = null;
        this.loading = true;
        this.global.axios.post(this.url, row)
          .then(resp => {
            this.getList();
            this.$message({
              type: "success",
              message: "数据更新成功！"
            });
          })
          .catch(err => {
            console.log("更新数据失败");
            this.loading = false;
          })
      },

      /* 行修改功能 */
      onDefaultEdit(row) {
        this.$refs.editDialog.openDialog(row.id, row.supplierId);
      },

      onToolBarAdd() {
        this.$refs.editDialog.openDialog(null, this.primaryId);
      },

      onToolBarDownloadTpl() {
        //获取数据
        let table = this.$refs.table;
        let downloadUrl = this.url + '/' + this.primaryId + "?pageSize=" + this.pageSize + "&currentPage=" + this.currentPage + "&relations=" + this.relations;
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
            filename: `供货商${this.primaryName}库存-${moment(new Date()).format("YYYY-MM-DD")}`,
            noExportProps: ['更新人', '图片', '状态', '更新时间', '库存件数'],
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
        let resData = [];
        // 整理数据
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

        this.global.axios.post(`/supplierStocks/importStock/${this.primaryId}`, resData)
          .then(resp => {
            this.$message.success("导入成功");
            loading.close();
            this.getList();
          })
          .catch(err => {
            loading.close();
            this.getList();
          })

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

