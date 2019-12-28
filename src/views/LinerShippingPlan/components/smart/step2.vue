<template>

  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">
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
      :default-sort="{prop: 'replenishmentCartonQty', order: 'descending'}"
      id="table"
    >
      <el-table-column prop="skuCode" label="SKU" sortable width="150" fixed="left">
      </el-table-column>
      <el-table-column prop="categoryName" label="分类" width="100"></el-table-column>
      <el-table-column prop="groupName" label="款式" width="150"></el-table-column>
      <el-table-column prop="vipLevel" label="Vip级别" width="80"></el-table-column>
      <el-table-column prop="numberOfCarton" label="装箱数" width="80"></el-table-column>
      <el-table-column prop="soldOutTime" label="销售覆盖时间" width="100"></el-table-column>
      <el-table-column prop="sevenAmendQty" label="7日销量（件)" width="100"></el-table-column>
      <el-table-column prop="logisticsWeek" label="运输周数" width="100"></el-table-column>
      <el-table-column prop="safetyWeek" label="销售周数" width="100"></el-table-column>
      <el-table-column prop="coverageWeek" label="覆盖周数" width="100"></el-table-column>
      <el-table-column prop="demandedCartonQty" label="需求总量(箱)" width="100"></el-table-column>
      <el-table-column prop="stockGapCartonQty" label="库存缺口(箱)" width="100"></el-table-column>

      <el-table-column prop="inStockQty" label="亚马逊在库库存(件)" width="120"></el-table-column>
      <el-table-column prop="totalQty" label="亚马逊总库存(件)" width="120"></el-table-column>

      <el-table-column prop="validateStockQty" label="有效库存(件)" width="100"></el-table-column>


      <el-table-column prop="domesticStockCartonQty" label="国内库存(箱)" width="100">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.domesticStockCartonQty > 0 " placement="top-start" title="国内库存(箱)" width="250"
                      trigger="hover">
            <div v-html="br(scope.row.domesticStocks)"></div>
            <span slot="reference">{{ scope.row.domesticStockCartonQty }}</span>
          </el-popover>
          <span v-else>{{ scope.row.domesticStockCartonQty }}</span>
        </template>
      </el-table-column>

      <el-table-column v-for="(item, index) in warehouses" :key="item.id" :label="item.name" >
        <template slot-scope="scope">
          <span>{{ scope.row.warehouseStocks[item.id]}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="cartonSpecVolume" label="箱子体积(m³)" width="100">

        <template slot-scope="scope">
          <span v-if="false">{{ scope.row.cartonSpec.length }} * {{ scope.row.cartonSpec.width }} * {{ scope.row.cartonSpec.height }} </span>
          <span>{{scope.row.cartonSpecVolume}}</span>
        </template>

      </el-table-column>

      <el-table-column prop="oversize" label="OverSize" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.oversize ? '是' : '否' }}</span>
        </template>
      </el-table-column>


      <el-table-column prop="productName" label="名称" width="200">
      </el-table-column>


      <el-table-column prop="replenishmentCartonQty" sortable label="应补箱数"
                       width="140" fixed="right" align="center">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.replenishmentCartonQty"
                           size="mini"
                           style="width: 120px;margin: 3px 0;"
                           :precision="3"
                           :min="0"
                           :step="1"
                           @change="onReceivedCartonQty(scope.row)"
                           :max="1000000" label="请填本次应补箱数">
          </el-input-number>
        </template>
      </el-table-column>

      <el-table-column prop="replenishmentQty" sortable label="应补件数"
                       width="100" fixed="right" align="center">
      </el-table-column>

      <el-table-column prop="boxVolume" label="体积(m³)" width="100" fixed="right" align="center">
      </el-table-column>

      <!--默认操作列-->
      <el-table-column label="操作" v-if="hasOperation"
                       no-export="true"
                       width="50" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="hasDelete" type="danger" size="mini"
                     id="ph-table-del" icon="el-icon-delete" circle
                     @click="onDefaultDelete(scope.row)">

          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row>
      <el-col :md="12">
        <el-row type="flex" justify="center">
          <el-button type="primary" style="margin-top: 15px"
                     size="mini"
                     @click="onBack"
                     :loading="confirmLoading">
            上一步
          </el-button>
        </el-row>
      </el-col>

      <el-col :md="12">
        <el-row type="flex" justify="center">
          <el-button type="primary" style="margin-top: 15px"
                     size="mini"
                     @click="toPlanItem"
                     :loading="confirmLoading">
            转物流计划明细
          </el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency, parseLineBreak} from '@/utils'
  import moment from 'moment';

  export default {
    components: {},
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
      hasExecute() {
        return false;
      },
      hasOperation() {
        return this.hasEdit || this.hasDelete;
      },
      hasEdit() {
        return false;
      },
      hasDelete() {
        return true;
      }
    },
    filters: {
      currency: currency,
    },

    data() {
      return {
        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,

        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 多选记录对象
        selected: [],
        warehouses: [],

        //数据 TODO: 根据实际情况调整
        url: "/amazonStocks/shippings", // 资源URL
        searchParam: {
          skuCode: null,
          category: null,
          status: null,
          groupName: null,
        },
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
        this.getTableHeight();
        this.initData();
        this.getList();
      })
    },

    methods: {
      /********************* 基础方法  *****************************/
      br(text) {
        return parseLineBreak(text);
      },
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        let warehouses = [];

        if (this.primary.warehouseId.indexOf(-99)) {
          warehouses.push({id: -99, name: '供货商(箱)'})
        }

        let url = `/warehouses?filters=${JSON.stringify({
          "groupOp": "AND",
          "rules": [{
            field: "id",
            op: 'in',
            data: this.primary.warehouseId.join(",")
          }]
        })}&sort=id&dir=asc`;

        this.global.axios.get(url).then(data => {
          data.data.forEach(res => {
            warehouses.push({id: res.id, name: `${res.name}(箱)`})
          })
          this.warehouses = warehouses;
        });

      },
      // 获取表格的高度
      getTableHeight() {
        if (this.device !== 'mobile') {
          //浏览器高度
          let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          //表格高度
          let tableHeight = windowHeight;
          tableHeight = tableHeight - 240; //减框架头部高度
          this.tableMaxHeight = tableHeight;
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
          if (column.property == 'skuCode') {
            const values = data.map(item => item[column.property]);
            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);
            sums[index] = '合计: ' + sums[index] + ' 行';
          }

          if (column.property == 'replenishmentCartonQty') {
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

          if (column.property == 'boxVolume') {
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
              sums[index] = sums[index].toFixed(2) + ' m³';
            } else {
              sums[index] = 'N/A';
            }
          }

        });

        return sums;
      },

      /*获取列表*/
      getList() {
        let url = `${this.url}/${this.primary.merchantId}`;

        url += "?warehouse=" + this.primary.warehouseId.join(",")  //出货仓库
          + "&category=" + this.primary.categoryId.join(",")     //品类
          + "&etdTime=" + this.primary.formatEtdTime      //发柜时间
          + "&shipmentType=" + this.primary.type    //物流类型
          + "&portOfLoading=" + this.primary.portOfLoading  //出货港口
          + "&toWarehouse=" + this.primary.toWarehouse.address;      //收货区域

        if (this.primary.groupName) {
          url += "&group=" + this.primary.groupName.join(",");  //销售覆盖时间
        }
        if (this.primary.vip0SoldOutTime) {
          url += "&vip0SoldOutTime=" + this.primary.vip0SoldOutTime;  //销售覆盖时间
        }
        if (this.primary.vip1SoldOutTime) {
          url += "&vip1SoldOutTime=" + this.primary.vip1SoldOutTime;  //销售覆盖时间
        }
        if (this.primary.vip2SoldOutTime) {
          url += "&vip2SoldOutTime=" + this.primary.vip2SoldOutTime;  //销售覆盖时间
        }
        if (this.primary.exclude) {
          url += "&exclude=" + this.primary.exclude;  //销售覆盖时间
        }

        // 请求开始
        this.loading = true

        //获取数据
        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data
            let data = res || []

            this.data = [];
            data.forEach(row => {
              switch (row.vipLevel) {
                case 0 :
                  row.soldOutTime = this.primary.vip0SoldOutTime ? this.primary.vip0SoldOutTime : moment(new Date()).format("YYYY-MM-DD");
                  break;
                case 1 :
                  row.soldOutTime = this.primary.vip1SoldOutTime ? this.primary.vip1SoldOutTime : moment(new Date()).format("YYYY-MM-DD");
                  break;
                case 2 :
                  row.soldOutTime = this.primary.vip2SoldOutTime ? this.primary.vip2SoldOutTime : moment(new Date()).format("YYYY-MM-DD");
                  break;
              }
              this.data.push(row);
            })

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
      /* 行删除功能 */
      // 删除功能， 本地删除
      onDefaultDelete(row) {
        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              let idx = null;

              this.data.forEach((item, index) => {
                  if (item.skuCode === row.skuCode) {
                    idx = index;
                    return;
                  }
                }
              );
              this.date = this.data.splice(idx, 1);
              this.search();

              done();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },

      onReceivedCartonQty(row) {
        row.replenishmentQty = (row.replenishmentCartonQty * row.numberOfCarton).toFixed(0);
        row.boxVolume = (row.replenishmentCartonQty * row.cartonSpecVolume).toFixed(3);
      },

      //转物流计划明细
      toPlanItem() {
        let loading = this.$loading({
          lock: true,
          text: '保存中...',
          spinner: 'el-icon-upload',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let postData = [];
        this.tableData.forEach(row => {
          postData.push({
            productId: row.productId,
            skuCode: row.skuCode,
            cartonSpecId: row.cartonSpecId,
            cartonSpecName: row.cartonSpecCode,
            numberOfCarton: row.numberOfCarton,
            sevenSalesCount: row.sevenAmendQty,
            logisticsWeek: row.logisticsWeek,
            safetyWeek: row.safetyWeek,
            inStockQty: row.inStockQty,
            validateStockQty: row.validateStockQty,
            domesticStockQty: row.domesticStockQty,
            cartonQty: row.replenishmentCartonQty,
            merchantId: this.primary.merchantId,
            soldOutTime: row.soldOutTime,
            domesticStocks: JSON.stringify(row.warehouseStocks),
            domesticStockWarehouses : this.primary.warehouseId.join(","),
            amazonTotalStock: row.totalQty
          });
        });

        let url = `/linerShippingPlanItems/importData/${this.primary.id}`
        this.global.axios.post(url, postData)
          .then(data => {
            this.$message.success('操作成功！');
            loading.close();
            this.$emit("step2CBEvent", 3);

          })
          .catch(error => {
            try {
              this.$store.dispatch('errorLog/addErrorLog', {
                message: error.response.data.description,
                //url: window.location.href,
                title: '导入产品',
                time: new Date()
              });
            }
            catch (e) {
              console.log(e);
            }

            loading.close();
          })
      },

      onBack() {
        this.$emit("step2CBEvent", 0);
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

