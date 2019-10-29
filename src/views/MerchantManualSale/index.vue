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
            <el-table-column prop="id" label="ID" width="200" v-if="disabled" ></el-table-column>
            <el-table-column prop="merchantId" label="渠道ID" width="200" v-if="disabled" ></el-table-column>
            <el-table-column prop="skuCode" label="SKU编码" width="200"></el-table-column>
            <el-table-column prop="productName" label="产品名" width="200"></el-table-column>
            <el-table-column prop="categoryName" label="分类" width="200"></el-table-column>
            <el-table-column prop="minQty" label="7日最小销量" width="200"></el-table-column>
            <el-table-column prop="maxQty" label="7日最大销量" width="200"></el-table-column>
            <el-table-column prop="avgQty" label="7日平均销量" width="200"></el-table-column>
            <el-table-column prop="recommendQty" label="7日推荐销量" width="200"></el-table-column>
            <el-table-column prop="sevenSaleQty" label="7日销量" width="200"></el-table-column>
            <el-table-column prop="finalSevenSaleQty" label="7日最终销量" width="200"></el-table-column>
            <el-table-column prop="formatLastModified" label="修改时间" width="200"></el-table-column>
            <el-table-column prop="expire" label="是否过期" width="200" ></el-table-column>
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
        data:[],
        tableData:[],
        total: 0,
        loading: false,
        merchantSelectOptions: [],
        categorySelectOptions: [],
        weekSelectOptions: [],
        week: null,
        merchantId: null,
        categoryId: null,

        title: '途断货情况',
        url: '/merchantManualSales/',
        tableAttrs: {
            "row-class-name": this.statusClassName
          },
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },
    computed: {
      disabled: false,
    },
    methods: {
      initData(){
        this.categorySelectOptions = categoryModel.getMineSelectProdcutOptions();
        this.merchantSelectOptions = merchantModel.getSelectOptions();
        this.weekSelectOptions = [];
        for (let i=1;i<52;i++){
          this.weekSelectOptions.push( {
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
        this.setUrl() ;
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

      setUrl(){
        if (this.merchantId !=null){
          this.url = `/merchantManualSales/${this.merchantId}?cid=${this.categoryId ? this.categoryId : -1}&weekNum=${this.week ? this.week : ''}`;
        }
        else{
          this.url = null;
        }
      }
    },
    watch: {
      merchantId(n,o){
        this.getList()
      },
      categoryId(n,o){
        this.getList()
      },
      week(n,o){
        this.getList()
      },
    }
  }
</script>

<style scoped>


</style>
