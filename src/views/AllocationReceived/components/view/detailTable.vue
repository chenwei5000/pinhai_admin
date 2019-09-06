<template>

  <!--本地搜索表格 一次加载所有相关数据 在本地进行搜索 不分页 前端搜索、排序 -->
  <div class="ph-table">

    <!--表格 TODO:根据实际情况调整 el-table-column  -->
    <el-table
      ref="table"
      style="width: 100%"
      stripe
      border
      max-height="500"
      highlight-current-row
      :row-class-name="dangerClassName"
      cell-class-name="ph-cell"
      header-cell-class-name="ph-cell-header"
      :data="tableData"
      v-loading="loading"
      show-summary
      :summary-method="getSummaries"
      :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
      id="table"
    >
      <!--el-table-column prop="sortNum" type="index" label="序号" width="50" fixed="left"></el-table-column-->
      <el-table-column prop="product.skuCode" label="SKU编码" width="200" fixed="left">

      </el-table-column>

      <el-table-column prop="product.name" label="产品名" min-width="200">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="200" trigger="hover"
                      v-if="scope.row.product.name && scope.row.product.name.length > 18">
            <div v-html="scope.row.product.name"></div>
            <span slot="reference">{{
              scope.row.product ? scope.row.product.name.length > 18 ? scope.row.product.name.substr(0,16)+'..' : scope.row.product.name : ''
              }}</span>
          </el-popover>
          <span v-else>
            {{ scope.row.product.name }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="boxCode" label="箱码" width="100"></el-table-column>
      <el-table-column prop="cartonSpecCode" label="箱规" width="120"></el-table-column>
      <el-table-column prop="numberOfCarton" label="装箱数" width="80"></el-table-column>

      <el-table-column prop="shippedCartonQty" label="发货数量(箱)" width="100"></el-table-column>
      <el-table-column prop="shippedQty" label="发货数量(件)" width="100"></el-table-column>

      <el-table-column prop="receivedNote" label="异常备注" width="130">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="异常备注" width="250" trigger="hover"
                      v-if="scope.row.receivedNote && scope.row.receivedNote.length > 10">
            <div v-html="scope.row.receivedNote"></div>
            <span slot="reference">{{ scope.row.receivedNote ? scope.row.receivedNote.substr(0,8)+'..' : '' }}</span>
          </el-popover>
          <span v-else>
            {{ scope.row.receivedNote }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="receivedCartonQty" label="收货数量(箱)" width="120" fixed="right"></el-table-column>
      <el-table-column prop="receivedQty" label="收货数量(件)" width="90" fixed="right"></el-table-column>

    </el-table>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'

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
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        //数据 TODO: 根据实际情况调整
        url: "/allocationReceivedItems", // 资源URL
        filters: [
          {
            field: "warehouseAllocationId",
            op: 'eq',
            data: this.primary ? this.primary.id : -1
          }
        ],   //搜索对象
        relations: ["product", "cartonSpec", "storageLocation"],  // 关联对象
        data: [], // 从后台加载的数据
        tableData: [],  // 前端表格显示的数据，本地搜索用
        // 表格加载效果
        loading: false,
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
        this.getList();
      })
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
      },


      /********************* 表格相关方法  ***************************/
      //报警样式 TODO:根据实际情况调整
      dangerClassName({row}) {
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

          if (column.property == 'shippedCartonQty' || column.property == 'receivedCartonQty') {
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

            this.data = data
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

      /********************* 搜索相关方法  ***************************/
      /*本地搜索*/
      search() {
        this.tableData = this.data;
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

