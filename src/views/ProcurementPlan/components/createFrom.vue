<template>
  <div>

    <el-steps :active="0" finish-status="success" align-center simple>
      <el-step title="基本信息" icon="el-icon-reading"></el-step>
      <el-step title="明细信息" icon="el-icon-picture"></el-step>
      <el-step title="指派处理人" icon="el-icon-upload"></el-step>
      <el-step title="提交审核" icon="el-icon-edit"></el-step>
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
        </el-form-item>

        <el-form-item label="下单截止日" prop="executeTime">
          <el-date-picker v-model="newPlan.executeTime" type="date" placeholder="交货截止日"></el-date-picker>
        </el-form-item>

        <el-form-item label="备注">
          <el-input type="textarea" v-model="newPlan.note"
                    maxlength="500"
                    textarea="4"
                    show-word-limit></el-input>
        </el-form-item>

        <fieldset class="panel-heading">
          <legend class="panel-title">智能备货</legend>

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
          </el-form-item>

          <el-form-item label="库存来源" prop="warehouseId">
            <el-select v-model="newPlan.warehouseId"
                       filterable multiple placeholder="请选择库存,可多选">
              <el-option
                v-for="(item , idx)  in warehouseSelectOptions"
                :label="item.label"
                :value="item.value"
                :key="idx"
              ></el-option>
            </el-select>
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
          </el-form-item>

          <el-form-item label="未完成采购计划处理方式" prop="exclude">
            <el-select v-model="newPlan.exclude"
                       filterable placeholder="请选择未完成采购计划处理方式">

              <el-option label="不考虑" value="0"></el-option>
              <el-option label="采购计划数量" value="1"></el-option>
              <el-option label="已下采购单数量" value="2"></el-option>
              <el-option label="已发货数量" value="3"></el-option>
              <el-option label="已收货数量" value="4"></el-option>

            </el-select>
          </el-form-item>

        </fieldset>


      </fieldset>

      <el-row type="flex" justify="center">
        <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onCreateProduct">下一步
        </el-button>
      </el-row>

    </el-form>


  </div>


</template>

<script>
  import categoryModel from '@/api/category'
  import warehouseModel from '@/api/warehouse'
  import merchantModel from '@/api/merchant'

  export default {

    components: {},

    props: {},

    computed: {},

    data() {
      return {
        //选择框
        categorySelectOptions: [],
        warehouseSelectOptions: [],
        merchantSelectOptions: [],

        confirmLoading: false,
        // 新产品对象
        newPlan: {
          status: 1,
          skuCode: null,
          groupName: null,
          fnSku: null,
          categoryId: '',
          name: null,
          model: null,
          color: null,
          comment: null,
          grossWeight: null,
          length: null,
          width: null,
          height: null,
          supplierId: '',
          price: null,
          cartonSpecId: '',
          numberOfCarton: null,
          currencyId: '',
          leadDay: null,
          vipLevel: 0,
          oversize: 0,
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
      onCreateProduct() {
        this.$refs.createForm.validate(valid => {
          if (!valid) return;

          // 新增逻辑
          let url = '/products'
          this.confirmLoading = true

          this.global.axios.post(url, this.newPlan)
            .then(resp => {
              this.$message({type: 'success', message: '产品添加成功'});
              this.$refs.createForm.resetFields();
              this.confirmLoading = false
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

