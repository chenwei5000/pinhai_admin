<template>

  <!-- 编辑表单 TODO:-->
  <el-form :rules="rules" :model="editObject" status-icon inline
           ref="editObject" label-position="right"
           label-width="120px"
           v-loading="loading"
  >

    <el-row>
      <el-col :md="10">
        <el-form-item label="编码" prop="code">
          <el-input v-model="editObject.code" style="width: 220px" ></el-input>
        </el-form-item>
      </el-col>

    </el-row>

    <el-row>
      <el-col :md="14">
        <el-form-item label="供货商" prop="supplierId">
          <el-select v-model="editObject.supplierId" style="width: 220px">
            <el-option
              v-for="(item , idx)  in supplierSelectOptions"
              :label="item.label"
              :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>

        </el-form-item>
      </el-col>

      <el-col :md="14">
        <el-form-item label="收货仓库" prop="warehouseId">
          <el-select v-model="editObject.warehouseId" style="width: 220px">
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
      <el-col :md="14">
      <el-form-item label="预计到货时间" prop="expectTime">
        <el-date-picker
          v-model="editObject.expectTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="预计到货时间">
        </el-date-picker>
      </el-form-item>
    </el-col>
    </el-row>

    <el-row>
      <el-col :md="24">
        <el-form-item label="物流信息" prop="trackNumber">
          <el-col :span="22">
            <el-input type="textarea" v-model="editObject.trackNumber"
                      maxlength="500"
                      show-word-limit
                      rows="3"
                      cols="80"
                      show-word-limit></el-input>
          </el-col>

          <el-col :span="2">
            <el-tooltip class="item" effect="light" content="请根据要求填写物流信息！" placement="right">
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>
          </el-col>

        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="24">
        <el-form-item label="备注" prop="remark">
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

    <el-row>
      <el-col :md="24">
        <el-row type="flex" justify="center">
          <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onSave">
            保存基本信息
          </el-button>
        </el-row>
      </el-col>
    </el-row>

  </el-form>

</template>

<script>

  import warehouseModel from '@/api/warehouse'
  import systemModel from '@/api/system'
  import {intArrToStrArr} from '@/utils'
  import supplierModel from "../../../../api/supplier";

  export default {
    components: {},
    props: {
      primary: {
        type: [Object],
        default: {}
      }
    },
    computed: {},

    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 选择框 TODO:

        warehouseSelectOptions: [],
        supplierSelectOptions: [],


        // 编辑对象 TODO
        editObject: {
          id: null,
          code: null,
          warehouseId: null,
          supplierId: null,
          remark: null,
          trackNumber: null,
          expectTime: null
        },

        // 字段验证规则 TODO:
        rules: {
          limitTime: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          executeTime: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          categoryId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          merchantId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          warehouseId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          safetyStockWeek: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          vip1SafetyStockWeek: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          vip2SafetyStockWeek: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          handleMethod: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ]
        },
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },
    methods: {
      /********************* 基础方法  *****************************/
      /**
       * 初始化数据
       */
      initData() {
        this.loading = true;
        if (this.primary) {
          //获取计划数据
          this.editObject = this.primary;
          //转化时间
          this.editObject.limitTime = this.primary.formatLimitTime;
          this.editObject.executeTime = this.primary.formatExecuteTime;
          this.editObject.expectTime = this.primary.formatExpectTime;



          //转化仓库
          this.warehouseSelectOptions = warehouseModel.getSelectDomesticOptions();

          this.supplierSelectOptions = supplierModel.getSelectOptions();


          //设置默认安全库存
          systemModel.getConfigInfos().then(data => {
            if (this.editObject.safetyStockWeek == null) {
              this.editObject.safetyStockWeek = data.safetyStockWeek;
            }
            if (this.editObject.vip1SafetyStockWeek == null) {
              this.editObject.vip1SafetyStockWeek = data.vip1SafetyStockWeek;
            }
            if (this.editObject.vip2SafetyStockWeek == null) {
              this.editObject.vip2SafetyStockWeek = data.vip2SafetyStockWeek;
            }
          });

          let flg = true;
          this.warehouseSelectOptions.forEach(obj => {
            if (obj.value == "-99") {
              flg = false;
            }
          });

          if (flg) {
            this.warehouseSelectOptions.unshift({label: '供货商库存', value: "-99"})
          }
          this.loading = false;
        }
        else {
          this.$message.error("无效的采购计划!");
          this.loading = false;
        }
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 保存对象 */
      onSave() {
        this.$confirm('注意保存基本信息只会修改对应的参数，不会重新计算明细数据，您是否继续？', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              done();
              this.modifyObject();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },

      // 创建计划
      modifyObject() {
        let _object = JSON.parse(JSON.stringify(this.editObject));
        _object.warehouseId = _object.warehouseId ? _object.warehouseId.join(",") : "";
        this.loading = true;
        this.confirmLoading = true;

        this.global.axios.put(`/procurementReceivedOrders/${this.editObject.id}`, _object)
          .then(resp => {
            let _newObject = resp.data;
            this.$message({type: 'success', message: '操作成功'});
            this.loading = false;
            this.confirmLoading = false;
            // 回传消息
            this.formVisible = false;
            this.$emit("modifyCBEvent", _newObject);
          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
          })
      },
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .panel-heading {
    color: #444;
    border: 1px #cfd9db solid;
  }

  .panel-title {
    display: table-cell;
    vertical-align: middle;
    padding: 0 10px;
  }

  .el-form-item {
    //margin-bottom: 7px;
  }

</style>

