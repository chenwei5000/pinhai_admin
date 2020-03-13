<template>

  <div class="ph-form">
    <!-- 编辑表单 TODO:-->
    <el-form :rules="rules" :model="editObject" status-icon inline
             ref="editObject"
             label-position="right"
             label-width="120px"
             v-loading="loading"
             inline-message
    >


      <fieldset class="panel-heading">
        <legend class="panel-title">交货要求
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              销售对采购计划的要求
            </div>
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </legend>

        <el-row v-html="primary.procurementPlan.formatNote" v-if="primary.procurementPlan.note">
        </el-row>
        <el-row v-else>
          无
        </el-row>
      </fieldset>

      <fieldset class="panel-heading" style="margin-top: 15px">
        <legend class="panel-title">采购单信息
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              采购单相关信息
            </div>
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </legend>

        <el-row>
          <el-col :md="8">
            <el-form-item label="供货商" prop="supplierId">
              <span style="font-size: 12px">{{editObject.supplier.name}}</span>
            </el-form-item>
          </el-col>

          <el-col :md="8">
            <el-form-item label="购买方" prop="companyId">
              <el-select v-model="editObject.companyId" size="mini"
                         filterable placeholder="请选择供货商">
                <el-option
                  v-for="(item , idx) in companySelectOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="产品供货商，从哪个厂商采购。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="8">
            <el-form-item label="收货仓库" prop="warehouseId">
              <el-select v-model="editObject.warehouseId" size="mini"
                         filterable placeholder="请选择收货仓库">
                <el-option
                  v-for="(item , idx) in warehouseSelectOptions"
                  :label="item.name"
                  :value="item.id"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="采购的商品接收的仓库" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :md="8">
            <el-form-item label="结算方式" prop="settlementMethod">
              <el-select v-model="editObject.settlementMethod" size="mini"
                         filterable placeholder="请选择结算方式">
                <el-option
                  v-for="(item , idx)  in settlementMethodSelectOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="采购单的结算方式。货到付款方式不用走预付款流程。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="8">
            <el-form-item label="结算货币" prop="currencyId">
              <el-select v-model="editObject.currencyId" size="mini"
                         filterable placeholder="请选择结算货币">
                <el-option
                  v-for="(item , idx)  in currencySelectOptions"
                  :label="item.name"
                  :value="item.id"
                  :key="idx"
                ></el-option>
              </el-select>

              <el-tooltip class="item" effect="light" content="使用什么货币跟供货商进行结算。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="8">
            <el-form-item label="帐期" prop="accountPeriod">
              <el-input-number v-model="editObject.accountPeriod" size="mini"
                               style="width: 155px"
                               :min="1"
                               :step="1"
                               :max="365" label="帐期">
              </el-input-number>
              天
              <el-tooltip class="item" effect="light" content="生产商、批发商向零售商供货后，直至零售商付款的这段时间周期" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="8">
            <el-form-item label="期望交货日期" prop="otdTime">
              <el-date-picker
                v-model="editObject.otdTime"
                type="date"
                size="mini"
                style="width: 175px"
                placeholder="选择日期">
              </el-date-picker>

              <el-tooltip class="item" effect="light" content="采购单预计在该日期前完成" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model.trim="editObject.name" size="mini"
                        maxlength="200"
                        show-word-limit
                        style="width: 300px" placeholder="请填写名称" clearable></el-input>

              <el-tooltip class="item" effect="light" content="采购单名称默认使用计划名称" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

      </fieldset>

      <el-row>
        <el-col :md="24">
          <el-row type="flex" justify="center">
            <el-button v-if="hasEdit" type="primary" style="margin-top: 15px" size="mini" :loading="confirmLoading"
                       @click="onSave">
              保存基本信息
            </el-button>
          </el-row>
        </el-col>
      </el-row>

    </el-form>
  </div>

</template>

