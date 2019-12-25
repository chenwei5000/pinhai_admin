<template>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {currency} from '@/utils'
  import moment from 'moment'

  export default {
    components: {},

    props: {},

    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),
    },
    filters: {},

    data() {
      return {
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,
        invoices: [], // 发票列表
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      })
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
      },

      /********************* 搜索相关方法  ***************************/
      // 添加发票
      addInvoice(invoice) {
        if (invoice) {
          let addFlg = true;
          this.invoices.forEach(r => {
            if (r.invoiceNumber == invoice.InvoiceCode + invoice.InvoiceNum) {
              addFlg = false;
            }
          });

          if (addFlg) {
            let details = [];
            for (var i = 0; i < invoice.CommodityName.length; i++) {
              details.push({
                name: invoice.CommodityName[i].word,
                model: invoice.CommodityType[i].word,
                unit: invoice.CommodityUnit[i].word,
                qty: invoice.CommodityNum[i].word,
                price: invoice.CommodityPrice[i].word,
                taxRate: invoice.CommodityTaxRate[i].word,
                tax: invoice.CommodityTax[i].word,
                amount: invoice.CommodityAmount[i].word,
              });
            }

            this.invoices.push({
              invoiceNo: invoice.InvoiceCode + invoice.InvoiceNum,
              invoiceDate: moment(invoice.InvoiceDate, "YYYY年MM月DD日").format("YYYY-MM-DD"),
              amount: invoice.AmountInFiguers,
              tax: invoice.TotalTax,
              seller: invoice.SellerName + ":" + invoice.SellerRegisterNum,
              buyer: invoice.PurchaserName + ":" + invoice.PurchaserRegisterNum,
              invoiceDetails: details
            });
          }
        }
      },

      /* 行删除功能 */
      onDefaultDelete(row) {
        this.$confirm('确认删除吗', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              let idx = null;

              this.data.forEach((item, index) => {
                  if (item.invoiceNumber === row.invoiceNumber) {
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

