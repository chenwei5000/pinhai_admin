<template>

  <el-dialog title="添加供应商" :visible.sync="dialogVisible">
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
  import phFromItems from '../../components/phFromItems'
  import datadicModel from '@/api/datadic'

  export default {
    name: 'SupplierDialog',
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
            $type: 'select',
            $id: 'region',
            label: '管理区域',
            $el: {
              filterable: true,
              placeholder: '我们采购团队所在的区域，如：深圳'
            },
            rules: [
              validRules.required
            ],
            $options: datadicModel.getSelectOptions('region')
          },
          phFromItems.code,
          {
            $type: 'input',
            $id: 'name',
            label: '简称',
            $el: {
              placeholder: '供应商简称，如：品海'
            },
            rules: [
              validRules.required
            ]
          },
          {
            $type: 'input',
            $id: 'companyName',
            label: '公司名称',
            $el: {
              placeholder: '供应商公司全称，如：深圳市品海电子商务有限公司'
            },
          },
          {
            $type: 'input',
            $id: 'city',
            label: '所在城市',
            $el: {
              placeholder: '供应商所在城市，如：深圳龙岗'
            },
          },
          {
            $type: 'input',
            $id: 'address',
            label: '地址',
            $el: {
              placeholder: '供应商地址，如：深圳市龙岗区坂田街道永香路5号'
            },
          },
          {
            $type: 'input',
            $id: 'linkman',
            label: '联系人',
            $el: {
              placeholder: '供应商的联系人'
            },
          },
          {
            $type: 'input',
            $id: 'tel',
            label: '联系电话',
            $el: {
              placeholder: '供应商的联系电话'
            },
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
            {status: 1},
            this.$refs.dialogForm.getFormValue()
          );

          // 新增逻辑
          let url = '/suppliers'
          this.confirmLoading = true

          this.global.axios.post(url, data)
            .then(resp => {
              this.$message({type: 'success', message: '供应商添加成功'});
              this.cancel();

              //TODO: 添加成功，需要更新分类选项
              let obj = resp.data;
              this.$emit("newSupplierComplete", obj);
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
