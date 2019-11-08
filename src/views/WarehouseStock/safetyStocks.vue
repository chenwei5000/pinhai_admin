<template>
  <div class="app-container">
    <div class="ph-card">
      <div class="ph-card-body">

        <div class="ph-form" style="padding: 10px 15px 0 15px;">
          <!--搜索-->
          <el-form :inline="true"
                   :model="param"
                   ref="searchForm"
                   id="filter-form"
                   inline-message
                   :rules="rules"
                   @submit.native.prevent>

            <el-form-item label="分类" prop="category">
              <el-select v-model="param.category" size="mini" style="width: 150px"
                         multiple placeholder="请选择原料分类" @change="onChange">
                <el-option
                  v-for="item in categories"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="国内成品库存" prop="warehouse">
              <el-select v-model="param.warehouse" size="mini" style="width: 150px" multiple placeholder="请选择仓库">
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
  import {checkPermission} from "../../utils/permission";
  import validRules from "../../components/validRules";

  export default {
    data() {
      return {
        title: '成品安全库存-单位(件)',
        param: {
          category: '',
          warehouse: '',
        },
        categories: [],
        warehouses: [],

        // 字段验证规则 TODO:
        rules: {
          category: [
            validRules.required
          ],
          warehouse: [
            validRules.required
          ]
        },

        tableConfig: {
          hasExport: true,
          hasOperation: false,
          hasPagination: false,
          hasDelete: false,
          hasEdit: false,
          exportFileName: '成品安全库存',
          subHeight: 35,

          url: null,
          relations: ["safetyStocks"],
          countUrl: "",
          tableAttrs: {
            "row-class-name": this.statusClassName,
            "default-sort": {prop: 'safetyStocks.stockGapQty1', order: 'descending'},
          },
          //列表
          columns: [
            {prop: 'skuCode', label: 'SKU编码', 'min-width': 150},
            {prop: 'productName', label: '产品名', 'min-width': 150},
            {prop: 'categoryName', label: '分类', 'min-width': 80},
            {prop: 'unit', label: '单位', 'min-width': 50, formatter: row => ('件')},
          ],
        }
      }
    },
    computed: {},

    mounted() {
      this.initData();
    },

    methods: {
      initData() {
        this.categories = categoryModel.getMineSelectProdcutOptions();

        this.global.axios.get('/safetyStockConfigs').then(resp => {
          let res = resp.data || []
          this.data = res;
          for (let element of res) {
            if (element.type == 0 || element.type == 2) {
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
                'min-width': 130
              })
            }
          }
          this.tableConfig.columns.push({prop: 'vipLevelName', label: 'Vip级别', 'min-width': 80})
          this.tableConfig.columns.push({prop: 'amazonTotalQty', label: '亚马逊成品(含在途)', 'min-width': 120})
          this.tableConfig.columns.push({prop: 'domesticStockQty', label: '国内库存', 'min-width': 80})

        }).catch(err => {

        })
      },

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
        if (row && row.safetyStocks && (row.safetyStocks.stockGapQty3 > 0)) {
          return 'danger-row';
        }
        else {
          return '';
        }
      },

      search() {
        this.$refs.searchForm.validate(valid => {
          if (valid) {
            this.tableConfig.url = "/stocks/safetyStocks?category=";
            if (this.param.category != null) {
              this.tableConfig.url += this.param.category.join(",");
            }
            this.tableConfig.url += "&warehouse=";
            if (this.param.warehouse != null) {
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

<style type="text/less" lang="scss" scoped>

  .ph-table {
    padding: 0 15px !important;

  }
</style>
