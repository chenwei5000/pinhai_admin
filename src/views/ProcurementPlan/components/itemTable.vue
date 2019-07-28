<template>

  <el-dialog title="智能备货" :visible.sync="formVisible" fullscreen>

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
        :cell-style="{padding: '2px 0', 'font-size': '13px'}"
        :header-cell-style="{padding: '2px 0'}"
        :data="data"
        v-loading="loading"
        show-summary
        :summary-method="getSummaries"
        @selection-change="handleSelectionChange"
        :default-sort="{prop: 'replenishmentCartonPlanQty', order: 'descending'}"
        id="table"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="skuCode" label="SKU" sortable width="200" fixed="left"></el-table-column>
        <el-table-column prop="categoryName" label="分类" width="120"></el-table-column>
        <el-table-column prop="numberOfCarton" label="装箱数" width="100"></el-table-column>
        <el-table-column prop="safetyWeek" label="备货周数" width="90"></el-table-column>
        <el-table-column prop="demandedCartonQty" sortable label="需求总量(箱)" width="130"></el-table-column>
        <el-table-column prop="sevenAmendQty" sortable label="7日销量(件)" width="120"></el-table-column>
        <el-table-column prop="totalQty" sortable label="亚马逊含在途库存(件)" width="200"></el-table-column>
        <el-table-column prop="domesticStockCartonQty" sortable label="国内库存(箱)" width="130"></el-table-column>
        <el-table-column prop="unfinishedPlanCartonQty" sortable label="国内在途(箱)" width="130"></el-table-column>
        <el-table-column prop="saleWeek" sortable label="可售周数" width="120"></el-table-column>
        <el-table-column prop="productName" label="名称" width="200"></el-table-column>
        <el-table-column prop="fnSku" label="FNSKU" min-width="120"></el-table-column>
        <el-table-column prop="vipLevel" label="Vip级别" width="120"></el-table-column>
        <el-table-column prop="cartonSpecCode" label="箱规" width="120"></el-table-column>
        <el-table-column prop="numberOfPallets" label="托盘装箱数" width="120"></el-table-column>


        <el-table-column prop="replenishmentCartonPlanQty" sortable label="采购箱数" width="120"
                         fixed="right"></el-table-column>
        <!--默认操作列-->
        <el-table-column label="操作" v-if="hasOperation" width="50" fixed="right">
          <template slot-scope="scope">

            <el-button v-if="hasDelete" type="danger" size="mini"
                       id="ph-table-del" icon="el-icon-delete" circle
                       @click="onDefaultDelete(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-col :md="24">
        <el-row type="flex" justify="center">
          <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onCreatePlan">
            生成采购计划
          </el-button>
        </el-row>
      </el-col>

    </div>

  </el-dialog>

</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    components: {},
    props: {
      plan: {
        type: Object,
        default: null
      }
    },
    computed: {
      ...mapGetters([
        'device'
      ])
    },

    data() {
      return {
        //样式
        tableMaxHeight: this.device !== 'mobile' ? 400 : 40000000,

        formVisible: false,

        confirmLoading: false,

        //操作
        hasOperation: true,
        hasEdit: true,
        hasDelete: true,
        selected: [],

        //数据 TODO: 根据实际情况调整
        plan: null,
        url: null, // 资源URL
        relations: [],  // 关联对象
        data: [],
        loading: false,

        // 记录修改的那一行
        row: {},
      }
    },

    created() {
    },

    mounted() {

      this.$on("openDialog", plan => {
        this.plan = plan;
        this.formVisible = true;
        this.url = `/amazonStocks/plans/${plan.merchantId}?warehouse=${plan.warehouseId.join(",")}&category=${plan.categoryId.join(",")}&safetyStockWeek=${plan.safetyStockWeek}&vip1SafetyStockWeek=${plan.vip1SafetyStockWeek}&vip2SafetyStockWeek=${plan.vip2SafetyStockWeek}&exclude=${plan.handleMethod}`;
        this.getTableHeight();
        this.initLoadData();
        this.getList();
      });

      this.$nextTick(() => {
        this.getTableHeight();
        this.initLoadData();
        this.getList();
      })
    },
    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initLoadData() {
      },

      // 获取表格的高度
      getTableHeight() {
        if (this.device !== 'mobile') {
          //浏览器高度
          let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          //表格高度
          let tableHeight = windowHeight;
          tableHeight = tableHeight - 160; //减标题高度
          this.tableMaxHeight = tableHeight;
        }
        else {
          this.tableMaxHeight = 400;
        }
      },

      /********************* 表格相关方法  ***************************/
      //报警样式 TODO:根据实际情况调整
      dangerClassName({row}) {
        return '';
      },

      onDefaultDelete(row) {
        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              let idx = null;

              this.data.forEach((item, index) => {
                  if (item.id == row.id) {
                    idx = index;
                    return;
                  }
                }
              );

              this.date = this.data.splice(idx, 1);

              done();

            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },

      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];

        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property == 'replenishmentCartonPlanQty') {
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

          if (column.property == 'skuCode') {
            const values = data.map(item => item[column.property]);

            sums[index] = values.reduce((prev) => {
              return prev + 1;
            }, 0);
            sums[index] += ' 行';

          }
        });

        return sums;
      },

      /*获取列表*/
      getList(shouldStoreQuery) {
        let url = this.url
        if (!url) {
          console.warn('url 为空, 不发送请求')
          return
        }

        // 构造查询url
        if (url.indexOf('?') > -1) {
          url += '&'
        }
        else {
          url += '?'
        }

        // 处理关联加载
        if (this.relations && this.relations.length > 0) {
          params += "&relations=" + JSON.stringify(this.relations);
        }

        // 请求开始
        this.loading = true

        //获取数据
        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data
            let data = res || []
            this.data = data
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

      ///////////////创建///////////////////////
      onCreatePlan() {
        if (this.selected == null || this.selected.length == 0) {
          this.$confirm('您没有选择任何推荐备货的商品，如果您确认。将手工维护采购计划明细，是否继续？', '提示', {
            type: 'warning',
            beforeClose: (action, instance, done) => {
              if (action == 'confirm') {
                done();
                this.createPlan();
              } else done()
            }
          }).catch(er => {
            /*取消*/
          })
        }
        else{
          this.createPlan();
        }
      },
      // 创建计划
      createPlan() {
        let _plan = JSON.parse(JSON.stringify(this.plan));
        _plan.warehouseId = _plan.warehouseId ? _plan.warehouseId.join(",") : "";
        this.loading = true;
        this.confirmLoading = true;

        console.log(this.selected);
        this.global.axios[method](url, _plan)
          .then(resp => {
            let _newPlan = resp.data;

            this.$message({type: 'success', message: '操作成功'});
            this.loading = false;
            this.confirmLoading = false;
            // 回传消息
            this.$emit("createCBEvent", _newPlan.id);
          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
            this.$emit("createCBEvent", null, null);
          })

      },
      cancel() {

      },
      confirm() {

      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .el-table {
    /deep/ .ph-header-small {
      font-size: 12px !important;
    }
    /deep/ tr.warning-row {
      background: rgb(233, 233, 235) !important;
    }

    /deep/ tr.warning-row td {
      background: rgb(233, 233, 235) !important;
    }

    /deep/ tr.danger-row {
      background: rgb(253, 226, 226) !important;
    }

    /deep/ tr.danger-row td {
      background: rgb(253, 226, 226) !important;
    }
  }

  .el-form-item__content {
    /deep/ .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
      width: 230px !important;
    }
  }
</style>

