<template>

  <el-form :rules="rules" :model="editPlan" status-icon inline
           ref="editPlan" label-position="right"
           label-width="120px"
           v-loading="loading"
  >

    <el-row>
      <el-col :md="10">
        <el-form-item label="销售渠道" prop="merchantId">
          <el-select v-model="editPlan.merchantId" style="width: 220px"
                     filterable placeholder="请选择销售渠道">
            <el-option
              v-for="(item , idx)  in merchantSelectOptions"
              :label="item.label"
              :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>

          <el-tooltip class="item" effect="light" content="以选定的销售渠道（销售店铺）的销售情况为备货依据。" placement="right">
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </el-form-item>
      </el-col>

      <el-col :md="14">
        <el-form-item label="标签" prop="tags">
          <el-input v-model="editPlan.tags"
                    maxlength="20"
                    show-word-limit
                    style="width: 220px" placeholder="请填写标签" clearable></el-input>

          <el-tooltip class="item" effect="light" content="给计划打上一个标签方便查找" placement="right">
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :md="10">
        <el-form-item label="分类" prop="categoryId">

          <el-select v-model="editPlan.categoryId" style="width: 220px" filterable multiple placeholder="请选择分类,可多选">
            <el-option
              v-for="(item , idx)  in categorySelectOptions"
              :label="item.label"
              :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>

          <el-tooltip class="item" effect="light" content="选择需要备货的分类" placement="right">
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </el-form-item>
      </el-col>

      <el-col :md="14">
        <el-form-item label="国内库存" prop="warehouseId">
          <el-select v-model="editPlan.warehouseId" style="width: 220px"
                     filterable multiple placeholder="请选择库存,可多选">
            <el-option
              v-for="(item , idx)  in warehouseSelectOptions"
              :label="item.label"
              :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>

          <el-tooltip class="item" effect="light" content="以选定的仓库库存情况为当前库存依据。" placement="right">
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>

        </el-form-item>
      </el-col>
    </el-row>

    <el-col :md="10">
      <el-form-item label="下单截止日" prop="limitTime">
        <el-date-picker
          v-model="editPlan.limitTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="下单截止日"></el-date-picker>

        <el-tooltip class="item" effect="light" content="本次采购必须在这个日期之前完成交货" placement="right">
          <i class="el-icon-question">&nbsp;</i>
        </el-tooltip>

      </el-form-item>
    </el-col>

    <el-col :md="14">
      <el-form-item label="交货截止日" prop="executeTime">
        <el-date-picker
          v-model="editPlan.executeTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="交货截止日"></el-date-picker>

        <el-tooltip class="item" effect="light" content="本次采购必须在这个日期之前向厂家签好采购合同" placement="right">
          <i class="el-icon-question">&nbsp;</i>
        </el-tooltip>
      </el-form-item>
    </el-col>

    <el-col :md="10">
      <el-form-item label="非Vip备货周数" prop="safetyStockWeek">
        <el-select v-model="editPlan.safetyStockWeek" style="width: 220px"
                   filterable placeholder="请选择非Vip备货周数">
          <el-option
            v-for="week in 52"
            :label="week"
            :value="week"
            :key="week"
          ></el-option>
        </el-select>

        <el-tooltip class="item" effect="light" content="普通类型的产品，希望支持销售的周数。可在产品管理中查看产品类型。" placement="right">
          <i class="el-icon-question">&nbsp;</i>
        </el-tooltip>

      </el-form-item>
    </el-col>


    <el-col :md="14">
      <el-form-item label="Vip1备货周数" prop="vip1SafetyStockWeek">
        <el-select v-model="editPlan.vip1SafetyStockWeek" style="width: 220px"
                   filterable placeholder="请选择Vip1备货周数">
          <el-option
            v-for="week in 52"
            :label="week"
            :value="week"
            :key="week"
          ></el-option>
        </el-select>

        <el-tooltip class="item" effect="light" content="热卖类型的产品，希望支持销售的周数。可在产品管理中查看产品类型。" placement="right">
          <i class="el-icon-question">&nbsp;</i>
        </el-tooltip>

      </el-form-item>
    </el-col>

    <el-col :md="10">
      <el-form-item label="Vip2备货周数" prop="vip2SafetyStockWeek">
        <el-select v-model="editPlan.vip2SafetyStockWeek" style="width: 220px"
                   filterable placeholder="请选择Vip2备货周数">
          <el-option
            v-for="week in 52"
            :label="week"
            :value="week"
            :key="week"
          ></el-option>
        </el-select>

        <el-tooltip class="item" effect="light" content="爆款类型的产品，希望支持销售的周数。可在产品管理中查看产品类型。" placement="right">
          <i class="el-icon-question">&nbsp;</i>
        </el-tooltip>

      </el-form-item>
    </el-col>

    <el-col :md="14">
      <el-form-item label="未完成采购计划处理方式" prop="handleMethod">
        <el-select v-model="editPlan.handleMethod" style="width: 220px"
                   filterable placeholder="请选择未完成采购计划处理方式">

          <el-option label="不考虑" value="0"></el-option>
          <el-option label="采购计划数量" value="1"></el-option>
          <el-option label="已下采购单数量" value="2"></el-option>
          <el-option label="已发货数量" value="3"></el-option>
          <el-option label="已收货数量" value="4"></el-option>

        </el-select>

        <el-tooltip class="item" effect="light" placement="right">
          <div slot="content">对当前没有结束的其它采购计划的处理方式。<BR/>
            例如：选择已发货数量。表示最终需要减去没有完成采购计划中，已经发货的数量。<BR/>
            具体各种状态数量可以在采购计划中查看。
          </div>
          <i class="el-icon-question">&nbsp;</i>
        </el-tooltip>

      </el-form-item>
    </el-col>

    <el-col :md="24">
      <el-form-item label="备注" prop="note">
        <el-col :span="22">
          <el-input type="textarea" v-model="editPlan.note"
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

    <el-col :md="24">
      <el-row type="flex" justify="center">
        <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onSavePlan">
          保存基本信息
        </el-button>
      </el-row>
    </el-col>

  </el-form>