<script>

  import {intArrToStrArr} from '@/utils'
  import phEnumModel from '@/api/phEnum'
  import currencyModel from '@/api/currency'
  import {checkPermission} from "../../../../utils/permission";
  import companyManagementModel from "../../../../api/companyManagement";

  export default {
    components: {},
    props: {
      primary: {
        type: [Object],
        default: {}
      }
    },
    computed: {
      hasEdit() {
        // 控制按钮
        if ([0, 8].indexOf(this.primary.status) > -1) {
          return false;
        }
        if (!checkPermission('ProcurementOrderResource_update')) {
          return false;
        }
        return true;
      },
      hasCategory() {
        if (this.editObject.categoryId == null || this.editObject.categoryId.length == 0) {
          return true;
        }
        else {
          return false;
        }
      }
    },

    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        // 选择框 TODO:
        warehouseSelectOptions: [],
        settlementMethodSelectOptions: [],
        currencySelectOptions: [],
        companySelectOptions: [],
        selCurrency: {},

        // 编辑对象 TODO
        editObject: {
          id: null,
          supplierId: null,
          warehouseId: null,
          settlementMethod: null,
          currencyId: null,
          accountPeriod: null,
          supplier: {name: ""},
        },

        // 字段验证规则 TODO:
        rules: {
          supplierId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          companyId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          warehouseId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          settlementMethod: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          currencyId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          accountPeriod: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          otdTime: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
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
          this.editObject = JSON.parse(JSON.stringify(this.primary));

          // 转化数据
          this.editObject.settlementMethod = this.editObject.settlementMethod + '';
          this.editObject.companyId = this.editObject.companyId == null ? null : this.editObject.companyId + '';

          // 付款方式
          this.settlementMethodSelectOptions = phEnumModel.getSelectOptions('SettlementMethod');
          // 购买方
          this.companySelectOptions = companyManagementModel.getSelectSelfOptions();

          this.initCurrencData();
          this.initWarehouseData();

          this.loading = false;
        }
        else {
          this.$message.error("无效的采购计划!");
          this.loading = false;
        }
      },

      // 初始化仓库数据
      initWarehouseData() {
        this.loading = true;
        let url = "/warehouses";
        let filters = [
          {"field": "status", "op": "eq", "data": "1"},
          {"field": "type", "op": "in", "data": "普通,原料仓,工厂仓,虚拟仓"}
        ];
        url += "?filters=" + JSON.stringify({"groupOp": "AND", "rules": filters});

        this.global.axios.get(url)
          .then(resp => {
            let res = resp.data || [];
            this.warehouseSelectOptions = [];
            res.forEach(r => {
              this.warehouseSelectOptions.push(r);
            });
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
      },

      // 初始化货币数据
      initCurrencData() {
        this.loading = true;
        currencyModel.getCurrencies()
          .then(resp => {
            let res = resp || [];
            this.currencySelectOptions = [];
            res.forEach(r => {
              this.currencySelectOptions.push(r);
            });
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
      },

      /********************* 操作按钮相关方法  ***************************/
      /* 保存对象 */
      onSave() {
        this.$refs.editObject.validate(valid => {
          if (!valid) {
            return;
          }
          this.$confirm('注意保存基本信息只会修改对应的参数，您是否继续？', '提示', {
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
        })
      },

      // 修改采购单
      modifyObject() {
        let _object = JSON.parse(JSON.stringify(this.editObject));

        const loading = this.$loading({
          lock: true,
          text: '保存中..',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.global.axios.put(`/procurementOrders/${this.editObject.id}`, _object)
          .then(resp => {
            let _newObject = resp.data;
            this.$message({type: 'success', message: '操作成功'});
            loading.close();
            // 回传消息
            this.$emit("modifyCBEvent", _newObject);
          })
          .catch(err => {
            loading.close();
          })
      },

      /**
       * 分类发生修改
       */
      onCateChange(val) {
        this.initGroupData(val);
        this.initWarehouseData(val);
      }
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

