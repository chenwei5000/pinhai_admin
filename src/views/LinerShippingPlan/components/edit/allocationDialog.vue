<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title"
             class="ph-dialog"
             append-to-body
             v-if="dialogVisible"
             width="60%"
             top="20vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="ph-table">

      <!-- 编辑表单 TODO:-->
      <el-form :rules="rules" :model="primary" status-icon
               ref="detailItem" label-position="right"
               label-width="120px"
               inline-message
               v-if="initComplete"
               @submit.native.prevent
               v-loading="loading"
      >

        <el-row>
          <el-col :md="10">
            <el-form-item label="发船时间">
              <span style="font-size: 12px">{{primary.formatEtdTime}} - {{primary.code}}</span>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="品类">
              <span style="font-size: 12px">{{primary.categoryName}}</span>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :md="10">
            <el-form-item label="物流类型">
              <span style="font-size: 12px">{{primary.type}}</span>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="发货港口">
              <span style="font-size: 12px">{{primary.portOfLoading}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="FBA ID" prop="shipmentId">
              <el-input size="mini" v-model="primary.shipmentId" style="width: 150px"
                        placeholder="请输入FBA ID"></el-input>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="Reference ID" prop="referenceId">
              <el-input size="mini" v-model="primary.referenceId" style="width: 150px"
                        placeholder="请输入Reference ID"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="24">
            <el-form-item label="备注" prop="detail">
              <el-col :span="22">
                <el-input type="textarea" v-model="primary.detail"
                          maxlength="300"
                          show-word-limit
                          rows="3"
                          cols="80"
                          show-word-limit></el-input>
              </el-col>
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
        return '确认发货';
      }
    },

    data() {
      return {
        primary: {}, //主对象
        dialogVisible: false, //Dialog 是否开启
        loading: false,
        initComplete: false,
        confirmLoading: false,
        rules: {
          shipmentId: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          referenceId: [
            {required: true, message: "必填", trigger: "blur"}
          ]
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
        if (this.primary.id) {
          this.loading = true;
          let url = `/linerShippingPlans/${this.primary.id}`;
          this.global.axios.get(url)
            .then(data => {
              this.primary = data.data || {};
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
            })
        }
      },

      /* 开启弹出编辑框 需要传主键ID */
      openDialog(primary, details) {
        this.initComplete = false;
        this.primary = primary;
        this.initData();
        this.dialogVisible = true;
        this.initComplete = true;
      },
      closeDialog() {
        this.primary = {};
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
          let _object = this.primary;

          const loading = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          this.global.axios.put(`/exportAllocations/linerShippedOrder/${this.primary.id}`, _object)
            .then(resp => {
              this.$message.info("发货完成");
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

