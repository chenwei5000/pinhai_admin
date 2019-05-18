<template>
  <div>

    <el-form :rules="rules" :model="newProduct" status-icon ref="createForm" label-position="right" inline
             label-width="90px">

      <fieldset class="panel-heading">
        <legend class="panel-title">基本信息</legend>

        <el-row>
          <el-form-item label="状态" style="width: 400px" prop="status">
            <el-radio-group v-model.number="newProduct.status">
              <el-radio-button label="1">开启</el-radio-button>
              <el-radio-button label="0">关闭</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="超大" style="width: 400px" prop="oversize">
            <el-radio-group v-model.number="newProduct.oversize">
              <el-radio-button label="1">开启</el-radio-button>
              <el-radio-button label="0">关闭</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="SKU" style="width: 400px" prop="skuCode">
            <el-input v-model="newProduct.skuCode" placeholder="请输入产品SKU" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="名称" style="width: 400px" prop="name">
            <el-input v-model="newProduct.name" placeholder="请输入产品名称" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="分类" style="width: 400px" prop="categoryId">
            <el-col :span="20">
              <el-select filterable v-model="newProduct.categoryId" placeholder="请选择分类" style="width: 200px">
                <el-option
                  v-for="(item,idx) in categorySelectOptions"
                  :label="item.label" :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="onCategoryNew" icon="el-icon-circle-plus"></el-button>
            </el-col>
          </el-form-item>

          <el-form-item label="款式" style="width: 400px">
            <el-input v-model="newProduct.groupName" placeholder="请输入产品款式" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="箱规" style="width: 400px" prop="cartonSpecId">
            <el-col :span="20">
              <el-select filterable v-model="newProduct.cartonSpecId" placeholder="包装材料规格" style="width: 200px">
                <el-option
                  v-for="(item,idx) in cartonspecSelectOptions"
                  :label="item.label" :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" icon="el-icon-circle-plus"></el-button>
            </el-col>
          </el-form-item>

          <el-form-item label="装箱数" style="width: 400px" prop="numberOfCarton">
            <el-input v-model="newProduct.numberOfCarton" placeholder="一箱有多少个产品" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="型号" style="width: 400px">
            <el-input v-model="newProduct.model" placeholder="请输入产品型号" style="width: 300px"></el-input>
          </el-form-item>

          <el-form-item label="颜色" style="width: 400px">
            <el-input v-model="newProduct.color" placeholder="请输入产品颜色" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="净重(Kg)" style="width: 400px" prop="grossWeight">
            <el-input v-model="newProduct.grossWeight" placeholder="单个商品的净重(不包括外箱重量)" style="width: 300px"></el-input>
          </el-form-item>

          <el-form-item label="体积(Cm³ )" style="width: 500px">
            <el-col :span="6">
              <el-input v-model="newProduct.length" placeholder="长(Cm)" style="width: 90px"></el-input>
            </el-col>
            <el-col :span="3"> x</el-col>
            <el-col :span="6">
              <el-input v-model="newProduct.width" placeholder="宽(Cm)" style="width: 90px"></el-input>
            </el-col>
            <el-col :span="3"> x</el-col>
            <el-col :span="6">
              <el-input v-model="newProduct.height" placeholder="高(Cm)" style="width: 90px"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
      </fieldset>

      <fieldset class="panel-heading" style="margin-top: 10px">
        <legend class="panel-title">采购信息</legend>
        <el-row>
          <el-form-item filterable label="供货商" style="width: 400px" prop="supplierId">
            <el-col :span="20">
              <el-select v-model="newProduct.supplierId" placeholder="请选择供货商" style="width: 200px">
                <el-option
                  v-for="(item,idx) in supplierSelectOptions"
                  :label="item.label" :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" icon="el-icon-circle-plus"></el-button>
            </el-col>
          </el-form-item>

          <el-form-item label="交期(天)" style="width: 400px">
            <el-input v-model="newProduct.leadDay" placeholder="请输入产品交期" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="结算货币" style="width: 400px" prop="currencyId">
            <el-col :span="20">
              <el-select v-model="newProduct.currencyId" placeholder="请选择结算货币" style="width: 200px">
                <el-option
                  v-for="(item,idx) in currencySelectOptions"
                  :label="item.label" :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" icon="el-icon-circle-plus"></el-button>
            </el-col>
          </el-form-item>

          <el-form-item label="采购价" style="width: 400px" prop="price">
            <el-input v-model="newProduct.price" placeholder="请输入产品采购价格" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>
      </fieldset>

      <fieldset class="panel-heading" style="margin-top: 10px">
        <legend class="panel-title">销售信息</legend>
        <el-row>
          <el-form-item label="FNSKU" style="width: 400px">
            <el-input v-model="newProduct.fnSku" placeholder="请输入产品FNSKU" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="Vip级别" style="width: 400px">
            <el-select v-model="newProduct.vipLevel" placeholder="请输入产品Vip级别" style="width: 200px">
              <el-option
                v-for="(item,idx) in currencySelectOptions"
                :label="item.label" :value="item.value"
                :key="idx"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>

        </el-row>
      </fieldset>

      <fieldset class="panel-heading" style="margin-top: 10px">
        <legend class="panel-title">备注</legend>
        <el-form-item style="width: 400px">
          <el-input v-model="newProduct.comment" style="width: 400px" type="textarea"
                    :autosize="{minRows: 6, maxRows: 10}"></el-input>
        </el-form-item>
      </fieldset>

      <el-row type="flex" justify="center">
        <el-button type="primary" style="margin-top: 15px" @click="submitForm">立即创建</el-button>
      </el-row>

    </el-form>

    <!--div style="height: 300px;position: fixed;right: 10px;top: 80px;">
      <el-steps direction="vertical" :active="1">
        <el-step title="基本信息"></el-step>
        <el-step title="采购信息"></el-step>
        <el-step title="销售信息"></el-step>
        <el-step title="备注"></el-step>
      </el-steps>
    </div-->

    <!--添加分类-->
    <el-dialog title="添加分类" :visible.sync="categoryDialogVisible">
      <el-scrollbar class="menu-wrapper" noresize>
        <el-row>
          <el-col :span="22">
            <ph-form :content="categoryForm" ref="categoryForm" v-bind="formAttrs">
            </ph-form>
          </el-col>
        </el-row>
      </el-scrollbar>

      <div slot="footer">
        <el-button @click="cancelCategory" size="small">取 消</el-button>
        <el-button type="primary" @click="createCategory" :loading="createCategoryLoading" size="small">确 定</el-button>
      </div>

    </el-dialog>

  </div>


