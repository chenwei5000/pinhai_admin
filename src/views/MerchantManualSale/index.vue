<template>
  <div class="app-container">
    <div class="ph-card">
      <div class="ph-card-body">

        <div class="ph-table">

          <div class="dashboard">
            <el-row
              style="text-align:left;
             position:fixed;
             width: 100%;
             bottom: 0px; padding: 0px 0px; z-index: 9999; ">

              <el-form :inline="true" ref="fromParent" id="filter-form"
                       @submit.native.prevent>
                <el-form-item label="销售渠道" size="mini">
                  <el-select filterable v-model="fromParent.merchantId" placeholder="请选择销售渠道">
                    <el-option
                      v-for="(item,idx) in merchantSelectOptions"
                      :label="item.label" :value="item.value"
                      :key="idx"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="分类" size="mini">
                  <el-select filterable v-model="fromParent.categoryId" placeholder="请选择分类">
                    <el-option
                      v-for="(item,idx) in categorySelectOptions"
                      :label="item.label" :value="item.value"
                      :key="idx"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="统计周数" size="mini">
                  <el-select filterable v-model="fromParent.week" placeholder="统计周数">
                    <el-option
                      v-for="(item,idx) in weekSelectOptions"
                      :label="item.label" :value="item.value"
                      :key="idx"
                    ></el-option>
                  </el-select>
                </el-form-item>

              </el-form>
            </el-row>
          </div>

          <!--本地搜索 TODO: 更加实际情况调整 el-form-item -->
          <el-form :inline="true" :model="searchParam" ref="searchForm" id="filter-form"
                   @submit.native.prevent>

            <el-form-item label="SKU">
              <el-input v-model="searchParam.skuCode" size="mini" placeholder="请输入SKU" clearable></el-input>
            </el-form-item>

            <el-form-item label="产品款式">
              <el-input v-model="searchParam.groupName" size="mini" placeholder="请输入产品款式" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <el-button native-type="submit" type="primary" @click="search(true)" size="mini">查询</el-button>
              <el-button @click="resetSearch" size="mini">重置</el-button>
            </el-form-item>
          </el-form>

          <!-- 表格工具条 添加、导入、导出等 -->
          <tableToolBar
            :hasExport="hasExport"
            :hasImport="hasImport"
            @onToolBarDownloadData="onToolBarDownloadData"
            @onToolBarImportData="onToolBarImportData"
          >
          </tableToolBar>

          <el-table
            ref="table"
            style="width: 100%"
            stripe
            border
            highlight-current-row
            :max-height="tableMaxHeight"
            cell-class-name="ph-cell"
            header-cell-class-name="ph-cell-header"
            :data="tableData"
            @cell-dblclick="handleDblclick"
            v-loading="loading"
            :default-sort="{prop: 'skuCode', order: 'ascending'}"
            id="table"
          >
            <el-table-column prop="id" label="ID" width="200" v-if="false"></el-table-column>
            <el-table-column prop="merchantId" label="渠道ID" width="200" v-if="false"></el-table-column>
            <el-table-column prop="skuCode" sortable label="SKU编码" width="150" fixed="left"
                             align="center"></el-table-column>
            <el-table-column prop="productImgUrl" label="图片" width="40">
              <template slot-scope="scope" v-if="scope.row.productImgUrl">
                <el-image
                  :z-index="10000"
                  style="width: 30px; height: 30px;margin-top: 5px"
                  :src="scope.row.productImgUrl"
                  :preview-src-list="[scope.row.productImgUrl.replace('_SL75_','_SL500_')]" lazy>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名" width="200" align="center"></el-table-column>
            <el-table-column prop="categoryName" label="分类" width="100" align="center"></el-table-column>
            <el-table-column prop="groupName" label="款式" width="100" align="center"></el-table-column>
            <el-table-column prop="minQty" label="7日最小销量" width="90" align="center"></el-table-column>
            <el-table-column prop="maxQty" label="7日最大销量" width="90" align="center"></el-table-column>
            <el-table-column prop="avgQty" label="7日平均销量" width="90" align="center"></el-table-column>
            <el-table-column prop="recommendQty" label="7日推荐销量" width="90" align="center"></el-table-column>
            <el-table-column prop="sevenSaleQty" label="7日人工销量" width="90" align="center"></el-table-column>
            <el-table-column prop="formatLastModified" label="设置时间" width="120" align="center"
                             fixed="right"></el-table-column>
            <el-table-column prop="finalSevenSaleQty" label="7日最终销量" width="90" align="center"
                             fixed="right"></el-table-column>
            <el-table-column prop="expire" label="是否过期" width="80" align="center" fixed="right">
              <template slot-scope="scope" v-if="scope.row.sevenSaleQty">
                <el-tag size="mini"
                        :type="scope.row.expire ? 'danger' : 'success'"
                        disable-transitions>{{ scope.row.expire === true ? '过期' : '有效' }}
                </el-tag>
              </template>
            </el-table-column>

            <!--默认操作列-->
            <el-table-column label="操作"
                             no-export="true"
                             width="90" fixed="right">
              <template slot-scope="scope">

                <el-button v-if="hasSetting" type="warning" size="mini"
                           id="ph-table-setting" icon="el-icon-setting" circle
                           @click="onDefaultSetting(scope.row)">
                </el-button>

                <el-button size="mini" icon="el-icon-s-data" circle
                           type="primary" id="ph-table-sell" @click="saleSituation(scope.row)">
                </el-button>
              </template>
            </el-table-column>

          </el-table>

          <!--分页-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="paginationSizes"
            :page-size="size"
            :total="total"
            style="text-align: right; padding: 7px 0 0 0;"
            background
            size="mini"
            :layout="paginationLayout"
            id="ph-table-page"
            ref="pageForm"
          >
            <el-button icon="el-icon-refresh" @click="onRefreshTable" class="btn-prev" circle></el-button>
          </el-pagination>

        </div>


        <chartDialog ref="chartDialog" :fromParent="fromParent"></chartDialog>
        <saveDialog ref="saveDialog" @modifyCBEvent="modifyCBEvent" :fromParent="fromParent"></saveDialog>

      </div>
    </div>
  </div>
