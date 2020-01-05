<template>
  <div v-loading.fullscreen.lock="fullscreenLoading"
       class="main-article" element-loading-text="打印发货单">

    <div class="article__heading">
      <div class="article__heading__title">发货单{{primary.code}}</div>
    </div>
    <el-row style="margin-bottom: 10px">
      <el-col :span="12" style="text-align: left;padding-left: 5px;font-size: 12px;line-height: 150%;">
        发货单位：{{primary.supplier.name}}
      </el-col>
      <el-col :span="12" style="text-align: right;padding-left: 5px;font-size: 12px;line-height: 150%;">
        接收单位：品海科技 {{primary.warehouse.name}}
      </el-col>
    </el-row>

    <div class="ph-table">
      <el-table
        ref="table"
        style="width: 100%;color:#000;border: 1px solid #000;"
        border
        cell-class-name="ph-cell"
        header-cell-class-name="ph-cell-header"
        :data="items"
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>

        <el-table-column prop="product.skuCode" label="SKU" width="200">
        </el-table-column>

        <el-table-column prop="product.name" label="名称" width="166">
        </el-table-column>

        <el-table-column prop="product.name" label="规格型号" width="150">
          <template slot-scope="scope">
            {{scope.row.product.model}} , {{scope.row.product.color}}
          </template>
        </el-table-column>

        <el-table-column prop="cartonSpecCode" label="箱规" width="90">
          <template slot-scope="scope">
            {{scope.row.cartonSpec? scope.row.cartonSpec.length : ""}}
            *{{scope.row.cartonSpec? scope.row.cartonSpec.width : "" }}
            *{{scope.row.cartonSpec? scope.row.cartonSpec.height : ""}}
          </template>
        </el-table-column>

        <el-table-column prop="numberOfCarton" label="装箱数" width="80">
          <template slot-scope="scope">
            {{scope.row.numberOfCarton}}/箱
          </template>
        </el-table-column>

        <el-table-column prop="boxCode" label="箱码" width="80">
        </el-table-column>


        <el-table-column label="发货" align="center">

          <el-table-column
            prop="shippedQty"
            label="数量"
            width="60">
          </el-table-column>

          <el-table-column
            prop="shippedCartonQty"
            label="箱数"
            width="60">
          </el-table-column>

        </el-table-column>

        <el-table-column label="实发" align="center">
          <el-table-column
            label="数量"
            width="60">
          </el-table-column>

          <el-table-column
            label="箱数"
            width="60">
          </el-table-column>
        </el-table-column>
      </el-table>

      <table width="100%" border="0" align="center" cellpadding="2" cellspacing="0" style="margin-bottom: 20px;">
        <tbody>
        <tr height="100">
          <td align="center" width="90" style="border: 1px solid #000;border-top: 0;">说明</td>
          <td width="320" style="border: 1px solid #000;border-top: 0;">&nbsp;</td>
          <td align="center" width="90" style="border: 1px solid #000;border-top: 0;">检验结果</td>
          <td width="225" style="border: 1px solid #000;border-top: 0;">&nbsp;</td>
          <td align="center" width="120" style="border: 1px solid #000;border-top: 0;">经办人(签字)</td>
          <td width="195" style="border: 1px solid #000;border-top: 0;">&nbsp;</td>
        </tr>
        </tbody>
      </table>

    </div>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        primaryId: null,
        primary: {supplier: {name: ""}, warehouse: {name: ""}},
        items: [],
        fullscreenLoading: true,
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.primaryId = this.$route.query.id;
        this.initData();
      });

    },
    methods: {
      initData() {
        if (this.primaryId) {

          let _arr = [];

          //获取计划数据
          let url = `/procurementShippedOrders/${this.primaryId}`;
          url += "?relations=" + JSON.stringify(["supplier", "warehouse"]);


          _arr.push(this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data;
              this.primary = res || {};
            })
            .catch(err => {
            })
          );


          let itemsUrl = `procurementShippedOrderItems/`
          // 处理查询
          itemsUrl += "?filters=" + JSON.stringify({
            "groupOp": "AND", "rules": [
              {
                field: "procurementShippedOrderId",
                op: 'eq',
                data: this.primaryId ? this.primaryId : -1
              }
            ]
          });
          // 处理关联加载
          itemsUrl += "&relations=" + JSON.stringify(["product", "cartonSpec"]);
          //排序
          itemsUrl + "&sort=sortNum&dir=asc"

          //获取数据
          _arr.push(this.global.axios
            .get(itemsUrl)
            .then(resp => {
              let res = resp.data
              let data = res || []
              this.items = data;
            })
            .catch(err => {
            })
          );

          // 控制多个异步请求，保证所有请求全部完成
          Promise.all(_arr).then(obj => {
            this.fullscreenLoading = false;
            setTimeout(() => {
              window.print()
            }, 2000)
          });
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

          if (column.property == 'shippedQty' || column.property == 'shippedCartonQty') {
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
              sums[index] += ' ';
            } else {
              sums[index] = 'N/A';
            }
          }

        });

        return sums;
      },
    }
  }