</template>

<script>
  import categoryModel from '@/api/category'
  import cartonspecModel from '@/api/cartonspec'
  import supplierModel from '@/api/supplier'
  import currencyModel from '@/api/currency'
  import userModel from '@/api/user'
  import validRules from '@/components/validRules'

  export default {
    props: {},

    computed: {},

    data() {
      return {
        categoryDialogVisible: false,
        createCategoryLoading: false,
        categoryForm: [
          {
            $type: 'input',
            $id: 'name',
            label: '分类名称',
            $el: {},
            rules: [
              validRules.required
            ]
          },
          {
            $type: 'select',
            $id: 'userId',
            label: '采购负责人',
            $el: {filterable: true},
            $options: userModel.getSelectOptions(),
            rules: [
              validRules.required
            ]
          }
        ],
        formAttrs: {
          "label-width": "100px",
          "label-suffix": ":",
          "status-icon": true,
          size: "small"
        },
        categorySelectOptions: [],
        cartonspecSelectOptions: [],
        supplierSelectOptions: [],
        currencySelectOptions: [],
        newProduct: {
          status: 1,
          skuCode: null,
          groupName: null,
          fnSku: null,
          categoryId: null,
          name: null,
          model: null,
          color: null,
          comment: null,
          grossWeight: null,
          length: null,
          width: null,
          height: null,
          supplierId: null,
          price: null,
          cartonSpecId: null,
          numberOfCarton: null,
          currencyId: null,
          leadDay: null,
          vipLevel: null,
          oversize: 0,
        },
        rules: {
          status: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          skuCode: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          categoryId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          cartonSpecId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          numberOfCarton: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          grossWeight: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          supplierId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          currencyId: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '必须输入', trigger: 'blur'}
          ]
        },
      }
    },
    created() {
      this.categorySelectOptions = categoryModel.getMineSelectOptions();
      this.cartonspecSelectOptions = cartonspecModel.getSelectOptions();
      this.supplierSelectOptions = supplierModel.getSelectOptions();
      this.currencySelectOptions = currencyModel.getSelectOptions();
    },

    mounted() {
    },
    methods: {
      cancelCategory() {
        this.$refs.categoryForm.resetFields();
        this.categoryDialogVisible = false
      },
      onCategoryNew(row = {}) {
        this.row = row
        this.isNew = true
        this.categoryDialogVisible = true
      },


      submitForm() {
        this.$refs.createForm.validate(valid => {
          alert(valid);
          if (!valid) return;
        })
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

</style>

