<template>

  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">
    <el-form inline
             ref="searchForm"
             label-position="right"
             label-width="120px"
    >

      <el-row>
        <el-col :md="8">
          <el-form-item label="船期">
            <span style="font-size: 12px">{{primary.linerShippingPlan.formatEtdTime}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="发货港口">
            <span style="font-size: 12px">{{primary.linerShippingPlan.portOfLoading}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="发货仓库">
            <span style="font-size: 12px">{{primary.fromWarehouse.name}}</span>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :md="8">
          <el-form-item label="FBA ID">
            <span style="font-size: 12px">{{primary.linerShippingPlan.shipmentId}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="提单号">
            <span style="font-size: 12px">{{primary.linerShippingPlan.ladingBillNumber}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="8">
          <el-form-item label="箱号">
            <span style="font-size: 12px">{{primary.linerShippingPlan.boxNumber}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="SKU">
          <el-input v-model="searchParam.skuCode" placeholder="请输入SKU" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="FNSKU">
          <el-input v-model="searchParam.fnSku" placeholder="请输入FNSKU" size="mini" clearable></el-input>
        </el-form-item>

        <el-form-item label="是否缺货">
          <el-checkbox v-model="searchParam.outOfStock"></el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search" size="mini">查询</el-button>
          <el-button @click="resetSearch" size="mini">重置</el-button>
        </el-form-item>

      </el-row>
    </el-form>
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
      @cell-dblclick="handleDblclick"
      :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
      id="table"
    >
      <!--el-table-column prop="sortNum" type="index" label="序号" width="50" fixed="left"></el-table-column-->
      <el-table-column prop="product.skuCode" label="SKU编码" width="200" fixed="left" align="center"></el-table-column>

      <el-table-column prop="product.fnSku" label="FN-SKU" width="100" align="center"></el-table-column>

      <el-table-column prop="product.imgUrl" label="图片" width="40" align="center">
        <template slot-scope="scope" v-if="scope.row.product.imgUrl">
          <el-image
            :z-index="10000"
            style="width: 30px; height: 30px;margin-top: 5px"
            :src="scope.row.product.imgUrl"
            :preview-src-list="[scope.row.product.imgUrl.replace('_SL75_','_SL500_')]" lazy>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column prop="product.groupName" label="款式" width="150" align="center">
      </el-table-column>

      <el-table-column prop="product.name" label="产品名" min-width="200" align="center">
      </el-table-column>

      <el-table-column prop="product.model" label="型号" width="100" align="center"></el-table-column>
      <el-table-column prop="product.color" label="颜色" width="120" align="center"></el-table-column>
      <el-table-column prop="product.size" label="尺码" width="80" align="center"></el-table-column>
      <el-table-column prop="cartonSpecCode" label="箱规" width="120" align="center"></el-table-column>
      <el-table-column prop="boxCode" label="箱码" width="100" align="center"></el-table-column>
      <el-table-column prop="numberOfCarton" label="装箱数" width="120"></el-table-column>
      <el-table-column prop="stock" label="库存量" width="100"></el-table-column>
      <el-table-column prop="sufficientStock" label="库存满足" width="100" align="center"></el-table-column>
      <el-table-column prop="cartonQty" label="计划箱数" width="100" align="center"></el-table-column>
      <el-table-column prop="qty" label="计划件数" width="100" align="center"></el-table-column>
      <el-table-column prop="shippedCartonQty" label="应发箱数" width="200" align="center" fixed="right">

        <template slot="header" slot-scope="scope">
          <span>本次应发箱数</span><BR/>
          <el-button type="primary" size="mini" plain @click="onAll">全部发货</el-button>
          <el-button type="success" size="mini" plain @click="onClear"> 清空</el-button>
        </template>

        <template slot-scope="scope">
          <el-input-number v-model="scope.row.shippedCartonQty"
                           size="mini"
                           style="width: 120px;margin: 3px 0;"
                           :precision="3"
                           :min="0"
                           :step="1"
                           @change="onShippedCartonQty(scope.row)"
                           :max="1000000" label="请填本次应发箱数">
          </el-input-number>

        </template>

      </el-table-column>
      <el-table-column prop="shippedQty" label="应发件数" width="100" fixed="right" align="center"></el-table-column>
    </el-table>
  </div>


</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'
  import {getObjectValueByArr} from "../../../../utils";

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
        'device', 'rolePower'
      ])
    },
    filters: {
      currency: currency
    },

    data() {
      return {
        // 表格最大高度
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,

        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        //数据 TODO: 根据实际情况调整
        url: "/warehouseAllocationItems", // 资源URL
        filters: [
          {
            field: "warehouseAllocationId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ],   //搜索对象
        relations: ["product", "cartonSpec", "warehouseAllocation"],  // 关联对象
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
        searchParam: {
          skuCode: null,
          outOfStock: null,
          fnSku: null,
        },
        // 表格加载效果
        loading: false
      }
    },

    created() {
    },

    mounted() {

      //全屏，表格高度处理
      window.onresize = () => {
        this.getTableHeight();
      }


      this.$nextTick(() => {
        this.initData();
        this.getTableHeight();
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
          tableHeight = tableHeight - 180;
          this.tableMaxHeight = tableHeight;
        }
        else {
          this.tableMaxHeight = 400;
        }
      },

      /********************* 表格相关方法  ***************************/
      //报警样式 TODO:根据实际情况调整
      dangerClassName({row}) {
        if (row.sufficientStock == '否') {
          return 'danger-row';
        }
        return '';
      },

      handleDblclick(row, column, cell, event) {
        if ('shippedCartonQty' == column.property) {
          return
        }
        let val = getObjectValueByArr(row, column.property);
        if (val) {
          this.$copyText(val)
            .then(res => {
                this.$message.success("单元格内容已成功复制，可直接去粘贴");
              },
              err => {
                this.$message.error("复制失败");
              })
        }
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

          if (column.property == 'shippedCartonQty') {
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
          if (column.property == 'shippedQty' || column.property == 'receivedQty') {
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
              sums[index] += ' 件';
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

            this.data = data;
            this.search();

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

      /********************* 搜索相关方法  ***************************/
      /*本地搜索*/
      search() {
        this.tableData = JSON.parse(JSON.stringify(this.data));
        if (this.searchParam.skuCode != null && this.searchParam.skuCode != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.product && item.product.skuCode.indexOf(this.searchParam.skuCode) !== -1) {
                return true;
              }
            });
        }

        if (this.searchParam.fnSku != null && this.searchParam.fnSku != '') {
          this.tableData = this.tableData.filter(
            item => {
              if (item.product && item.product.fnSku.indexOf(this.searchParam.fnSku) !== -1) {
                return true;
              }
            });
        }

        if (this.searchParam.outOfStock != null && this.searchParam.outOfStock) {
          this.tableData = this.tableData.filter(
            item => {
              if (item.sufficientStock == '否') {
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
        this.searchParam.fnSku = null;
        this.searchParam.outOfStock = null;

        this.search();
      },

      onAll() {
        this.data.forEach((item, index, arr) => {
          arr[index].shippedCartonQty = item.cartonQty;
          arr[index].shippedQty = item.qty;
          if (arr[index].stock >= arr[index].shippedQty) {
            arr[index].sufficientStock = "是";
          }
          else {
            arr[index].sufficientStock = "否";
          }
        });
        this.tableData = this.data;
      },

      onClear() {
        this.data.forEach((item, index, arr) => {
          arr[index].shippedCartonQty = 0;
          arr[index].shippedQty = 0;
          if (arr[index].stock >= arr[index].shippedQty) {
            arr[index].sufficientStock = "是";
          }
          else {
            arr[index].sufficientStock = "否";
          }
        });
        this.tableData = this.data;
      },
      onShippedCartonQty(row) {
        row.shippedQty = (row.shippedCartonQty * row.numberOfCarton).toFixed(0);
        if (row.stock >= row.shippedQty) {
          row.sufficientStock = "是";
        }
        else {
          row.sufficientStock = "否";
        }

        this.data.forEach((item, index, arr) => {
          if (arr[index].id == row.id) {
            arr[index].shippedCartonQty = row.shippedCartonQty;
            arr[index].shippedQty = row.shippedQty;
            arr[index].sufficientStock = row.sufficientStock;
          }
        });
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

