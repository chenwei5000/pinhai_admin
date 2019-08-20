<template>

  <el-dialog title="智能备货" v-if="dialogVisible" :visible.sync="dialogVisible" @close='closeDialog' fullscreen>

    <!--本地搜索 TODO: 根据实际情况调整 el-form-item -->
    <el-form :inline="true" :model="searchParam" ref="searchForm" id="filter-form"
             @submit.native.prevent>

      <el-form-item label="SKU">
        <el-input v-model="searchParam.skuCode" placeholder="请输入SKU" clearable></el-input>
      </el-form-item>

      <el-form-item label="分类">
        <el-input v-model="searchParam.category" placeholder="请输入分类名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search" size="small">查询</el-button>
        <el-button @click="resetSearch" size="small">重置</el-button>
      </el-form-item>
    </el-form>

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
        :default-sort="{prop: 'replenishmentCartonPlanQty', order: 'descending'}"
        id="table"
      >
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column prop="skuCode" label="SKU" sortable width="150" fixed="left">

          <template slot-scope="scope">
            <el-popover placement="top-start" width="200" trigger="hover"
                        v-if="scope.row.skuCode && scope.row.skuCode.length > 22">
              <div v-html="scope.row.skuCode"></div>
              <span slot="reference">{{
              scope.row.skuCode ? scope.row.skuCode.length > 22 ? scope.row.skuCode.substr(0,20)+'..' : scope.row.skuCode : ''
              }}</span>
            </el-popover>
            <span v-else>
            {{ scope.row.skuCode }}
          </span>
          </template>

        </el-table-column>
        <el-table-column prop="categoryName" label="分类" width="100"></el-table-column>

        <el-table-column prop="groupName" label="款式" width="150">
          <template slot-scope="scope">
            <el-popover placement="top-start" width="200" trigger="hover"
                        v-if="scope.row.groupName && scope.row.groupName.length > 12">
              <div v-html="scope.row.groupName"></div>
              <span slot="reference">{{
              scope.row.groupName ? scope.row.groupName.length > 12 ? scope.row.groupName.substr(0,10)+'..' : scope.row.groupName : ''
              }}</span>
            </el-popover>
            <span v-else>
            {{ scope.row.groupName }}
            </span>
          </template>

        </el-table-column>

        <el-table-column prop="numberOfCarton" label="装箱数" width="80"></el-table-column>
        <el-table-column prop="safetyWeek" label="备货周数" width="80"></el-table-column>
        <el-table-column prop="demandedCartonQty" sortable label="需求总量(箱)" width="120"></el-table-column>
        <el-table-column prop="sevenAmendQty" sortable label="7日销量(件)" width="120"></el-table-column>
        <el-table-column prop="totalQty" sortable label="亚马逊含在途库存(件)" width="180"></el-table-column>
        <el-table-column prop="domesticStockCartonQty" sortable label="国内库存(箱)" width="120"></el-table-column>
        <el-table-column prop="unfinishedPlanCartonQty" sortable label="国内在途(箱)" width="120"></el-table-column>
        <el-table-column prop="productName" label="名称" width="200">

          <template slot-scope="scope">
            <el-popover placement="top-start" width="200" trigger="hover"
                        v-if="scope.row.productName && scope.row.productName.length > 17">
              <div v-html="scope.row.productName"></div>
              <span slot="reference">{{
              scope.row.productName ? scope.row.productName.length > 17 ? scope.row.productName.substr(0,15)+'..' : scope.row.productName : ''
              }}</span>
            </el-popover>
            <span v-else>
            {{ scope.row.productName }}
            </span>
          </template>

        </el-table-column>
        <el-table-column prop="fnSku" label="FNSKU" min-width="120"></el-table-column>
        <el-table-column prop="vipLevel" label="Vip级别" width="100"></el-table-column>
        <el-table-column prop="cartonSpecCode" label="箱规" width="120" v-if="false"></el-table-column>
        <el-table-column prop="numberOfPallets" label="托盘装箱数" width="120"></el-table-column>

        <el-table-column prop="saleWeek" sortable label="可售周数" width="100" fixed="right"></el-table-column>
        <el-table-column prop="replenishmentCartonPlanQty" sortable label="采购箱数" width="100"
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

    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="confirmLoading" @click="onCreateObject">
        生成采购计划
      </el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>


  </el-dialog>

