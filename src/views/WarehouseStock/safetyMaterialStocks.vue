<template>
  <div class="app-container">
    <div class="ph-card">
      <div class="ph-card-body">

        <div class="ph-form" style="padding: 10px 15px 0 15px;">
          <!--搜索-->
          <el-form :inline="true"
                   inline-message
                   :rules="rules"
                   :model="param" ref="searchForm" id="filter-form"
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
              <el-select v-model="param.warehouse" size="mini" multiple placeholder="请选择成品仓库">
                <el-option
                  v-for="item in warehouses"
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

            <el-form-item>
              <el-button native-type="submit" type="primary" @click="search" size="mini">查询</el-button>
            </el-form-item>
          </el-form>
        </div>


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
  import categoryModel from '../../api/category'
  import warehouseModel from '../../api/warehouse';
  import {checkPermission} from "../../utils/permission";
  import validRules from "../../components/validRules";

  export default {
    data() {
      return {
        title: '原料安全库存',
        param: {
          category: '',
          warehouse: '',
          materialWarehouse: '',
        },
        categories: categoryModel.getMineSelectMaterialOptions(),
        warehouses: warehouseModel.getSelectDomesticOptions(),
        materialWarehouses: warehouseModel.getSelectMaterialOptions(),

        rules: {
          category: [
            validRules.required
          ],
          warehouse: [
            validRules.required
          ],
          materialWarehouse: [
            validRules.required
          ]
        },

        tableConfig: {
          exportFileName: '原料安全库存',
          hasExport: true,
          hasOperation: false,
          hasPagination: false,
          hasDelete: false,
          hasEdit: false,
          url: null,
          relations: ["safetyStocks"],
          countUrl: "",
          tableAttrs: {
            "row-class-name": this.statusClassName,
            "default-sort": {prop: 'safetyStocks.stockGapQty3', order: 'descending'},
          },
          //列表
          columns: [
            {prop: 'skuCode', label: 'SKU编码', 'min-width': 150},
            {prop: 'productName', label: '材料名', 'min-width': 150},
            {prop: 'categoryName', label: '分类', 'min-width': 80},
            {prop: 'unit', label: '单位', 'min-width': 50},
          ],
        }
      }
    },
    mounted() {
      this.initData();
      this.$nextTick(() => {
      })
    },

    computed: {},
    methods: {

      initData() {
        this.global.axios.get('/safetyStockConfigs').then(resp => {
          let res = resp.data || []
          this.data = res;
          for (let element of res) {
            if (element.type == 1 || element.type == 2) {
              if (element.vip0SafetyStockWeek == 4 && element.vip1SafetyStockWeek == 4 && element.vip2SafetyStockWeek == 4) {
                this.tableConfig.columns.push({
                  prop: `safetyStocks.demandedQty${element.id}`,
                  label: `${element.name}`,
                  'min-width': 80
                });
                continue
              }
              this.tableConfig.columns.push({
                prop: `safetyStocks.stockGapQty${element.id}`,
                sortable: true,
                label: `${element.name}缺口(${element.vip0SafetyStockWeek},${element.vip1SafetyStockWeek},${element.vip2SafetyStockWeek})`,
                'min-width': 125
              })
            }
          }

          this.tableConfig.columns.push({prop: 'amazonTotalQty', label: '亚马逊成品(含在途)', 'min-width': 120});
          this.tableConfig.columns.push({prop: 'domesticStockQty', label: '国内成品库存', 'min-width': 120});
          this.tableConfig.columns.push({prop: 'domesticMaterialStockQty', label: '国内原料库存', 'min-width': 120});
          this.tableConfig.columns.push({prop: 'supplierStockQty', label: '采购中库存', 'min-width': 80});
        }).catch(err => {

        })
      },

      onChange() {
      },

      statusClassName({row}) {
        if (row && row.safetyStocks && (row.safetyStocks.stockGapQty5 > 0)) {
          return 'danger-row';
        }
        else {
          return '';
        }
      },

      search() {
        this.$refs.searchForm.validate(valid => {
          if (valid) {
            this.tableConfig.url = `/stocks/safetyMaterialStocks?category=${this.param.category.join(",")}&warehouse=${this.param.warehouse.join(",")}&materialWarehoues=${this.param.materialWarehouse.join(",")}`
            this.$refs.table1.getList();
          }
        })

      }
    },
    watch: {}
  }
</script>

<style type="text/less" lang="scss" scoped>

  .ph-table {
    padding: 0 15px !important;

  }
</style>

