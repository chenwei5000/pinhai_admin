<template>

  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">

    <!--本地搜索 TODO: 更加实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam" ref="searchForm" id="filter-form"
             @submit.native.prevent >

      <el-form-item label="SKU">
        <el-input v-model="searchParam.skuCode" size="mini" placeholder="请输入SKU" clearable></el-input>
      </el-form-item>

      <el-form-item label="分类">
        <el-input v-model="searchParam.category" size="mini" placeholder="请输入分类名称" clearable></el-input>
      </el-form-item>

      <el-form-item label="款式">
        <el-input v-model="searchParam.groupName" size="mini" placeholder="请输入产品款式" clearable></el-input>
      </el-form-item>

      <el-form-item label="状态">
        <el-select filterable v-model="searchParam.status" size="mini" placeholder="请选择状态">
          <el-option
            v-for="(item,idx) in statusSelectOptions"
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
      @onToolBarDelete="onToolBarDelete"
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
        type="selection"
        width="50">
      </el-table-column>

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

      <el-table-column prop="statusName" label="状态" width="90">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1
            ? 'warning' : scope.row.status === 0
            ? 'danger' : scope.row.status === 2
            ? 'primary' : scope.row.status === 8
            ? 'info' : 'success'"
            disable-transitions>{{ scope.row.statusName }}
          </el-tag>
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
      <el-table-column prop="numberOfCarton" label="装箱数" width="80"></el-table-column>
      <el-table-column prop="safetyStockWeek" label="备货周数" width="80"></el-table-column>
      <el-table-column prop="demandedCartonQty" label="需求总量(箱)" width="100"></el-table-column>
      <el-table-column prop="sevenSalesCount" label="7日销量(件)" width="100"></el-table-column>
      <el-table-column prop="amazonTotalStock" label="亚马逊含在途库存(件)" width="140"></el-table-column>
      <el-table-column prop="domesticStockCartonQty" label="国内库存(箱)" width="100"></el-table-column>
      <el-table-column prop="unfinishedPlanQty" label="国内在途(箱)" width="100"></el-table-column>


      <el-table-column prop="qty" label="采购件数" width="80"></el-table-column>

      <el-table-column prop="orderQty" label="下单件数" width="80" v-if="hasExecute"></el-table-column>
      <el-table-column prop="shippedQty" label="发货件数" width="80" v-if="hasExecute"></el-table-column>
      <el-table-column prop="receivedQty" label="收货件数" width="80" v-if="hasExecute"></el-table-column>

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

      <el-table-column prop="product.fnSku" label="FNSKU" min-width="120"></el-table-column>
      <el-table-column prop="product.vipLevel" label="Vip级别" width="100"></el-table-column>
      <el-table-column prop="cartonSpecCode" label="箱规" width="120"></el-table-column>
      <el-table-column prop="numberOfPallets" label="托盘装箱数" width="120"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>

      <el-table-column prop="saleWeek" sortable label="可售周数" width="110"
                       fixed="right"></el-table-column>

      <el-table-column prop="cartonQty" sortable label="采购箱数" width="110"
                       fixed="right"></el-table-column>

      <el-table-column prop="amount" sortable label="金额" width="100"
                       fixed="right">
        <template slot-scope="scope">
          {{scope.row.amount, scope.row.product.currency ? scope.row.product.currency.symbolLeft : '' | currency}}
        </template>
      </el-table-column>

      <el-table-column prop="priority" label="优先级" sortable width="100" v-if="false">
        <template slot-scope="scope">
          {{ scope.row.priorityName }}
        </template>
      </el-table-column>

      <el-table-column prop="priorityNote" label="优先要求" width="130" v-if="false">

        <template slot-scope="scope">
          <el-popover placement="top-start" title="优先要求" width="250" trigger="hover">
            <div v-html="scope.row.priorityNote"></div>
            <span slot="reference">{{ scope.row.priorityNote ? scope.row.priorityNote.substr(0,15) : '' }}</span>
          </el-popover>
        </template>

      </el-table-column>


      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation"
                       no-export="true"
                       width="120" fixed="right">
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
  import phEnumModel from '@/api/phEnum'
  import itemDialog from './dialog'
  import excelConfig from './excelConfig'
  import {checkPermission} from "@/utils/permission";

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

      hasExport() {
        return checkPermission('ProcurementPlanItemResource_export');
      },

      hasImport() {
        if ([0, 8].indexOf(this.primary.status) > -1) {
          return false;
        }
        return checkPermission('ProcurementPlanItemResource_import');
      },
      hasAdd() {
        //return false;
        if ([0, 8].indexOf(this.primary.status) > -1) {
          return false;
        }
        return checkPermission('ProcurementPlanItemResource_create');
      },


      hasOperation() {
        return this.hasEdit || this.hasDelete;
      },
      hasEdit() {
        if ([0, 8].indexOf(this.primary.status) > -1) {
          return false;
        }
        return checkPermission('ProcurementPlanItemResource_update');
      },
      hasDelete() {
        if ([0, 8].indexOf(this.primary.status) > -1) {
          return false;
        }
        return checkPermission('ProcurementPlanItemResource_remove');
      },

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
        maxUploadCount: 20,
        // 选择项
        statusSelectOptions: [],
        prioritySelectOptions: [],

        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,

        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 多选记录对象
        selected: [],

        //数据 TODO: 根据实际情况调整
        url: "/procurementPlanItems", // 资源URL
        downloadUrl: "", //下载Url
        searchParam: {
          skuCode: null,
          category: null,
          status: null,
          groupName: null,
        },
        filters: [
          {
            field: "procurementPlanId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ],   //搜索对象
        relations: ["cartonSpec", "product", "product.currency", "product.category"],  // 关联对象
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
        this.prioritySelectOptions = phEnumModel.getSelectOptions('Priority');
        this.statusSelectOptions = phEnumModel.getSelectOptions('ProcurementPlanStatus');

        // 设置下载链接
        this.downloadUrl = this.url;
        if (this.filters && this.filters.length > 0) {
          this.downloadUrl += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": this.filters});
        }

        // 处理关联加载
        if (this.relations && this.relations.length > 0) {
          this.downloadUrl += "&relations=" + JSON.stringify(this.relations);
        }
      },

      /********************* 表格相关方法  ***************************/
      //报警样式 TODO:根据实际情况调整
      dangerClassName({row, rowIndex}) {
        if (row.saleWeek > 0) {
          if (row.safetyStockWeek - row.saleWeek >= 2) { //可售周数不足2周
            return 'warning-row';
          }
          else if (row.saleWeek - row.safetyStockWeek >= 2) { //可售周数超2周
            return 'danger-row';
          }
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
        if (this.searchParam.status != null && this.searchParam.status != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.status == this.searchParam.status) {
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
        this.searchParam.status = null;

        this.search();
      },


      /********************* 操作按钮相关方法  ***************************/
      /* 行添加功能 */
      onToolBarAdd() {
        this.$refs.itemDialog.openDialog();
      },

      /* 行修改功能 */
      onDefaultEdit(row) {
        this.$refs.itemDialog.openDialog(row.id);
      },

      onToolBarDelete() {
          let ids = [];
          this.selected.forEach(data => {
            ids.push(data.id);
          });

        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {

              let url = `${this.url}/${ids.join(",")}`;
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
      onToolBarDownloadData() {
        //获取数据
        let downloadUrl = this.downloadUrl;
        import('@/vendor/Export2ExcelPinHai').then(excel => {
          this.loading = true;
          excel.export_json_url_to_excel_with_formulae({
            url: downloadUrl,
            excelField: excelConfig.excelField,
            filename: `${this.primary.name}采购计划`
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
          _res.procurementPlanId = this.primary.id;
          _res.skuCode = obj["SKU编码"];
          _res.cartonQty = obj["采购箱数"];
          _res.cartonSpecCode = obj["箱规"];
          _res.numberOfCarton = obj["装箱数"];
          _res.sevenSalesCount = obj["7日销量(件)"];
          _res.safetyStockWeek = obj["备货周数"];
          _res.unfinishedPlanQty = obj["国内在途(箱)"];
          _res.amazonTotalStock = obj["在途加亚马逊库存(件)"];
          _res.domesticStockQty = obj["国内库存(箱)"];
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

