<template>
  <div class="app-container">
       <!--搜索-->
    <el-form :inline="true" :model="param" ref="searchForm" id="filter-form"
             @submit.native.prevent :rules="rules">
      <el-form-item label="分类" prop="category">
        <el-select v-model="param.category" multiple placeholder="请选择原料分类">
          <el-option
            v-for="item in categories"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

       <el-form-item label="国内成品库存" prop="warehouse">
        <el-select v-model="param.warehouse" multiple placeholder="请选择原料分类">
          <el-option
            v-for="item in warehouses"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

       <el-form-item label="国内原料库存" prop="materialWarehouse">
        <el-select v-model="param.materialWarehouse" multiple placeholder="请选择原料分类">
          <el-option
            v-for="item in materialWarehouses"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search" size="small">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="ph-card">
      <ph-card-header :title="title" type="table">
      </ph-card-header>
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
  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'
  import qs from 'qs'
  import categoryModel from '../../api/category'
import warehouseModel from '../../api/warehouse';

  export default {
    data() {
      return {
        title: '原料安全库存',
        param:{
          category: '',
          warehouse: '',
          materialWarehouse: '',
        },
        rules: {
          category: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
           warehouse: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
           materialWarehouse: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        categories: categoryModel.getSelectOptions(),
        warehouses: warehouseModel.getSelectDomesticOptions(),
        materialWarehouses: warehouseModel.getSelectMaterialOptions(),
        tableConfig: {
          url: null,
          relations: ["safetyStocks"],
          hasNew: false,
          hasDelete: false,
          hasOperation: false,
          hasPagination: false,
          countUrl: "",
          tableAttrs: {
            "row-class-name": this.statusClassName,
            "default-sort": {prop: 'safetyStocks.stockGapQty3', order: 'descending'},
          },
          //列表
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'skuCode', label: 'SKU编码', 'min-width': 200},
            {prop: 'productName', label: '材料名', 'min-width': 180},
            {prop: 'categoryName', label: '分类', 'min-width': 100},
            {prop: 'unit', label: '单位', 'min-width': 100},
            {prop: 'safetyStocks.demandedQty2', label: '4周消耗', 'min-width': 120},
            {prop: 'safetyStocks.stockGapQty3', sortable: true, label: 'P2缺口', 'min-width': 100},
            {prop: 'safetyStocks.stockGapQty4', label: 'P3缺口', 'min-width': 100},
            {prop: 'safetyStocks.stockGapQty5', label: 'P4缺口', 'min-width': 100},
            {prop: 'safetyStocks.stockGapQty6', label: 'P5缺口', 'min-width': 200},
            {prop: 'amazonTotalQty', label: '亚马逊成品(含在途)', 'min-width': 100},
            {prop: 'domesticStockQty', label: '国内成品库存(含在途)', 'min-width': 100},
            {prop: 'domesticMaterialStockQty', label: '国内原料库存', 'min-width': 100},
            {prop: 'supplierStockQty', label: '采购中库存', 'min-width': 100},
          ],
        }
      }
    },
    computed: {},
    methods: {
      statusClassName({row}) {
        try{
          if (row && row.safetyStocks && row.safetyStocks.stockGapQty3 > 0) {
            return 'danger-row';
          }
          else {
            return '';
          }
        }
        catch($e){
            return 'warning-row';
        }
      },
      search(){
        this.$refs.searchForm.validate(valid => {
          if(valid){
            this.tableConfig.url = `/stocks/safetyMaterialStocks?category=${this.param.category.join(",")}&warehouse=${this.param.warehouse.join(",")}&materialWarehous=${this.param.materialWarehouse.join(",")}`
            this.$refs.table1.getList();
          }
        })
        
      }
    },
    watch: {

    }
  }
</script>

<style scoped>


</style>
