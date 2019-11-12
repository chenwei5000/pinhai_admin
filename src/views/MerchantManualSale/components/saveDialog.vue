<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title"
             class="ph-dialog"
             append-to-body
             v-if="dialogVisible"
             width="70%"
             top="20vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="ph-table">

      <!-- 编辑表单 TODO:-->
      <el-form :rules="rules" :model="details" status-icon
               ref="detailItem" label-position="right"
               label-width="120px"
               inline-message
               v-if="initComplete"
               @submit.native.prevent
               v-loading="loading"
      >
        <el-row>
          <el-col :md="10">
            <el-form-item label="SKU">
              <span style="font-size: 12px">{{details.skuCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="14">
            <el-form-item label="名称">
              <span style="font-size: 12px">{{details.productName}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="7日最小销量">
              <span style="font-size: 12px">{{details.minQty}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="14">
            <el-form-item label="7日最大销量">
              <span style="font-size: 12px">{{details.maxQty}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="7日平均销量">
              <span style="font-size: 12px">{{details.avgQty}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="14">
            <el-form-item label="7日推荐销量">
              <b style="font-size: 12px;color: blue">{{details.recommendQty}}</b>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="设置时间">
              <span style="font-size: 12px">{{details.formatLastModified}}</span>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="7日人工销量" prop="sevenSaleQty">
              <el-input-number v-model="details.sevenSaleQty"
                               size="mini"
                               style="width: 150px;margin: 3px 0;"
                               :precision="0"
                               :min="0"
                               :step="1"
                               :max="1000000" label="请设置7日人工销量">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>



      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave" size="mini" :loading="confirmLoading">确认</el-button>
      <el-button @click="closeDialog" size="mini">关 闭</el-button>
    </div>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {parseTime} from '@/utils'

  export default {
    components: {},
    props: {},
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),
      title() {
        return '设置7日销量';
      }
    },

    data() {
      return {
        primary: {}, //主对象
        details: {}, //明细对象
        dialogVisible: false, //Dialog 是否开启
        loading: false,
        initComplete: false,
        confirmLoading: false,
        rules: {
          sevenSaleQty: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
        },
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
      });
    },
    methods: {
      initData() {
      },

      /* 开启弹出编辑框 需要传主键ID */
      openDialog(details, primary) {
        this.initComplete = false;
        this.details = JSON.parse(JSON.stringify(details));
        this.primary = primary;
        this.initData();
        this.dialogVisible = true;
        this.initComplete = true;
      },
      closeDialog() {
        this.details = {};
        this.dialogVisible = false;
      },

      /* 子组件编辑完成后相应事件 */
      onPaymentCBEvent(object) {
        this.$emit("paymentCBEvent", object);
      },
      /* 打印合同 */
      onSave() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }
          let _object = {};
          _object.skuCode = this.details.skuCode;
          _object.sevenSaleQty = this.details.sevenSaleQty;
          _object.merchantId = this.primary.merchantId;

          const loading = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          this.global.axios.put(`/merchantManualSales/${this.primary.merchantId}`, _object)
            .then(resp => {
              this.$message.success("设置完成");
              loading.close();
              this.$emit("modifyCBEvent", resp.data);
              this.closeDialog();
            })
            .catch(err => {
              loading.close();
            })
        });
      },
      updateInput(val) {
        this.$forceUpdate();
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>
  .title {
    font-size: 14px;
    font-weight: bold;
  }

  .panel-heading {
    color: #444;
    border: 1px #cfd9db solid;
  }

  .panel-title {
    display: table-cell;
    vertical-align: middle;
    padding: 0 10px;
  }

</style>