</template>

<script>

  import categoryModel from "../../api/category";
  import merchantModel from "../../api/merchant";
  import qs from 'qs'
  import {checkPermission} from "@/utils/permission";
  import {currency, parseTime} from '@/utils'
  import tableToolBar from '@/components/PhTableToolBar'
  import chartDialog from '../Dashboard/sales/components/SaleDetails/components/chartDialog'
  import saveDialog from './components/saveDialog'

  const valueSeparator = '~'
  const valueSeparatorPattern = new RegExp(valueSeparator, 'g')
  const paramSeparator = ','
  const equal = '='
  const queryPattern = new RegExp('q=.*' + paramSeparator)

  export default {
    components: {
      tableToolBar,
      chartDialog,
      saveDialog
    },

    data() {
      return {
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
        total: 0,
        loading: false,

        categorySelectOptions: [],
        weekSelectOptions: [],
        merchantSelectOptions: [],

        title: '途断货情况',
        url: '/merchantManualSales',

        // 分页
        paginationSizes: [20, 50, 100],
        total: null,
        size: 20,
        page: 1,
        paginationLayout: 'total, sizes, slot, prev, pager, next, jumper',

        searchParam: {
          skuCode: null,
          groupName: null,
        },

        fromParent: {merchantId: null, categoryId: null, week: 20},

        tableAttrs: {
          "row-class-name": this.statusClassName
        },
      }
    },
    mounted() {
      //全屏，表格高度处理
      window.onresize = () => {
        this.getTableHeight();
      }

      //搜索区块，根据url恢复功能
      // 恢复查询条件
      let matches = location.href.match(queryPattern)

      if (matches) {
        let query = matches[0].substr(2).replace(valueSeparatorPattern, equal)
        let params = qs.parse(query, {delimiter: paramSeparator})

        if (params.categoryId) {
          this.fromParent.categoryId = params.categoryId;
        }
        if (params.merchantId) {
          this.fromParent.merchantId = params.merchantId;
        }
        if (params.week) {
          this.fromParent.week = params.week;
        }
      }

      this.$nextTick(() => {
        this.getTableHeight();
        this.initData();
        this.getList();
      })
    },

    computed: {
      hasExport() {
        return true;
      },
      hasSetting() {
        return true;
      },
      hasImport(){
        return true;
      }
    },

    methods: {
      // 获取表格的高度
      getTableHeight() {
        if (this.device !== 'mobile') {
          //浏览器高度
          let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          //表格高度
          let tableHeight = windowHeight;
          tableHeight = tableHeight - 84; //减框架头部高度
          tableHeight = tableHeight - 100; //减标题高度
          tableHeight = tableHeight - (this.$refs.searchForm ? this.$refs.searchForm.$el.offsetHeight : 0); //减搜索区块高度
          tableHeight = tableHeight - (this.$refs.operationForm ? this.$refs.operationForm.$el.offsetHeight : 0); //减操作区块高度
          tableHeight = tableHeight - (this.$refs.pageForm ? this.$refs.pageForm.$el.offsetHeight : 0); //减分页区块高度
          this.tableMaxHeight = tableHeight;
        }
        else {
          this.tableMaxHeight = 400;
        }
      },

      initData() {
        this.categorySelectOptions = categoryModel.getMineSelectProdcutOptions();
        this.merchantSelectOptions = merchantModel.getSelectOptions();
        this.weekSelectOptions = [];
        for (let i = 1; i < 52; i++) {
          this.weekSelectOptions.push({
            label: `${i}周`,
            value: i
          })
        }
        this.categorySelectOptions.unshift({label: '全部', value: '-1'});
      },

      statusClassName({row}) {
        return '';
      },

      getList() {
        if (this.fromParent.merchantId == null) {
          return;
        }
        let url = this.url;
        url += `/${this.fromParent.merchantId}?cid=${this.fromParent.categoryId ? this.fromParent.categoryId : -1}&weekNum=${this.fromParent.week}`;

        // 请求开始
        this.loading = true

        //获取数据
        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data
            let data = res || []

            this.data = data
            this.search(false)

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

      // 一页显示数量调整
      handleSizeChange(val) {
        if (this.size === val) return
        this.page = 1
        this.size = val
        this.search(false);
      },

      // 第几页调整
      handleCurrentChange(val) {
        if (this.page === val) return
        this.page = val
        this.search(false);
      },

      onRefreshTable: function () {
        this.getList();
      },

      handleDblclick(row, column, cell, event) {
        this.$copyText(row[column.property])
          .then(res => {
              this.$message.success("单元格内容已成功复制，可直接去粘贴");
            },
            err => {
              this.$message.error("复制失败");
            })
      },

      onDefaultSetting(row) {
        if (this.fromParent.merchantId == null) {
          return false;
        }
        this.$refs.saveDialog.openDialog(row, this.fromParent);
      },
      /********************* 搜索相关方法  ***************************/
      /*本地搜索*/
      search(flg) {
        if (flg) {
          this.page = 1;
        }
        this.tableData = JSON.parse(JSON.stringify(this.data));

        if (this.searchParam.skuCode != null && this.searchParam.skuCode != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.skuCode.indexOf(this.searchParam.skuCode) !== -1) {
                return true;
              }
            });
        }

        if (this.searchParam.groupName != null && this.searchParam.groupName != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.groupName.indexOf(this.searchParam.groupName) !== -1) {
                return true;
              }
            });
        }

        this.total = this.tableData.length;

        this.tableData = this.tableData.slice((this.page - 1) * this.size, this.page * this.size);
      },

      /*本地重置搜索*/
      resetSearch() {
        this.$refs.searchForm.resetFields();
        this.searchParam.skuCode = null;
        this.searchParam.groupName = null;
        this.search(true);
      },

      saleSituation(row) {
        this.$refs.chartDialog.openDialog(row);
      },

      modifyCBEvent(resp){
        this.tableData.forEach((item, index, arr) => {
          if (item.skuCode === resp.skuCode) {
            arr[index].formatLastModified = resp.formatLastModified;
            arr[index].lastModified = resp.lastModified;
            arr[index].sevenSaleQty = resp.sevenSaleQty;
            arr[index].expire = resp.expire;
            arr[index].finalSevenSaleQty = resp.finalSevenSaleQty;
          }
        });

        this.tableData.push({});
        this.tableData.pop();
      },

      onToolBarDownloadData() {
        if (this.fromParent.merchantId == null) {
          return false;
        }

        let table = this.$refs.table;
        let downloadUrl = this.url;
        downloadUrl += `/${this.fromParent.merchantId}?cid=${this.fromParent.categoryId ? this.fromParent.categoryId : -1}&weekNum=${this.fromParent.week}`;
        import('@/vendor/Export2Excel').then(excel => {
          this.loading = true;
          excel.export_el_table_to_excel({
            table: table,
            downloadUrl: downloadUrl,
            filename: `设置销量-${parseTime(new Date(), '{y}-{m}-{d}')}"`,
            noExportProps: ['操作', '图片', 'ID', '7日最终销量']
          })
          this.loading = false;
        })
      },

      uploadPromise(res) {
        let url = `${this.url}/${this.fromParent.merchantId}`
        return this.global.axios.post(url, res)
          .then(resp => {
          })
          .catch(err => {
          })
      },

      async onToolBarImportData(excelData) {

        if (this.fromParent.merchantId == null) {
          return false;
        }


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
          _res.skuCode = obj["SKU编码"];
          _res.sevenSaleQty = obj["7日人工销量"];
          _res.merchantId = this.fromParent.merchantId;
          if(_res.sevenSaleQty != null && _res.sevenSaleQty != '') {
            resData.push(_res);
          }
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
    },
    watch: {
      fromParent: {
        handler(newValue, oldValue) {
          this.getList();
        },
        deep: true
      }
    }
  }
</script>

<style scoped>
  .ph-table {
    padding: 10px 15px;

  }


</style>
