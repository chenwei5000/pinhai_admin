<template>

  <el-dialog title="添加箱规" :visible.sync="dialogVisible">
    <el-scrollbar class="menu-wrapper" noresize>
      <el-row>
        <el-col :span="22">
          <!--https://github.com/FEMessage/onDefaultEdit-->
          <ph-form :content="form" ref="dialogForm" v-bind="formAttrs">
          </ph-form>
        </el-col>
      </el-row>
    </el-scrollbar>

    <div slot="footer">
      <el-button @click="cancel" size="small">取 消</el-button>
      <el-button type="primary" @click="confirm" :loading="confirmLoading" size="small">确 定</el-button>
    </div>

  </el-dialog>

</template>

<script>
  import phFormItems from '@/components/phFromItems'
  import validRules from '@/components/validRules'
  import categoryModel from '@/api/category'

  export default {
    name: 'CartonspecDialog',
    components: {},
    props: {},
    data() {
      return {
        dialogVisible: false,
        confirmLoading: false,

        // 弹窗表单默认样式
        formAttrs: {
          "label-width": "100px",
          "label-suffix": ":",
          "status-icon": true,
          size: "small"
        },
        //添加或修改弹出框
        form: [
          {
            $type: 'select',
            $id: 'groupCode',
            label: '分类',
            $el: {
              filterable: true,
              placeholder: '请选择分类,可筛选'
            },
            $options: categoryModel.getMineSelectNameOptions('p'),
            rules: [
              validRules.required
            ]
          },
          phFormItems.code,
          {
            $type: 'input',
            $id: 'numberOfPallets',
            label: '托盘放置数',
            $el: {
              placeholder: '一个托盘上可以放置该箱规的最大箱数, 如：24'
            },
            rules: [
              validRules.required,
              validRules.number
            ]
          },
          {
            $type: 'input',
            $id: 'length',
            label: '长(Cm)',
            $el: {
              placeholder: '请输入箱子长度'
            },
            rules: [
              validRules.required,
              validRules.number
            ]
          },
          {
            $type: 'input',
            $id: 'width',
            label: '宽(Cm)',
            $el: {
              placeholder: '请输入箱子宽度'
            },
            rules: [
              validRules.required,
              validRules.number
            ]
          },
          {
            $type: 'input',
            $id: 'height',
            label: '高(Cm)',
            $el: {
              placeholder: '请输入箱子高度'
            },
            rules: [
              validRules.required,
              validRules.number
            ]
          },
          {
            $type: 'input',
            $id: 'grossWeight',
            label: '皮重(Kg)',
            $el: {
              placeholder: '箱子和箱中填充物的重量，不包含产品的重量'
            },
            rules: [
              validRules.required,
              validRules.number
            ]
          }
        ]
      }
    },
    methods: {
      // 显示浮层
      show() {
        this.dialogVisible = true;
      },

      //取消
      cancel() {
        this.$refs.dialogForm.resetFields();
        this.dialogVisible = false
      },

      //保存
      confirm() {
        this.$refs.dialogForm.validate(valid => {
          if (!valid) return false
          let data = Object.assign(
            {},
            this.$refs.dialogForm.getFormValue()
          );

          // 新增逻辑
          let url = '/cartonSpecs'
          this.confirmLoading = true

          this.global.axios.post(url, data)
            .then(resp => {
              this.$message({type: 'success', message: '箱规添加成功'});
              this.cancel();

              //TODO: 添加成功，需要更新分类选项
              let obj = resp.data;
              this.$emit("newCartonSpecComplete", obj);
              this.confirmLoading = false
            })
            .catch(err => {
              this.confirmLoading = false;
            })
        });
      },
    }
  }

</script>

<style type="text/less" lang="scss" scoped>
</style>
