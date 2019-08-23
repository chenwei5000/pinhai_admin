<template>
  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="80%"
             top="20px"
             :visible.sync="dialogVisible">

    <!-- 编辑表单 TODO:-->
    <el-form :rules="rules" :model="detailItem" status-icon inline
             ref="detailItem" label-position="right"
             label-width="120px"
             v-loading="loading"
    >

      <el-row>
        <el-col :md="10">
          <el-form-item label="序号" prop="sortNum">
            <el-input v-model="detailItem.sortNum" style="width: 220px" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="10">
          <el-form-item label="SKU编码" prop="skuCode">
            <el-input v-model="detailItem.skuCode" style="width: 220px" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :md="10">
          <el-form-item label="箱码" prop="boxCode">
            <el-input v-model="detailItem.boxCode" style="width: 220px" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="10">
          <el-form-item label="产品名" prop="productId">
            <el-input v-model="detailItem.productId" style="width: 320px" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :md="10">
          <el-form-item label="发货数量(箱)" prop="shippedCartonQty">
            <el-input v-model="detailItem.shippedCartonQty" style="width: 220px" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="10">
          <el-form-item label="存放货位" prop="storageLocationId" type="hidden">
            <el-input v-model="detailItem.storageLocationId" style="width: 220px" :disabled="true" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :md="10">
          <el-form-item label="总发货件数" prop="shippedQty">
            <el-input v-model="detailItem.shippedQty" style="width: 220px" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :md="10">
          <el-form-item label="收货数量" prop="receivedQty">
            <el-input v-model="detailItem.receivedQty" style="width: 220px" precision="2" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="10">
          <el-form-item label="异常备注" prop="receivedNote">
            <el-input type="textarea" v-model="detailItem.receivedNote"
                      maxlength="500"
                      show-word-limit
                      rows="3"
                      cols="80"
                      style="width: 320px"
                      show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="10">
          <el-form-item label="合计箱数" prop="receivedCartonQty">
            <el-input v-model="detailItem.receivedCartonQty" style="width: 220px" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </el-dialog>

</template>

<script>

  export default {
    components: {},
    props: {
      primaryId: {
        type: Number,
        default: null
      }
    },
    computed: {
      dialogTitle() {
        if (this.detailItemId == null) {
          return "添加采购入库明细";
        }
        else {
          return "采购入库明细";
        }
      }
    },

    data() {
      return {
        //Dialog 是否开启
        dialogVisible: false,
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 资源URL
        url: "/procurementReceivedOrderItems",
        relations: ["product", "cartonSpec", "procurementShippedOrder", "procurementOrderItem", "storageLocation"],  // 关联对象
        //明细对象ID
        detailItemId: null,
        //明细对象
        detailItem: {
          sortNum: null,
          skuCode: null,
          boxCode: null,
          shippedCartonQty: null,
          storageLocationId: null,
          shippedQty: null,
          receivedQty: null,
          receivedNote: null,
          receivedCartonQty: null,
          productId:  null

        },


        // 字段验证规则 TODO:
        rules: {}
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
      });
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        //获取数据
        // 箱规

        // 优先级

        // 明细数据
        if (this.detailItemId) {
          this.loading = true
          let url = `${this.url}/${this.detailItemId}`;
          if (this.relations && this.relations.length > 0) {
            url += "?relations=" + JSON.stringify(this.relations);
          }
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data
              let data = res || {}
              this.detailItem = data
              // 转字段
              this.detailItem=JSON.parse(JSON.stringify(this.detailItem));

              this.loading = false
            })
        }
        else {

        }
      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog2(detailItemId) {
        this.detailItemId = detailItemId;
        this.dialogVisible = true;
        this.initData();
      },

    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