</script>

<style lang="scss">
  @mixin clearfix {
  &:before {
    display: table;
    content: '';
    clear: both;
  }

  &:after {
     display: table;
     content: '';
     clear: both;
   }
  }

  .main-article {
    padding: 20px;
    margin: 0 auto;
    display: block;
    width: 1098px;
    background: #fff;
  }

  .article__heading {
    position: relative;
  }

  .article__heading__title {
    font-size: 26px;
    font-weight: normal;
    text-align: center;
    font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  .node-article-content {
    margin: 20px 0 0;
  @include clearfix;
    font-size: 16px;
    color: #333;
    letter-spacing: 0.5px;
    line-height: 28px;
    margin-bottom: 30px;
    font-family: medium-content-serif-font, Georgia, Cambria, "Times New Roman", Times, serif;

  &
  > :last-child {
    margin-bottom: 0;
  }

  b,
  strong {
    font-weight: inherit;
    font-weight: bolder;
  }

  img {
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }

  p {
    font-weight: 400;
    font-style: normal;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: -.003em;

  }

  ul {
    margin-bottom: 30px;
  }

  li {
    --x-height-multiplier: 0.375;
    --baseline-multiplier: 0.17;

    letter-spacing: .01rem;
    font-weight: 400;
    font-style: normal;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: -.003em;
    margin-left: 30px;
    margin-bottom: 14px;
  }

  a {
    text-decoration: none;
    background-repeat: repeat-x;
    background-image: linear-gradient(to right, rgba(0, 0, 0, .84) 100%, rgba(0, 0, 0, 0) 0);
    background-size: 1px 1px;
    background-position: 0 calc(1em + 1px);
    padding: 0 6px;
  }

  code {
    background: rgba(0, 0, 0, .05);
    padding: 3px 4px;
    margin: 0 2px;
    font-size: 16px;
    display: inline-block;
  }

  img {
    border: 0;
  }

  /* 解决 IE6-7 图片缩放锯齿问题 */
  img {
    -ms-interpolation-mode: bicubic;
  }

  blockquote {
    --x-height-multiplier: 0.375;
    --baseline-multiplier: 0.17;
    font-family: medium-content-serif-font, Georgia, Cambria, "Times New Roman", Times, serif;
    letter-spacing: .01rem;
    font-weight: 400;
    font-style: italic;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: -.003em;
    border-left: 3px solid rgba(0, 0, 0, .84);
    padding-left: 20px;
    margin-left: -23px;
    padding-bottom: 2px;
  }

  a {
    text-decoration: none;
  }

  h2,
  h3,
  h4 {
    font-size: 34px;
    line-height: 1.15;
    letter-spacing: -.015em;
    margin: 53px 0 0;
  }

  h4 {
    font-size: 26px;
  }

  }

  .el-table--border:after,
  .el-table--group:after,
  .el-table:before {
    background-color: #000;
  }

  .el-table--border,
  .el-table--group {
    border-color: #000;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #000;
  }

  .el-table--border th,
  .el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid #000;
  }

  .el-table--border td,
  .el-table--border th {
    border-right: 1px solid #000;
  }

  .el-table thead.is-group th {
    background-color: unset;
  }

  .el-table__footer-wrapper td {
    border-top: 1px solid #000;
  }

  .el-table__header-wrapper tbody td, .el-table__footer-wrapper tbody td {
    background-color: unset;
    color: #000;
  }
</style>
