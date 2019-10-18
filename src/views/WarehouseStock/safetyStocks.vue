<template>
  <div class="app-container">
    <!--搜索-->
    <el-form :inline="true" :model="param" ref="searchForm" id="filter-form"
             @submit.native.prevent>
      <el-form-item label="分类" prop="category">
        <el-select v-model="param.category" size="mini" multiple placeholder="请选择原料分类" @change="onChange">
          <el-option
            v-for="item in categories"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="国内成品库存" prop="warehouse">
        <el-select v-model="param.warehouse" size="mini" multiple placeholder="请选择仓库">
          <el-option
            v-for="item in warehouses"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search" size="mini">查询</el-button>
        <el-button @click="resetSearch" size="mini">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="ph-card">
      <div class="ph-card-body">

        <ph-table
          ref="table1"
          v-bind="tableConfig"
        >
        </ph-table>
      </div>
    </div>
  </div>
</template>

<script>
  import phColumns from '../../components/phColumns'
  import categoryModel from '../../api/category'
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        title: '成品安全库存',
        param: {
          category: '',
          warehouse: '',
        },
        categories: categoryModel.getMineSelectProdcutOptions(),
        warehouses: [],
        // warehouseModel.getSelectDomesticOptions(),
        tableConfig: {
          //权限控制
          hasNew: checkPermission('SafetyStockResource_create'),
          hasEdit: checkPermission('SafetyStockResource_update'),
          hasDelete: checkPermission('SafetyStockResource_remove'),
          // hasView: checkPermission('SafetyStockResource_get'),
          hasExportTpl: checkPermission('SafetyStockResource_export'),
          hasExport: true,
          hasImport: checkPermission('SafetyStockResource_import'),

          url: null,
          relations: ["safetyStocks"],
          hasNew: false,
          hasDelete: false,
          hasOperation: false,
          hasPagination: false,
          hasExport: true,
          countUrl: "",
          tableAttrs: {
            "row-class-name": this.statusClassName,
            "default-sort": {prop: 'safetyStocks.stockGapQty3', order: 'descending'},
          },
          //列表
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'skuCode', label: 'SKU编码', 'min-width': 120},
            {prop: 'productName', label: '材料名', 'min-width': 120},
            {prop: 'categoryName', label: '分类', 'min-width': 100},
            {prop: 'unit', label: '单位', 'min-width': 100},
            {prop: 'safetyStocks.demandedQty2', label: '4周消耗', 'min-width': 120},
            {prop: 'safetyStocks.stockGapQty1', label: 'P0缺口', 'min-width': 100},
            {prop: 'safetyStocks.stockGapQty2', label: 'P1缺口', 'min-width': 100},
            {prop: 'safetyStocks.stockGapQty3', sortable: true, label: 'P2缺口', 'min-width': 100},
            {prop: 'safetyStocks.stockGapQty4', label: 'P3缺口', 'min-width': 100},
            {prop: 'vipLevelName', label: 'Vip级别', 'min-width': 100},
            {prop: 'amazonTotalQty', label: '亚马逊成品(含在途)', 'min-width': 180},
            {prop: 'domesticStockQty', label: '国内库存', 'min-width': 100},

          ],
        }
      }
    },
    computed: {},
    methods: {
      resetSearch() {
        this.param.category = null;
        this.param.warehouse = null;
      },
      onChange() {
        let cateId = this.param.category;
        if (cateId != null) {
          this.loading = true;
          let url = "/warehouses/category";
          url += "?cateId=" + cateId.join(",");
          this.global.axios.get(url)
            .then(resp => {
              let res = resp.data || [];
              this.warehouses = [];
              res.forEach(r => {
                this.warehouses.push({
                  label: r.name,
                  value: r.id + ''
                });
              });
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
            });
        }
      },

      statusClassName({row}) {
        try {
          if (row && row.safetyStocks && row.safetyStocks.stockGapQty3 > 0) {
            return 'danger-row';
          }
          else {
            return '';
          }
        }
        catch ($e) {
          return 'warning-row';
        }
      },
      search() {
        this.$refs.searchForm.validate(valid => {
          if (valid) {
            this.tableConfig.url = "/stocks/safetyStocks?category=";
            if(this.param.category != null){
              this.tableConfig.url += this.param.category.join(",");
            }
            this.tableConfig.url += "&warehouse=";
            if(this.param.warehouse != null){
              this.tableConfig.url += this.param.warehouse.join(",");
            }
            this.$refs.table1.getList();
          }
        })

      }
    },
    watch: {}
  }
</script>

<style scoped>


</style>
