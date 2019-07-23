<template>
  <div>

    <el-steps :active="0" finish-status="success" align-center simple>
      <el-step title="基本信息" icon="el-icon-reading"></el-step>
      <el-step title="明细信息" icon="el-icon-picture"></el-step>
      <el-step title="指派处理人" icon="el-icon-upload"></el-step>
      <el-step title="提交审核" icon="el-icon-edit"></el-step>

    </el-steps>

    <el-form :rules="rules" :model="newPlan" status-icon ref="createForm" label-position="right" inline
             label-width="110px">

      <fieldset class="panel-heading">

        <el-row>
          <el-form-item label="分类" prop="categoryId">
            <el-select size="mini" v-model="newPlan.categoryId"
                       filterable multiple placeholder="请选择分类,可多选">
              <el-option
                v-for="(item , idx)  in categorySelectOptions"
                :label="item.label"
                :value="item.value"
                :key="idx"
              ></el-option>
            </el-select>

          </el-form-item>


        </el-row>

        <el-row>
          <el-form-item label="交货截止日" prop="limitTime">
            <el-date-picker size="mini" v-model="newPlan.limitTime" type="date" placeholder="交货截止日"></el-date-picker>
          </el-form-item>

          <el-form-item label="下单截止日" prop="executeTime">
            <el-date-picker size="mini" v-model="newPlan.executeTime" type="date" placeholder="交货截止日"></el-date-picker>
          </el-form-item>
        </el-row>


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

  export default {

    components: {},

    props: {},

    computed: {},

    data() {
      return {
        //选择框
        categorySelectOptions: [],

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

