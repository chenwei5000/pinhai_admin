<template>
  <div>

    <el-steps :active="stepsActive" finish-status="success" align-center simple>
      <el-step title="1.基本信息" icon="el-icon-reading"></el-step>
      <el-step title="2.明细信息" icon="el-icon-picture"></el-step>
      <el-step title="3.指派处理人" icon="el-icon-upload"></el-step>
      <el-step title="4.提交审核" icon="el-icon-edit"></el-step>
    </el-steps>

    <el-form :rules="rules" :model="newPlan" status-icon ref="createForm" label-position="right"
             label-width="180px">

      <fieldset class="panel-heading">
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="newPlan.categoryId"
                     filterable multiple placeholder="请选择分类,可多选">
            <el-option
              v-for="(item , idx)  in categorySelectOptions"
              :label="item.label"
              :value="item.value"
              :key="idx"
            ></el-option>
          </el-select>

        </el-form-item>

        <el-form-item label="交货截止日" prop="limitTime">
          <el-date-picker v-model="newPlan.limitTime" type="date" placeholder="交货截止日"></el-date-picker>

          <el-tooltip class="item" effect="light" content="本次采购必须在这个日期之前完成交货" placement="right">
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>

        </el-form-item>

        <el-form-item label="下单截止日" prop="executeTime">
          <el-date-picker v-model="newPlan.executeTime" type="date" placeholder="交货截止日"></el-date-picker>

          <el-tooltip class="item" effect="light" content="本次采购必须在这个日期之前向厂家签好采购合同" placement="right">
            <i class="el-icon-question">&nbsp;</i>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="备注" prop="note">
          <el-input type="textarea" v-model="newPlan.note"
                    maxlength="500"
                    rows="4"
                    show-word-limit></el-input>
        </el-form-item>

        <fieldset class="panel-heading">

          <legend class="panel-title">智能备货(按箱备货)
            <el-tooltip class="item" effect="light" placement="right">
              <div slot="content">
                智能备货是通过销量情况、各地库存情况自动推荐备货数量。需要选择以下对应的选项。<BR/>
                公式：((7日销量 x ️备货周数) - 亚马逊库存(含在途) - 国内库存 - 未完成采购计划数(根据选项处理)) ➗ 装箱数（自动四舍五入保证整箱）
              </div>
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>
          </legend>

          <el-form-item label="销售渠道" prop="merchantId">
            <el-select v-model="newPlan.merchantId"
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

          <el-form-item label="国内库存来源" prop="warehouseId">
            <el-select v-model="newPlan.warehouseId"
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

          <el-form-item label="非Vip备货周数" prop="safetyStockWeek">
            <el-select v-model="newPlan.safetyStockWeek"
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


          <el-form-item label="Vip1备货周数" prop="vip1SafetyStockWeek">
            <el-select v-model="newPlan.vip1SafetyStockWeek"
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

          <el-form-item label="Vip2备货周数" prop="vip2SafetyStockWeek">
            <el-select v-model="newPlan.vip2SafetyStockWeek"
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

          <el-form-item label="未完成采购计划处理方式" prop="handleMethod">
            <el-select v-model="newPlan.handleMethod"
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

        </fieldset>


      </fieldset>

      <el-row type="flex" justify="center">
        <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onCreatePlan">下一步
        </el-button>
      </el-row>

    </el-form>


  </div>


</template>

<script>
  import categoryModel from '@/api/category'
  import warehouseModel from '@/api/warehouse'
  import merchantModel from '@/api/merchant'
  import systemModel from '@/api/system'

  export default {

    components: {},

    props: {},

    computed: {},

    data() {
      return {
        //
        stepsActive: 0,
        confirmLoading: false,

        //选择框
        categorySelectOptions: [],
        warehouseSelectOptions: [],
        merchantSelectOptions: [],

        // 新对象
        newPlan: {
          id: null,
          categoryId: null,
          limitTime: null,
          executeTime: null,
          note: null,
          merchantId: null,
          warehouseId: null,
          handleMethod: null,
          safetyStockWeek: null,
          vip1SafetyStockWeek: null,
          vip2SafetyStockWeek: null,
        },
        rules: {
          categoryId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          limitTime: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          executeTime: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ]
        },
      }
    },

    created() {
    },

    mounted() {
      this.categorySelectOptions = categoryModel.getMineSelectOptions();
      this.merchantSelectOptions = merchantModel.getSelectOptions();
      this.warehouseSelectOptions = warehouseModel.getSelectDomesticOptions();
      //设置默认安全库存
      systemModel.getConfigInfos().then(data => {
        if (this.newPlan.safetyStockWeek == null) {
          this.newPlan.safetyStockWeek = data.safetyStockWeek;
        }
        if (this.newPlan.vip1SafetyStockWeek == null) {
          this.newPlan.vip1SafetyStockWeek = data.vip1SafetyStockWeek;
        }
        if (this.newPlan.vip2SafetyStockWeek == null) {
          this.newPlan.vip2SafetyStockWeek = data.vip2SafetyStockWeek;
        }
      });

      let flg = true;
      this.warehouseSelectOptions.forEach(obj => {
        if (obj.value == -99) {
          flg = false;
        }
      });

      if (flg) {
        this.warehouseSelectOptions.unshift({label: '供货商库存', value: -99})
      }
    },
    methods: {
      ///////////////产品///////////////////////
      onCreatePlan() {

        this.$refs.createForm.validate(valid => {
          if (!valid) return;

          this.confirmLoading = true

          // 新增逻辑
          let url = '/procurementPlans';
          let method = 'post'

          if (this.newPlan.id != null && this.newPlan.id > 0) {
            method = 'put'
            url += `/${this.newPlan.id}`
          }

          let postDate = JSON.parse(JSON.stringify(this.newPlan));
          postDate.warehouseId = postDate.warehouseId ? postDate.warehouseId.join(",") : "";
          this.global.axios[method](url, postDate)
            .then(resp => {
              console.log(resp);
              this.newPlan = resp.data;
              this.newPlan.warehouseId = resp.data.warehouseId ? resp.data.warehouseId.split(",") : "";

              let categoryId=[];//保存转换后的整型字符串

              this.newPlan.categoryId.forEach(item => {
                categoryId.push(item+"");
              });

              this.newPlan.categoryId = categoryId;

              this.$message({type: 'success', message: '操作成功'});
              this.confirmLoading = false;
              this.stepsActive = 1;
            })
            .catch(err => {
              this.confirmLoading = false;
            })
        })
      },

      //保存产品
      confirm() {
        this.$refs.createForm.validate(valid => {
          if (!valid) {
            this.$emit("callback", null);
            return false;
          }
          let data = this.newPlan;
          if (!data.id) {
            this.$message.error("无效的产品ID");
            this.$emit("callback", null);
            return false;
          }

          // 新增逻辑
          let url = '/products/' + data.id

          this.global.axios.put(url, data)
            .then(resp => {
              this.$message({type: 'success', message: '商品编辑成功'});
              let obj = resp.data;
              // 回传消息
              this.$emit("callback", {type: 'sure', data: obj});
            })
            .catch(err => {
              this.$emit("callback", null);
            })
        });
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

</style>

