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
      @cell-dblclick="handleDblclick"
      :default-sort="{prop: 'product.skuCode', order: 'ascending'}"
      id="table"
    >
      <!--el-table-column prop="sortNum" type="index" label="序号" width="50" fixed="left"></el-table-column-->
      <el-table-column prop="product.skuCode" label="SKU编码" width="200" fixed="left" align="center"></el-table-column>

      <el-table-column prop="product.imgUrl" label="图片" width="40" align="center">
        <template slot-scope="scope"  v-if="scope.row.product.imgUrl">
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
      <el-table-column prop="numberOfCarton" label="装箱数" width="120" align="center"></el-table-column>
      <el-table-column prop="cartonQty" label="计划箱数" width="100" align="center"></el-table-column>
      <el-table-column prop="qty" label="计划件数" width="100" align="center"></el-table-column>
      <el-table-column prop="shippedCartonQty" label="实发箱数" width="100" fixed="right" align="center"></el-table-column>
      <el-table-column prop="shippedQty" label="实发件数" width="100" fixed="right" align="center"></el-table-column>

      <el-table-column prop="shippedNote" label="备注" width="130" v-if="false">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="备注" width="250" trigger="hover"
                      v-if="scope.row.shippedNote && scope.row.shippedNote.length > 10">
            <div v-html="scope.row.shippedNote"></div>
            <span slot="reference">{{ scope.row.shippedNote ? scope.row.shippedNote.substr(0,8)+'..' : '' }}</span>
          </el-popover>
          <span v-else>
            {{ scope.row.receivedNote }}
          </span>
        </template>
      </el-table-column>

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

      handleDblclick(row, column, cell, event) {
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

          if (column.property == 'shippedCartonQty' ) {
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

