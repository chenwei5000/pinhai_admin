<template>
  <div class="app-container">
    <div class="ph-card">
      <div class="ph-card-body">
        <el-form :inline="true" ref="searchForm" id="filter-form"
                 @submit.native.prevent>
          <el-form-item label="销售渠道">
            <el-select filterable v-model="merchantId" placeholder="请选择销售渠道">
              <el-option
                v-for="(item,idx) in merchantSelectOptions"
                :label="item.label" :value="item.value"
                :key="idx"
              ></el-option>

            </el-select>
          </el-form-item>

          <el-form-item label="分类">
            <el-select filterable v-model="categoryId" placeholder="请选择分类">
              <el-option
                v-for="(item,idx) in categorySelectOptions"
                :label="item.label" :value="item.value"
                :key="idx"
              ></el-option>

            </el-select>
          </el-form-item>

          <el-form-item label="周数">
            <el-select filterable v-model="week" placeholder="统计周数">
              <el-option
                v-for="(item,idx) in weekSelectOptions"
                :label="item.label" :value="item.value"
                :key="idx"
              ></el-option>

            </el-select>
          </el-form-item>
        </el-form>
        <el-table
          ref="table"
          style="width: 100%"
          stripe
          border
          highlight-current-row
          :max-height="tableMaxHeight"
          cell-class-name="ph-cell"
          header-cell-class-name="ph-cell-header"
          :data="tableData"
          v-loading="loading"
          id="table"
        >
          <el-table-column prop="id" label="ID" width="200" v-if="disabled"></el-table-column>
          <el-table-column prop="skuCode" label="SKU编码" width="200"></el-table-column>
          <el-table-column prop="productName" label="产品名" width="200"></el-table-column>
          <el-table-column prop="categoryName" label="分类" width="200"></el-table-column>
          <el-table-column prop="fnSku" label="FNSKU" width="200" v-if="disabled"></el-table-column>
          <el-table-column prop="groupName" label="产品款式" width="200" v-if="disabled"></el-table-column>
          <el-table-column prop="model" label="型号" width="200" v-if="disabled"></el-table-column>
          <el-table-column prop="color" label="颜色" width="200" v-if="disabled"></el-table-column>
          <el-table-column prop="size" label="尺码" width="200" v-if="disabled"></el-table-column>
          <el-table-column prop="vipLevel" label="vip等级" width="200"></el-table-column>
          <el-table-column prop="sevenAmendQty" label="7日销量修正" width="200"></el-table-column>
          <el-table-column prop="inStockQty" label="库存" width="200"></el-table-column>
          <el-table-column prop="onPassageQty" label="待入库" width="200"></el-table-column>
          <el-table-column prop="stockSoldOutTime" label="库售罄时间" width="200"></el-table-column>
          <el-table-column prop="allSoldOutTime" label="途售罄时间" width="200"></el-table-column>
          <el-table-column prop="containerSoldOutTime" label="途断货日期" width="200"></el-table-column>
          <el-table-column prop="containerSoldOutDay" label="途断货天数" width="200"></el-table-column>
          <el-table-column prop="containerSoldOutCartonQty" label="途缺口箱数" width="200"></el-table-column>
        </el-table>

      </div>
    </div>
  </div>
</template>

<script>

  import categoryModel from "../../api/category";
  import merchantModel from "../../api/merchant";

  export default {
    data() {
      return {
        tableMaxHeight: this.device !== 'mobile' ? 500 : 40000000,
        data: [],
        tableData: [],
        total: 0,
        loading: false,
        merchantSelectOptions: [],
        categorySelectOptions: [],
        weekSelectOptions: [],
        week: null,
        merchantId: null,
        categoryId: null,

        title: '途断货情况',
        url: '/amazonStocks/containerSoldOutDays',
        tableAttrs: {
          "row-class-name": this.statusClassName
        },
        //表格内容显示
        columns: [
          {
            width: 30,
            type: checkPermission('CountryResource_remove') ? 'selection' : '',
            hidden: !checkPermission('CountryResource_remove')
          },
          {prop: 'skuCode', label: 'SKU编码', sortable: 'custom', "min-width": 120, fixed: 'left'},
          {prop: 'productName', label: '产品名', "min-width": 120},
          {prop: 'categoryName', label: '分类', "min-width": 120},
          {prop: 'fnSku', label: 'FNSKU', "min-width": 120, hidden: 'false'},
          {prop: 'groupName', label: '产品款式', "min-width": 120, hidden: 'false'},
          {prop: 'model', label: '型号', "min-width": 120, hidden: 'false'},
          {prop: 'color', label: '颜色', "min-width": 120, hidden: 'false'},
          {prop: 'size', label: '尺码', "min-width": 120, hidden: 'false'},
          {prop: 'vipLevel', label: 'Vip级别', "min-width": 120},
          {prop: 'sevenAmendQty', label: '7日销量修正', "min-width": 120},
          {prop: 'inStockQty', label: '库存', "min-width": 120},
          {prop: 'onPassageQty', label: '待入库', "min-width": 120},
          {prop: 'stockSoldOutTime', label: '库售罄时间', "min-width": 120},
          {prop: 'allSoldOutTime', label: '途售罄时间', "min-width": 120},
          {prop: 'containerSoldOutTime', label: '途断货日期', "min-width": 120},
          {prop: 'containerSoldOutDay', label: '途断货天数', "min-width": 120},
          {prop: 'containerSoldOutCartonQty', label: '途缺口箱数', "min-width": 120},
        ],

        // 搜索区块定义
        searchForm: [
          phSearchItems.name,
          phSearchItems.status()
        ],
        //提交后执行
        afterConfirm: () => {
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },
    computed: {
      disabled: 'false'
    },
    methods: {
      initData() {
        this.categorySelectOptions = categoryModel.getMineSelectProdcutOptions();
        this.merchantSelectOptions = merchantModel.getSelectOptions();
        this.weekSelectOptions = [];
        for (let i = 1; i < 52; i++) {
          this.weekSelectOptions.push({
            label: `${i}周`,
            value: i
          })
        }
      },
      statusClassName({row}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      },

      getList() {
        this.setUrl();
        let url = this.url;
        if (!url) {
          console.warn('url 为空, 不发送请求')
          return
        }
        // 请求开始
        this.loading = true

        //获取数据
        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data
            let data = res || []

            this.data = data;
            this.search();
            console.log(this.tableData)
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
      search() {
        this.tableData = this.data;
      },

      setUrl() {
        if (this.merchantId != null) {
          this.url = `/amazonStocks/containerSoldOutDays/${this.merchantId}?cid=${this.categoryId ? this.categoryId : -1}&weekNum=${this.week ? this.week : ''}`;
        }
        else {
          this.url = null;
        }
      }
    },
    watch: {
      merchantId(n, o) {
        this.getList()
      },
      categoryId(n, o) {
        this.getList()
      },
      week(n, o) {
        this.getList()
      },
    }
  }
</script>

<style scoped>


</style>