</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    components: {},
    props: {},

    computed: {
      ...mapGetters([
        'device'
      ])
    },
    watch: {
      dialogVisible(val) {

      }
    },

    data() {
      return {
        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 400 : 40000000,
        // 对话框是否可见
        dialogVisible: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        //操作按钮控制
        hasOperation: true,
        hasDelete: true,

        // 多选记录对象
        selected: [],

        //抓数据 TODO: 根据实际情况调整
        object: null,
        url: null, // 资源URL
        searchParam: {
          skuCode: null,
          category: null
        },
        relations: [],  // 关联对象
        data: [],  // 从后台加载的数据
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
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
      },

      // 获取表格的高度
      getTableHeight() {
        if (this.device !== 'mobile') {
          //浏览器高度
          let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          //表格高度
          let tableHeight = windowHeight;
          tableHeight = tableHeight - 230; //减标题高度
          this.tableMaxHeight = tableHeight;
        }
        else {
          this.tableMaxHeight = 400;
        }
      },

      // 打开Dialog TODO:
      openDialog(object) {
        this.dialogVisible = true;
        this.object = object;
        this.url = `/amazonStocks/plans/${object.merchantId}?warehouse=${object.warehouseId.join(",")}&category=${object.categoryId.join(",")}&safetyStockWeek=${object.safetyStockWeek}&vip1SafetyStockWeek=${object.vip1SafetyStockWeek}&vip2SafetyStockWeek=${object.vip2SafetyStockWeek}&exclude=${object.handleMethod}`;
        this.url += '&group=' + encodeURIComponent(object.groupName.join(","))

        this.getTableHeight();
        this.initData();
        this.getList();
      },

      closeDialog() {
        this.object = null;
        this.data = [];
        this.search();
        this.resetSearch();
        this.dialogVisible = false;
      },

      /********************* 表格相关方法  ***************************/
      //报警样式 TODO:根据实际情况调整
      dangerClassName({row}) {
        return '';
      },

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

      // 统计功能 TODO:
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
      getList() {
        let url = this.url
        if (!url) {
          return
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
            this.search()
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

      /********************* 操作按钮相关方法  ***************************/
      //** 创建对象 TODO: **/
      onCreateObject() {
        if (this.selected == null || this.selected.length == 0) {
          this.$confirm('您没有选择任何推荐备货的商品，如果您确认。将手工维护采购计划明细，是否继续？', '提示', {
            type: 'warning',
            beforeClose: (action, instance, done) => {
              if (action == 'confirm') {
                done();
                this.createObject();
              } else done()
            }
          }).catch(er => {
            /*取消*/
          })
        }
        else {
          this.createObject();
        }
      },

      // 创建计划
      createObject() {
        this.loading = true;
        this.confirmLoading = true;

        //转义字段
        let _object = JSON.parse(JSON.stringify(this.object));
        _object.warehouseId = _object.warehouseId ? _object.warehouseId.join(",") : "";
        _object.groupName =  _object.groupName ? _object.groupName.join(",") : "";

        let items = [];
        this.selected.forEach(obj => {
          obj.safetyStockWeek = obj.safetyWeek;
          obj.cartonQty = obj.replenishmentCartonPlanQty;
          obj.sevenSalesCount = obj.sevenAmendQty;
          obj.amazonTotalStock = obj.totalQty;
          items.push(obj);
        });

        _object.planItems = JSON.parse(JSON.stringify(items));

        this.global.axios.post("/procurementPlans", _object)
          .then(resp => {
            let _newObject = resp.data;
            this.$message({type: 'success', message: '操作成功'});
            this.loading = false;
            this.confirmLoading = false;
            // 回传消息
            this.dialogVisible = false;
            this.$emit("createCBEvent", _newObject.id);
          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
          })

      },

      /********************* 搜索相关方法  ***************************/
      /*本地搜索*/
      search() {
        this.tableData = this.data;

        if (this.searchParam.category != null && this.searchParam.category != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.categoryName && item.categoryName.indexOf(this.searchParam.category) !== -1) {
                return true;
              }
            });
        }
        if (this.searchParam.skuCode != null && this.searchParam.skuCode != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.skuCode.indexOf(this.searchParam.skuCode) !== -1) {
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

        this.search();
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>
</style>