</template>

<script>

  import categoryModel from '@/api/category'
  import warehouseModel from '@/api/warehouse'
  import merchantModel from '@/api/merchant'
  import systemModel from '@/api/system'
  import {intArrToStrArr} from '@/utils'

  export default {
    components: {},
    props: {
      planId: {
        type: Number,
        default: null
      }
    },
    computed: {},

    data() {
      return {
        loading: false,
        confirmLoading: false,

        //选择框
        categorySelectOptions: [],
        warehouseSelectOptions: [],
        merchantSelectOptions: [],

        // 新对象
        editPlan: {
          id: null,
          categoryId: null,
          limitTime: null,
          executeTime: null,
          tags: null,
          note: null,
          merchantId: null,
          warehouseId: null,
          handleMethod: "3",
          safetyStockWeek: null,
          vip1SafetyStockWeek: null,
          vip2SafetyStockWeek: null,
        },

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
      /**
       * 初始化数据
       */
      initData() {
        this.loading = true;
        if (this.planId) {
          //获取计划数据
          this.global.axios
            .get(`/procurementPlans/${this.planId}`)
            .then(resp => {
              let res = resp.data
              this.editPlan = res || {}
              this.editPlan = resp.data;
              //转化时间
              this.editPlan.limitTime = resp.data.formatLimitTime;
              this.editPlan.executeTime = resp.data.formatExecuteTime;
              //转化分类
              this.editPlan.categoryId = intArrToStrArr(resp.data.categoryId);
              //转化仓库
              this.editPlan.warehouseId = resp.data.warehouseId ? intArrToStrArr(resp.data.warehouseId.split(",")) : [];
              this.editPlan.handleMethod = resp.data.handleMethod + '';
              this.$emit('update', this.editPlan, res)
            })
            .catch(err => {
              this.$emit('error', err)
            })

          this.categorySelectOptions = categoryModel.getMineSelectOptions();
          this.merchantSelectOptions = merchantModel.getSelectOptions();
          this.warehouseSelectOptions = warehouseModel.getSelectDomesticOptions();

          //设置默认安全库存
          systemModel.getConfigInfos().then(data => {
            if (this.editPlan.safetyStockWeek == null) {
              this.editPlan.safetyStockWeek = data.safetyStockWeek;
            }
            if (this.editPlan.vip1SafetyStockWeek == null) {
              this.editPlan.vip1SafetyStockWeek = data.vip1SafetyStockWeek;
            }
            if (this.editPlan.vip2SafetyStockWeek == null) {
              this.editPlan.vip2SafetyStockWeek = data.vip2SafetyStockWeek;
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
      onSavePlan() {
        this.$confirm('注意保存基本信息只会修改对应的参数不会重新计算明细数据，您是否继续？', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              done();
              this.modifyPlan();
            } else done()
          }
        }).catch(er => {
          /*取消*/
        })
      },

      // 创建计划
      modifyPlan() {
        let _plan = JSON.parse(JSON.stringify(this.editPlan));
        _plan.warehouseId = _plan.warehouseId ? _plan.warehouseId.join(",") : "";
        this.loading = true;
        this.confirmLoading = true;

        this.global.axios.put(`/procurementPlans/${this.editPlan.id}`, _plan)
          .then(resp => {
            let _newPlan = resp.data;
            this.$message({type: 'success', message: '操作成功'});
            this.loading = false;
            this.confirmLoading = false;
            // 回传消息
            this.formVisible = false;
            this.$emit("modifyCBEvent", _newPlan);
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

