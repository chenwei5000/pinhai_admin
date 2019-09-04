<template>
  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             class="ph-dialog"
             width="70%"
             top="10vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="ph-form">
      <!-- 编辑表单 TODO:-->
      <el-form :rules="rules" :model="editObject" status-icon inline
               ref="detailItem" label-position="right"
               label-width="120px"
               v-loading="loading"
      >
        <el-row>
          <el-col :md="10">
            <el-form-item label="编码" prop="code">
              <span style="font-size: 12px">{{editObject.code}}</span>
            </el-form-item>
          </el-col>

          <el-col :md="10">
            <el-form-item label="发货仓库" prop="fromWarehouseId">
              <el-select v-model="editObject.fromWarehouseId" style="width: 220px"
                         filterable placeholder="请选择发货仓库">
                <el-option
                  v-for="(item , idx)  in warehouseSelectOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="收货仓库" prop="toWarehouseId">
              <el-select v-model="editObject.toWarehouseId" style="width: 220px"
                         filterable placeholder="请选择收货仓库">
                <el-option
                  v-for="(item , idx)  in warehouseSelectOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="发货时间" prop="expectTime">
              <el-date-picker
                v-model="editObject.expectTime"
                format="yyyy-MM-dd"
                type="date"
                placeholder="发货时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="物流单号" prop="trackNumber">
              <el-input v-model="editObject.trackNumber"
                        show-word-limit
                        style="width: 220px" placeholder="请填写单号" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="物流公司" prop="channel">
              <el-input v-model="editObject.channel"
                        style="width: 220px" placeholder="请填写公司" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">
            <el-form-item label="车牌" prop="plateNumber">
              <el-input v-model="editObject.plateNumber"
                        show-word-limit
                        style="width: 220px" placeholder="请填写车牌" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="editObject.linkman"
                        style="width: 220px" placeholder="请填写联系人" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="24">
            <el-form-item label="联系电话" prop="tel">
              <el-input v-model="editObject.tel"
                        style="width: 220px" placeholder="请填写电话" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="24">
            <el-form-item label="备注" prop="note">
              <el-col :span="22">
                <el-input type="textarea" v-model="editObject.remark"
                          maxlength="500"
                          show-word-limit
                          rows="3"
                          cols="80"
                          show-word-limit></el-input>
              </el-col>

              <el-col :span="2">
                <el-tooltip class="item" effect="light" content="备注信息。支持换行！" placement="right">
                  <i class="el-icon-question">&nbsp;</i>
                </el-tooltip>
              </el-col>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave" :loading="confirmLoading">发 货</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>
  import warehouseModel from '@/api/warehouse'
  import validRules from '@/components/validRules'

  export default {
    components: {},
    props: {},
    computed: {
      dialogTitle() {
        return "国内调拨执行发货";
      },
    },

    data() {
      return {
        //Dialog 是否开启
        dialogVisible: false,
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        warehouseSelectOptions: [],

        //明细对象ID
        editObject: {},

        // 字段验证规则 TODO:
        rules: {
          fromWarehouseId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          toWarehouseId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          expectTime: [
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
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
        //转化仓库
        this.warehouseSelectOptions = warehouseModel.getSelectDomesticOptions();
        this.editObject.fromWarehouseId = this.editObject.fromWarehouseId + '';
        this.editObject.toWarehouseId = this.editObject.toWarehouseId + '';

      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog(primary) {
        this.editObject = primary;
        this.dialogVisible = true;
        this.initData();
      },

      closeDialog() {
        this.dialogVisible = false;
        this.loading = false;
        this.confirmLoading = false;
        this.editObject = {};
      },

      // 发货
      onSave() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }

          const loading = this.$loading({
            lock: true,
            text: '发货中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let url = `/warehouseAllocations/shippedOrder/${this.editObject.id}`;
          //转义字段
          let _object = JSON.parse(JSON.stringify(this.editObject));
          this.global.axios.put(url, _object)
            .then(resp => {
              this.$message.info("发货成功");
              loading.close();
              this.closeDialog();
              this.$emit("shippedCBEvent", resp.data);
            })
            .catch(err => {
              loading.close();
            })
        })
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

