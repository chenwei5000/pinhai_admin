<template>
  <div class="app-container">
       <!--搜索-->
    <el-form :inline="true" :model="param" ref="searchForm" id="filter-form"
             @submit.native.prevent >
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

      <el-form-item label="国内原料库存" prop="materialWarehouse">
        <el-select v-model="param.materialWarehouse" size="mini" multiple placeholder="请选择原料仓库">
          <el-option
            v-for="item in materialWarehouses"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

       <el-form-item label="国内成品库存" prop="warehouse">
        <el-select v-model="param.warehouse" size="mini" multiple placeholder="请选择成品仓库">
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
  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'
  import qs from 'qs'
  import categoryModel from '../../api/category'
import warehouseModel from '../../api/warehouse';
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        title: '原料安全库存',
        param:{
          category: '',
          warehouse: '',
          materialWarehouse: '',
        },
        categories: categoryModel.getMineSelectMaterialOptions(),
        warehouses: warehouseModel.getSelectDomesticOptions(),
        // warehouseModel.getSelectDomesticOptions(),
        materialWarehouses: warehouseModel.getSelectMaterialOptions(),
        tableConfig: {
          //权限控制
          hasNew: checkPermission('MaterialResource_create'),
          hasEdit: checkPermission('MaterialResource_update'),
          hasDelete: checkPermission('MaterialResource_remove'),
          // hasView: checkPermission('MaterialResource_get'),
          hasExport: checkPermission('MaterialResource_export'),

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
              {width: 30, type: checkPermission('MaterialResource_remove') ? 'selection' : '', hidden: !checkPermission('MaterialResource_remove')},
              phColumns.id,
              {prop: 'skuCode', label: 'SKU编码', 'min-width': 200},
              {prop: 'productName', label: '材料名', 'min-width': 180},
              {prop: 'categoryName', label: '分类', 'min-width': 100},
              {prop: 'unit', label: '单位', 'min-width': 100},
              {prop: 'amazonTotalQty', label: '亚马逊成品(含在途)', 'min-width': 100},
              {prop: 'domesticStockQty', label: '国内成品库存(含在途)', 'min-width': 100},
              {prop: 'domesticMaterialStockQty', label: '国内原料库存', 'min-width': 100},
              {prop: 'supplierStockQty', label: '采购中库存', 'min-width': 100},
            ],
        }
      }
    },
    mounted(){
      this.initData();
      this.$nextTick(()=>{
      })
    },

    computed: {
    },
    methods: {

      initData(){
          this.global.axios.get('/safetyStockConfigs').then( resp => {
           let res = resp.data || []
           this.data = res;
            for(let element of res){
               if (element.type == 1 ||element.type == 2){
                if (element.vip0SafetyStockWeek == 4 && element.vip1SafetyStockWeek == 4 && element.vip2SafetyStockWeek == 4){
                    this.tableConfig.columns.push({
                      prop: `safetyStocks.demandedQty${element.id}`,
                      label: `${element.name}`,
                      'min-width': 100
                   });
                   continue
                }
                this.tableConfig.columns.push({
                  prop: `safetyStocks.stockGapQty${element.id}`,
                  sortable: true,
                  label: `${element.name}缺口`,
                  'min-width': 100
                })
              }

            }
          }).catch(err => {

          })
      },

      onChange(){
          // let cateId = this.param.category;
          // if( cateId != null){
          //    this.loading = true;
          //    let url = "/warehouses/category/";
          //    url += "?cateId=" + cateId.join(",");
          //    this.global.axios.get(url)
          //     .then(resp => {
          //       let res = resp.data || [];
          //       this.materialWarehouses = [];
          //       res.forEach(r => {
          //         this.materialWarehouses.push({
          //           label: r.name,
          //           value: r.id + ''
          //         });
          //       });
          //       this.loading = false;
          //     })
          //     .catch(err => {
          //       this.loading = false;
          //     });
          // }
      },
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
            this.tableConfig.url = `/stocks/safetyMaterialStocks?category=${this.param.category.join(",")}&warehouse=${this.param.warehouse.join(",")}&materialWarehoues=${this.param.materialWarehouse.join(",")}`
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
