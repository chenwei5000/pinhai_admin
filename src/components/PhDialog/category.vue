<template>

  <el-dialog title="添加分类" :visible.sync="dialogVisible">
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
  import validRules from '@/components/validRules'
  import userModel from '@/api/user'

  export default {
    name: 'CategoryDialog',
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
        form: [
          {
            $type: 'input',
            $id: 'name',
            label: '分类名称',
            $el: {
              placeholder: '请输入分类名称'
            },
            rules: [
              validRules.required
            ]
          },
          {
            $type: 'select',
            $id: 'userId',
            label: '采购负责人',
            $el: {
              placeholder: '请选择采购负责人,可筛选',
              filterable: true
            },
            $options: userModel.getSelectOptions(),
            rules: [
              validRules.required
            ]
          }
        ]
      }
    },
    methods: {
      ///////////////分类///////////////////////
      // 显示浮层
      show() {
        this.dialogVisible = true;
      },

      //取消创建分类
      cancel() {
        this.$refs.dialogForm.resetFields();
        this.dialogVisible = false
      },

      //保存分类
      confirm() {
        this.$refs.dialogForm.validate(valid => {
          if (!valid) return false
          let data = Object.assign(
            {},
            this.$refs.dialogForm.getFormValue()
          );

          // 新增逻辑
          let url = '/categories'
          this.confirmLoading = true

          this.global.axios.post(url, data)
            .then(resp => {
              this.$message({type: 'success', message: '分类添加成功'});
              this.cancel();

              //TODO: 添加成功，需要更新分类选项
              let obj = resp.data;
              this.$emit("newCategoryComplete", obj);
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
