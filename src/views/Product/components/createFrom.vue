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
          <el-form-item label="新品" style="width: 400px" prop="newGoods">
            <el-radio-group v-model.number="newProduct.newGoods">
              <el-radio-button label="1">是</el-radio-button>
              <el-radio-button label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="SKU" style="width: 400px" prop="skuCode">
            <el-input v-model="newProduct.skuCode" placeholder="使用全英文,空格用-号代替。如：gym-104"
                      style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="名称" style="width: 400px" prop="name">
            <el-input v-model="newProduct.name" placeholder="请输入产品名称" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="分类" style="width: 400px" prop="categoryId">
            <el-col :span="20">
              <el-select filterable v-model="newProduct.categoryId + ''" placeholder="请选择分类,可筛选" style="width: 200px">
                <el-option
                  v-for="(item,idx) in categorySelectOptions"
                  :label="item.label" :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="openNewCategoryDialog" icon="el-icon-circle-plus"></el-button>
            </el-col>
          </el-form-item>

          <el-form-item label="款式" style="width: 400px">
            <el-input v-model="newProduct.groupName" placeholder="请输入产品款式" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="箱规" style="width: 400px" prop="cartonSpecId">
            <el-col :span="20">
              <el-select filterable v-model="newProduct.cartonSpecId+ ''" placeholder="外箱包装材料规格,可筛选"
                         style="width: 200px">
                <el-option
                  v-for="(item,idx) in cartonspecSelectOptions"
                  :label="item.label" :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="openNewCartonspecDialog" icon="el-icon-circle-plus"></el-button>
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
          <el-form-item label="供货商" style="width: 400px" prop="supplierId">
            <el-col :span="20">
              <el-select filterable v-model="newProduct.supplierId+ ''" placeholder="请选择供货商,可筛选" style="width: 200px">
                <el-option
                  v-for="(item,idx) in supplierSelectOptions"
                  :label="item.label" :value="item.value"
                  :key="idx"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="openNewSupplierDialog" icon="el-icon-circle-plus"></el-button>
            </el-col>
          </el-form-item>

          <el-form-item label="交期(天)" style="width: 400px">
            <el-input v-model="newProduct.leadDay" placeholder="请输入产品交期" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="结算货币" style="width: 400px" prop="currencyId">
            <el-select v-model="newProduct.currencyId+ ''" placeholder="请选择结算货币" style="width: 200px">
              <el-option
                v-for="(item,idx) in currencySelectOptions"
                :label="item.label" :value="item.value"
                :key="idx"
              ></el-option>
            </el-select>
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
            <el-select v-model="newProduct.vipLevel+ ''" placeholder="请输入产品Vip级别" style="width: 200px">
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

      <el-row type="flex" justify="center" v-if="isNew">
        <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onCreateProduct">立即创建
        </el-button>
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


  </div>


</template>

<script>
  import categoryDialog from '@/components/PhDialog/category'
  import cartonspecDialog from '@/components/PhDialog/cartonspec'
  import supplierDialog from '@/components/PhDialog/supplier'

  import categoryModel from '@/api/category'
  import cartonspecModel from '@/api/cartonspec'
  import supplierModel from '@/api/supplier'
  import currencyModel from '@/api/currency'

  export default {

    components: {},

    props: {
      init_data: {
        type: Object,
        default: null
      }
    },

    computed: {},

    data() {
      return {
        //选择框
        categorySelectOptions: [],
        cartonspecSelectOptions: [],
        supplierSelectOptions: [],
        currencySelectOptions: [],

        isNew: this.init_data ? false : true,

        confirmLoading: false,
        // 新产品对象
        newProduct: this.init_data ? this.init_data : {
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
          newGoods:0,
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
          grossWeight: [],
          supplierId: [],
          currencyId: [],
          price: []
        },
      }
    },
    created() {
      this.categorySelectOptions = categoryModel.getMineSelectProdcutOptions();
      this.cartonspecSelectOptions = cartonspecModel.getSelectOptions();
      this.supplierSelectOptions = supplierModel.getSelectOptions();
      this.currencySelectOptions = currencyModel.getSelectOptions();
    },

    mounted() {
    },
    methods: {
      ///////////////分类///////////////////////
      // 打开
      openNewCategoryDialog() {
        let option = {
          title: '添加分类',
          component: categoryDialog,
          _width_: '70%',
          callback: (category) => {
            this.categorySelectOptions.unshift({label: category.name, value: category.id + ''});
            this.newProduct.categoryId = category.id + '';
          }
        };
        common.dialog(option);
      },

      ///////////////箱规///////////////////////
      // 打开
      openNewCartonspecDialog(row = {}) {
        let option = {
          title: '添加箱规',
          component: cartonspecDialog,
          _width_: '70%',
          callback: (cartonSpec) => {
            //清除缓存
            this.cartonspecSelectOptions.unshift({label: cartonSpec.name, value: cartonSpec.id + ''});
            this.newProduct.cartonSpecId = cartonSpec.id + '';
          }
        };
        common.dialog(option);
      },

      ///////////////供货商///////////////////////
      // 打开
      openNewSupplierDialog(row = {}) {
        let option = {
          title: '添加供货商',
          component: supplierDialog,
          _width_: '70%',
          callback: (supplier) => {
            this.supplierSelectOptions.unshift({label: supplier.name, value: supplier.id + ''});
            this.newProduct.supplierId = supplier.id + '';
          }
        };
        common.dialog(option);
      },

      ///////////////产品///////////////////////
      onCreateProduct() {
        this.$refs.createForm.validate(valid => {
          if (!valid) return;

          // 新增逻辑
          let url = '/products'
          this.confirmLoading = true

          this.global.axios.post(url, this.newProduct)
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
          let data = this.newProduct;
          if(!data.id){
            this.$message.error("无效的产品ID");
            this.$emit("callback", null);
            return false;
          }

          // 新增逻辑
          let url = '/products/'+data.id

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

